// routes/preachingStatus.js
const express = require("express");
const router = express.Router();
const PreachingStatus = require("../models/preachingStatus");

// Get preaching status for contacts on specific date
router.get("/", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "Missing date" });
  try {
    const statuses = await PreachingStatus.find({ date });
    res.json({ statuses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:userId/:date", async (req, res) => {
  const { userId, date } = req.params;
  const { status, attended, contactNumber, contactName } = req.body;

  try {
    const updated = await PreachingStatus.findOneAndUpdate(
      { userId, date, contactNumber, contactName },
      { status, attended, contactNumber, contactName },
      { upsert: true, new: true }
    );
    res.json({ preachingStatus: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk update preaching status for multiple contacts on a date
router.post("/bulk-update", async (req, res) => {
  const { date, updates } = req.body; // updates = [{ userId, status, attended }]
  if (!date || !Array.isArray(updates)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const ops = updates.map(({ userId, status, attended, contactNumber }) => ({
      updateOne: {
        filter: { userId, date, contactNumber },
        update: { $set: { status, attended } },
        upsert: true,
      },
    }));

    await PreachingStatus.bulkWrite(ops);
    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
