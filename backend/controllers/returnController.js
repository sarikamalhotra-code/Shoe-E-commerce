import Return from "../models/Return.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Create Return Request
export const createReturnRequest = async (req, res) => {
    try {
        const {
            order,
            product,
            reason,
            evidence,
            type
        } = req.body;

        const existingReturn = await Return.findOne({
            order,
            product,
            status: {
                $nin: ["Rejected", "Refunded", "Exchanged"]
            }
        });

        if (existingReturn) {
            return res.status(400).json({
                message: "Return request already exists for this product"
            });
        }

        const orderData = await Order.findById(order);

        if (!orderData) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const returnRequest = await Return.create({
            order,
            user: req.user._id,
            product,
            reason,
            evidence,
            type
        });

        return res.status(201).json({
            message: "Return request created successfully",
            returnRequest
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// Get All Returns
export const getAllReturns = async (req, res) => {
    try {
        const { status, type } = req.query;

        let filter = {};

        if (status) {
            filter.status = status;
        }

        if (type) {
            filter.type = type;
        }

        const returns = await Return.find(filter)
            .populate("user", "name email")
            .populate("product", "name brand category")
            .populate("order")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All return requests",
            returns
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// Get Return By ID
export const getReturnById = async (req, res) => {
    try {
        const returnRequest = await Return.findById(req.params.id)
            .populate("user", "name email")
            .populate("product", "name brand category")
            .populate("order");

        if (!returnRequest) {
            return res.status(404).json({
                message: "Return request not found"
            });
        }

        return res.status(200).json({
            message: "Return details",
            returnRequest
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// Approve Return
export const approveReturn = async (req, res) => {
    try {
        const { adminNote } = req.body;

        const returnRequest = await Return.findByIdAndUpdate(
            req.params.id,
            {
                status: "Approved",
                adminNote: adminNote || ""
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!returnRequest) {
            return res.status(404).json({
                message: "Return request not found"
            });
        }

        return res.status(200).json({
            message: "Return request approved",
            returnRequest
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// Reject Return
export const rejectReturn = async (req, res) => {
    try {
        const { adminNote } = req.body;

        const returnRequest = await Return.findByIdAndUpdate(
            req.params.id,
            {
                status: "Rejected",
                adminNote: adminNote || ""
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!returnRequest) {
            return res.status(404).json({
                message: "Return request not found"
            });
        }

        return res.status(200).json({
            message: "Return request rejected",
            returnRequest
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// Update Return Status
export const updateReturnStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const returnRequest = await Return.findByIdAndUpdate(
            req.params.id,
            {
                status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!returnRequest) {
            return res.status(404).json({
                message: "Return request not found"
            });
        }

        return res.status(200).json({
            message: "Return status updated successfully",
            returnRequest
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// Process Refund
export const processRefund = async (req, res) => {
    try {
        const {
            refundAmount,
            refundMethod
        } = req.body;

        const returnRequest = await Return.findById(req.params.id);

        if (!returnRequest) {
            return res.status(404).json({
                message: "Return request not found"
            });
        }

        if (
            returnRequest.status !== "Approved" &&
            returnRequest.status !== "QC Passed"
        ) {
            return res.status(400).json({
                message: "Return is not eligible for refund"
            });
        }

        returnRequest.refundAmount = refundAmount;
        returnRequest.refundMethod = refundMethod;
        returnRequest.refundStatus = "Processing";

        await returnRequest.save();

        // Simulate successful refund
        returnRequest.refundStatus = "Completed";
        returnRequest.status = "Refunded";

        await returnRequest.save();

        return res.status(200).json({
            message: "Refund processed successfully",
            returnRequest
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};