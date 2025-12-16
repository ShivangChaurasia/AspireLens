// import UserAnswer from "../../models/UserAnswer.js";
// import Question from "../../models/Question.js";
// import TestSession from "../../models/TestSessions.js";
// import { evaluateAnswerWithAI } from "../../services/openaiService.js";

// /**
//  * AI EVALUATION CONTROLLER
//  * Evaluates subjective answers only
//  */
// export const evaluateTestAnswers = async (req, res) => {
//   try {
//     const { testSessionId } = req.params;

//     // 1️⃣ Get test session
//     const testSession = await TestSession.findById(testSessionId);
//     if (!testSession || testSession.status !== "submitted") {
//       return res.status(400).json({ message: "Invalid test session" });
//     }

//     // 2️⃣ Fetch unevaluated subjective answers
//     const answers = await UserAnswer.find({
//       testSessionId,
//       answerType: { $ne: "mcq" },
//       isCorrect: null,
//     });

//     if (answers.length === 0) {
//       return res.json({ message: "No answers pending AI evaluation" });
//     }

//     // 3️⃣ Evaluate each subjective answer
//     for (const ans of answers) {
//       const question = await Question.findById(ans.questionId);
//       if (!question || !ans.answerText) continue;

//       const aiResult = await evaluateAnswerWithAI({
//         question: question.questionText,
//         answer: ans.answerText,
//         maxMarks: ans.maxMarks,
//       });

//       ans.aiEvaluation = {
//         score: aiResult.score,
//         feedback: aiResult.feedback,
//         improvementTip: aiResult.improvementTip,
//       };

//       ans.marksAwarded = aiResult.score;
//       ans.isCorrect = aiResult.score >= ans.maxMarks * 0.6;

//       await ans.save();
//     }

//     // 4️⃣ Recalculate test summary
//     const allAnswers = await UserAnswer.find({ testSessionId });

//     let totalScore = 0;
//     let maxScore = 0;
//     const sectionWiseScore = {};

//     for (const a of allAnswers) {
//       totalScore += a.marksAwarded;
//       maxScore += a.maxMarks;

//       sectionWiseScore[a.section] =
//         (sectionWiseScore[a.section] || 0) + a.marksAwarded;
//     }

//     testSession.scoreSummary = {
//       totalScore,
//       maxScore,
//       sectionWiseScore,
//     };

//     // ✅ Mark evaluation complete
//     testSession.status = "submitted";
//     await testSession.save();

//     return res.json({
//       message: "AI evaluation completed",
//       scoreSummary: testSession.scoreSummary,
//       nextStep: "Career counselling",
//     });

//   } catch (error) {
//     console.error("AI Evaluation Error:", error);
//     res.status(500).json({ message: "AI evaluation failed" });
//   }
// };
