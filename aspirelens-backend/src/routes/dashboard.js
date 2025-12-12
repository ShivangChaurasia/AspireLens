import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import UserActivity from "../models/UserActivity.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/stats", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  const activity = await UserActivity.findOne({ userId });

  const totalFields = 6;
  const filledFields = Object.values(user.profile || {}).filter(v => v).length;
  const profileCompletion = Math.round((filledFields / totalFields) * 100);

  res.json({
    profileCompletion,
    dailyStreak: activity?.dailyStreak || 0,
    weeklyProgress: activity?.weeklyProgress || 0,
    testsTaken: activity?.testsTaken || 0,
    lastActive: activity?.lastActive || null,
  });
});

export default router;
