import express from 'express';
import { addOrderItems, getOrders, getAllOrders, updateOrderStatus, getAdminOrderById } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer
router.route('/')
    .get(protect, getOrders)
    .post(protect, addOrderItems);

// Admin
router.get('/admin', protect, adminOnly, getAllOrders);
router.get('/admin/:id', protect, adminOnly, getAdminOrderById);
router.put('/admin/:id/status', protect, adminOnly, updateOrderStatus);


export default router;