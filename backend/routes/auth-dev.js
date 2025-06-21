const express = require("express");
const FileStorage = require("../utils/fileStorage");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Validation middleware
const validateUserRegistration = (req, res, next) => {
  const { firstName, lastName, email, password, userType } = req.body;

  if (!firstName || !lastName || !email || !password || !userType) {
    return res.status(400).json({
      status: "error",
      message: "All required fields must be provided",
    });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({
      status: "error",
      message: "Please provide a valid email address",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      status: "error",
      message: "Password must be at least 6 characters long",
    });
  }

  if (!["student", "admin"].includes(userType)) {
    return res.status(400).json({
      status: "error",
      message: "User type must be either 'student' or 'admin'",
    });
  }

  next();
};

const validateUserLogin = (req, res, next) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).json({
      status: "error",
      message: "Email, password, and user type are required",
    });
  }

  next();
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", validateUserRegistration, async (req, res) => {
  try {
    console.log("Registration attempt:", req.body);

    const user = await FileStorage.createUser(req.body);

    // Generate token
    const token = generateToken(user._id);

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
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", validateUserLogin, async (req, res) => {
  try {
    console.log("Login attempt:", req.body);

    const { email, password, userType } = req.body;

    // Find user and verify credentials
    const user = await FileStorage.findUserByCredentials(email, password);

    // Check if user type matches
    if (user.userType !== userType) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user type for this account",
      });
    }

    // Generate token
    const token = generateToken(user._id);

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
          enrolledCourses: [],
          lastLogin: user.lastLogin,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      status: "error",
      message: error.message,
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", (req, res) => {
  // Simple token verification for development
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = FileStorage.findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          gender: user.gender,
          flightHours: user.flightHours,
          certificates: user.certificates,
          enrolledCourses: [],
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }
});

// @desc    Get all users (for admin)
// @route   GET /api/auth/users
// @access  Private (Admin only)
router.get("/users", (req, res) => {
  try {
    const users = FileStorage.getAllUsers();
    res.status(200).json({
      status: "success",
      data: {
        users: users.map((user) => ({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userType: user.userType,
          flightHours: user.flightHours,
          certificates: user.certificates,
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
        })),
        count: users.length,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching users",
    });
  }
});

module.exports = router;
