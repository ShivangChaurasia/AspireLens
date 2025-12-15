import TestSession from "../../models/TestSessions.js";

/**
 * GET SUBMITTED TEST DETAILS
 * GET /api/test/submitted/:testSessionId
 */
export const getSubmittedTest = async (req, res) => {
  try {
    const { testSessionId } = req.params;
    const userId = req.user.id;

    // 🔍 Find test session
    const session = await TestSession.findOne({
      _id: testSessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({
        message: "Test session not found"
      });
    }

    // ❌ Block access if not submitted
    if (session.status !== "submitted" && session.status) {
      return res.status(400).json({
        message: "Test not submitted yet"
      });
    }

    // 📊 Calculate attempted / unattempted
    const totalQuestions = session.totalQuestions || 0;

    // If later you store answers separately, this remains future-safe
    const attempted =
      session.answers?.length ||
      session.scoreSummary?.attempted ||
      0;

    const unattempted = Math.max(totalQuestions - attempted, 0);

    return res.json({
      testSessionId: session._id,
      status: session.status,
      submittedAt: session.submittedAt,
      totalQuestions,
      attempted,
      unattempted,
      durationMinutes: session.durationMinutes,
      level: session.level,
      scoreSummary: session.scoreSummary || null,
      aiInsights: session.aiInsights || null
    });

  } catch (error) {
    console.error("Get Submitted Test Error:", error);
    return res.status(500).json({
      message: "Failed to fetch submitted test"
    });
  }
};
