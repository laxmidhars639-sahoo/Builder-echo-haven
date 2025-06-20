const express = require("express");
const User = require("../models/User");
const { protect, ownerOrAdmin, adminOnly } = require("../middleware/auth");
const {
  validateProfileUpdate,
  validatePasswordChange,
} = require("../middleware/validation");

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private (own profile or admin)
router.get("/:id", protect, ownerOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
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
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          gender: user.gender,
          flightHours: user.flightHours,
          certificates: user.certificates,
          profileImage: user.profileImage,
          isActive: user.isActive,
          address: user.address,
          emergencyContact: user.emergencyContact,
          medicalCertificate: user.medicalCertificate,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching user profile",
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (own profile or admin)
router.put(
  "/:id",
  protect,
  ownerOrAdmin,
  validateProfileUpdate,
  async (req, res) => {
    try {
      const allowedUpdates = [
        "firstName",
        "lastName",
        "phone",
        "gender",
        "address",
        "emergencyContact",
        "medicalCertificate",
      ];

      // Only admin can update certain fields
      if (req.user.userType === "admin") {
        allowedUpdates.push("isActive", "flightHours", "certificates");
      }

      const updates = {};
      Object.keys(req.body).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      const user = await User.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Profile updated successfully",
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            userType: user.userType,
            gender: user.gender,
            flightHours: user.flightHours,
            certificates: user.certificates,
            profileImage: user.profileImage,
            isActive: user.isActive,
            address: user.address,
            emergencyContact: user.emergencyContact,
            medicalCertificate: user.medicalCertificate,
            updatedAt: user.updatedAt,
          },
        },
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({
        status: "error",
        message: "Error updating user profile",
      });
    }
  },
);

// @desc    Change user password
// @route   PUT /api/users/:id/password
// @access  Private (own profile only)
router.put(
  "/:id/password",
  protect,
  validatePasswordChange,
  async (req, res) => {
    try {
      // Ensure user can only change their own password
      if (req.user.id !== req.params.id) {
        return res.status(403).json({
          status: "error",
          message: "You can only change your own password",
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.params.id).select("+password");

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      // Check current password
      const isCurrentPasswordCorrect =
        await user.comparePassword(currentPassword);
      if (!isCurrentPasswordCorrect) {
        return res.status(400).json({
          status: "error",
          message: "Current password is incorrect",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.status(200).json({
        status: "success",
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        status: "error",
        message: "Error changing password",
      });
    }
  },
);

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.userType) {
      filter.userType = req.query.userType;
    }
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    // Get users with pagination
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      status: "success",
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
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

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        status: "error",
        message: "You cannot delete your own account",
      });
    }

    // Soft delete - deactivate user instead of removing
    await User.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      status: "success",
      message: "User account deactivated successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      status: "error",
      message: "Error deleting user",
    });
  }
});

// @desc    Get user statistics (admin only)
// @route   GET /api/users/stats
// @access  Private (admin only)
router.get("/analytics/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalStudents = await User.countDocuments({
      userType: "student",
      isActive: true,
    });
    const totalAdmins = await User.countDocuments({
      userType: "admin",
      isActive: true,
    });

    const recentUsers = await User.find({ isActive: true })
      .select("firstName lastName email userType createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const usersByMonth = await User.aggregate([
      {
        $match: { isActive: true },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        overview: {
          totalUsers,
          totalStudents,
          totalAdmins,
          activeUsers: totalUsers,
        },
        recentUsers,
        usersByMonth,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching user statistics",
    });
  }
});

module.exports = router;
