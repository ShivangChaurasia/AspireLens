import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  lastActive: { type: Date, default: Date.now },

  dailyStreak: { type: Number, default: 0 },

  testsTaken: { type: Number, default: 0 },

  weeklyProgress: { type: Number, default: 0 },

  skillScore: { type: Number, default: 0 }, // later
}, { timestamps: true });

export default mongoose.model("UserActivity", userActivitySchema);
