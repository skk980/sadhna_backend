const express = require("express");
const Activity = require("../models/activity");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

// GET: fetch activities based on userId query and decoded user role/id
router.get("/", requireAuth, async (req, res) => {
  try {
    const queryUserId = req.query.userId;
    const loggedInUserId = req.user.userId; // decoded from token by requireAuth
    const loggedInUserRole = req.user.role;

    if (!queryUserId) {
      return res
        .status(400)
        .json({ message: "Missing userId query parameter" });
    }

    let filter = {};
    if (loggedInUserRole === "admin" && queryUserId === loggedInUserId) {
      // Admin querying their own ID: get all devotees' activities linked to adminId
      filter.adminId = queryUserId;
    } else {
      // Otherwise fetch only activities for the userId specified
      filter.userId = queryUserId;
    }

    const activities = await Activity.find(filter)
      .sort({ date: -1 })
      .populate("userId")
      .populate("adminId");
    res.json({ activities });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error loading activities", error: err.message });
  }
});

// POST: Add activity (authenticated)
router.post("/", requireAuth, async (req, res) => {
  try {
    // Extract userId and role from decoded token
    const userId = req.user.userId; // logged-in user's ID
    const role = req.user.role;
    console.log(req.user);
    // If user is admin, their adminId is themselves
    // If user is a devotee, get adminId from token or other source (ensure your middleware sets it)
    let adminId;
    if (role === "admin") {
      adminId = userId;
    } else {
      adminId = req.user.adminId; // your token or middleware must include this for users
      if (!adminId) {
        return res
          .status(400)
          .json({ message: "adminId missing in token for user" });
      }
    }

    // Prepare new activity data by merging req.body with userId/adminId
    const activityData = {
      ...req.body,
      userId,
      adminId,
    };

    const activity = new Activity(activityData);
    await activity.save();
    res.status(201).json({ activity });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding activity", error: err.message });
  }
});

// PUT: Update activity by ID (authenticated)
// PUT: Update activity by ID with role-based access control
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const updates = req.body;
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Allow if admin or owner
    if (
      req.user.role !== "admin" &&
      activity.userId.toString() !== req.user.userId
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot update this activity" });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
      }
    );

    res.json({ activity: updatedActivity });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating activity", error: err.message });
  }
});

// GET: Get activity by date for specific user with role-based access control
router.get("/byDate", requireAuth, async (req, res) => {
  try {
    const { userId, date } = req.query;
    if (!userId || !date) {
      return res
        .status(400)
        .json({ message: "Missing userId or date query params" });
    }

    // Devotee can only fetch their own; admin can fetch any
    if (req.user.role !== "admin" && userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot view this activity" });
    }

    const activity = await Activity.findOne({ userId, date });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json({ activity });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting activity by date", error: err.message });
  }
});

module.exports = router;
