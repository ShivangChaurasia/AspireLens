import express from "express";
import { register, login, googleLogin } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getCurrentUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.get("/me", requireAuth, getCurrentUser);

export default router;
