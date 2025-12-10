import User from "../models/User.js";

// GET /api/user/me
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      classLevel: user.classLevel,
      stream: user.stream,
      interests: user.interests,
      isProfileComplete: user.isProfileComplete,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get Profile Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// POST /api/user/complete-profile
export const completeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classLevel, stream, interests } = req.body;

    // Basic validation
    const allowedClassLevels = ["10", "11", "12"];
    const allowedStreams = ["PCM", "PCB", "Commerce", "Arts", "General"];

    if (!classLevel || !allowedClassLevels.includes(classLevel)) {
      return res.status(400).json({
        message: "Invalid or missing classLevel. Allowed: 10, 11, 12",
      });
    }

    if (!stream || !allowedStreams.includes(stream)) {
      return res.status(400).json({
        message: "Invalid or missing stream. Allowed: PCM, PCB, Commerce, Arts, General",
      });
    }

    let finalInterests = [];
    if (Array.isArray(interests)) {
      finalInterests = interests
        .filter((i) => typeof i === "string")
        .map((i) => i.trim())
        .filter((i) => i.length > 0);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        classLevel,
        stream,
        interests: finalInterests,
        isProfileComplete: true,
      },
      { new: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile completed successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        classLevel: updatedUser.classLevel,
        stream: updatedUser.stream,
        interests: updatedUser.interests,
        isProfileComplete: updatedUser.isProfileComplete,
      },
    });
  } catch (error) {
    console.error("Complete Profile Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
