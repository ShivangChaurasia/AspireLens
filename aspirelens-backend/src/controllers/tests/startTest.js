import TestSession from "../../models/TestSessions.js";
import Question from "../../models/Question.js";
import User from "../../models/User.js";
import { calculateNextLevel } from "../../utils/levelCalculator.js";
import { generateQuestionsWithAI } from "../../services/openaiService.js";

/**
 * Map level to difficulty
 */
const mapLevelToDifficulty = (level) => {
  if (level <= 2) return "easy";
  if (level <= 4) return "medium";
  return "hard";
};

/**
 * START TEST CONTROLLER
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

    // 🔐 Ensure usedQuestions always exists (CRITICAL FIX)
    if (!Array.isArray(user.usedQuestions)) {
      user.usedQuestions = [];
    }

    // ✅ REQUIRED by Question schema
    const stream =
      user.profile?.stream ||
      user.stream ||
      "Generic";

    // ✅ Authoritative profile fields
    const { educationLevel, educationStage, interests } = user.profile || {};

    if (!educationLevel || !educationStage || !interests?.length) {
      return res.status(400).json({
        message: "Complete profile (education & interests) to start test",
      });
    }

    // 2️⃣ Resume existing test if any
    const existingSession = await TestSession.findOne({
      userId,
      status: { $in: ["in_progress", "not_started"] },
    });

    if (existingSession) {
      return res.status(200).json({
        testSessionId: existingSession._id,
        status: existingSession.status,
        level: existingSession.level,
        durationMinutes: existingSession.durationMinutes,
        totalQuestions: existingSession.totalQuestions,
        testName: `Career Assessment - Level ${existingSession.level}`,
      });
    }

    // 3️⃣ Determine level & difficulty
    const level = await calculateNextLevel(userId);
    const difficulty = mapLevelToDifficulty(level);

    // 4️⃣ Decide subjects (interest-driven)
    const subjects = [
      { section: "verbal", subject: "Verbal Ability", count: 10 },
      { section: "analytical", subject: "Logical Reasoning", count: 10 },
      { section: "math", subject: "Quantitative Aptitude", count: 10 },
    ];

    interests.forEach((interest) => {
      subjects.push({
        section: "domain",
        subject: interest,
        count: 10,
      });
    });

    // Hard limit
    const finalSubjects = subjects.slice(0, 6);

    let questionIds = [];
    let totalQuestions = 0;

    // 5️⃣ Fetch questions (DB first → AI fallback)
    for (const s of finalSubjects) {
      let questions = await Question.find({
        educationLevel,
        $or: [{ educationStage }, { educationStage: null }],
        section: s.section,
        subject: s.subject,
        stream: { $in: [stream, "Generic"] },
        difficulty,
        isActive: true,
        _id: { $nin: user.usedQuestions },
      }).limit(s.count);

      // 🧠 AI fallback (NON-FATAL)
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
        } catch (aiError) {
          console.error(
            `AI Question Generation Failed (${s.subject}):`,
            aiError.message
          );
          aiQuestions = [];
        }

        // Save AI questions only if available
        if (aiQuestions.length > 0) {
          const saved = await Question.insertMany(
            aiQuestions.map((q) => ({
              questionText: q.questionText,
              options: q.options,
              correctOption: q.correctOption,
              educationLevel,
              educationStage,
              stream,                // ✅ REQUIRED
              subject: s.subject,
              section: s.section,
              difficulty,
              isAIgenerated: true,
              isActive: true,
            }))
          );

          questions.push(...saved);
        }
      }

      // 🚨 Final safety check
      if (questions.length === 0) {
        return res.status(503).json({
          message:
            "Question generation temporarily unavailable. Please try again later.",
        });
      }

      questionIds.push(...questions.map((q) => q._id));
      totalQuestions += questions.length;
    }

    // 6️⃣ Lock question reuse (ABSOLUTE RULE)
    user.usedQuestions = [
      ...new Set([...user.usedQuestions, ...questionIds]),
    ];
    await user.save();

  // 7️⃣ Create test session (SCHEMA-COMPLETE)
  const session = await TestSession.create({
    userId,
    level,

    // ✅ REQUIRED BY SCHEMA
    classLevel: educationLevel,
    stream,

    // must contain at least 2 subjects
    subjects: finalSubjects.map(s => ({
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

  } catch (error) {
    console.error("Start Test Error:", error);
    return res.status(500).json({
      message: "Unable to start test",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
