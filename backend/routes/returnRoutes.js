import express from "express";
import { createReturnRequest, getAllReturns, getReturnById, approveReturn, rejectReturn, updateReturnStatus, processRefund } from "../controllers/returnController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReturnRequest);
router.get("/", protect, getAllReturns);
router.get("/:id", protect, getReturnById);
router.put("/:id/approve", protect, approveReturn);
router.put("/:id/reject", protect, rejectReturn);
router.put("/:id/status", protect, updateReturnStatus);
router.put("/:id/refund", protect, processRefund);

export default router;