const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const User = require("../models/User");
const {
  protect,
  studentOnly,
  adminOnly,
  ownerOrAdmin,
} = require("../middleware/auth");
const { validateEnrollment } = require("../middleware/validation");

const router = express.Router();

// @desc    Create new enrollment
// @route   POST /api/enrollments
// @access  Private (student only)
router.post("/", protect, studentOnly, validateEnrollment, async (req, res) => {
  try {
    const { courseId, paymentMode, installments, gender } = req.body;

    // Check if course exists and is available
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    if (course.status !== "active") {
      return res.status(400).json({
        status: "error",
        message: "Course is not available for enrollment",
      });
    }

    if (course.isFull()) {
      return res.status(400).json({
        status: "error",
        message: "Course is full",
      });
    }

    // Check if student is already enrolled in this course
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        status: "error",
        message: "You are already enrolled in this course",
      });
    }

    // Update user gender if provided
    if (gender) {
      await User.findByIdAndUpdate(req.user._id, { gender });
    }

    // Create enrollment
    const enrollmentData = {
      student: req.user._id,
      course: courseId,
      paymentInfo: {
        paymentMode,
        installments,
        totalAmount: course.priceNumeric,
        paymentStatus: "pending",
      },
      academicInfo: {
        startDate: new Date(),
        expectedCompletionDate: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000,
        ), // 1 year from now
      },
    };

    const enrollment = await Enrollment.create(enrollmentData);

    // Increment course enrollment count
    await course.incrementEnrollment();

    // Populate the created enrollment
    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate("student", "firstName lastName email phone")
      .populate("course", "title description duration price");

    res.status(201).json({
      status: "success",
      message: "Enrollment created successfully",
      data: {
        enrollment: populatedEnrollment,
      },
    });
  } catch (error) {
    console.error("Create enrollment error:", error);
    res.status(500).json({
      status: "error",
      message: "Error creating enrollment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @desc    Get all enrollments for current user
// @route   GET /api/enrollments/my
// @access  Private (student only)
router.get("/my", protect, studentOnly, async (req, res) => {
  try {
    const enrollments = await Enrollment.getByStudent(req.user._id);

    res.status(200).json({
      status: "success",
      data: {
        enrollments,
      },
    });
  } catch (error) {
    console.error("Get my enrollments error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching your enrollments",
    });
  }
});

// @desc    Get all enrollments (admin only)
// @route   GET /api/enrollments
// @access  Private (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.paymentStatus) {
      filter["paymentInfo.paymentStatus"] = req.query.paymentStatus;
    }

    if (req.query.courseId) {
      filter.course = req.query.courseId;
    }

    if (req.query.studentId) {
      filter.student = req.query.studentId;
    }

    if (req.query.search) {
      // Search in student names (requires aggregation)
      const searchRegex = new RegExp(req.query.search, "i");
      const students = await User.find({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
        ],
      }).select("_id");
      filter.student = { $in: students.map((s) => s._id) };
    }

    // Get enrollments with pagination
    const enrollments = await Enrollment.find(filter)
      .populate("student", "firstName lastName email phone gender")
      .populate("course", "title description duration price")
      .sort({ enrollmentDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Enrollment.countDocuments(filter);

    res.status(200).json({
      status: "success",
      data: {
        enrollments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalEnrollments: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get enrollments error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching enrollments",
    });
  }
});

// @desc    Get single enrollment
// @route   GET /api/enrollments/:id
// @access  Private (owner or admin)
router.get("/:id", protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate(
        "student",
        "firstName lastName email phone gender address emergencyContact",
      )
      .populate("course", "title description duration price curriculum")
      .populate("academicInfo.instructor", "firstName lastName email");

    if (!enrollment) {
      return res.status(404).json({
        status: "error",
        message: "Enrollment not found",
      });
    }

    // Check access: student can only see their own enrollment, admin can see all
    if (
      req.user.userType === "student" &&
      enrollment.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        status: "error",
        message: "Access denied",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        enrollment,
      },
    });
  } catch (error) {
    console.error("Get enrollment error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching enrollment",
    });
  }
});

