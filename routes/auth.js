const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const requireAuth = require("../middleware/requireAuth");
const BhogaSchedule = require("../models/bhogaSchedule");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

router.post("/", async (req, res) => {
  res.json({ message: "welcome to sadhna" });
});

router.post("/register", requireAuth, async (req, res) => {
  const { name, email, password, adminId } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password || "password", 10);
    const role = req.user.role === "admin" ? "user" : "user";

    // For users with role 'user', require and assign adminId
    let assignedAdminId;
    if (role === "user") {
      if (!adminId) {
        return res
          .status(400)
          .json({ message: "adminId required for user registration" });
      }
      assignedAdminId = adminId;
    }

    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      adminId: assignedAdminId, // assigned only when role:'user'
    });

    await user.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Registration error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
        adminId: user.adminId,
      },
      JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

router.get("/api/users", requireAuth, async (req, res) => {
  const filter = { role: "user" };

  try {
    const users = await User.find(filter).select("_id name email role");
    res.json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// Protected route: /auth/profile
router.get("/profile", requireAuth, async (req, res) => {
  try {
    console.log("Authorization:", req.headers.authorization);
    console.log("Decoded token:", req.user);

    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
});

// PUT: Create or replace entire Bhoga schedule (admin only)
router.put("/bhoga-schedule", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday = "No Offering Duty", // default if missing
    } = req.body;

    // Validate user IDs if needed here...

    let schedule = await BhogaSchedule.findOne();
    if (!schedule) {
      schedule = new BhogaSchedule();
    }

    schedule.monday = monday;
    schedule.tuesday = tuesday;
    schedule.wednesday = wednesday;
    schedule.thursday = thursday;
    schedule.friday = friday;
    schedule.saturday = saturday;
    schedule.sunday = sunday;

    await schedule.save();

    res.status(200).json({ message: "Bhoga schedule updated", schedule });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Bhoga schedule", error: error.message });
  }
});

// GET: fetch Bhoga Offer Schedule (any authenticated user)
router.get("/bhoga-schedule", requireAuth, async (req, res) => {
  try {
    const schedule = await BhogaSchedule.findOne()
      .populate("monday", "_id name email")
      .populate("tuesday", "_id name email")
      .populate("wednesday", "_id name email")
      .populate("thursday", "_id name email")
      .populate("friday", "_id name email")
      .populate("saturday", "_id name email");

    if (!schedule) {
      return res.status(404).json({ message: "Bhoga schedule not found" });
    }

    res.status(200).json({ schedule });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Bhoga schedule", error: error.message });
  }
});

router.post("/logout", requireAuth, (req, res) => {
  // Since JWT is stateless, logout is handled by frontend by deleting token.
  // This endpoint is for frontend to call to acknowledge logout.
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
