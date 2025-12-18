import mongoose from "mongoose";
import crypto from "crypto";

/**
 * OPTION SCHEMA
 */
const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

/**
 * QUESTION SCHEMA
 */
const questionSchema = new mongoose.Schema(
  {
    // ✅ MATCHES USER PROFILE
    educationLevel: {
      type: String,
      enum: ["School", "Undergraduate", "Postgraduate", "Professional"],
      required: true,
    },

    // Optional granularity
    educationStage: {
      type: String, // "11","12","1","2","3","4"
      default: null,
    },

    stream: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      default: null,
    },
 
    questionType: {
      type: String,
      enum: ["mcq", "short", "situational", "likert"],
      default: "mcq",
    },

    questionText: {
      type: String,
      required: true,
    },

    // 🔒 CRITICAL: CONTENT-BASED DEDUPLICATION
    questionHash: {
      type: String,
      required: true,
      index: true,
    },

    options: {
      type: [optionSchema],
      default: [],
    },

    correctOption: {
      type: String,
      default: null,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    isAIgenerated: {
      type: Boolean,
      default: false,
    },

    aiMeta: {
      promptVersion: String,
      generatedAt: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * 🔐 AUTO-GENERATE HASH BEFORE SAVE
 */
questionSchema.pre("validate", function () {
  if (!this.questionHash && this.questionText) {
    this.questionHash = crypto
      .createHash("sha256")
      .update(this.questionText.trim().toLowerCase())
      .digest("hex");
  }
});

/**
 * 🚀 SMART INDEXES
 */
questionSchema.index(
  {
    questionHash: 1,
    educationLevel: 1,
    section: 1,
    subject: 1,
  },
  { unique: true }
);


/**
 * 🔥 HARD DUPLICATE PREVENTION
 * Same question text cannot exist twice in same context
 */
questionSchema.index(
  {
    questionHash: 1,
    educationLevel: 1,
    section: 1,
    subject: 1,
  },
  { unique: true }
);

export default mongoose.model("Question", questionSchema);
