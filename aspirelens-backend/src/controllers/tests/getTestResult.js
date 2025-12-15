// src/controllers/tests/getTestResult.js
import TestResult from "../../models/TestResults.js";
import TestSession from "../../models/TestSessions.js";
import User from "../../models/User.js";

/**
 * GET TEST RESULT CONTROLLER
 * GET /api/test/result/:testSessionId
 */
export const getTestResult = async (req, res) => {
  try {
    const { testSessionId } = req.params;
    const userId = req.user.id;

    console.log(`[GetTestResult] Request: session=${testSessionId}, user=${userId}`);

    // 1️⃣ Validate testSessionId format
    if (!testSessionId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid test session ID format"
      });
    }

    // 2️⃣ Check test session exists and belongs to user
    const testSession = await TestSession.findOne({
      _id: testSessionId,
      userId
    }).select('status submittedAt totalQuestions level testName');

    if (!testSession) {
      return res.status(404).json({
        success: false,
        message: "Test session not found or unauthorized"
      });
    }

    // 3️⃣ Find test result
    const testResult = await TestResult.findOne({
      testSessionId,
      userId
    });

    if (!testResult) {
      // If no result exists yet, return pending status with session data
      return res.status(200).json({
        success: true,
        testSessionId,
        status: "pending_evaluation",
        message: "Test is being evaluated",
        testName: testSession.testName || `Career Assessment - Level ${testSession.level || 1}`,
        level: testSession.level || 1,
        totalQuestions: testSession.totalQuestions || 0,
        attemptedQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        scorePercentage: 0,
        sectionWiseScore: {},
        submittedAt: testSession.submittedAt,
        evaluatedAt: null
      });
    }

    // 4️⃣ Calculate derived fields
    const unattemptedQuestions = Math.max(0, testResult.totalQuestions - testResult.attemptedQuestions);
    const accuracy = testResult.attemptedQuestions > 0 
      ? Math.round((testResult.correctAnswers / testResult.attemptedQuestions) * 100)
      : 0;

    // 5️⃣ Get user details for response
    const user = await User.findById(userId).select('name email classLevel stream');

    // 6️⃣ Prepare response
    const response = {
      success: true,
      testSessionId: testResult.testSessionId,
      status: testResult.status,
      testName: testSession.testName || `Career Assessment - Level ${testSession.level || 1}`,
      level: testSession.level || 1,
      totalQuestions: testResult.totalQuestions,
      attemptedQuestions: testResult.attemptedQuestions,
      unattemptedQuestions,
      correctAnswers: testResult.correctAnswers,
      wrongAnswers: testResult.wrongAnswers,
      scorePercentage: testResult.scorePercentage,
      accuracyPercentage: accuracy,
      sectionWiseScore: Object.fromEntries(testResult.sectionWiseScore),
      submittedAt: testSession.submittedAt,
      evaluatedAt: testResult.evaluatedAt,
      userDetails: {
        name: user?.name || "User",
        classLevel: user?.classLevel || "N/A",
        stream: user?.stream || "N/A"
      }
    };

    console.log(`[GetTestResult] Success: session=${testSessionId}, status=${testResult.status}`);

    return res.status(200).json(response);

  } catch (error) {
    console.error("[GetTestResult] Error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Failed to fetch test result",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};