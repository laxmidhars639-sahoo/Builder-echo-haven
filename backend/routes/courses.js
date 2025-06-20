const express = require("express");
const Course = require("../models/Course");
const { protect, adminOnly } = require("../middleware/auth");
const { validateCourseCreation } = require("../middleware/validation");

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};

    // Filter by status (default to active for public access)
    if (req.query.status) {
      filter.status = req.query.status;
    } else {
      filter.status = "active";
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.level) {
      filter.level = req.query.level;
    }

    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === "true";
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Sort options
    let sort = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort = { createdAt: -1 }; // Default: newest first
    }

    // Get courses with pagination
    const courses = await Course.find(filter)
      .populate("createdBy", "firstName lastName")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      status: "success",
      data: {
        courses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalCourses: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching courses",
    });
  }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("createdBy", "firstName lastName")
      .populate("lastModifiedBy", "firstName lastName");

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    // Get enrollment count
    const Enrollment = require("../models/Enrollment");
    const enrollmentCount = await Enrollment.countDocuments({
      course: course._id,
      status: { $in: ["enrolled", "in-progress"] },
    });

    res.status(200).json({
      status: "success",
      data: {
        course: {
          ...course.toObject(),
          currentEnrollments: enrollmentCount,
        },
      },
    });
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching course",
    });
  }
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (admin only)
router.post(
  "/",
  protect,
  adminOnly,
  validateCourseCreation,
  async (req, res) => {
    try {
      const courseData = {
        ...req.body,
        createdBy: req.user._id,
      };

      const course = await Course.create(courseData);

      const populatedCourse = await Course.findById(course._id).populate(
        "createdBy",
        "firstName lastName",
      );

      res.status(201).json({
        status: "success",
        message: "Course created successfully",
        data: {
          course: populatedCourse,
        },
      });
    } catch (error) {
      console.error("Create course error:", error);
      res.status(500).json({
        status: "error",
        message: "Error creating course",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updates = {
      ...req.body,
      lastModifiedBy: req.user._id,
    };

    const course = await Course.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "firstName lastName")
      .populate("lastModifiedBy", "firstName lastName");

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Course updated successfully",
      data: {
        course,
      },
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      status: "error",
      message: "Error updating course",
    });
  }
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    // Check if course has active enrollments
    const Enrollment = require("../models/Enrollment");
    const activeEnrollments = await Enrollment.countDocuments({
      course: req.params.id,
      status: { $in: ["enrolled", "in-progress"] },
    });

    if (activeEnrollments > 0) {
      return res.status(400).json({
        status: "error",
        message: `Cannot delete course with ${activeEnrollments} active enrollments. Please complete or transfer enrollments first.`,
      });
    }

    // Soft delete - set status to inactive instead of removing
    await Course.findByIdAndUpdate(req.params.id, { status: "inactive" });

    res.status(200).json({
      status: "success",
      message: "Course deactivated successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({
      status: "error",
      message: "Error deleting course",
    });
  }
});

// @desc    Get featured courses
// @route   GET /api/courses/featured/list
// @access  Public
router.get("/featured/list", async (req, res) => {
  try {
    const courses = await Course.getFeaturedCourses()
      .populate("createdBy", "firstName lastName")
      .limit(6);

    res.status(200).json({
      status: "success",
      data: {
        courses,
      },
    });
  } catch (error) {
    console.error("Get featured courses error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching featured courses",
    });
  }
});

// @desc    Get courses by category
// @route   GET /api/courses/category/:category
// @access  Public
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const courses = await Course.getCoursesByCategory(category).populate(
      "createdBy",
      "firstName lastName",
    );

    res.status(200).json({
      status: "success",
      data: {
        courses,
        category,
      },
    });
  } catch (error) {
    console.error("Get courses by category error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching courses by category",
    });
  }
});

// @desc    Get course statistics (admin only)
// @route   GET /api/courses/analytics/stats
// @access  Private (admin only)
router.get("/analytics/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments({ status: "active" });
    const draftCourses = await Course.countDocuments({ status: "draft" });
    const inactiveCourses = await Course.countDocuments({ status: "inactive" });

    const coursesByCategory = await Course.aggregate([
      {
        $match: { status: "active" },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const coursesByLevel = await Course.aggregate([
      {
        $match: { status: "active" },
      },
      {
        $group: {
          _id: "$level",
          count: { $sum: 1 },
        },
      },
    ]);

    const Enrollment = require("../models/Enrollment");
    const popularCourses = await Enrollment.aggregate([
      {
        $group: {
          _id: "$course",
          enrollmentCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $match: {
          "course.status": "active",
        },
      },
      {
        $sort: { enrollmentCount: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          title: "$course.title",
          enrollmentCount: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        overview: {
          totalCourses,
          activeCourses: totalCourses,
          draftCourses,
          inactiveCourses,
        },
        coursesByCategory,
        coursesByLevel,
        popularCourses,
      },
    });
  } catch (error) {
    console.error("Get course stats error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching course statistics",
    });
  }
});

module.exports = router;
