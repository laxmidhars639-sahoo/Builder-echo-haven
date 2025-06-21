const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth-dev");

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:8080", // Vite dev server default port
    "http://localhost:5173", // Vite alternative port
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Ensure data directory exists
const dataDir = path.join(__dirname, "data");
const fs = require("fs");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log("✅ Data directory created successfully");
}

console.log("✅ File-based storage initialized (Development Mode)");
console.log("📝 Note: User data will be stored in backend/data/users.json");

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "SkyTraining API is running (Development Mode)",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    storage: "File-based (Development)",
  });
});

// API routes
app.use("/api/auth", authRoutes);

// Simple courses endpoint for development
app.get("/api/courses", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      courses: [
        {
          id: "1",
          title: "Private Pilot License (PPL)",
          description: "Learn to fly single-engine aircraft",
          duration: "6 months",
          price: 15000,
          level: "Beginner",
        },
        {
          id: "2",
          title: "Commercial Pilot License (CPL)",
          description: "Advanced training for commercial aviation",
          duration: "12 months",
          price: 25000,
          level: "Advanced",
        },
        {
          id: "3",
          title: "Instrument Rating (IR)",
          description: "Fly in all weather conditions",
          duration: "4 months",
          price: 10000,
          level: "Intermediate",
        },
      ],
    },
  });
});

// Simple admin endpoint for development
app.get("/api/admin/dashboard", (req, res) => {
  const FileStorage = require("./utils/fileStorage");
  const users = FileStorage.getAllUsers();

  res.status(200).json({
    status: "success",
    data: {
      totalUsers: users.length,
      totalStudents: users.filter((u) => u.userType === "student").length,
      totalAdmins: users.filter((u) => u.userType === "admin").length,
      recentUsers: users.slice(-5),
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log("🛩️  SKYTRAINING BACKEND SERVER (DEVELOPMENT MODE)");
  console.log("=".repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`💾 Storage: File-based (${path.join(__dirname, "data")})`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log("=".repeat(50));
  console.log("📚 Available Endpoints:");
  console.log("   • POST /api/auth/register - User registration");
  console.log("   • POST /api/auth/login - User login");
  console.log("   • GET  /api/auth/me - Get current user");
  console.log("   • GET  /api/auth/users - Get all users");
  console.log("   • GET  /api/courses - Get all courses");
  console.log("   • GET  /api/admin/dashboard - Admin dashboard");
  console.log("   • GET  /api/health - Health check");
  console.log("=".repeat(50));
  console.log("✅ Ready to accept connections!\n");
});

module.exports = app;
