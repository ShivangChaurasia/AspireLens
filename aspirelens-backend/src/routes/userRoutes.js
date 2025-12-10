import express from "express";
import { getMyProfile, completeProfile } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/me", requireAuth, getMyProfile);

// Complete / update academic profile
router.post("/complete-profile", requireAuth, completeProfile);

export default router;
