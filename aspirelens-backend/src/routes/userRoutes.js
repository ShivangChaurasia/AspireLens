import express from "express";
import { getMyProfile, completeProfile } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/userController.js";
import { changePassword } from "../controllers/userController.js";
import UserActivity from "../models/UserActivity.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/me", requireAuth, getMyProfile);

// Complete / update academic profile
router.post("/complete-profile", requireAuth, completeProfile);
router.post("/update-profile", requireAuth, updateProfile);
router.post("/change-password", requireAuth, changePassword);


// --------------------------------------------------
// UPDATE ACTIVITY ROUTE
// --------------------------------------------------
router.post("/update-activity", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    let activity = await UserActivity.findOne({ userId });

    if (!activity) {
      activity = new UserActivity({ userId });
    }

    activity.lastActive = new Date();
    activity.testsTaken = activity.testsTaken || 0;
    activity.dailyStreak = activity.dailyStreak || 0;
    activity.weeklyProgress = activity.weeklyProgress || 0;

    await activity.save();

    res.json({ message: "Activity updated" });

  } catch (err) {
    console.error("Update Activity Error:", err);
    res.status(500).json({ message: "Failed to update activity" });
  }
});



export default router;
