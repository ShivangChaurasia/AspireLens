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
      timeTakenSeconds = 0,
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

    // 2️⃣ Fetch question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    // 3️⃣ Save / Update answer (idempotent)
    const answer = await UserAnswer.findOneAndUpdate(
      {
        userId,
        testSessionId,
        questionId,
      },
      {
        userId,
        testSessionId,
        questionId,

        answerType: question.questionType || "mcq",
        selectedOption: selectedOption || null,

        subject: subject || question.subject,
        section: section || question.section,

        timeSpentSeconds: timeTakenSeconds,

        maxMarks: 1,
        marksAwarded: 0,
        isCorrect: null,
        answeredAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Answer saved successfully",
      answerId: answer._id,
    });

  } catch (error) {
    console.error("[SaveAnswer Error]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save answer",
    });
  }
};
