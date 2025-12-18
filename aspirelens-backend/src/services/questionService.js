import Question from "../models/Question.js";
import UserAnswer from "../models/UserAnswer.js";

export const getUnusedQuestionsForUser = async ({
  userId,
  educationLevel,
  educationStage,
  stream,
  section,
  difficulty,
  limit,
}) => {
  // 1️⃣ Get all question IDs already seen by this user
  const usedQuestionIds = await UserAnswer.distinct("questionId", {
    userId,
  });

  // 2️⃣ Fetch only UNUSED questions
  const questions = await Question.find({
    educationLevel,
    educationStage,
    stream,
    section,
    difficulty,
    isActive: true,
    _id: { $nin: usedQuestionIds },
  })
    .limit(limit)
    .lean();

  return questions;
};
