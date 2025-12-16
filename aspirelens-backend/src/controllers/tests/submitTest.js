// src/controllers/tests/submitTest.js

import TestSession from "../../models/TestSessions.js";
import TestResult from "../../models/TestResults.js";
import UserAnswer from "../../models/UserAnswer.js";
import Question from "../../models/Question.js";
import User from "../../models/User.js";

export const submitTest = async (req, res) => {
  const startTime = Date.now();
  const { testSessionId } = req.params;
  const { reason } = req.body || {};
  const userId = req.user?.id;

  try {
    // 1️⃣ Basic validation
    if (!testSessionId) {
      return res.status(400).json({ success: false, message: "Test session ID required" });
    }
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 2️⃣ Fetch test session
    const testSession = await TestSession.findById(testSessionId);
    if (!testSession) {
      return res.status(404).json({ success: false, message: "Test session not found" });
    }

    // 3️⃣ Ownership check
    if (testSession.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // 4️⃣ Idempotency
    if (testSession.status === "submitted" || testSession.status === "evaluated") {
      const existingResult = await TestResult.findOne({ testSessionId, userId });
      return res.json({
        success: true,
        alreadySubmitted: true,
        testSessionId,
        resultId: existingResult?._id || null,
        status: testSession.status,
      });
    }

    // 5️⃣ Fetch answers
    const answers = await UserAnswer.find({
      testSessionId,
      userId,
    }).populate("questionId");

    // 6️⃣ MCQ AUTO EVALUATION
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let attemptedQuestions = 0;
    let sectionWiseScore = {};

    for (const ans of answers) {
      const question = ans.questionId;
      if (!question || question.questionType !== "mcq") continue;

      if (ans.selectedOption && ans.selectedOption.trim() !== "") {
        attemptedQuestions++;

        if (ans.selectedOption === question.correctOption) {
          correctAnswers++;
          ans.isCorrect = true;
          ans.marksAwarded = 1;
        } else {
          wrongAnswers++;
          ans.isCorrect = false;
          ans.marksAwarded = 0;
        }

        sectionWiseScore[question.section] =
          (sectionWiseScore[question.section] || 0) + ans.marksAwarded;

        await ans.save();
      }
    }

    const totalQuestions = testSession.totalQuestions || 0;
    const scorePercentage =
      attemptedQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    // 7️⃣ Create or update TestResult
    const testResult = await TestResult.findOneAndUpdate(
      { testSessionId, userId },
      {
        userId,
        testSessionId,
        totalQuestions,
        attemptedQuestions,
        correctAnswers,
        wrongAnswers,
        scorePercentage,
        sectionWiseScore,
        status: "evaluated",
        evaluatedAt: new Date(),
        autoSubmitted: Boolean(reason),
        autoSubmitReason: reason || null,
      },
      { upsert: true, new: true }
    );

    // 8️⃣ Update TestSession
    await TestSession.findByIdAndUpdate(testSessionId, {
      status: "evaluated",
      submittedAt: new Date(),
      autoSubmitted: Boolean(reason),
      autoSubmitReason: reason || null,
      lastUpdated: new Date(),
    });

    // 9️⃣ Update user activity (safe)
    await User.findByIdAndUpdate(userId, {
      $inc: { "profile.testsTaken": 1 },
      $set: { "profile.lastActive": new Date() },
    });

    return res.status(200).json({
      success: true,
      message: "Test submitted and evaluated successfully",
      testSessionId,
      resultId: testResult._id,
      totalQuestions,
      attemptedQuestions,
      correctAnswers,
      wrongAnswers,
      scorePercentage,
      status: "evaluated",
      processingTimeMs: Date.now() - startTime,
    });

  } catch (error) {
    console.error("[SubmitTest] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit test",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
