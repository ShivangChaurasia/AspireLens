import User from "../models/User.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export const adminLoginPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.otp = otp;
    admin.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    await admin.save();

    // Send OTP via Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: admin.email,
      subject: "AspireLens Admin Login OTP",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`
    });

    res.json({ message: "OTP sent to admin email." });
  } catch (error) {
    console.error("Admin Password Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


import jwt from "jsonwebtoken";

export const verifyAdminOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (admin.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // OTP is correct → clear it
    admin.otp = null;
    admin.otpExpiresAt = null;
    await admin.save();

    // Generate token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


