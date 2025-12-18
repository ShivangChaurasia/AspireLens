import TestSession from "../../models/TestSessions.js";
import TestResult from "../../models/TestResults.js";
import UserAnswer from "../../models/UserAnswer.js";

/**
 * EVALUATE TEST (MCQ AUTO EVALUATION)
 * POST /api/test/evaluate/:testSessionId
 */
export const evaluateTest = async (req, res) => {
  try {
    const { testSessionId } = req.params;

    // 1️⃣ Fetch test session
    const session = await TestSession.findById(testSessionId);
    if (!session || session.status !== "submitted") {
      return res.status(400).json({
        success: false,
        message: "Test session not ready for evaluation",
      });
    }

    // 2️⃣ Fetch test result
    const result = await TestResult.findOne({ testSessionId });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Test result not found",
      });
    }

    if (result.status === "evaluated") {
      return res.status(200).json({
        success: true,
        message: "Test already evaluated",
        resultId: result._id,
      });
    }

    // 3️⃣ Fetch answers WITH questions
    const answers = await UserAnswer.find({ testSessionId })
      .populate("questionId");

    if (!answers.length) {
      return res.status(400).json({
        success: false,
        message: "No answers found for evaluation",
      });
    }

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let attemptedQuestions = 0;

    const sectionWiseScore = {};

    // 4️⃣ Evaluate MCQs
    for (const ans of answers) {
      const question = ans.questionId;
      if (!question || question.questionType !== "mcq") continue;

      if (!ans.selectedOption) continue;

      attemptedQuestions++;

      // Initialize section
      if (!sectionWiseScore[question.section]) {
        sectionWiseScore[question.section] = {
          correct: 0,
          total: 0,
          percentage: 0,
        };
      }

      sectionWiseScore[question.section].total++;

      if (ans.selectedOption === question.correctOption) {
        correctAnswers++;
        ans.isCorrect = true;
        ans.marksAwarded = 1;
        sectionWiseScore[question.section].correct++;
      } else {
        wrongAnswers++;
        ans.isCorrect = false;
        ans.marksAwarded = 0;
      }

      await ans.save();
    }

    // 5️⃣ Calculate section percentages
    for (const section in sectionWiseScore) {
      const s = sectionWiseScore[section];
      s.percentage =
        s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    }

    const totalQuestions = session.totalQuestions || 0;
    const scorePercentage =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    // 6️⃣ Update TestResult
    result.attemptedQuestions = attemptedQuestions;
    result.correctAnswers = correctAnswers;
    result.wrongAnswers = wrongAnswers;
    result.totalQuestions = totalQuestions;
    result.scorePercentage = scorePercentage;
    result.sectionWiseScore = sectionWiseScore;
    result.status = "evaluated";
    result.evaluatedAt = new Date();

    await result.save();

    // 7️⃣ Update TestSession
    session.status = "evaluated";
    session.lastUpdated = new Date();
    await session.save();

    return res.status(200).json({
      success: true,
      message: "Test evaluated successfully",
      testSessionId,
      summary: {
        totalQuestions,
        attemptedQuestions,
        correctAnswers,
        wrongAnswers,
        scorePercentage,
        sectionWiseScore,
      },
    });

  } catch (error) {
    console.error("Test Evaluation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to evaluate test",
    });
  }
};
