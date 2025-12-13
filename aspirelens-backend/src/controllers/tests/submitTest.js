import TestSession from "../../models/TestSessions.js";
import UserAnswer from "../../models/UserAnswer.js";
import Question from "../../models/Question.js";

/**
 * SUBMIT TEST CONTROLLER
 * POST /api/test/submit/:testSessionId
 */
export const submitTest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { testSessionId } = req.params;

    // 1️⃣ Fetch test session
    const testSession = await TestSession.findById(testSessionId);
    if (!testSession) {
      return res.status(404).json({ message: "Test session not found" });
    }

    // 2️⃣ Ownership check
    if (testSession.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // 3️⃣ Prevent double submission
    if (testSession.status === "submitted") {
      return res.status(400).json({ message: "Test already submitted" });
    }

    // 4️⃣ Lock test
    testSession.status = "submitted";
    testSession.submittedAt = new Date();
    await testSession.save();

    // 5️⃣ Fetch all answers
    const answers = await UserAnswer.find({ userId, testSessionId });
    if (answers.length === 0) {
      return res.status(400).json({ message: "No answers found" });
    }

    // 6️⃣ Evaluate MCQs immediately
    let totalScore = 0;
    let maxScore = 0;
    const sectionWiseScore = {};

    for (const ans of answers) {
      maxScore += ans.maxMarks;

      if (ans.answerType === "mcq") {
        const question = await Question.findById(ans.questionId);

        if (question && ans.selectedOption === question.correctOption) {
          ans.isCorrect = true;
          ans.marksAwarded = ans.maxMarks;
        } else {
          ans.isCorrect = false;
          ans.marksAwarded = 0;
        }

        await ans.save();
      }

      totalScore += ans.marksAwarded;
      sectionWiseScore[ans.section] =
        (sectionWiseScore[ans.section] || 0) + ans.marksAwarded;
    }

    // 7️⃣ Store score summary in TestSession (single source of truth)
    testSession.scoreSummary = {
      totalScore,
      maxScore,
      sectionWiseScore,
    };

    await testSession.save();

    // 8️⃣ Response → AI evaluation & counselling comes NEXT
    return res.status(200).json({
      message: "Test submitted successfully",
      testSessionId,
      totalScore,
      maxScore,
      nextStep: "AI_EVALUATION",
    });

  } catch (error) {
    console.error("Submit Test Error:", error);
    res.status(500).json({ message: "Failed to submit test" });
  }
};
