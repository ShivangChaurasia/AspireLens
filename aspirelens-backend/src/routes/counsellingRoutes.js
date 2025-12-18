// routes/counsellingRoutes.js
import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { 
  generateCareerCounselling,
  getCareerCounselling 
} from "../controllers/tests/careerCounsellingController.js";
import TestSession from "../models/TestSessions.js"; // ADD THIS IMPORT

const router = express.Router();

// POST: Generate counselling (AI processing)
router.post(
  "/generate/:testSessionId",
  requireAuth,
  generateCareerCounselling
);

// GET: Fetch counselling data (for frontend)
router.get(
  "/data/:testSessionId",
  requireAuth,
  getCareerCounselling
);

// Alternative: GET all counselling for user
router.get(
  "/my-counselling",
  requireAuth,
  async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Fetch all test sessions with counselling
      const sessions = await TestSession.find({
        userId,
        aiInsights: { $exists: true, $ne: null }
      })
      .select("testName level submittedAt aiInsights counsellingGeneratedAt")
      .sort({ counsellingGeneratedAt: -1 });
      
      return res.json({
        success: true,
        sessions: sessions.map(session => ({
          testSessionId: session._id,
          testName: session.testName,
          level: session.level,
          submittedAt: session.submittedAt,
          counsellingGeneratedAt: session.counsellingGeneratedAt,
          hasCounselling: !!session.aiInsights
        }))
      });
    } catch (error) {
      console.error("Error fetching counselling sessions:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch counselling sessions"
      });
    }
  }
);


export default router;