const mongoose = require("mongoose");

const BhogaScheduleSchema = new mongoose.Schema(
  {
    monday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tuesday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wednesday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thursday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    saturday: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
