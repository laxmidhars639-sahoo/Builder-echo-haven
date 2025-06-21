#!/usr/bin/env node

/**
 * SkyTraining Backend Development Startup Script
 * This script starts the backend server with file-based storage (no MongoDB required)
 */

const fs = require("fs");
const path = require("path");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvironment() {
  log("🔍 Checking environment configuration...", "cyan");

  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    log("❌ .env file not found!", "red");
    log("Please create a .env file in the backend directory", "yellow");
    process.exit(1);
  }

  // Load environment variables
  require("dotenv").config();

  const requiredVars = ["PORT", "JWT_SECRET", "NODE_ENV"];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    log("❌ Missing required environment variables:", "red");
    missingVars.forEach((varName) => {
      log(`   - ${varName}`, "red");
    });
    process.exit(1);
  }

  log("✅ Environment configuration OK", "green");
}

function checkDependencies() {
  log("📦 Checking dependencies...", "cyan");

  const packagePath = path.join(__dirname, "package.json");

  if (!fs.existsSync(packagePath)) {
    log("❌ package.json not found!", "red");
    process.exit(1);
  }

  const nodeModulesPath = path.join(__dirname, "node_modules");

  if (!fs.existsSync(nodeModulesPath)) {
    log("❌ node_modules not found!", "red");
    log("Please run: npm install", "yellow");
    process.exit(1);
  }

  log("✅ Dependencies OK", "green");
}

function createDirectories() {
  log("📁 Creating necessary directories...", "cyan");

  const directories = ["logs", "data", "temp"];

  directories.forEach((dir) => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      log(`   ✅ Created ${dir} directory`, "green");
    }
  });
}

function displayStartupInfo() {
  log("\n" + "=".repeat(50), "cyan");
  log("🛩️  SKYTRAINING BACKEND SERVER (DEVELOPMENT)", "bright");
  log("=".repeat(50), "cyan");
  log(`🌐 Environment: ${process.env.NODE_ENV}`, "blue");
  log(`🚀 Port: ${process.env.PORT}`, "blue");
  log(`💾 Storage: File-based (Development Mode)`, "blue");
  log(`🔐 JWT Expiry: ${process.env.JWT_EXPIRE}`, "blue");
  log(`📁 Data Directory: ${path.join(__dirname, "data")}`, "blue");
  log("=".repeat(50), "cyan");
  log("📚 Available Endpoints:", "yellow");
  log("   • POST /api/auth/register - User registration", "white");
  log("   • POST /api/auth/login - User login", "white");
  log("   • GET  /api/auth/me - Get current user", "white");
  log("   • GET  /api/auth/users - Get all users", "white");
  log("   • GET  /api/courses - Get all courses", "white");
  log("   • GET  /api/admin/dashboard - Admin dashboard", "white");
  log("   • GET  /api/health - Health check", "white");
  log("=".repeat(50), "cyan");
  log("💡 Development Features:", "magenta");
  log("   • No MongoDB required", "white");
  log("   • File-based user storage", "white");
  log("   • Hot reload with nodemon", "white");
  log("   • CORS enabled for frontend", "white");
  log("=".repeat(50), "cyan");
  log("\n");
}

function startServer() {
  log("🚀 Starting SkyTraining backend server (Development Mode)...", "bright");

  try {
    // Pre-flight checks
    checkEnvironment();
    checkDependencies();
    createDirectories();
    displayStartupInfo();

    // Start the development server
    require("./server-dev.js");
  } catch (error) {
    log("❌ Failed to start server:", "red");
    log(error.message, "red");
    process.exit(1);
  }
}

// Handle process termination
process.on("SIGINT", () => {
  log("\n👋 Shutting down SkyTraining backend server...", "yellow");
  process.exit(0);
});

process.on("SIGTERM", () => {
  log("\n👋 Shutting down SkyTraining backend server...", "yellow");
  process.exit(0);
});

// Start the application
startServer();
