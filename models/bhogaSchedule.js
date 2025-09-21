const mongoose = require("mongoose");

const BhogaScheduleSchema = new mongoose.Schema(
  {
    monday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tuesday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    wednesday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    thursday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    friday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    saturday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sunday: {
      type: String,
      default: "No Offering Duty",
    },
  },
  { timestamps: true }
);

console.log("BhogaSchedule schema loaded!");

module.exports = mongoose.model("BhogaSchedule", BhogaScheduleSchema);
