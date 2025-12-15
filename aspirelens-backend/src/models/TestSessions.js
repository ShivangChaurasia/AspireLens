import mongoose from "mongoose";

/**
 * SUBJECT CONFIG
 * Defines each subject inside a test
 */
const subjectSchema = new mongoose.Schema(
  {
    subject: {
      type: String, // "Verbal Ability", "Logical Reasoning", "Computer Science"
      required: true,
    },

    section: {
      type: String, // "verbal", "analytical", "domain"
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 5,
      max: 20,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "adaptive"],
      default: "medium",
    },
  },
  { _id: false }
);

/**
 * TEST SESSION SCHEMA
 */
const testSessionSchema = new mongoose.Schema(
  {
    // Who is taking the test
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // User context (frozen at test start)
    classLevel: {
      type: String, // "10", "12", "UG"
      required: true,
    },

    stream: {
      type: String, // "PCM", "Commerce", "CSE"
      required: true,
    },

    // Test difficulty level (increases with test count)
    level: {
      type: Number,
      default: 1,
    },

    // Subjects included in this test
    subjects: {
      type: [subjectSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 2,
        message: "A test must contain at least 2 subjects.",
      },
    },

    // Question references (AI-generated or pool)
    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    // Time control
    totalQuestions: {
      type: Number,
      required: true,
    },

    durationMinutes: {
      type: Number,
      default: 60, // 1 min per question
    },

    startedAt: {
      type: Date,
      default: null,
    },

    endsAt: {
      type: Date,
      default: null,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    autoSubmitted:{
      type: Boolean,
      default: null,

    },

    autoSubmitReason:{
      type: String,
      default:null,
    },


    // Test state
    status: {
      type: String,
      enum: ["not_started", "in_progress", "submitted", "expired"],
      default: "not_started",
    },

    // Evaluation summary (filled later)
    scoreSummary: {
      totalScore: { type: Number, default: 0 },
      maxScore: { type: Number, default: 0 },

      sectionWiseScore: {
        type: Map,
        of: Number, // { verbal: 12, analytical: 18 }
      },
    },

    // AI Counselling output (post-evaluation)
    aiInsights: {
      strengths: [String],
      weaknesses: [String],
      careerRecommendations: [String],
      improvementPlan: String,
    },
  },
  { timestamps: true }
);

/**
 * Indexes for performance
 */
testSessionSchema.index({ userId: 1, status: 1 });
testSessionSchema.index({ startedAt: 1 });
testSessionSchema.index({ level: 1 });

export default mongoose.model("TestSession", testSessionSchema);



