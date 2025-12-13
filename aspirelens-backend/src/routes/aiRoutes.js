import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { evaluateTestAnswers } from "../controllers/tests/aiEvaluationController.js";
import { generateQuestions } from "../controllers/tests/aiQuestionGeneratorController.js";
const router = express.Router();

router.post(
  "/evaluate/:testSessionId",
  requireAuth,
  evaluateTestAnswers
);
router.post("/generate-questions", requireAuth, generateQuestions);

export default router;
