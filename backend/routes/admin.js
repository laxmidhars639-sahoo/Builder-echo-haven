const express = require("express");
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (admin only)
router.get("/dashboard", protect, adminOnly, async (req, res) => {
  try {
    // Get current date for time-based queries
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Basic counts
    const totalStudents = await User.countDocuments({
      userType: "student",
      isActive: true,
    });
    const totalCourses = await Course.countDocuments({ status: "active" });
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({
      status: { $in: ["enrolled", "in-progress"] },
    });

    // Revenue calculation (sum of all paid amounts)
    const revenueData = await Enrollment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$paymentInfo.amountPaid" },
          monthlyRevenue: {
            $sum: {
              $cond: [
                { $gte: ["$enrollmentDate", startOfMonth] },
                "$paymentInfo.amountPaid",
                0,
              ],
            },
          },
        },
      },
    ]);

    const revenue = revenueData[0] || { totalRevenue: 0, monthlyRevenue: 0 };

    // Recent enrollments
    const recentEnrollments = await Enrollment.find()
      .populate("student", "firstName lastName email")
      .populate("course", "title")
      .sort({ enrollmentDate: -1 })
      .limit(5);

    // Students by enrollment date (last 6 months)
    const studentGrowth = await User.aggregate([
      {
        $match: {
          userType: "student",
          isActive: true,
          createdAt: {
            $gte: new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Course popularity
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

    // Payment status distribution
    const paymentStats = await Enrollment.aggregate([
      {
        $group: {
          _id: "$paymentInfo.paymentStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$paymentInfo.totalAmount" },
          paidAmount: { $sum: "$paymentInfo.amountPaid" },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        overview: {
          totalStudents,
          totalCourses,
          totalEnrollments,
          activeEnrollments,
          totalRevenue: revenue.totalRevenue,
          monthlyRevenue: revenue.monthlyRevenue,
        },
        recentEnrollments,
        studentGrowth,
        popularCourses,
        paymentStats,
      },
    });
  } catch (error) {
    console.error("Get admin dashboard error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching dashboard data",
    });
  }
});

// @desc    Get students list for admin
// @route   GET /api/admin/students
// @access  Private (admin only)
router.get("/students", protect, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { userType: "student" };

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    // Get students
    const students = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get enrollment data for each student
    const studentsWithEnrollments = await Promise.all(
      students.map(async (student) => {
        const enrollments = await Enrollment.find({ student: student._id })
          .populate("course", "title")
          .select("course status paymentInfo.paymentStatus enrollmentDate");

        const studentData = student.toObject();
        studentData.enrollments = enrollments;
        studentData.totalCourses = enrollments.length;
        studentData.activeCourses = enrollments.filter((e) =>
          ["enrolled", "in-progress"].includes(e.status),
        ).length;

        return studentData;
      }),
    );

    const total = await User.countDocuments(filter);

    res.status(200).json({
      status: "success",
      data: {
        students: studentsWithEnrollments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalStudents: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching students",
    });
  }
});

// @desc    Get detailed student information
// @route   GET /api/admin/students/:id
// @access  Private (admin only)
router.get("/students/:id", protect, adminOnly, async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      userType: "student",
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    // Get all enrollments for this student
    const enrollments = await Enrollment.find({ student: student._id })
      .populate("course", "title description duration price")
      .sort({ enrollmentDate: -1 });

    // Calculate student statistics
    const totalCourseFees = enrollments.reduce(
      (sum, enrollment) => sum + enrollment.paymentInfo.totalAmount,
      0,
    );
    const totalPaid = enrollments.reduce(
      (sum, enrollment) => sum + enrollment.paymentInfo.amountPaid,
      0,
    );
    const pendingAmount = totalCourseFees - totalPaid;

    const studentData = {
      ...student.toObject(),
      enrollments,
      statistics: {
        totalCourses: enrollments.length,
        activeCourses: enrollments.filter((e) =>
          ["enrolled", "in-progress"].includes(e.status),
        ).length,
        completedCourses: enrollments.filter((e) => e.status === "completed")
          .length,
        totalCourseFees,
        totalPaid,
        pendingAmount,
      },
    };

    res.status(200).json({
      status: "success",
      data: {
        student: studentData,
      },
    });
  } catch (error) {
    console.error("Get student details error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching student details",
    });
  }
});

