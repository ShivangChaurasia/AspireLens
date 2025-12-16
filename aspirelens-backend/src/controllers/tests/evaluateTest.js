// src/controllers/tests/evaluateTest.js

import TestSession from "../../models/TestSessions.js";
import TestResult from "../../models/TestResults.js";
import UserAnswer from "../../models/UserAnswer.js";
import Question from "../../models/Question.js";

/**
 * EVALUATE TEST (MCQ AUTO EVALUATION)
 * Can be triggered after submission
 */
export const evaluateTest = async (req, res) => {
  try {
    const { testSessionId } = req.params;

    // 1️⃣ Fetch test session
    const session = await TestSession.findById(testSessionId);
    if (!session || session.status !== "submitted") {
      return res.status(400).json({
        message: "Test session not ready for evaluation",
      });
    }

    // 2️⃣ Fetch test result
    const result = await TestResult.findOne({ testSessionId });
    if (!result) {
      return res.status(404).json({
        message: "Test result not found",
      });
    }

    // Prevent double evaluation
    if (result.status === "evaluated") {
      return res.status(200).json({
        message: "Test already evaluated",
        resultId: result._id,
      });
    }

    // 3️⃣ Fetch answers
    const answers = await UserAnswer.find({ testSessionId });
    if (!answers.length) {
      return res.status(400).json({
        message: "No answers found for evaluation",
      });
    }

    let correct = 0;
    let wrong = 0;
    let attempted = 0;

    const sectionWiseScore = {};

    // 4️⃣ Evaluate MCQs
    for (const ans of answers) {
      if (!ans.questionId || !ans.selectedOption) continue;

      const question = await Question.findById(ans.questionId);
      if (!question) continue;

      attempted++;

      // Initialize section score
      if (!sectionWiseScore[question.section]) {
        sectionWiseScore[question.section] = {
          correct: 0,
          wrong: 0,
          total: 0,
        };
      }

      sectionWiseScore[question.section].total++;

      if (
        question.questionType === "mcq" &&
        ans.selectedOption === question.correctOption
      ) {
        correct++;
        sectionWiseScore[question.section].correct++;
      } else {
        wrong++;
        sectionWiseScore[question.section].wrong++;
      }
    }

    // 5️⃣ Calculate score
    const totalQuestions = session.totalQuestions;
    const scorePercentage =
      totalQuestions > 0
        ? Math.round((correct / totalQuestions) * 100)
        : 0;

    // 6️⃣ Update TestResult
    result.attemptedQuestions = attempted;
    result.correctAnswers = correct;
    result.wrongAnswers = wrong;
    result.totalQuestions = totalQuestions;
    result.scorePercentage = scorePercentage;
    result.sectionWiseScore = sectionWiseScore;
    result.status = "evaluated";
    result.evaluatedAt = new Date();

    await result.save();

    return res.status(200).json({
      message: "Test evaluated successfully",
      testSessionId,
      summary: {
        totalQuestions,
        attempted,
        correct,
        wrong,
        scorePercentage,
        sectionWiseScore,
      },
    });

  } catch (error) {
    console.error("Test Evaluation Error:", error);
    return res.status(500).json({
      message: "Failed to evaluate test",
    });
  }
};
