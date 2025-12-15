import TestSession from "../../models/TestSessions.js";
export const getTestSession = async (req, res) => {
  try {
    const { testSessionId } = req.params;

    // console.log("🔥 getTestSession HIT", testSessionId);

    const session = await TestSession.findById(testSessionId)
      .populate("questionIds");

    if (!session) {
      return res.status(404).json({
        message: "Test session not found",
      });
    }

    if (session.status !== "in_progress" && session.status !== "not_started") {
      return res.status(400).json({
        message: "Test session already submitted or expired",
      });
    }

    // ✅ SAFE ARRAY CHECK
    if (!session.questionIds || session.questionIds.length === 0) {
      return res.status(500).json({
        message: "No questions found for this test session",
      });
    }
    return res.json({
      questions: session.questionIds,
      durationMinutes: session.durationMinutes,
      totalQuestions: session.totalQuestions,
      level: session.level,
      createdAt: session.createdAt,
      testName: "Career Assessment",
    });
  } catch (error) {
    console.error("Get Test Session Error:", error);
    return res.status(500).json({
      message: "Failed to fetch test session",
    });
  }
};

