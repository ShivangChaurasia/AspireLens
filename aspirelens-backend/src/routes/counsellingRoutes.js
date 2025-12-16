import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { generateCareerCounselling } from "../controllers/tests/careerCounsellingController.js";

const router = express.Router();

router.post(
  "/generate/:testSessionId",
  requireAuth,
  generateCareerCounselling
);
export default router;