import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { updateUserActivity } from "../utils/updateActivity.js";

/**
 * ============================================================
 * ⚠️ EMAIL VERIFICATION TEMPORARILY DISABLED
 * Users are auto-verified to ensure accessibility.
 * Email verification can be re-enabled later.
 * ============================================================
 */

//
// ======================= REGISTER =======================
//
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    console.log("➡️ Signup started for:", email);

    // Validate
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user (AUTO VERIFIED)
    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordHash,
      role: "student",
      isEmailVerified: true, // ✅ AUTO VERIFY
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });

    await newUser.save();
    console.log("✅ User saved & auto-verified");

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        firstName,
        lastName,
        email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};


//
// ======================= LOGIN =======================
//
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check inputs
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Email verification check (will always pass for new users)
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    // Check password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await updateUserActivity(user._id);

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


//
// ======================= GET CURRENT USER =======================
//
export const getCurrentUser = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};
