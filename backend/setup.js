#!/usr/bin/env node

/**
 * SkyTraining Backend Setup Script
 * Automates the initial setup process
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header() {
  console.clear();
  log("\n" + "=".repeat(60), "cyan");
  log("🛩️  SKYTRAINING BACKEND SETUP", "bright");
  log("=".repeat(60), "cyan");
  log("🚀 Setting up your pilot training backend...", "blue");
  log("=".repeat(60), "cyan");
  log("");
}

function checkNode() {
  log("🔍 Checking Node.js version...", "cyan");

  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

  if (majorVersion < 14) {
    log("❌ Node.js version 14 or higher is required", "red");
    log(`   Current version: ${nodeVersion}`, "red");
    process.exit(1);
  }

  log(`✅ Node.js ${nodeVersion} OK`, "green");
}

function createDirectories() {
  log("📁 Creating project directories...", "cyan");

  const directories = ["logs", "uploads", "temp", "scripts"];

  directories.forEach((dir) => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      log(`   ✅ Created ${dir}/`, "green");
    } else {
      log(`   ✓ ${dir}/ already exists`, "yellow");
    }
  });
}

function checkEnvFile() {
  log("⚙️  Checking environment configuration...", "cyan");

  const envPath = path.join(__dirname, ".env");
  const envExamplePath = path.join(__dirname, ".env.example");

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log("✅ Created .env file from .env.example", "green");
    } else {
      log("⚠️  No .env file found - please create one", "yellow");
    }
  } else {
    log("✅ .env file exists", "green");
  }

  // Load and validate environment
  require("dotenv").config();

  log("📋 Current configuration:", "blue");
  log(`   • Port: ${process.env.PORT || "5000"}`, "white");
  log(`   • Environment: ${process.env.NODE_ENV || "development"}`, "white");
  log(
    `   • Database: ${process.env.MONGODB_URI ? "✓ Configured" : "❌ Not set"}`,
    "white",
  );
  log(
    `   • JWT Secret: ${process.env.JWT_SECRET ? "✓ Configured" : "❌ Not set"}`,
    "white",
  );
}

function installDependencies() {
  log("📦 Installing dependencies...", "cyan");

  try {
    execSync("npm install", { stdio: "inherit" });
    log("✅ Dependencies installed successfully", "green");
  } catch (error) {
    log("❌ Failed to install dependencies", "red");
    log("Please run: npm install", "yellow");
    process.exit(1);
  }
}

function createGitignore() {
  log("📝 Creating .gitignore...", "cyan");

  const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.production

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Uploads and temporary files
uploads/
temp/

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Build outputs
dist/
build/

# Cache
.cache/
.npm/
.eslintcache
`;

  const gitignorePath = path.join(__dirname, ".gitignore");

  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, gitignoreContent);
    log("✅ Created .gitignore", "green");
  } else {
    log("✓ .gitignore already exists", "yellow");
  }
}

function createHealthCheck() {
  log("🏥 Creating health check script...", "cyan");

  const healthCheckContent = `const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 5000,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(\`Status: \${res.statusCode}\`);
  res.on('data', (data) => {
    console.log(JSON.parse(data.toString()));
  });
});

req.on('error', (error) => {
  console.error(\`Health check failed: \${error.message}\`);
  process.exit(1);
});

req.end();
`;

  const healthPath = path.join(__dirname, "scripts", "health.js");
  fs.writeFileSync(healthPath, healthCheckContent);
  log("✅ Created health check script", "green");
}

function displayNextSteps() {
  log("\n" + "=".repeat(60), "cyan");
  log("🎉 SETUP COMPLETE!", "bright");
  log("=".repeat(60), "cyan");
  log("");
  log("📝 Next steps:", "yellow");
  log("");
  log("1. Configure your database:", "white");
  log("   • Edit .env file and set MONGODB_URI", "blue");
  log("   • Use MongoDB Atlas or local MongoDB", "blue");
  log("");
  log("2. Start the development server:", "white");
  log("   npm run dev", "green");
  log("");
  log("3. Test the API:", "white");
  log("   • Health check: http://localhost:5000/api/health", "blue");
  log("   • API docs: http://localhost:5000/api/docs (if enabled)", "blue");
  log("");
  log("4. Available commands:", "white");
  log("   • npm start      - Start production server", "blue");
  log("   • npm run dev    - Start development server", "blue");
  log("   • npm test       - Run tests", "blue");
  log("   • npm run health - Check server health", "blue");
  log("");
  log("🔗 Connect your React frontend to: http://localhost:5000", "cyan");
  log("");
  log("=".repeat(60), "cyan");
  log("Happy coding! 🚀", "green");
  log("");
}

function main() {
  try {
    header();
    checkNode();
    createDirectories();
    checkEnvFile();
    installDependencies();
    createGitignore();
    createHealthCheck();
    displayNextSteps();
  } catch (error) {
    log("\n❌ Setup failed:", "red");
    log(error.message, "red");
    process.exit(1);
  }
}

main();
