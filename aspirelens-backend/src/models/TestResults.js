import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    selectedOption: {
      type: String, // "A", "B", "C", etc.
      required: true,
    },
  },
  { _id: false }
);

const sectionScoresSchema = new mongoose.Schema(
  {
    analytical: { type: Number, default: 0 },
    reasoning: { type: Number, default: 0 },
    verbal: { type: Number, default: 0 },
    math: { type: Number, default: 0 },
    creative: { type: Number, default: 0 },
    digital: { type: Number, default: 0 },
  },
  { _id: false }
);

const testResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Snapshot of profile at the time of test
    classLevel: {
      type: String,
      default: null,
    },
    stream: {
      type: String,
      default: null,
    },

    answers: {
      type: [answerSchema],
      default: [],
    },

    sectionScores: {
      type: sectionScoresSchema,
      default: () => ({}),
    },

    totalScore: {
      type: Number,
      default: 0,
    },

    // Will hold AI-generated personalized career report text
    careerReportText: {
      type: String,
      default: null,
    },

    // For structured AI response (JSON) if needed
    careerReportJSON: {
      type: Object,
      default: null,
    },

    // From your future rule-based + AI hybrid engine:
    recommendedStreams: {
      type: [String], // e.g. ["PCM", "Commerce"]
      default: [],
    },

    recommendedCareers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Career",
      },
    ],

    isReportGenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TestResult", testResultSchema);
