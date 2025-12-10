import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // Which streams this career is generally tied to
    suitableStreams: {
      type: [String], // e.g. ["PCM", "PCB", "Commerce", "Arts"]
      default: [],
    },

    // For future mapping: If student scores >= these, suggest this career
    suitableScores: {
      analyticalMin: { type: Number, default: 0 },
      reasoningMin: { type: Number, default: 0 },
      verbalMin: { type: Number, default: 0 },
      mathMin: { type: Number, default: 0 },
      creativeMin: { type: Number, default: 0 },
    },

    requiredSubjects: {
      type: [String], // e.g. ["Physics", "Maths"]
      default: [],
    },

    recommendedSubjects: {
      type: [String], // what student should focus on in 11–12
      default: [],
    },

    roadmap: {
      type: [String], // step-by-step: 10th → 12th → college → job
      default: [],
    },

    tags: {
      type: [String], // e.g. ["engineering", "design", "management"]
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Career", careerSchema);
