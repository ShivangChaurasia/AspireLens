import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";


dotenv.config();
const app = express();



app.use(cors({
  origin: 'http://localhost:5173', // Your Vite frontend
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);       // student auth
app.use("/api/admin/auth", adminAuthRoutes);     // admin portal login
app.use("/api/user", userRoutes);    // profile routes
app.use("/api/admin", adminRoutes);  // admin routes
app.use("/api/dashboard", dashboardRoutes);


app.get("/", (req, res) => {
  res.json({ message: "AspireLens Backend Running" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
