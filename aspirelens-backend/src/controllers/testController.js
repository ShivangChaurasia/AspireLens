import TestSession from "../models/TestSessions.js";
import UserAnswer from "../models/UserAnswer.js";
import Question from "../models/Question.js";

/**
 * SUBMIT TEST CONTROLLER
 * Locks test, evaluates MCQs, prepares AI evaluation data
 */
export const submitTest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { testSessionId } = req.params;

    // 1️⃣ Fetch test session
    const testSession = await TestSession.findOne({
      _id: testSessionId,
      userId,
    });

    if (!testSession) {
      return res.status(404).json({ message: "Test session not found" });
    }

    if (testSession.status !== "in_progress") {
      return res.status(400).json({ message: "Test already submitted or expired" });
    }

    // 2️⃣ Lock the test
    testSession.status = "submitted";
    testSession.submittedAt = new Date();

    // 3️⃣ Fetch all answers
    const answers = await UserAnswer.find({
      testSessionId,
      userId,
    });

    if (answers.length === 0) {
      return res.status(400).json({ message: "No answers submitted" });
    }

    // 4️⃣ Evaluate MCQs (instant)
    let totalScore = 0;
    let maxScore = 0;
    const sectionWiseScore = {};

    for (const ans of answers) {
      maxScore += ans.maxMarks;

      if (ans.answerType === "mcq") {
        const question = await Question.findById(ans.questionId);

        if (question && question.correctOption) {
          if (ans.selectedOption === question.correctOption) {
            ans.isCorrect = true;
            ans.marksAwarded = ans.maxMarks;
          } else {
            ans.isCorrect = false;
            ans.marksAwarded = 0;
          }

          totalScore += ans.marksAwarded;
        }
      }

      // Section-wise aggregation
      if (!sectionWiseScore[ans.section]) {
        sectionWiseScore[ans.section] = 0;
      }
      sectionWiseScore[ans.section] += ans.marksAwarded;

      await ans.save();
    }

    // 5️⃣ Save score summary
    testSession.scoreSummary = {
      totalScore,
      maxScore,
      sectionWiseScore,
    };

    await testSession.save();

    // 6️⃣ Prepare AI evaluation payload (NO AI CALL YET)
    const aiPayload = answers
      .filter(a => a.answerType !== "mcq")
      .map(a => ({
        questionId: a.questionId,
        subject: a.subject,
        section: a.section,
        answerText: a.answerText,
        maxMarks: a.maxMarks,
      }));

    return res.status(200).json({
      message: "Test submitted successfully",
      testSessionId,
      scoreSummary: testSession.scoreSummary,
      pendingAIEvaluation: aiPayload.length,
      nextStep: "AI evaluation & counselling",
    });

  } catch (error) {
    console.error("Submit Test Error:", error);
    res.status(500).json({ message: "Failed to submit test" });
  }
};
