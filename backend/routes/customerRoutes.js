import express from "express";
import { getAllCustomers, searchCustomers, getCustomerById, getCustomerOrders } from "../controllers/customerController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin", protect, adminOnly, getAllCustomers);
router.get("/admin/search", protect, adminOnly, searchCustomers);
router.get("/admin/:id/orders", protect, adminOnly, getCustomerOrders);
router.get("/admin/:id", protect, adminOnly, getCustomerById);

export default router;