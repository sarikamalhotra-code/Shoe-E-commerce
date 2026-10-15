import express from "express";
import { getDashboardAnalytics } from "../controllers/dashboardController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getDashboardAnalytics);

export default router;