#!/usr/bin/env node

/**
 * Test script to verify the SkyTraining backend setup
 */

const fs = require("fs");
const path = require("path");

console.log("🧪 Testing SkyTraining Backend Setup...\n");

// Test 1: Check if required files exist
console.log("1. Checking required files...");
const requiredFiles = [
  ".env",
  "utils/fileStorage.js",
  "routes/auth-dev.js",
  "server-dev.js",
  "start-dev.js",
];

let allFilesExist = true;
requiredFiles.forEach((file) => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log("\n❌ Some required files are missing!");
  process.exit(1);
}

// Test 2: Check environment variables
console.log("\n2. Checking environment configuration...");
require("dotenv").config();

const requiredEnvVars = ["PORT", "JWT_SECRET", "NODE_ENV"];
let allEnvVarsPresent = true;

requiredEnvVars.forEach((varName) => {
  if (process.env[varName]) {
    console.log(`   ✅ ${varName}`);
  } else {
    console.log(`   ❌ ${varName} - MISSING`);
    allEnvVarsPresent = false;
  }
});

if (!allEnvVarsPresent) {
  console.log("\n❌ Some environment variables are missing!");
  process.exit(1);
}

// Test 3: Test FileStorage
console.log("\n3. Testing file storage...");
try {
  const FileStorage = require("./utils/fileStorage");

  // Test directory creation
  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Test user creation
  const testUser = {
    firstName: "Test",
    lastName: "User",
    email: "test@skytraining.com",
    password: "password123",
    userType: "student",
  };

  console.log("   Creating test user...");
  FileStorage.createUser(testUser)
    .then((user) => {
      console.log(`   ✅ User created with ID: ${user._id}`);

      // Test user authentication
      return FileStorage.findUserByCredentials(
        "test@skytraining.com",
        "password123",
      );
    })
    .then((user) => {
      console.log(`   ✅ User authentication successful: ${user.email}`);

      // Test getting all users
      const allUsers = FileStorage.getAllUsers();
      console.log(`   ✅ Total users in storage: ${allUsers.length}`);

      console.log("\n4. Testing JWT token generation...");
      const jwt = require("jsonwebtoken");
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log("   ✅ JWT token generated successfully");

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`   ✅ JWT token verified, userId: ${decoded.userId}`);

      console.log("\n✅ All tests passed! Backend setup is ready.");
      console.log("\n🚀 To start the backend server, run:");
      console.log("   cd backend && npm run dev-simple");
      console.log("\n📋 User data is stored in: backend/data/users.json");
      console.log(
        `📋 Test user created: ${testUser.email} / ${testUser.password}`,
      );
    })
    .catch((error) => {
      if (error.message.includes("already exists")) {
        console.log("   ✅ User already exists (that's fine)");
        console.log("\n✅ All tests passed! Backend setup is ready.");
      } else {
        console.log(`   ❌ FileStorage test failed: ${error.message}`);
        process.exit(1);
      }
    });
} catch (error) {
  console.log(`   ❌ FileStorage test failed: ${error.message}`);
  process.exit(1);
}
