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
    classLevel: { type: String, default: null },
    
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    otp: String,
    otpExpiresAt: Date,

    // OLD fields (backward compatibility)

    // KEEP THIS — used by Career Roadmap later
    stream: { type: String, default: null },

    // KEEP THIS — used by interests page
    interests: { type: [String], default: [] },

    // MAIN PROFILE OBJECT (used by MyProfile frontend)
    profile: {
      age: Number,
      educationLevel: String,
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

// Always ensure profile object exists
userSchema.pre("save", function () {
  if (!this.profile) this.profile = {};
  if (!this.profile.joinedAt) this.profile.joinedAt = new Date();
  if (!this.profile.lastActive) this.profile.lastActive = new Date();
});



export default mongoose.model("User", userSchema);
