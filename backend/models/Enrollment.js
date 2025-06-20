const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["enrolled", "in-progress", "completed", "dropped", "suspended"],
      default: "enrolled",
    },
    paymentInfo: {
      paymentMode: {
        type: String,
        enum: ["Credit Card", "Debit Card", "Bank Transfer", "Check", "Cash"],
        required: [true, "Payment mode is required"],
      },
      installments: {
        type: String,
        enum: [
          "Direct Payment",
          "Within 3 months",
          "Within 6 months",
          "Within 8 months",
        ],
        required: [true, "Payment plan is required"],
      },
      totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
      },
      amountPaid: {
        type: Number,
        default: 0,
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "partial", "paid", "overdue"],
        default: "pending",
      },
      paymentSchedule: [
        {
          dueDate: Date,
          amount: Number,
          paidDate: Date,
          status: {
            type: String,
            enum: ["pending", "paid", "overdue"],
            default: "pending",
          },
          transactionId: String,
        },
      ],
    },
    academicInfo: {
      startDate: Date,
      expectedCompletionDate: Date,
      actualCompletionDate: Date,
      instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      aircraft: [
        {
          registration: String,
          type: String,
          hoursFlown: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
    progress: {
      overallProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      modulesCompleted: [
        {
          moduleId: String,
          moduleName: String,
          completionDate: Date,
          score: Number,
          instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        },
      ],
      flightHours: {
        total: {
          type: Number,
          default: 0,
        },
        solo: {
          type: Number,
          default: 0,
        },
        dualInstruction: {
          type: Number,
          default: 0,
        },
        crossCountry: {
          type: Number,
          default: 0,
        },
        nightFlying: {
          type: Number,
          default: 0,
        },
        instrumentTime: {
          type: Number,
          default: 0,
        },
      },
      examResults: [
        {
          examType: {
            type: String,
            enum: ["written", "oral", "practical", "checkride"],
          },
          date: Date,
          score: Number,
          passed: Boolean,
          attempts: {
            type: Number,
            default: 1,
          },
          examiner: String,
          notes: String,
        },
      ],
    },
    schedule: [
      {
        date: Date,
        startTime: String,
        endTime: String,
        type: {
          type: String,
          enum: [
            "ground-school",
            "flight-training",
            "solo-flight",
            "exam",
            "checkride",
          ],
        },
        instructor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        aircraft: String,
        location: String,
        status: {
          type: String,
          enum: ["scheduled", "completed", "cancelled", "rescheduled"],
          default: "scheduled",
        },
        notes: String,
      },
    ],
    documents: [
      {
        name: String,
        type: {
          type: String,
          enum: [
            "medical-certificate",
            "identification",
            "logbook",
            "certificate",
            "transcript",
          ],
        },
        url: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        expiryDate: Date,
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    notes: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        type: {
          type: String,
          enum: ["academic", "administrative", "disciplinary", "medical"],
          default: "academic",
        },
        content: {
          type: String,
          required: true,
        },
        private: {
          type: Boolean,
          default: false,
        },
      },
    ],
    completion: {
      isCompleted: {
        type: Boolean,
        default: false,
      },
      completionDate: Date,
      finalGrade: {
        type: String,
        enum: ["A", "B", "C", "D", "F", "Pass", "Fail"],
      },
      certificateIssued: {
        type: Boolean,
        default: false,
      },
      certificateNumber: String,
      certificateIssueDate: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for payment completion percentage
enrollmentSchema.virtual("paymentProgress").get(function () {
  return this.paymentInfo.totalAmount > 0
    ? (this.paymentInfo.amountPaid / this.paymentInfo.totalAmount) * 100
    : 0;
});

// Virtual for days since enrollment
enrollmentSchema.virtual("daysSinceEnrollment").get(function () {
  return Math.floor((new Date() - this.enrollmentDate) / (1000 * 60 * 60 * 24));
});

// Indexes for better query performance
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ enrollmentDate: -1 });
enrollmentSchema.index({ "paymentInfo.paymentStatus": 1 });

// Compound indexes
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true }); // Prevent duplicate enrollments
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ course: 1, status: 1 });

// Pre-save middleware to calculate payment schedule
enrollmentSchema.pre("save", function (next) {
  if (this.isNew && this.paymentInfo.installments !== "Direct Payment") {
    const totalAmount = this.paymentInfo.totalAmount;
    const installmentPlan = this.paymentInfo.installments;

    let numberOfInstallments;
    switch (installmentPlan) {
      case "Within 3 months":
        numberOfInstallments = 3;
        break;
      case "Within 6 months":
        numberOfInstallments = 6;
        break;
      case "Within 8 months":
        numberOfInstallments = 8;
        break;
      default:
        numberOfInstallments = 1;
    }

    if (numberOfInstallments > 1) {
      const installmentAmount = totalAmount / numberOfInstallments;
      const schedule = [];

      for (let i = 0; i < numberOfInstallments; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i + 1);

        schedule.push({
          dueDate,
          amount: installmentAmount,
          status: "pending",
        });
      }

      this.paymentInfo.paymentSchedule = schedule;
    }
  }
  next();
});

// Static method to get enrollments by student
enrollmentSchema.statics.getByStudent = function (studentId) {
  return this.find({ student: studentId })
    .populate("course", "title description duration price")
    .sort({ enrollmentDate: -1 });
};

// Static method to get enrollments by course
enrollmentSchema.statics.getByCourse = function (courseId) {
  return this.find({ course: courseId })
    .populate("student", "firstName lastName email phone")
    .sort({ enrollmentDate: -1 });
};

// Static method to get active enrollments
enrollmentSchema.statics.getActiveEnrollments = function () {
  return this.find({ status: { $in: ["enrolled", "in-progress"] } })
    .populate("student", "firstName lastName email")
    .populate("course", "title duration")
    .sort({ enrollmentDate: -1 });
};

// Instance method to update progress
enrollmentSchema.methods.updateProgress = async function (progressData) {
  Object.assign(this.progress, progressData);

  // Auto-complete if progress is 100%
  if (this.progress.overallProgress >= 100 && !this.completion.isCompleted) {
    this.completion.isCompleted = true;
    this.completion.completionDate = new Date();
    this.status = "completed";
  }

  return await this.save();
};

// Instance method to add payment
enrollmentSchema.methods.addPayment = async function (amount, transactionId) {
  this.paymentInfo.amountPaid += amount;

  // Update payment status
  if (this.paymentInfo.amountPaid >= this.paymentInfo.totalAmount) {
    this.paymentInfo.paymentStatus = "paid";
  } else if (this.paymentInfo.amountPaid > 0) {
    this.paymentInfo.paymentStatus = "partial";
  }

  // Update payment schedule
  for (let payment of this.paymentInfo.paymentSchedule) {
    if (payment.status === "pending" && amount >= payment.amount) {
      payment.status = "paid";
      payment.paidDate = new Date();
      payment.transactionId = transactionId;
      amount -= payment.amount;
      break;
    }
  }

  return await this.save();
};

module.exports = mongoose.model("Enrollment", enrollmentSchema);
