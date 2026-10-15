import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log(
  "EMAIL_APP_PASSWORD exists:",
  !!process.env.EMAIL_APP_PASSWORD
);

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },

  tls: {
    rejectUnauthorized: false,
  },
});

// Send Reset OTP
export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    await PasswordReset.deleteMany({
      email: cleanEmail,
    });

    await PasswordReset.create({
      email: cleanEmail,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: cleanEmail,
      subject: "SoleSpace Password Reset OTP",
      text: `Your SoleSpace password reset OTP is ${otp}. It is valid for 10 minutes.`,
    });

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// Verify Reset OTP
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const resetRequest = await PasswordReset.findOne({
      email: cleanEmail,
      otp: otp.trim(),
    });

    if (!resetRequest) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    resetRequest.verified = true;

    await resetRequest.save();

    return res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const resetRequest = await PasswordReset.findOne({
      email: cleanEmail,
      verified: true,
    });

    if (!resetRequest) {
      return res.status(400).json({
        message: "Please verify OTP first",
      });
    }

    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP",
      });
    }

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const bcrypt = (await import("bcryptjs")).default;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    await PasswordReset.deleteOne({
      _id: resetRequest._id,
    });

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Failed to reset password",
      error: error.message,
    });
  }
};