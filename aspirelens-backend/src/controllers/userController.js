import User from "../models/User.js";
import bcrypt from "bcryptjs";

// GET /api/user/me
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure profile always exists
    if (!user.profile) user.profile = {};
    if (!user.profile.joinedAt) user.profile.joinedAt = user.createdAt;
    if (!user.profile.lastActive) user.profile.lastActive = user.updatedAt;

    return res.json(user);
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// FIXED: updateProfile function - NO LEGACY FIELD SYNCING
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, profile } = req.body; // REMOVED: classLevel, stream, interests from root

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update basic fields
    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    // REMOVED: classLevel, stream, interests updates from root

    // PROFILE object exists?
    if (!user.profile) user.profile = {};

    // Update profile fields ONLY
    if (profile) {
      if ("age" in profile) user.profile.age = profile.age;
      if ("educationLevel" in profile) user.profile.educationLevel = profile.educationLevel;
      if ("educationStage" in profile) user.profile.educationStage = profile.educationStage; // ADDED
      if ("stream" in profile) user.profile.stream = profile.stream;
      if ("interests" in profile) user.profile.interests = profile.interests;
      // REMOVED: Legacy field syncing (user.stream = profile.stream, user.interests = profile.interests)
    }

    // Calculate profile completion (using PROFILE fields only)
    let completion = 0;
    if (user.firstName) completion += 20;
    if (user.lastName) completion += 20;
    if (user.profile.age) completion += 20;
    if (user.profile.educationLevel) completion += 20;
    
    // Check educationStage conditionally
    if (user.profile.educationLevel === "Professional") {
      completion += 20; // Professional doesn't need educationStage
    } else if (user.profile.educationStage) {
      completion += 20;
    }
    
    if (user.profile.interests?.length > 0) completion += 20;

    // Cap at 100%
    user.profile.profileCompletion = Math.min(100, completion);
    user.isProfileComplete = user.profile.profileCompletion === 100;
    user.profile.lastActive = new Date();

    const updatedUser = await user.save();
    
    // Return response with PROFILE fields only (no legacy sync)
    return res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      // REMOVED: classLevel, stream, interests from root level
      isProfileComplete: updatedUser.isProfileComplete,
      profile: {
        age: updatedUser.profile.age,
        educationLevel: updatedUser.profile.educationLevel,
        educationStage: updatedUser.profile.educationStage, // ADDED
        stream: updatedUser.profile.stream,
        interests: updatedUser.profile.interests,
        testsTaken: updatedUser.profile.testsTaken,
        profileCompletion: updatedUser.profile.profileCompletion,
        joinedAt: updatedUser.profile.joinedAt,
        lastActive: updatedUser.profile.lastActive
      }
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// FIXED: completeProfile function - NO LEGACY FIELD SYNCING
export const completeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { age, educationLevel, educationStage, stream, interests } = req.body; // REMOVED: classLevel

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.profile) user.profile = {};

    // Update profile fields ONLY
    if (age) user.profile.age = age;
    if (educationLevel) user.profile.educationLevel = educationLevel;
    if (educationStage) user.profile.educationStage = educationStage; // ADDED
    
    // Stream + interests - UPDATE PROFILE ONLY
    if (stream) {
      user.profile.stream = stream;
      // REMOVED: user.stream = stream (legacy sync)
    }

    if (interests) {
      user.profile.interests = interests;
      // REMOVED: user.interests = interests (legacy sync)
    }

    // Calculate completion % (using PROFILE fields only)
    let completion = 0;
    if (user.firstName && user.lastName) completion += 20;
    if (user.profile.age) completion += 20;
    if (user.profile.educationLevel) completion += 20;
    
    // Check educationStage conditionally
    if (user.profile.educationLevel === "Professional") {
      completion += 20; // Professional doesn't need educationStage
    } else if (user.profile.educationStage) {
      completion += 20;
    }
    
    if (user.profile.stream) completion += 20;
    if (user.profile.interests?.length > 0) completion += 20;

    user.profile.profileCompletion = Math.min(100, completion);
    user.isProfileComplete = user.profile.profileCompletion === 100;

    // Last active update
    user.profile.lastActive = new Date();

    const updated = await user.save();

    return res.json({
      ...updated.toObject(),
      passwordHash: undefined // Hide password
    });

  } catch (error) {
    console.error("Complete profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================CHANGE PASSWORD ===========================
export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    if (!oldPassword || !newPassword) return res.status(400).json({ message: "Both old and new password required" });
    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    // hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);

    // optionally update lastActive
    if (!user.profile) user.profile = {};
    user.profile.lastActive = new Date();

    await user.save();

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error (backend):", error);
    return res.status(500).json({ message: "Server error while changing password" });
  }
};