import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";

// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
    try {
        // Check Razorpay credentials
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({
                message: "Razorpay keys are not configured",
            });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
            });
        }

        // Find MongoDB order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        // Check order belongs to logged-in user
        if (!order.user || order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized to pay for this order",
            });
        }

        // Create Razorpay order
        const options = {
            amount: Math.round(order.totalPrice * 100),
            currency: "INR",
            receipt: `order_${order._id}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Save Razorpay Order ID in MongoDB
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.status(200).json({
            message: "Razorpay order created successfully",
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to create Razorpay order",
            error: error.message,
        });
    }
};


// Verify Razorpay Payment
export const verifyRazorpayPayment = async (req, res) => {
    try {
        // Check Razorpay credentials
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({
                message: "Razorpay keys are not configured",
            });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, } = req.body;

        // Check required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
            return res.status(400).json({
                message: "Payment details are required",
            });
        }

        // Find MongoDB order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        // Check order belongs to logged-in user
        if (!order.user || order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        // Check Razorpay Order ID matches our database
        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                message: "Razorpay order ID does not match",
            });
        }

        // Generate signature
        const generatedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");

        // Compare signatures
        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                message: "Invalid payment signature",
            });
        }

        // Payment verified successfully
        order.isPaid = true;
        order.paidAt = new Date();
        order.razorpayPaymentId = razorpay_payment_id;

        const updatedOrder = await order.save();

        return res.status(200).json({
            message: "Payment verified successfully",
            order: updatedOrder,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Payment verification failed",
            error: error.message,
        });
    }
};