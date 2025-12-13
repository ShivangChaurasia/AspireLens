import UserAnswer from "../../models/UserAnswer.js";
import TestSession from "../../models/TestSessions.js";

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

    // 2️⃣ Upsert answer (autosave logic)
    const answer = await UserAnswer.findOneAndUpdate(
      {
        testSessionId,
        questionId,
        userId,
      },
      {
        selectedOption,
        timeTakenSeconds,
        subject,
        section,
      },
      {
        upsert: true,
        new: true,
      }
    );

    return res.json({
      message: "Answer saved",
      answerId: answer._id,
    });

  } catch (error) {
    console.error("Save Answer Error:", error);
    res.status(500).json({ message: "Failed to save answer" });
  }
};
