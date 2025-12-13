import TestSession from "../models/TestSessions.js";

/**
 * Calculates next test level for user
 */
export const calculateNextLevel = async (userId) => {
  const completedTests = await TestSession.find({
    userId,
    status: "submitted",
  }).sort({ createdAt: -1 });

  if (completedTests.length === 0) return 1;

  const currentLevel = completedTests[0].level || 1;

  // Tests at current level
  const levelTests = completedTests.filter(
    (t) => t.level === currentLevel
  );

  if (levelTests.length < 2) {
    return currentLevel; // minimum tests not met
  }

  // Calculate average score
  const avgScore =
    levelTests.reduce((sum, t) => {
      const percent =
        t.scoreSummary.maxScore > 0
          ? (t.scoreSummary.totalScore / t.scoreSummary.maxScore) * 100
          : 0;
      return sum + percent;
    }, 0) / levelTests.length;

  // Fast-track rule (last 2 tests)
  const lastTwo = levelTests.slice(0, 2);
  const fastTrack =
    lastTwo.every(
      (t) =>
        (t.scoreSummary.totalScore / t.scoreSummary.maxScore) * 100 >= 75
    );

  if (fastTrack) {
    return currentLevel + 1;
  }

  // Normal promotion
  if (avgScore >= 65) {
    return currentLevel + 1;
  }

  // Poor performance protection
  if (avgScore < 40) {
    return currentLevel;
  }

  return currentLevel;
};
