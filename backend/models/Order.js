 import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: false }, // Made optional to prevent blocking
            price: { type: Number, required: true },
            sku: { type: String, required: false },   // Made optional to prevent blocking
        }
    ],
    shippingAddress: {
        address: { type: String, required: false },
        city: { type: String, required: false },
        postalCode: { type: String, required: false },
        country: { type: String, required: false },
    },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    status: { type: String, default: "Pending" },
    paidAt: { type: Date },
    razorpayOrderId: { type: String, },
    razorpayPaymentId: { type: String, },
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;