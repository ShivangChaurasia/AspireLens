import TestSession from "../../models/TestSessions.js";
import Question from "../../models/Question.js";
import User from "../../models/User.js";
import { calculateNextLevel } from "../../utils/levelCalculator.js";
import { generateQuestionsWithAI } from "../../services/openaiService.js";


/**
 * START TEST CONTROLLER
 * POST /api/test/start
 */
export const startTest = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const classLevel = user.classLevel;
    const stream = user.stream || "Generic";

    // 2️⃣ Block multiple active tests
    const activeTest = await TestSession.findOne({
      userId,
      status: { $in: ["not_started", "in_progress"] },
    });

    if (activeTest) {
      return res.status(400).json({
        message: "You already have an active test",
        testSessionId: activeTest._id,
      });
    }

    // 3️⃣ Calculate next level
    const level = await calculateNextLevel(userId);

    // Map level → difficulty
    const difficulty =
      level <= 2 ? "easy" :
      level <= 4 ? "medium" :
      "hard";

    // 4️⃣ Decide subjects (Verbal mandatory)
    let subjects = [
      {
        subject: "Verbal Ability",
        section: "verbal",
        totalQuestions: 10,
        difficulty,
      },
    ];

    if (classLevel === "10") {
      subjects.push(
        { subject: "Logical Reasoning", section: "analytical", totalQuestions: 10, difficulty },
        { subject: "Quantitative Aptitude", section: "math", totalQuestions: 10, difficulty }
      );
    }

    if (classLevel === "12" && stream === "PCM") {
      subjects.push(
        { subject: "Physics Aptitude", section: "domain", totalQuestions: 10, difficulty },
        { subject: "Mathematics Aptitude", section: "math", totalQuestions: 10, difficulty }
      );
    }

    if (classLevel === "12" && stream === "Commerce") {
      subjects.push(
        { subject: "Business Logic", section: "domain", totalQuestions: 10, difficulty },
        { subject: "Quantitative Aptitude", section: "math", totalQuestions: 10, difficulty }
      );
    }

    if (stream === "CSE" || stream === "IT") {
      subjects.push(
        { subject: "Computer Science", section: "domain", totalQuestions: 10, difficulty },
        { subject: "Logical Reasoning", section: "analytical", totalQuestions: 10, difficulty }
      );
    }

    // Limit subjects
    subjects = subjects.slice(0, 6);
// 5️⃣ Fetch questions (DB first, AI fallback)
  let questionIds = [];
  let totalQuestions = 0;

  for (const s of subjects) {

    // 5.1 Try DB first
    let questions = await Question.find({
      classLevel,
      section: s.section,
      isActive: true,
      $or: [{ stream }, { stream: "Generic" }],
      difficulty: s.difficulty,
    }).limit(s.totalQuestions);

    // 5.2 If DB is insufficient → generate via AI
    if (questions.length < s.totalQuestions) {
      const needed = s.totalQuestions - questions.length;

      const aiQuestions = await generateQuestionsWithAI({
        subject: s.subject,
        section: s.section,
        classLevel,
        stream,
        difficulty: s.difficulty,
        count: needed,
      });

      const savedQuestions = await Question.insertMany(
        aiQuestions.map((q) => ({
          classLevel,
          stream,
          section: s.section,
          subject: s.subject,
          questionText: q.questionText,
          options: q.options,
          correctOption: q.correctOption,
          difficulty: q.difficulty,
          isAIgenerated: true,
          isActive: true,
        }))
      );

      questions.push(...savedQuestions);
    }

    // 5.3 Final safety check
    if (questions.length < s.totalQuestions) {
      return res.status(400).json({
        message: `Unable to generate enough questions for ${s.subject}`,
      });
    }

    questionIds.push(...questions.map((q) => q._id));
    totalQuestions += questions.length;
  }

    // 6️⃣ Create test session
    const testSession = await TestSession.create({
      userId,
      classLevel,
      stream,
      level,
      subjects,
      questionIds,
      totalQuestions,
      durationMinutes: totalQuestions,
      status: "not_started",
    });

    return res.status(201).json({
      message: "Test session created",
      testSessionId: testSession._id,
      level,
      totalQuestions,
      durationMinutes: testSession.durationMinutes,
    });

  } catch (error) {
    console.error("Start Test Error:", error);
    res.status(500).json({ message: "Failed to start test" });
  }
};
