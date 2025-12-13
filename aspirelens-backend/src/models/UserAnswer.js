import mongoose from "mongoose";

const userAnswerSchema = new mongoose.Schema(
  {
    // Link to user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Link to test session
    testSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestSession",
      required: true,
      index: true,
    },

    // Link to question
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    // Question context (denormalized for fast analytics)
    subject: {
      type: String, // "Verbal Ability", "Computer Science"
      required: true,
    },

    section: {
      type: String, // "verbal", "analytical", "domain"
      required: true,
    },

    // User response
    answerType: {
      type: String,
      enum: ["mcq", "short", "essay"],
      required: true,
    },

    selectedOption: {
      type: String, // "A", "B", "C", "D" (MCQ)
      default: null,
    },

    answerText: {
      type: String, // Short / descriptive answers
      default: null,
    },

    // Evaluation (filled after submission)
    isCorrect: {
      type: Boolean,
      default: null, // null until evaluated
    },

    marksAwarded: {
      type: Number,
      default: 0,
    },

    maxMarks: {
      type: Number,
      default: 1,
    },

    attemptNumber: {
      type: Number,
      default: 1,
    },


    // AI evaluation metadata
    aiEvaluation: {
      score: { type: Number, default: null },
      feedback: { type: String, default: null },
      improvementTip: { type: String, default: null },
    },

    // Timing
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },

    answeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate answers per question per test
 */

userAnswerSchema.pre("save", function (next) {
  if (this.answerType === "mcq") {
    this.answerText = null;
  }
  if (this.answerType !== "mcq") {
    this.selectedOption = null;
  }
  next();
});

userAnswerSchema.index(
  { userId: 1, testSessionId: 1, questionId: 1 },
  { unique: true }
);

export default mongoose.model("UserAnswer", userAnswerSchema);
