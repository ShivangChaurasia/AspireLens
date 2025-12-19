import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

// Auth & User
import authRoutes from "./routes/authRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Core Features
import dashboardRoutes from "./routes/dashboard.js";
import testRoutes from "./routes/testRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import counsellingRoutes from "./routes/counsellingRoutes.js";

dotenv.config();
const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://careerwithaspirelens.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server, Postman, etc.
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);              // student auth
app.use("/api/admin/auth", adminAuthRoutes);   // admin auth
app.use("/api/user", userRoutes);              // user profile
app.use("/api/admin", adminRoutes);            // admin features

app.use("/api/dashboard", dashboardRoutes);    // dashboard stats
app.use("/api/test", testRoutes);              // test flow
app.use("/api/ai", aiRoutes);                  // AI (questions + evaluation)
app.use("/api/counselling", counsellingRoutes);// AI counselling

// Health check
app.get("/", (req, res) => {
  res.json({ message: "AspireLens Backend Running" });
});

const PORT = process.env.PORT || 5000;

// DB + Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
