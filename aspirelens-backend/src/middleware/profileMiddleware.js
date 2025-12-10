import User from "../models/User.js";

export const ensureProfileComplete = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("isProfileComplete");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isProfileComplete) {
      return res.status(403).json({
        message: "Please complete your profile before accessing this feature",
      });
    }

    next();
  } catch (error) {
    console.error("Profile Check Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
