import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
// import { evaluateTest } from "../controllers/tests/evaluateTest.js";
import { generateQuestions } from "../controllers/tests/aiQuestionGeneratorController.js";
const router = express.Router();

// router.post(
//   "/evaluate/:testSessionId",
//   requireAuth,
//   evaluateTest
// );
router.post("/generate-questions", requireAuth, generateQuestions);

export default router;
