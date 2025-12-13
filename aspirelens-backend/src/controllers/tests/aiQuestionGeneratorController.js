import Question from "../../models/Question.js";
import { generateQuestionsWithAI } from "../../services/openaiService.js";

/**
 * AI QUESTION GENERATOR
 * Generates & stores questions
 */
export const generateQuestions = async (req, res) => {
  try {
    const {
      classLevel,
      stream,
      subject,
      section,
      difficulty = "medium",
      count = 10,
    } = req.body;

    if (!classLevel || !subject || !section) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Ask AI to generate questions
    const aiQuestions = await generateQuestionsWithAI({
      classLevel,
      stream,
      subject,
      section,
      difficulty,
      count,
    });

    // 2️⃣ Save to DB
    const savedQuestions = await Question.insertMany(
      aiQuestions.map((q) => ({
        ...q,
        classLevel,
        stream,
        subject,
        section,
        difficulty,
        isAIgenerated: true,
      }))
    );

    return res.status(201).json({
      message: "Questions generated successfully",
      questionIds: savedQuestions.map((q) => q._id),
    });

  } catch (error) {
    console.error("AI Question Generator Error:", error);
    res.status(500).json({ message: "Failed to generate questions" });
  }
};
