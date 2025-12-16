import TestSession from "../../models/TestSessions.js";
import TestResult from "../../models/TestResults.js";
import User from "../../models/User.js";
import { generateCareerCounsellingWithAI } from "../../services/openaiService.js";

/**
 * CAREER COUNSELLING CONTROLLER
 * POST /api/counselling/generate/:testSessionId
 */
export const generateCareerCounselling = async (req, res) => {
  try {
    const { testSessionId } = req.params;
    const userId = req.user.id;

    // 1️⃣ Fetch evaluated test session
    const testSession = await TestSession.findOne({
      _id: testSessionId,
      userId,
      status: "evaluated",
    });

    if (!testSession) {
      return res.status(400).json({
        message: "Test must be evaluated before counselling",
      });
    }

    // 2️⃣ Fetch test result
    const testResult = await TestResult.findOne({
      testSessionId,
      userId,
      status: "evaluated",
    });

    if (!testResult) {
      return res.status(400).json({
        message: "Test result not found or not evaluated",
      });
    }

    // 3️⃣ Fetch user profile
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = user.profile || {};

    // 4️⃣ Build performance summary (SAFE)
    const performance = Object.entries(testResult.sectionWiseScore || {}).map(
      ([section, score]) => ({
        section,
        score,
        percentage:
          testResult.attemptedQuestions > 0
            ? Math.round((score / testResult.attemptedQuestions) * 100)
            : 0,
      })
    );

    // 5️⃣ AI INPUT PAYLOAD (STRICT + CLEAN)
    const aiPayload = {
      educationLevel: profile.educationLevel,
      educationStage: profile.educationStage,
      interests: profile.interests || [],
      level: testSession.level,
      scorePercentage: testResult.scorePercentage,
      performance,
      testsTaken: profile.testsTaken || 1,
    };

    let counselling;

    // 6️⃣ AI GENERATION (FAIL-SAFE)
    try {
      counselling = await generateCareerCounsellingWithAI(aiPayload);
    } catch (aiError) {
      console.error("AI Counselling Failed:", aiError.message);

      // Fallback counselling (NON-AI)
      counselling = {
        strengths: performance
          .filter(p => p.percentage >= 70)
          .map(p => p.section),
        weaknesses: performance
          .filter(p => p.percentage < 40)
          .map(p => p.section),
        careerRecommendations: profile.interests || [],
        improvementPlan: [
          "Practice weak sections consistently",
          "Focus on aptitude fundamentals",
          "Take the next level test after preparation",
        ],
      };
    }

    // 7️⃣ Save counselling (idempotent)
    await TestSession.findByIdAndUpdate(testSessionId, {
      aiInsights: counselling,
      counsellingGeneratedAt: new Date(),
    });

    return res.json({
      success: true,
      message: "Career counselling generated",
      counselling,
    });

  } catch (error) {
    console.error("Career Counselling Error:", error);
    return res.status(500).json({
      message: "Career counselling failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
