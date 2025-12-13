import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { startTest } from "../controllers/tests/startTest.js";
import { saveAnswer } from "../controllers/tests/saveAnswer.js";
import { submitTest } from "../controllers/tests/submitTest.js";

const router = express.Router();

router.post("/start", requireAuth, startTest);
router.post("/answer", requireAuth, saveAnswer);
router.post("/submit/:testSessionId", requireAuth, submitTest);


export default router;


