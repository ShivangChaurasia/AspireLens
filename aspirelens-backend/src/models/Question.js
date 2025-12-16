import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

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
 * SMART INDEXES
 */
questionSchema.index({
  educationLevel: 1,
  educationStage: 1,
  stream: 1,
  section: 1,
  difficulty: 1,
});

export default mongoose.model("Question", questionSchema);
