import express from "express";
import {
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
} from "../controllers/forgotPasswordController.js";

const router = express.Router();

router.post("/send-otp", sendResetOtp);
router.post("/verify-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

export default router;