import express from "express";
import { verifyAdminToken } from "../middleware/adminAuth.js";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
} from "../controllers/adminController.js";

const router = express.Router();

// Admin-only routes
router.get("/users", verifyAdminToken, getAllUsers);
router.get("/users/:id", verifyAdminToken, getUserById);
router.put("/update-role/:id", verifyAdminToken, updateUserRole);
router.delete("/users/:id", verifyAdminToken, deleteUser);

export default router;
