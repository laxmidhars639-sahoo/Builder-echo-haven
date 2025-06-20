const express = require("express");
const User = require("../models/User");
const { generateToken, protect } = require("../middleware/auth");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../middleware/validation");

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", validateUserRegistration, async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, userType, gender } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      userType,
      gender,
    });

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          gender: user.gender,
          flightHours: user.flightHours,
          certificates: user.certificates,
          enrolledCourses: [],
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
      message: "Error creating user account",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", validateUserLogin, async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Find user and include password for verification
    const user = await User.findByCredentials(email, password);

    // Check if user type matches
    if (user.userType !== userType) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user type for this account",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Get user's enrollments if student
    let enrolledCourses = [];
    if (user.userType === "student") {
      const Enrollment = require("../models/Enrollment");
      const enrollments = await Enrollment.find({ student: user._id })
        .populate("course", "title")
        .select("course status enrollmentDate progress.overallProgress");

      enrolledCourses = enrollments.map((enrollment) => ({
        courseId: enrollment.course._id,
        courseName: enrollment.course.title,
        status: enrollment.status,
        enrollmentDate: enrollment.enrollmentDate,
        progress: enrollment.progress.overallProgress,
      }));
    }

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          gender: user.gender,
          flightHours: user.flightHours,
          certificates: user.certificates,
          enrolledCourses,
          lastLogin: user.lastLogin,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    if (
      error.message.includes("Invalid login credentials") ||
      error.message.includes("Account temporarily locked")
    ) {
      return res.status(401).json({
        status: "error",
        message: error.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = req.user;

    // Get user's enrollments if student
    let enrolledCourses = [];
    if (user.userType === "student") {
      const Enrollment = require("../models/Enrollment");
      const enrollments = await Enrollment.find({ student: user._id })
        .populate("course", "title description duration price")
        .select(
          "course status enrollmentDate progress paymentInfo.paymentStatus",
        );

      enrolledCourses = enrollments.map((enrollment) => ({
        courseId: enrollment.course._id,
        courseName: enrollment.course.title,
        courseDescription: enrollment.course.description,
        duration: enrollment.course.duration,
        price: enrollment.course.price,
        status: enrollment.status,
        enrollmentDate: enrollment.enrollmentDate,
        progress: enrollment.progress.overallProgress,
        paymentStatus: enrollment.paymentInfo.paymentStatus,
      }));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          gender: user.gender,
          flightHours: user.flightHours,
          certificates: user.certificates,
          enrolledCourses,
          profileImage: user.profileImage,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching user data",
    });
  }
});

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
router.post("/logout", protect, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
router.post("/refresh", protect, (req, res) => {
  try {
    // Generate new token
    const token = generateToken(req.user._id);

    res.status(200).json({
      status: "success",
      message: "Token refreshed successfully",
      data: {
        token,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      status: "error",
      message: "Error refreshing token",
    });
  }
});

module.exports = router;
