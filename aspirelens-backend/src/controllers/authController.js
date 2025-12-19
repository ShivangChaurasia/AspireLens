import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { updateUserActivity } from "../utils/updateActivity.js";

//
// ======================= REGISTER =======================
//
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

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

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordHash,
      role: "student",
    });

    // Generate Email Verification Token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiry = Date.now() + 1000 * 60 * 60; // 1 hour

    newUser.emailVerificationToken = verificationToken;
    newUser.emailVerificationExpires = verificationExpiry;

    // Save user
    await newUser.save();

    const verifyUrl = `https://aspirelens-backend.onrender.com/api/auth/verify-email?token=${verificationToken}`;


    // Send verification email
    await sendEmail(
      email,
      "Verify your AspireLens email",
      `Hi ${firstName},

      Please verify your email by clicking the link below:
      ${verifyUrl}

      This link expires in 1 hour.

      Best Regards,
      AspireLens Team`
    );

    // Response
    res.status(201).json({
      message: "Signup successful — please verify your email.",
      user: {
        id: newUser._id,
        firstName,
        lastName,
        email,
        role: newUser.role,
      },
    });

  } catch (error) {
  console.error("REGISTER FULL ERROR OBJECT:", error);
  res.status(500).json({
    message: error.message,
    errorName: error.name,
  });
}
};

//
// ======================= VERIFY EMAIL =======================
//
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    // OPTIONAL: Send welcome email after verification

    await sendEmail(
      user.email,
      "Welcome to AspireLens!",
      `Hi ${user.firstName},
      Thank you for verifying your email!
      You can now log in and continue your journey.
      Best Regards,
      AspireLens Team`
    );

    return res.redirect("https://careerwithaspirelens.vercel.app/verify-email");

  } catch (error) {
    console.error("Verify Email Error:", error.message);
    res.status(500).json({ message: "Server error" });
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
    if (!user) return res.status(404).json({ message: "User not found" });

    // Block login if email not verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in."
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

    res.json({
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
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================= GET CURRENT USER =======================
export const getCurrentUser = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,  // This works because middleware attaches user object
  });
};