// @desc    Update enrollment progress (admin only)
// @route   PUT /api/enrollments/:id/progress
// @access  Private (admin only)
router.put("/:id/progress", protect, adminOnly, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        status: "error",
        message: "Enrollment not found",
      });
    }

    const progressData = req.body;
    const updatedEnrollment = await enrollment.updateProgress(progressData);

    const populatedEnrollment = await Enrollment.findById(updatedEnrollment._id)
      .populate("student", "firstName lastName email")
      .populate("course", "title");

    res.status(200).json({
      status: "success",
      message: "Progress updated successfully",
      data: {
        enrollment: populatedEnrollment,
      },
    });
  } catch (error) {
    console.error("Update progress error:", error);
    res.status(500).json({
      status: "error",
      message: "Error updating progress",
    });
  }
});

// @desc    Add payment to enrollment (admin only)
// @route   POST /api/enrollments/:id/payment
// @access  Private (admin only)
router.post("/:id/payment", protect, adminOnly, async (req, res) => {
  try {
    const { amount, transactionId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Valid payment amount is required",
      });
    }

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        status: "error",
        message: "Enrollment not found",
      });
    }

    const updatedEnrollment = await enrollment.addPayment(
      amount,
      transactionId,
    );

    const populatedEnrollment = await Enrollment.findById(updatedEnrollment._id)
      .populate("student", "firstName lastName email")
      .populate("course", "title");

    res.status(200).json({
      status: "success",
      message: "Payment added successfully",
      data: {
        enrollment: populatedEnrollment,
      },
    });
  } catch (error) {
    console.error("Add payment error:", error);
    res.status(500).json({
      status: "error",
      message: "Error adding payment",
    });
  }
});

// @desc    Update enrollment status (admin only)
// @route   PUT /api/enrollments/:id/status
// @access  Private (admin only)
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (
      ![
        "enrolled",
        "in-progress",
        "completed",
        "dropped",
        "suspended",
      ].includes(status)
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid status",
      });
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    )
      .populate("student", "firstName lastName email")
      .populate("course", "title");

    if (!enrollment) {
      return res.status(404).json({
        status: "error",
        message: "Enrollment not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Enrollment status updated successfully",
      data: {
        enrollment,
      },
    });
  } catch (error) {
    console.error("Update enrollment status error:", error);
    res.status(500).json({
      status: "error",
      message: "Error updating enrollment status",
    });
  }
});

// @desc    Add note to enrollment (admin only)
// @route   POST /api/enrollments/:id/notes
// @access  Private (admin only)
router.post("/:id/notes", protect, adminOnly, async (req, res) => {
  try {
    const { content, type, private: isPrivate } = req.body;

    if (!content) {
      return res.status(400).json({
        status: "error",
        message: "Note content is required",
      });
    }

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        status: "error",
        message: "Enrollment not found",
      });
    }

    const note = {
      author: req.user._id,
      content,
      type: type || "academic",
      private: isPrivate || false,
    };

    enrollment.notes.push(note);
    await enrollment.save();

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate("notes.author", "firstName lastName")
      .populate("student", "firstName lastName")
      .populate("course", "title");

    res.status(201).json({
      status: "success",
      message: "Note added successfully",
      data: {
        enrollment: populatedEnrollment,
      },
    });
  } catch (error) {
    console.error("Add note error:", error);
    res.status(500).json({
      status: "error",
      message: "Error adding note",
    });
  }
});

// @desc    Get enrollment statistics (admin only)
// @route   GET /api/enrollments/analytics/stats
// @access  Private (admin only)
router.get("/analytics/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({
      status: { $in: ["enrolled", "in-progress"] },
    });
    const completedEnrollments = await Enrollment.countDocuments({
      status: "completed",
    });
    const droppedEnrollments = await Enrollment.countDocuments({
      status: "dropped",
    });

    const paymentStats = await Enrollment.aggregate([
      {
        $group: {
          _id: "$paymentInfo.paymentStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const enrollmentsByMonth = await Enrollment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$enrollmentDate" },
            month: { $month: "$enrollmentDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 },
      },
      {
        $limit: 12,
      },
    ]);

    const recentEnrollments = await Enrollment.find()
      .populate("student", "firstName lastName email")
      .populate("course", "title")
      .sort({ enrollmentDate: -1 })
      .limit(5);

    res.status(200).json({
      status: "success",
      data: {
        overview: {
          totalEnrollments,
          activeEnrollments,
          completedEnrollments,
          droppedEnrollments,
        },
        paymentStats,
        enrollmentsByMonth,
        recentEnrollments,
      },
    });
  } catch (error) {
    console.error("Get enrollment stats error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching enrollment statistics",
    });
  }
});

module.exports = router;
