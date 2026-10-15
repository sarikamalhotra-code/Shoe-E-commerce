import mongoose from "mongoose";

const returnSchema = new mongoose.Schema({

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    reason: {
        type: String,
        required: true
    },

    evidence: [{
        type: String
    }],

    type: {
        type: String,
        enum: ["return", "exchange"],
        default: "return"
    },

    status: {
        type: String,
        enum: [
            "Requested",
            "Approved",
            "Rejected",
            "Picked Up",
            "QC Passed",
            "QC Failed",
            "Refunded",
            "Exchanged"
        ],
        default: "Requested"
    },

    adminNote: {
        type: String
    },

    refundAmount: {
        type: Number,
        default: 0
    },

    refundMethod: {
        type: String,
        enum: ["original_payment", "store_credit", "none"],
        default: "none"
    },

    refundStatus: {
        type: String,
        enum: ["Pending", "Processing", "Completed", "Failed", "Not Applicable"],
        default: "Not Applicable"
    }

}, {
    timestamps: true
});

const Return = mongoose.model("Return", returnSchema);

export default Return;