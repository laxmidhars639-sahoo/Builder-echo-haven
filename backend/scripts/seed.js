#!/usr/bin/env node

/**
 * Database Seeding Script
 * Seeds the database with initial data for development
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Sample data
const sampleCourses = [
  {
    title: "Private Pilot License (PPL)",
    description:
      "Learn to fly single-engine aircraft for personal use. This comprehensive course covers all aspects of private pilot training.",
    duration: "6-12 months",
    price: "$8,500",
    priceNumeric: 8500,
    category: "license",
    level: "beginner",
    status: "active",
    featured: true,
    prerequisites: [],
    curriculum: [
      {
        module: "Ground School",
        description: "Learn aviation theory and regulations",
        estimatedHours: 40,
        topics: ["Weather", "Navigation", "Regulations", "Aerodynamics"],
      },
      {
        module: "Flight Training",
        description: "Hands-on flight experience with instructor",
        estimatedHours: 40,
        topics: ["Pre-flight", "Takeoff", "Landing", "Emergency procedures"],
      },
    ],
    maxStudents: 20,
    estimatedCompletionTime: { weeks: 24, months: 6 },
  },
  {
    title: "Commercial Pilot License (CPL)",
    description:
      "Advance your skills for commercial aviation careers. Professional pilot training for career advancement.",
    duration: "12-18 months",
    price: "$25,000",
    priceNumeric: 25000,
    category: "license",
    level: "advanced",
    status: "active",
    featured: true,
    prerequisites: ["Private Pilot License"],
    curriculum: [
      {
        module: "Advanced Ground School",
        description: "Commercial aviation regulations and procedures",
        estimatedHours: 80,
        topics: [
          "Commercial regulations",
          "Advanced weather",
          "Flight planning",
        ],
      },
      {
        module: "Commercial Flight Training",
        description: "Advanced flight maneuvers and procedures",
        estimatedHours: 250,
        topics: [
          "Complex aircraft",
          "Instrument procedures",
          "Commercial maneuvers",
        ],
      },
    ],
    maxStudents: 15,
    estimatedCompletionTime: { weeks: 72, months: 18 },
  },
  {
    title: "Instrument Rating (IR)",
    description:
      "Fly safely in all weather conditions. Learn to use aircraft instruments for navigation and flight control.",
    duration: "3-6 months",
    price: "$12,000",
    priceNumeric: 12000,
    category: "rating",
    level: "intermediate",
    status: "active",
    featured: false,
    prerequisites: ["Private Pilot License"],
    curriculum: [
      {
        module: "Instrument Ground School",
        description: "Instrument flight rules and procedures",
        estimatedHours: 60,
        topics: ["IFR regulations", "Instrument approaches", "Weather systems"],
      },
      {
        module: "Instrument Flight Training",
        description: "Instrument flight training with safety pilot",
        estimatedHours: 40,
        topics: ["Instrument approaches", "Holds", "Navigation"],
      },
    ],
    maxStudents: 12,
    estimatedCompletionTime: { weeks: 24, months: 6 },
  },
];

const sampleUsers = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@skytraining.com",
    password: "admin123",
    phone: "+1234567890",
    userType: "admin",
    isActive: true,
  },
  {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    password: "student123",
    phone: "+1234567891",
    userType: "student",
    gender: "male",
    flightHours: 15,
    certificates: 1,
    isActive: true,
  },
  {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    password: "student123",
    phone: "+1234567892",
    userType: "student",
    gender: "female",
    flightHours: 8,
    certificates: 0,
    isActive: true,
  },
  {
    firstName: "Mike",
    lastName: "Chen",
    email: "mike.chen@example.com",
    password: "student123",
    phone: "+1234567893",
    userType: "student",
    gender: "male",
    flightHours: 25,
    certificates: 1,
    isActive: true,
  },
];

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    log("✅ Connected to MongoDB", "green");
  } catch (error) {
    log("❌ MongoDB connection failed:", "red");
    log(error.message, "red");
    process.exit(1);
  }
}

async function clearDatabase() {
  log("🗑️  Clearing existing data...", "yellow");

  await User.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});

  log("✅ Database cleared", "green");
}

async function seedUsers() {
  log("👥 Seeding users...", "cyan");

  const createdUsers = [];

  for (const userData of sampleUsers) {
    const user = new User(userData);
    await user.save();
    createdUsers.push(user);
    log(`   ✅ Created ${user.userType}: ${user.email}`, "green");
  }

  return createdUsers;
}

async function seedCourses(adminUser) {
  log("📚 Seeding courses...", "cyan");

  const createdCourses = [];

  for (const courseData of sampleCourses) {
    const course = new Course({
      ...courseData,
      createdBy: adminUser._id,
    });
    await course.save();
    createdCourses.push(course);
    log(`   ✅ Created course: ${course.title}`, "green");
  }

  return createdCourses;
}

async function seedEnrollments(students, courses) {
  log("📝 Seeding enrollments...", "cyan");

  const enrollmentData = [
    {
      student: students[0]._id, // John Smith
      course: courses[0]._id, // PPL
      paymentInfo: {
        paymentMode: "Credit Card",
        installments: "Within 3 months",
        totalAmount: 8500,
        amountPaid: 2833,
        paymentStatus: "partial",
      },
    },
    {
      student: students[1]._id, // Sarah Johnson
      course: courses[2]._id, // Instrument Rating
      paymentInfo: {
        paymentMode: "Bank Transfer",
        installments: "Direct Payment",
        totalAmount: 12000,
        amountPaid: 12000,
        paymentStatus: "paid",
      },
    },
    {
      student: students[2]._id, // Mike Chen
      course: courses[1]._id, // CPL
      paymentInfo: {
        paymentMode: "Check",
        installments: "Within 6 months",
        totalAmount: 25000,
        amountPaid: 0,
        paymentStatus: "pending",
      },
    },
  ];

  for (const enrollment of enrollmentData) {
    const newEnrollment = new Enrollment(enrollment);
    await newEnrollment.save();

    // Update course enrollment count
    await Course.findByIdAndUpdate(enrollment.course, {
      $inc: { currentEnrollments: 1 },
    });

    log(`   ✅ Created enrollment for student`, "green");
  }
}

async function main() {
  try {
    log("🌱 Starting database seeding...", "cyan");
    log("=".repeat(50), "cyan");

    await connectDatabase();
    await clearDatabase();

    const users = await seedUsers();
    const adminUser = users.find((u) => u.userType === "admin");
    const students = users.filter((u) => u.userType === "student");

    const courses = await seedCourses(adminUser);
    await seedEnrollments(students, courses);

    log("=".repeat(50), "green");
    log("🎉 Database seeding completed!", "green");
    log("=".repeat(50), "green");
    log("");
    log("📋 Created accounts:", "yellow");
    log("   👤 Admin: admin@skytraining.com (password: admin123)", "blue");
    log("   👤 Student: john.smith@example.com (password: student123)", "blue");
    log(
      "   👤 Student: sarah.johnson@example.com (password: student123)",
      "blue",
    );
    log("   👤 Student: mike.chen@example.com (password: student123)", "blue");
    log("");
    log("📚 Created courses:", "yellow");
    courses.forEach((course) => {
      log(`   📖 ${course.title} - ${course.price}`, "blue");
    });
    log("");
    log("✅ Ready to test your application!", "green");
  } catch (error) {
    log("❌ Seeding failed:", "red");
    log(error.message, "red");
  } finally {
    await mongoose.disconnect();
    log("👋 Disconnected from database", "yellow");
    process.exit(0);
  }
}

main();
