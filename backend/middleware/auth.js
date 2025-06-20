const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token. User not found.",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: "error",
        message: "User account has been deactivated.",
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Token has expired.",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Server error during authentication.",
    });
  }
};

// Middleware to restrict access to specific user types
const restrictTo = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.user.userType)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Insufficient permissions.",
      });
    }
    next();
  };
};

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// Middleware to check if user is student
const studentOnly = (req, res, next) => {
  if (req.user.userType !== "student") {
    return res.status(403).json({
      status: "error",
      message: "Access denied. Student access only.",
    });
  }
  next();
};

// Middleware to allow access to own resources or admin
const ownerOrAdmin = (req, res, next) => {
  const userId = req.params.userId || req.params.id;

  if (req.user.userType === "admin" || req.user.id === userId) {
    return next();
  }

  return res.status(403).json({
    status: "error",
    message: "Access denied. You can only access your own resources.",
  });
};

module.exports = {
  generateToken,
  protect,
  restrictTo,
  adminOnly,
  studentOnly,
  ownerOrAdmin,
};
