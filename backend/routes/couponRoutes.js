import express from "express";
import { createCoupon, getAllCoupons, getCouponById, updateCoupon, deleteCoupon, applyCoupon } from "../controllers/couponController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createCoupon);
router.get("/", protect, adminOnly, getAllCoupons);
router.get("/:id", protect, adminOnly, getCouponById);
router.put("/:id", protect, adminOnly, updateCoupon);
router.delete("/:id", protect, adminOnly, deleteCoupon);
// Customer bhi coupon apply kar sakta hai
router.post("/apply", protect, applyCoupon);

export default router;