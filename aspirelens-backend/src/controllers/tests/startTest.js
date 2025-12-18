import crypto from "crypto";
import TestSession from "../../models/TestSessions.js";
import Question from "../../models/Question.js";
import User from "../../models/User.js";
import UserAnswer from "../../models/UserAnswer.js";
import { calculateNextLevel } from "../../utils/levelCalculator.js";
import { generateQuestionsWithAI } from "../../services/openaiService.js";

/**
 * 🔐 Create deterministic question hash
 */
const hashQuestion = (text) =>
  crypto
    .createHash("sha256")
    .update(text.trim().toLowerCase())
    .digest("hex");

/**
 * 🎯 Map level → difficulty
 */
const mapLevelToDifficulty = (level) => {
  if (level <= 2) return "easy";
  if (level <= 4) return "medium";
  return "hard";
};

/**
 * 🚀 START TEST
 * POST /api/test/start
 */
export const startTest = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { educationLevel, educationStage, interests, stream } =
      user.profile || {};

    if (!educationLevel || !interests || interests.length === 0) {
      return res.status(400).json({
        message: "Complete profile (education & interests) to start test",
      });
    }

    const finalStream = stream || user.stream || "Generic";

    // 2️⃣ Resume existing test
    const existingSession = await TestSession.findOne({
      userId,
      status: "in_progress",
    });

    if (existingSession) {
      return res.status(200).json({
        success: true,
        testSessionId: existingSession._id,
        status: existingSession.status,
        level: existingSession.level,
        durationMinutes: existingSession.durationMinutes,
        totalQuestions: existingSession.totalQuestions,
        testName: `Career Assessment - Level ${existingSession.level}`,
      });
    }

    // 3️⃣ Level & difficulty
    const level = await calculateNextLevel(userId);
    const difficulty = mapLevelToDifficulty(level);

    // 4️⃣ Subject blueprint
    const subjects = [
      { section: "verbal", subject: "Verbal Ability", count: 10 },
      { section: "analytical", subject: "Logical Reasoning", count: 10 },
      { section: "math", subject: "Quantitative Aptitude", count: 10 },
      ...interests.map((i) => ({
        section: "domain",
        subject: i,
        count: 10,
      })),
    ].slice(0, 6);

    // 🔒 5️⃣ All previously used questions (GLOBAL PER USER)
    const usedQuestionIds = await UserAnswer.distinct("questionId", {
      userId,
    });

    let questionIds = [];
    let totalQuestions = 0;

    // 6️⃣ Fetch questions (DB → AI fallback)
    for (const s of subjects) {
      let questions = await Question.find({
        educationLevel,
        $or: [{ educationStage }, { educationStage: null }],
        section: s.section,
        subject: s.subject,
        stream: { $in: [finalStream, "Generic"] },
        difficulty,
        isActive: true,
        _id: { $nin: usedQuestionIds }, // 🔥 ABSOLUTE RULE
      }).limit(s.count);

      // 🧠 AI fallback
      if (questions.length < s.count) {
        const needed = s.count - questions.length;

        let aiQuestions = [];
        try {
          aiQuestions = await generateQuestionsWithAI({
            educationLevel,
            educationStage,
            subject: s.subject,
            section: s.section,
            difficulty,
            count: needed,
          });
        } catch (err) {
          console.error(`AI generation failed (${s.subject})`, err.message);
        }

        if (aiQuestions.length > 0) {
          const formatted = aiQuestions.map((q) => ({
            questionText: q.questionText,
            options: q.options,
            correctOption: q.correctOption,
            educationLevel,
            educationStage,
            stream: finalStream,
            subject: s.subject,
            section: s.section,
            difficulty,
            questionHash: hashQuestion(q.questionText),
            isAIgenerated: true,
            isActive: true,
          }));

          let saved = [];
          try {
            saved = await Question.insertMany(formatted, {
              ordered: false, // 🔥 CRITICAL FIX
            });
          } catch (err) {
            if (err.code === 11000) {
              console.warn("Duplicate AI questions skipped");
              saved = err.insertedDocs || [];
            } else {
              throw err;
            }
          }

          questions.push(...saved);
        }
      }

      if (!questions.length) {
        return res.status(503).json({
          message:
            "Question pool exhausted. Please try again later or reset pool.",
        });
      }

      questionIds.push(...questions.map((q) => q._id));
      totalQuestions += questions.length;
    }

    // 7️⃣ Create test session
    const session = await TestSession.create({
      userId,
      level,
      classLevel: educationLevel,
      stream: finalStream,
      subjects: subjects.map((s) => ({
        section: s.section,
        subject: s.subject,
        totalQuestions: s.count,
      })),
      questionIds,
      totalQuestions,
      durationMinutes: totalQuestions,
      status: "in_progress",
      startedAt: new Date(),
      endsAt: new Date(Date.now() + totalQuestions * 60 * 1000),
    });

    return res.status(201).json({
      success: true,
      testSessionId: session._id,
      totalQuestions,
      durationMinutes: session.durationMinutes,
      level,
      testName: `Career Assessment - Level ${level}`,
    });

  } catch (error) {
    console.error("[StartTest Error]", error);
    return res.status(500).json({
      message: "Unable to start test",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
