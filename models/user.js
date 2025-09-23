const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  role: { type: String, enum: ["admin", "user"], default: "user" },
  isBaseMember: { type: Boolean, required: true, default: false },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Admin user reference
    required: function () {
      return this.role === "user";
    }, // required only for devotees
  },
  createdAt: { type: Date, default: Date.now },
});

console.log("User schema loaded!");

module.exports = mongoose.model("User", UserSchema);
