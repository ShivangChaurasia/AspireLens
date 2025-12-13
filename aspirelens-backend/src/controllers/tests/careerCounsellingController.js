import TestSession from "../../models/TestSessions.js";
import User from "../../models/User.js";
import UserAnswer from "../../models/UserAnswer.js";
import { generateCareerCounsellingWithAI } from "../../services/openaiService.js";

/**
 * AI CAREER COUNSELLING CONTROLLER
 * POST /api/counselling/:testSessionId
 */
export const generateCareerCounselling = async (req, res) => {
  try {
    const { testSessionId } = req.params;

    // 1️⃣ Fetch test session (must be evaluated)
    const test = await TestSession.findById(testSessionId);
    if (!test || test.status !== "evaluated") {
      return res.status(400).json({ message: "Test not ready for counselling" });
    }

    // 2️⃣ Fetch user
    const user = await User.findById(test.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Fetch answers
    const answers = await UserAnswer.find({ testSessionId });

    const sectionStats = {};
    const speedStats = {};

    for (const a of answers) {
      if (!sectionStats[a.section]) {
        sectionStats[a.section] = { score: 0, max: 0 };
        speedStats[a.section] = [];
      }

      sectionStats[a.section].score += a.marksAwarded;
      sectionStats[a.section].max += a.maxMarks;
      speedStats[a.section].push(a.timeSpentSeconds || 60);
    }

    const performance = Object.entries(sectionStats).map(
      ([section, data]) => ({
        section,
        percentage: Math.round((data.score / data.max) * 100),
        avgTime: Math.round(
          speedStats[section].reduce((a, b) => a + b, 0) /
          speedStats[section].length
        ),
      })
    );

    // 4️⃣ Call Gemini counselling service
    const counselling = await generateCareerCounsellingWithAI({
      classLevel: test.classLevel,
      stream: test.stream,
      level: test.level,
      testsTaken: user.testsTaken || 1,
      performance,
    });

    // 5️⃣ Save counselling output
    test.aiInsights = {
      strengths: counselling.strengths,
      weaknesses: counselling.weaknesses,
      careerRecommendations: counselling.careerRecommendations,
      improvementPlan: counselling.improvementPlan,
    };

    test.status = "counselling_generated";
    await test.save();

    return res.json({
      message: "Career counselling generated successfully",
      counselling: test.aiInsights,
    });

  } catch (error) {
    console.error("Career Counselling Error:", error);
    res.status(500).json({ message: "Career counselling failed" });
  }
};
