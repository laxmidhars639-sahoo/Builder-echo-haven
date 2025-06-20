const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxLength: [100, "Course title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      maxLength: [1000, "Course description cannot exceed 1000 characters"],
    },
    duration: {
      type: String,
      required: [true, "Course duration is required"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Course price is required"],
      trim: true,
    },
    priceNumeric: {
      type: Number,
      required: [true, "Numeric price is required"],
      min: [0, "Price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
    category: {
      type: String,
      enum: ["license", "rating", "certification", "advanced"],
      default: "license",
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    prerequisites: [
      {
        type: String,
        trim: true,
      },
    ],
    curriculum: [
      {
        module: {
          type: String,
          required: true,
        },
        description: String,
        estimatedHours: Number,
        topics: [String],
      },
    ],
    instructorRequirements: {
      minimumExperience: Number,
      certifications: [String],
      specializations: [String],
    },
    aircraftRequirements: {
      type: [String],
      default: ["Single Engine"],
    },
    maxStudents: {
      type: Number,
      default: 20,
      min: [1, "Maximum students must be at least 1"],
    },
    currentEnrollments: {
      type: Number,
      default: 0,
      min: [0, "Current enrollments cannot be negative"],
    },
    estimatedCompletionTime: {
      weeks: Number,
      months: Number,
    },
    materials: [
      {
        name: String,
        type: {
          type: String,
          enum: ["book", "video", "software", "equipment"],
        },
        required: {
          type: Boolean,
          default: true,
        },
        cost: Number,
      },
    ],
    examRequirements: {
      written: {
        required: Boolean,
        passingScore: Number,
        timeLimit: Number, // in minutes
      },
      practical: {
        required: Boolean,
        minimumFlightHours: Number,
        checkRideRequired: Boolean,
      },
    },
    certificationDetails: {
      issuingAuthority: {
        type: String,
        default: "FAA",
      },
      certificateType: String,
      validityPeriod: String,
      renewalRequirements: [String],
    },
    tags: [String],
    image: {
      type: String,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for availability
courseSchema.virtual("isAvailable").get(function () {
  return this.status === "active" && this.currentEnrollments < this.maxStudents;
});

// Virtual for enrollment percentage
courseSchema.virtual("enrollmentPercentage").get(function () {
  return this.maxStudents > 0
    ? (this.currentEnrollments / this.maxStudents) * 100
    : 0;
});

// Indexes for better query performance
courseSchema.index({ title: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ featured: 1 });
courseSchema.index({ createdAt: -1 });

// Pre-save middleware to extract numeric price
courseSchema.pre("save", function (next) {
  if (this.isModified("price")) {
    // Extract numeric value from price string (e.g., "$8,500" -> 8500)
    const numericPrice = parseFloat(this.price.replace(/[$,]/g, ""));
    if (!isNaN(numericPrice)) {
      this.priceNumeric = numericPrice;
    }
  }
  next();
});

// Static method to get active courses
courseSchema.statics.getActiveCourses = function () {
  return this.find({ status: "active" }).sort({ createdAt: -1 });
};

// Static method to get featured courses
courseSchema.statics.getFeaturedCourses = function () {
  return this.find({ status: "active", featured: true }).sort({
    createdAt: -1,
  });
};

// Static method to get courses by category
courseSchema.statics.getCoursesByCategory = function (category) {
  return this.find({ status: "active", category }).sort({ title: 1 });
};

// Instance method to check if course is full
courseSchema.methods.isFull = function () {
  return this.currentEnrollments >= this.maxStudents;
};

// Instance method to increment enrollment count
courseSchema.methods.incrementEnrollment = async function () {
  if (this.isFull()) {
    throw new Error("Course is full");
  }
  this.currentEnrollments += 1;
  return await this.save();
};

// Instance method to decrement enrollment count
courseSchema.methods.decrementEnrollment = async function () {
  if (this.currentEnrollments > 0) {
    this.currentEnrollments -= 1;
    return await this.save();
  }
  return this;
};

module.exports = mongoose.model("Course", courseSchema);
