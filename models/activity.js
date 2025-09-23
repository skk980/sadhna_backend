const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  // id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },
  name: String,
  phone: String,
  email: String,
  addedDate: String,
});

const ActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminId: {
      // <-- added adminId here
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true }, // ISO string YYYY-MM-DD
    mangalaAarti: { type: Boolean, default: false },
    mangalaAartiReason: { type: String, default: "" },
    japaRounds: { type: Number, default: 0 },
    lectureDuration: { type: Number, default: 0 },
    lectureDesciption: { type: String, default: "" },
    readingDuration: { type: Number, default: 0 },
    readingDesciption: { type: String, default: "" },
    wakeUpTime: { type: String, default: "" },
    sleepTime: { type: String, default: "" },
    bhogaOffering: { type: Boolean, default: false },
    preachingContacts: { type: [ContactSchema], default: [] },
  },
  { timestamps: true }
);

console.log("Activity schema loaded!"); // <-- Log message here

module.exports = mongoose.model("Activity", ActivitySchema);
