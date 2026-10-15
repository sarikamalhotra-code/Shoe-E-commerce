 import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  name: { type: String, required: true },
  line1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pin: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  loyaltyPoints: { type: Number, default: 120 }, // Optional if used in Overview
  addresses: [addressSchema],
  notifications: {
    orderConfirmation: { type: Boolean, default: true },
    shipping: { type: Boolean, default: true },
    delivery: { type: Boolean, default: true },
    cancellation: { type: Boolean, default: true },
    refunds: { type: Boolean, default: true },
    priceDrops: { type: Boolean, default: true },
    backInStock: { type: Boolean, default: true },
    newArrivals: { type: Boolean, default: true },
    promotions: { type: Boolean, default: false },
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    orderUpdates: { type: Boolean, default: true },
    priceDrop: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);