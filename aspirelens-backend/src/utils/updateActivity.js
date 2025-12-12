import UserActivity from "../models/UserActivity.js";

export const updateUserActivity = async (userId) => {
  const activity = await UserActivity.findOne({ userId });

  const today = new Date().toDateString();

  if (!activity) {
    return await UserActivity.create({
      userId,
      lastActive: new Date(),
      dailyStreak: 1
    });
  }

  const lastActiveDay = new Date(activity.lastActive).toDateString();

  let newStreak = activity.dailyStreak;

  if (lastActiveDay !== today) {
    newStreak += 1;
  }

  activity.lastActive = new Date();
  activity.dailyStreak = newStreak;

  await activity.save();
};
