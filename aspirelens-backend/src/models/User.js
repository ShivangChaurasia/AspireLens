import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    // Role is NOT chosen by user.
    // Every new user = "student" by default.
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    // Used for admin 2FA login
    otp: {
      type: String,
      default: null,
    },

    otpExpiresAt: {
      type: Date,
      default: null,
    },

    // For profile completion after signup
    classLevel: {
      type: String,
      default: null,
    },

    stream: {
      type: String,
      default: null,
    },

    interests: {
      type: [String],
      default: [],
    },

    googleId: {
      type: String,
      default: null,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
