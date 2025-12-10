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
    // You (default admin) can promote users manually later.
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    // Phase 2 — profile completion AFTER signup
    classLevel: {
      type: String, // e.g. "10", "11", "12"
      default: null,
    },

    // e.g. "PCM", "PCB", "Commerce", "Arts"
    stream: {
      type: String,
      default: null,
    },

    // e.g. ["technology", "design", "business"]
    interests: {
      type: [String],
      default: [],
    },

    // For future Google login integration
    googleId: {
      type: String,
      default: null,
    },

    // To know if the student has completed full profile
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
