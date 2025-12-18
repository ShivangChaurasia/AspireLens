import Question from "../../models/Question.js";
import { generateQuestionsWithAI } from "../../services/openaiService.js";

/**
 * AI QUESTION GENERATOR
 * Generates & stores questions
 * POST /api/ai/generate-questions
 */
export const generateQuestions = async (req, res) => {
  try {
    const {
      educationLevel,        // ✅ REQUIRED BY SCHEMA
      educationStage = null,
      stream = "Generic",
      subject,
      section,
      difficulty = "medium",
      count = 10,
    } = req.body;

    // 🔐 Strict validation
    if (!educationLevel || !subject || !section) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["educationLevel", "subject", "section"],
      });
    }

    // 1️⃣ Generate questions from AI
    const aiQuestions = await generateQuestionsWithAI({
      subject,
      section,
      classLevel: educationStage || educationLevel, // AI-friendly
      stream,
      difficulty,
      count,
    });

    if (!Array.isArray(aiQuestions) || aiQuestions.length === 0) {
      return res.status(502).json({
        message: "AI failed to generate valid questions",
      });
    }

    // 2️⃣ Save questions to DB (SCHEMA SAFE)
    const savedQuestions = await Question.insertMany(
      aiQuestions.map((q) => ({
        questionText: q.questionText,
        options: q.options,
        correctOption: q.correctOption,

        // 🔒 REQUIRED FIELDS
        educationLevel,
        educationStage,
        stream,
        subject,
        section,
        difficulty: q.difficulty || difficulty,

        isAIgenerated: true,
        isActive: true,
      }))
    );

    return res.status(201).json({
      success: true,
      message: "Questions generated successfully",
      total: savedQuestions.length,
      questionIds: savedQuestions.map((q) => q._id),
    });

  } catch (error) {
    console.error("AI Question Generator Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate questions",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


