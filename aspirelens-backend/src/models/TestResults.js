// models/TestResult.js
import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestSession',
    required: true,
    unique: true
  },
  totalQuestions: {
    type: Number,
    required: true,
    default: 0
  },
  attemptedQuestions: {
    type: Number,
    required: true,
    default: 0
  },
  correctAnswers: {
    type: Number,
    required: true,
    default: 0
  },
  wrongAnswers: {
    type: Number,
    required: true,
    default: 0
  },
  scorePercentage: {
    type: Number,
    required: true,
    default: 0
  },
  sectionWiseScore: {
    type: Map,
    of: {
      correct: Number,
      total: Number,
      percentage: Number
    },
    default: {}
  },
  status: {
    type: String,
    enum: ['pending_evaluation', 'evaluated'],
    default: 'pending_evaluation'
  },
  evaluatedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
testResultSchema.index({ userId: 1, testSessionId: 1 });
testResultSchema.index({ status: 1 });

const TestResult = mongoose.model('TestResult', testResultSchema);

export default TestResult;