import mongoose from "mongoose";

/**
 * OPTION SCHEMA
 * Used for MCQ-type questions
 */
const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // "A", "B", "C", "D"
    text: { type: String, required: true },
  },
  { _id: false }
);

/**
 * QUESTION SCHEMA
 * Core AI + aptitude + career question model
 */
const questionSchema = new mongoose.Schema(
  {
    // Academic level
    // e.g. "10", "11", "12", "UG", "PG"
    classLevel: {
      type: String,
      required: true,
    },

    // Stream / qualification group
    // e.g. "PCM", "PCB", "Commerce", "Arts", "CSE", "Generic"
    stream: {
      type: String,
      required: true,
    },

    // Mandatory aptitude grouping
    // e.g. "verbal", "analytical", "reasoning", "math", "domain"
    section: {
      type: String,
      required: true,
    },

    // Optional finer subject mapping
    // e.g. "Maths", "Physics", "English", "Computer Science"
    subject: {
      type: String,
      default: null,
    },

    // Question nature
    // MCQ for now, others added later without schema migration
    questionType: {
      type: String,
      enum: ["mcq", "short", "situational", "likert"],
      default: "mcq",
    },

    questionText: {
      type: String,
      required: true,
    },

    // Options only applicable to MCQs
    options: {
      type: [optionSchema],
      validate: {
        validator: function (v) {
          return this.questionType !== "mcq" || (Array.isArray(v) && v.length >= 2);
        },
        message: "MCQ questions must have at least 2 options.",
      },
      default: [],
    },

    // Correct option only for auto-evaluated MCQs
    correctOption: {
      type: String, // "A", "B", "C", "D"
      default: null,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    // AI tracking
    isAIgenerated: {
      type: Boolean,
      default: false,
    },

    aiMeta: {
      promptVersion: { type: String, default: null },
      generatedAt: { type: Date, default: null },
    },

    // Admin / system control
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * Indexes for fast question fetching during test creation
 */
questionSchema.index({ classLevel: 1, stream: 1, section: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ isAIgenerated: 1 });

export default mongoose.model("Question", questionSchema);
