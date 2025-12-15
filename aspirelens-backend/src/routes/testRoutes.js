import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { startTest } from "../controllers/tests/startTest.js";
import { saveAnswer } from "../controllers/tests/saveAnswer.js";
import { submitTest } from "../controllers/tests/submitTest.js";
import { getTestSession } from "../controllers/tests/getTestSession.js";
import { getSubmittedTest } from "../controllers/tests/getSubmittedTest.js";
import { getTestResult } from '../controllers/tests/getTestResult.js';
import { getTestResultPDF } from '../controllers/tests/getTestResultPDF.js'; // Optional

const router = express.Router();



router.post("/start", requireAuth, startTest);
router.get("/session/:testSessionId", requireAuth, getTestSession);
router.post("/answer", requireAuth, saveAnswer);
router.post("/submit/:testSessionId", requireAuth, submitTest);
router.get( "/submitted/:testSessionId", requireAuth, getSubmittedTest);
router.get('/result/:testSessionId', requireAuth, getTestResult);
router.get('/result/:testSessionId/pdf', requireAuth, getTestResultPDF);
export default router;


