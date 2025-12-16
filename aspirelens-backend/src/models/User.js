import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: { type: String, required: true },

    // ⚠️ DEPRECATED (keep for migration only)
    classLevel: { type: String, default: null },

    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    otp: String,
    otpExpiresAt: Date,

    // Shared fields
    stream: { type: String, default: null },
    interests: { type: [String], default: [] },

    // ✅ SINGLE SOURCE OF TRUTH
    profile: {
      age: Number,

      // PRIMARY EDUCATION LEVEL
      educationLevel: {
        type: String,
        enum: ["School", "Undergraduate", "Postgraduate", "Professional"],
        required: true,
      },

      // CONDITIONAL STAGE
      // School → 11,12
      // UG/PG → year1, year2, year3, year4
      educationStage: {
        type: String,
        default: null,
      },

      stream: String,
      interests: [String],

      testsTaken: { type: Number, default: 0 },
      profileCompletion: { type: Number, default: 0 },

      joinedAt: { type: Date, default: Date.now },
      lastActive: { type: Date, default: Date.now },
    },

    googleId: String,

    isProfileComplete: { type: Boolean, default: false },

    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
  },
  { timestamps: true }
);

/**
 * 🔒 VALIDATION GUARD
 */
userSchema.pre("save", function () {
  if (!this.profile) this.profile = {};

  const level = this.profile.educationLevel;
  const stage = this.profile.educationStage;

  if (level === "School" && !["11", "12"].includes(stage)) {
    throw new Error("School students must have class 11 or 12");
  }

  if (
    ["Undergraduate", "Postgraduate"].includes(level) &&
    !["1", "2", "3", "4"].includes(stage)
  ) {
    throw new Error("UG/PG students must have a valid year");
  }

  if (level === "Professional") {
    this.profile.educationStage = null;
  }

  this.profile.lastActive = new Date();
});

export default mongoose.model("User", userSchema);
