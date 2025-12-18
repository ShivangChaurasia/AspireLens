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

/**
 * GET CAREER COUNSELLING CONTROLLER
 * GET /api/counselling/data/:testSessionId
 */
export const getCareerCounselling = async (req, res) => {
  try {
    const { testSessionId } = req.params;
    const userId = req.user.id;

    console.log(`[GetCounselling] Request: session=${testSessionId}, user=${userId}`);

    // 1️⃣ Validate testSessionId format
    if (!testSessionId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid test session ID format"
      });
    }

    // 2️⃣ Fetch test session with counselling data
    const testSession = await TestSession.findOne({
      _id: testSessionId,
      userId
    })
    .select("aiInsights counsellingGeneratedAt testName level submittedAt status");

    if (!testSession) {
      return res.status(404).json({
        success: false,
        message: "Test session not found or unauthorized"
      });
    }

    // 3️⃣ Check if counselling exists
    if (!testSession.aiInsights) {
      return res.status(200).json({
        success: true,
        testSessionId,
        status: "counselling_pending",
        message: "Career counselling not generated yet",
        testName: testSession.testName,
        level: testSession.level,
        submittedAt: testSession.submittedAt,
        canGenerate: testSession.status === "evaluated"
      });
    }

    // 4️⃣ Fetch test result for additional data
    const testResult = await TestResult.findOne({
      testSessionId,
      userId
    })
    .select("totalQuestions attemptedQuestions correctAnswers wrongAnswers scorePercentage");

    // 5️⃣ Fetch user profile
    const user = await User.findById(userId).select(
      "firstName lastName email profile"
    );

    // 6️⃣ Prepare response
    const response = {
      success: true,
      testSessionId: testSession._id,
      status: "counselling_available",
      testName: testSession.testName || `Career Assessment - Level ${testSession.level || 1}`,
      level: testSession.level || 1,
      submittedAt: testSession.submittedAt,
      counsellingGeneratedAt: testSession.counsellingGeneratedAt,
      
      // Test performance data
      testPerformance: testResult ? {
        totalQuestions: testResult.totalQuestions,
        attemptedQuestions: testResult.attemptedQuestions,
        correctAnswers: testResult.correctAnswers,
        wrongAnswers: testResult.wrongAnswers,
        scorePercentage: testResult.scorePercentage,
        accuracy: testResult.attemptedQuestions > 0 
          ? Math.round((testResult.correctAnswers / testResult.attemptedQuestions) * 100)
          : 0
      } : null,
      
      // User profile
      userProfile: {
        name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User",
        email: user?.email || "N/A",
        educationLevel: user?.profile?.educationLevel || "Not specified",
        educationStage: user?.profile?.educationStage || "Not specified",
        interests: user?.profile?.interests || []
      },
      
      // Counselling insights
      counselling: testSession.aiInsights
    };

    console.log(`[GetCounselling] Success: session=${testSessionId}`);

    return res.status(200).json(response);

  } catch (error) {
    console.error("[GetCounselling] Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch career counselling",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};