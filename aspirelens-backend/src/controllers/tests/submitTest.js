import TestSession from "../../models/TestSessions.js";
import TestResult from "../../models/TestResults.js";
import UserAnswer from "../../models/UserAnswer.js";
import User from "../../models/User.js";

export const submitTest = async (req, res) => {
  const startTime = Date.now();
  const { testSessionId } = req.params;
  const { reason } = req.body || {};
  const userId = req.user?.id;
  
  console.log(`[SubmitTest] Request received:`, {
    session: testSessionId, 
    user: userId, 
    reason: reason || 'manual'
  });
  
  try {
    // 1️⃣ Validate required parameters
    if (!testSessionId) {
      return res.status(400).json({
        success: false,
        message: "Test session ID is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // 2️⃣ Check if test session exists
    const testSession = await TestSession.findById(testSessionId);

    if (!testSession) {
      return res.status(404).json({
        success: false,
        message: "Test session not found",
      });
    }

    // 3️⃣ Ownership check
    if (testSession.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to submit this test",
      });
    }

    // 4️⃣ Idempotent submission: If already submitted, return success
    if (testSession.status === "submitted") {
      const existingResult = await TestResult.findOne({ testSessionId });
      
      return res.status(200).json({
        success: true,
        message: "Test was already submitted",
        alreadySubmitted: true,
        testSessionId,
        resultId: existingResult?._id || null,
        submittedAt: testSession.submittedAt,
        autoSubmitted: testSession.autoSubmitted || false,
        autoSubmitReason: testSession.autoSubmitReason || null,
      });
    }

    // 5️⃣ Status validation
    if (!["in_progress", "not_started"].includes(testSession.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot submit test in current state",
        currentStatus: testSession.status
      });
    }

    // 6️⃣ Handle auto-submit
    const autoSubmitReason = reason || null;
    const isAutoSubmitted = Boolean(autoSubmitReason);
    
    console.log(`[SubmitTest] Processing:`, {
      isAutoSubmitted,
      reason: autoSubmitReason,
      currentStatus: testSession.status
    });

    // 7️⃣ Fetch all answers
    let answers = [];
    try {
      answers = await UserAnswer.find({
        testSessionId,
        userId,
      }).lean();
    } catch (dbError) {
      console.error(`[SubmitTest] Error fetching answers: ${dbError.message}`);
      // Continue with empty answers
    }

    // 8️⃣ Calculate attempted count
    let attemptedQuestions = 0;
    try {
      attemptedQuestions = answers.filter(a => {
        if (!a) return false;
        
        if (a.answerType === "mcq") {
          return a.selectedOption && a.selectedOption.trim() !== "";
        }
        
        if (a.answerType === "short_answer") {
          return a.answerText && a.answerText.trim() !== "";
        }
        
        return false;
      }).length;
    } catch (calcError) {
      console.error(`[SubmitTest] Error calculating attempts: ${calcError.message}`);
      attemptedQuestions = 0;
    }

    // 9️⃣ Create test result - SIMPLIFIED to prevent crashes
    let testResult;
    try {
      testResult = await TestResult.create({
        userId,
        testSessionId,
        totalQuestions: testSession.totalQuestions || 0,
        attemptedQuestions,
        autoSubmitted: isAutoSubmitted,
        autoSubmitReason: autoSubmitReason,
        submittedAt: new Date(),
        status: "pending_evaluation"
      });

      console.log(`[SubmitTest] TestResult created:`, testResult._id);
    } catch (createError) {
      console.error(`[SubmitTest] Error creating result:`, createError);
      // Continue anyway - we'll still update the session
    }

    // 🔟 Update test session
    try {
      await TestSession.findByIdAndUpdate(
        testSessionId,
        {
          status: "submitted",
          submittedAt: new Date(),
          autoSubmitted: isAutoSubmitted,
          autoSubmitReason: autoSubmitReason,
          lastUpdated: new Date()
        }
      );

      console.log(`[SubmitTest] TestSession updated to submitted`);
    } catch (updateError) {
      console.error(`[SubmitTest] Error updating session:`, updateError);
      // Try to continue
    }

    // 1️⃣1️⃣ Update user activity (optional)
    try {
      await User.findByIdAndUpdate(userId, {
        $inc: { totalTestsTaken: 1 },
        $set: { lastTestAt: new Date() }
      });
    } catch (userError) {
      console.warn(`[SubmitTest] Error updating user:`, userError);
    }

    // 1️⃣2️⃣ Return success
    const processingTime = Date.now() - startTime;
    
    return res.status(200).json({
      success: true,
      message: isAutoSubmitted
        ? `Test auto-submitted: ${autoSubmitReason}`
        : "Test submitted successfully",
      testSessionId,
      resultId: testResult?._id || null,
      attemptedQuestions,
      totalQuestions: testSession.totalQuestions || 0,
      submittedAt: new Date(),
      autoSubmitted: isAutoSubmitted,
      autoSubmitReason: autoSubmitReason,
      processingTimeMs: processingTime
    });

  } catch (error) {
    console.error(`[SubmitTest] Critical Error:`, error.message);
    
    return res.status(500).json({
      success: false,
      message: "Failed to submit test",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};