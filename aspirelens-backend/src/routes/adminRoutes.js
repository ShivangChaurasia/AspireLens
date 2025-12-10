import express from "express";
import { adminLoginPassword, verifyAdminOTP } from "../controllers/adminAuthController.js";

const router = express.Router();

router.post("/login-password", adminLoginPassword);
router.post("/verify-otp", verifyAdminOTP);

export default router;
