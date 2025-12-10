import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // e.g. "A", "B", "C", "D"
    text: { type: String, required: true },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    // "10", "11", "12" etc.
    classLevel: {
      type: String,
      required: true,
    },

    // "PCM", "PCB", "Commerce", "Arts", or "Generic" for class 10
    stream: {
      type: String,
      required: true,
    },

    // Logical grouping for aptitude sections:
    // "analytical", "reasoning", "verbal", "math", "creative", "digital", etc.
    section: {
      type: String,
      required: true,
    },

    // Optional subject info (for filtering or analytics)
    subject: {
      type: String, // e.g. "Maths", "Physics", "English"
      default: null,
    },

    questionText: {
      type: String,
      required: true,
    },

    options: {
      type: [optionSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 2,
        message: "A question must have at least 2 options.",
      },
    },

    // Optional: for AI-generated questions where no strict answer is needed
    correctOption: {
      type: String, // e.g. "A", "B", "C", "D"
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

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
