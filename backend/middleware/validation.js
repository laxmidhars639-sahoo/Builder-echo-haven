const { body, validationResult } = require("express-validator");

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),

  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),

  body("phone")
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage("Please provide a valid phone number"),

  body("userType")
    .isIn(["student", "admin"])
    .withMessage("User type must be either student or admin"),

  handleValidationErrors,
];

// User login validation
const validateUserLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),

  body("userType")
    .isIn(["student", "admin"])
    .withMessage("User type must be either student or admin"),

  handleValidationErrors,
];

// Course creation validation
const validateCourseCreation = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Course title must be between 5 and 100 characters"),

  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Course description must be between 10 and 1000 characters"),

  body("duration").trim().notEmpty().withMessage("Course duration is required"),

  body("price").trim().notEmpty().withMessage("Course price is required"),

  body("priceNumeric")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("status")
    .optional()
    .isIn(["active", "inactive", "draft"])
    .withMessage("Status must be active, inactive, or draft"),

  body("category")
    .optional()
    .isIn(["license", "rating", "certification", "advanced"])
    .withMessage(
      "Category must be license, rating, certification, or advanced",
    ),

  body("level")
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Level must be beginner, intermediate, or advanced"),

  handleValidationErrors,
];

// Enrollment validation
const validateEnrollment = [
  body("courseId").isMongoId().withMessage("Valid course ID is required"),

  body("paymentMode")
    .isIn(["Credit Card", "Debit Card", "Bank Transfer", "Check", "Cash"])
    .withMessage("Invalid payment mode"),

  body("installments")
    .isIn([
      "Direct Payment",
      "Within 3 months",
      "Within 6 months",
      "Within 8 months",
    ])
    .withMessage("Invalid installment option"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other", "prefer-not-to-say"])
    .withMessage("Invalid gender option"),

  handleValidationErrors,
];

// User profile update validation
const validateProfileUpdate = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),

  body("phone")
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage("Please provide a valid phone number"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other", "prefer-not-to-say"])
    .withMessage("Invalid gender option"),

  handleValidationErrors,
];

// Password change validation
const validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password confirmation does not match new password");
    }
    return true;
  }),

  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateCourseCreation,
  validateEnrollment,
  validateProfileUpdate,
  validatePasswordChange,
};
