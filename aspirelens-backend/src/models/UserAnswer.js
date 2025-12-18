import mongoose from "mongoose";

const userAnswerSchema = new mongoose.Schema(
  {
    // 🔗 User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔗 Test session
    testSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestSession",
      required: true,
      index: true,
    },

    // 🔗 Question
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },

    // 📘 Context (denormalized – REQUIRED)
    subject: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      required: true,
    },

    // 📝 Answer metadata
    answerType: {
      type: String,
      enum: ["mcq", "short", "essay"],
      required: true,
    },

    selectedOption: {
      type: String,
      default: null,
    },

    answerText: {
      type: String,
      default: null,
    },

    // ✅ Evaluation
    isCorrect: {
      type: Boolean,
      default: null,
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

    // 🤖 AI feedback (optional)
    aiEvaluation: {
      score: { type: Number, default: null },
      feedback: { type: String, default: null },
      improvementTip: { type: String, default: null },
    },

    // ⏱ Timing
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
 * 🛡 DATA SANITY HOOK
 */
userAnswerSchema.pre("save", function () {
  // absolute safety
  if (!this.subject) this.subject = "General";
  if (!this.section) this.section = "general";

  if (this.answerType === "mcq") {
    this.answerText = null;
  } else {
    this.selectedOption = null;
  }
});

/**
 * 🔒 HARD GUARANTEE
 * A user can NEVER see the same question twice
 */
userAnswerSchema.index(
  { userId: 1, questionId: 1 },
  { unique: true }
);

export default mongoose.model("UserAnswer", userAnswerSchema);
