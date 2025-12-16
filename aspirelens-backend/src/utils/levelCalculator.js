import TestSession from "../models/TestSessions.js";
import TestResult from "../models/TestResults.js";

/**
 * Calculates next test level for user
 * RULES:
 * - Level increases only after evaluated tests
 * - Promotion based on performance consistency
 */
export const calculateNextLevel = async (userId) => {
  // 1️⃣ Get last submitted session to know current level
  const lastSession = await TestSession.findOne({
    userId,
    status: "submitted",
  }).sort({ createdAt: -1 });

  if (!lastSession) {
    return 1; // First test
  }

  const currentLevel = lastSession.level || 1;

  // 2️⃣ Fetch evaluated results at this level
  const results = await TestResult.find({
    userId,
    status: "evaluated",
  })
    .populate({
      path: "testSessionId",
      match: { level: currentLevel },
      select: "level",
    })
    .lean();

  // Filter out results not matching this level
  const levelResults = results.filter(
    (r) => r.testSessionId && r.testSessionId.level === currentLevel
  );

  // Minimum attempts rule
  if (levelResults.length < 2) {
    return currentLevel;
  }

  // 3️⃣ Calculate average score
  const avgScore =
    levelResults.reduce(
      (sum, r) => sum + (r.scorePercentage || 0),
      0
    ) / levelResults.length;

  // 4️⃣ Fast-track promotion (last 2 tests ≥ 75%)
  const lastTwo = levelResults.slice(-2);
  const fastTrack = lastTwo.every(
    (r) => (r.scorePercentage || 0) >= 75
  );

  if (fastTrack) {
    return currentLevel + 1;
  }

  // 5️⃣ Normal promotion
  if (avgScore >= 65) {
    return currentLevel + 1;
  }

  // 6️⃣ Protection against regression
  return currentLevel;
};