// @desc    Update student status (activate/deactivate)
// @route   PUT /api/admin/students/:id/status
// @access  Private (admin only)
router.put("/students/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { isActive } = req.body;

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, userType: "student" },
      { isActive },
      { new: true },
    ).select("-password");

    if (!student) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: `Student ${isActive ? "activated" : "deactivated"} successfully`,
      data: {
        student,
      },
    });
  } catch (error) {
    console.error("Update student status error:", error);
    res.status(500).json({
      status: "error",
      message: "Error updating student status",
    });
  }
});

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private (admin only)
router.get("/analytics", protect, adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Monthly enrollment trends (last 12 months)
    const enrollmentTrends = await Enrollment.aggregate([
      {
        $match: {
          enrollmentDate: {
            $gte: new Date(now.getTime() - 12 * 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$enrollmentDate" },
            month: { $month: "$enrollmentDate" },
          },
          count: { $sum: 1 },
          revenue: { $sum: "$paymentInfo.amountPaid" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Course completion rates
    const completionRates = await Enrollment.aggregate([
      {
        $group: {
          _id: "$course",
          totalEnrollments: { $sum: 1 },
          completedEnrollments: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
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
        $project: {
          title: "$course.title",
          totalEnrollments: 1,
          completedEnrollments: 1,
          completionRate: {
            $multiply: [
              { $divide: ["$completedEnrollments", "$totalEnrollments"] },
              100,
            ],
          },
        },
      },
      {
        $sort: { completionRate: -1 },
      },
    ]);

    // Payment analytics
    const paymentAnalytics = await Enrollment.aggregate([
      {
        $group: {
          _id: "$paymentInfo.paymentMode",
          count: { $sum: 1 },
          totalAmount: { $sum: "$paymentInfo.totalAmount" },
          paidAmount: { $sum: "$paymentInfo.amountPaid" },
        },
      },
    ]);

    // Geographic distribution (if address data is available)
    const studentsByLocation = await User.aggregate([
      {
        $match: { userType: "student", isActive: true },
      },
      {
        $group: {
          _id: "$address.state",
          count: { $sum: 1 },
        },
      },
      {
        $match: { _id: { $ne: null } },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        enrollmentTrends,
        completionRates,
        paymentAnalytics,
        studentsByLocation,
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching analytics data",
    });
  }
});

// @desc    Export data (students, enrollments, etc.)
// @route   GET /api/admin/export/:type
// @access  Private (admin only)
router.get("/export/:type", protect, adminOnly, async (req, res) => {
  try {
    const { type } = req.params;
    const { format = "json" } = req.query;

    let data = [];
    let filename = "";

    switch (type) {
      case "students":
        data = await User.find({ userType: "student" })
          .select("-password")
          .lean();
        filename = `students_export_${Date.now()}.${format}`;
        break;

      case "enrollments":
        data = await Enrollment.find()
          .populate("student", "firstName lastName email")
          .populate("course", "title")
          .lean();
        filename = `enrollments_export_${Date.now()}.${format}`;
        break;

      case "courses":
        data = await Course.find().lean();
        filename = `courses_export_${Date.now()}.${format}`;
        break;

      default:
        return res.status(400).json({
          status: "error",
          message:
            "Invalid export type. Use: students, enrollments, or courses",
        });
    }

    // Set appropriate headers
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    res.status(200).json({
      status: "success",
      exportType: type,
      count: data.length,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    console.error("Export data error:", error);
    res.status(500).json({
      status: "error",
      message: "Error exporting data",
    });
  }
});

module.exports = router;
