const mongoose = require("mongoose");

const PreachingStatusSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true }, // Date for this status (YYYY-MM-DD)
    status: { type: String, default: "" },
    attended: { type: Boolean, default: false },
    contactName: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PreachingStatus", PreachingStatusSchema);
