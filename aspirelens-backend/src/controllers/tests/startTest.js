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
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const classLevel = user.classLevel;
    const stream = user.stream || "Generic";

    // 2️⃣ Check for existing tests with different logic
    const existingTest = await TestSession.findOne({
      userId,
      status: { $in: ["not_started", "in_progress"] },
    });

    if (existingTest) {
      // 🎯 CRITICAL FIX: Handle "not_started" status differently
      if (existingTest.status === "not_started") {
        // Allow user to restart a "not_started" test
        console.log(`[StartTest] Found not_started test: ${existingTest._id}, allowing restart`);
        
        // Update status to "in_progress" and set timestamps
        const updatedTest = await TestSession.findByIdAndUpdate(
          existingTest._id,
          {
            status: "in_progress",
            startedAt: new Date(),
            endsAt: new Date(Date.now() + existingTest.totalQuestions * 60 * 1000),
            lastUpdated: new Date()
          },
          { new: true }
        );

        // Get the questions for this test
        const questions = await Question.find({
          _id: { $in: existingTest.questionIds }
        }).lean();

        return res.status(200).json({
          success: true,
          message: "Resuming previously created test",
          testSessionId: existingTest._id,
          testInProgress: false, // Not in progress yet
          testResumed: true,
          level: existingTest.level,
          totalQuestions: existingTest.totalQuestions,
          durationMinutes: existingTest.durationMinutes,
          questions: questions,
          status: "in_progress",
          createdAt: existingTest.createdAt,
          testName: `Career Assessment - Level ${existingTest.level}`
        });
      }
      
      // If test is "in_progress", return it for continuation
      if (existingTest.status === "in_progress") {
        console.log(`[StartTest] Found in_progress test: ${existingTest._id}`);
        
        // Get the questions for this test
        const questions = await Question.find({
          _id: { $in: existingTest.questionIds }
        }).lean();

        return res.status(200).json({
          success: true,
          message: "You have a test in progress",
          testSessionId: existingTest._id,
          testInProgress: true,
          testResumed: false,
          level: existingTest.level,
          totalQuestions: existingTest.totalQuestions,
          durationMinutes: existingTest.durationMinutes,
          questions: questions,
          status: "in_progress",
          startedAt: existingTest.startedAt,
          endsAt: existingTest.endsAt,
          testName: `Career Assessment - Level ${existingTest.level}`
        });
      }
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
          success: false,
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
      status: "not_started", // Start as "not_started"
      createdAt: new Date(),
    });

    // 7️⃣ Immediately update to "in_progress" with timestamps
    const updatedSession = await TestSession.findByIdAndUpdate(
      testSession._id,
      {
        status: "in_progress",
        startedAt: new Date(),
        endsAt: new Date(Date.now() + totalQuestions * 60 * 1000),
        lastUpdated: new Date()
      },
      { new: true }
    );

    // 8️⃣ Fetch questions for response
    const questions = await Question.find({
      _id: { $in: questionIds }
    }).lean();

    console.log(`[StartTest] New test created: ${testSession._id}, level=${level}, questions=${totalQuestions}`);

    return res.status(201).json({
      success: true,
      testSessionId: testSession._id,
      level,
      totalQuestions,
      durationMinutes: totalQuestions,
      questions: questions,
      status: "in_progress",
      startedAt: updatedSession.startedAt,
      endsAt: updatedSession.endsAt,
      testName: `Career Assessment - Level ${level}`,
      message: "Test started successfully"
    });

  } catch (error) {
    console.error("Start Test Error:", error);
    
    // Provide more specific error messages
    let errorMessage = "Complete Your Profile Or Details Insufficient to Start Test";
    let statusCode = 500;
    
    if (error.message.includes("validation") || error.message.includes("Invalid")) {
      errorMessage = "Invalid user data. Please check your profile details.";
      statusCode = 400;
    } else if (error.message.includes("not found") || error.message.includes("undefined")) {
      errorMessage = "User profile not found or incomplete";
      statusCode = 404;
    } else if (error.message.includes("AI") || error.message.includes("generate")) {
      errorMessage = "Unable to generate questions at this time. Please try again.";
      statusCode = 503;
    }
    
    res.status(statusCode).json({ 
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};