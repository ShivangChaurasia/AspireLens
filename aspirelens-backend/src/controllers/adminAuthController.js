import User from "../models/User.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";



export const adminLoginPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 1️⃣ Find admin
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // 2️⃣ Verify password
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // 3️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 5 * 60 * 1000;

    // ✅ IMPORTANT FIX — no `.save()`
    await User.updateOne(
      { _id: admin._id },
      { otp, otpExpiresAt }
    );

    // 4️⃣ Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: admin.email,
      subject: "AspireLens Admin Login OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    return res.json({
      success: true,
      message: "OTP sent to admin email",
    });

  } catch (error) {
    console.error("Admin Password Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const verifyAdminOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // 1️⃣ Find admin
    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // 2️⃣ OTP validation
    if (!admin.otp || admin.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (admin.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 3️⃣ Clear OTP (IMPORTANT FIX)
    await User.updateOne(
      { _id: admin._id },
      {
        otp: null,
        otpExpiresAt: null,
      }
    );

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

