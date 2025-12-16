import UserAnswer from "../../models/UserAnswer.js";
import TestSession from "../../models/TestSessions.js";
import Question from "../../models/Question.js";

export const saveAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      testSessionId,
      questionId,
      selectedOption,
      timeTakenSeconds,
      subject,
      section,
    } = req.body;

    // 1️⃣ Validate test session
    const session = await TestSession.findOne({
      _id: testSessionId,
      userId,
      status: "in_progress",
    });

    if (!session) {
      return res.status(400).json({
        message: "Invalid or inactive test session",
      });
    }

    // 2️⃣ Get question to determine type
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // 3️⃣ Upsert answer with REQUIRED fields
    const answer = await UserAnswer.findOneAndUpdate(
      { testSessionId, questionId, userId },
      {
        answerType: question.questionType || "mcq", // ✅ FIX
        selectedOption,
        timeTakenSeconds,
        subject,
        section,
        maxMarks: 1,            // ✅ required for evaluation
        marksAwarded: 0,
        isCorrect: null,
      },
      { upsert: true, new: true }
    );

    return res.json({
      message: "Answer saved successfully",
      answerId: answer._id,
    });

  } catch (error) {
    console.error("Save Answer Error:", error);
    res.status(500).json({ message: "Failed to save answer" });
  }
};
