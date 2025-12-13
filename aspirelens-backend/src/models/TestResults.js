import mongoose from "mongoose";

const sectionScoreSchema = new mongoose.Schema(
  {
    section: { type: String, required: true }, // verbal, analytical, domain
    subject: { type: String, default: null },  // optional
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    accuracy: { type: Number, required: true }, // %
    strengthLevel: {
      type: String,
      enum: ["weak", "average", "strong"],
      required: true,
    },
  },
  { _id: false }
);

const testResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    testSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestSession",
      required: true,
      unique: true,
    },

    // Overall score
    totalScore: {
      type: Number,
      required: true,
    },

    maxScore: {
      type: Number,
      required: true,
    },

    percentile: {
      type: Number, // calculated later (optional)
      default: null,
    },

    // Section-wise analysis
    sectionScores: {
      type: [sectionScoreSchema],
      required: true,
    },

    // AI-generated insights
    aiAnalysis: {
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      learningStyle: { type: String, default: null },
      behaviorInsights: { type: String, default: null },
    },

    // Career counselling output
    careerRecommendations: [
      {
        career: { type: String, required: true },
        priority: {
          type: Number, // 1 = best fit
          required: true,
        },
        reason: { type: String, required: true },
      },
    ],

    // Actionable roadmap
    improvementPlan: {
      durationDays: { type: Number, default: 30 },
      steps: { type: [String], default: [] },
    },

    evaluatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TestResult", testResultSchema);
