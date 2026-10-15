 import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register Controller
 export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ $or: [{ email: cleanEmail }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ 
      name, 
      email: cleanEmail, 
      phone, 
      password: hashedPassword 
    });

    res.status(201).json({
      message: 'Account created successfully',
      user: { id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Login Controller (supports Email or Phone)
 export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const cleanIdentifier = identifier.toLowerCase().trim();

    const user = await User.findOne({ 
      $or: [
        { email: cleanIdentifier }, 
        { phone: identifier.trim() }
      ] 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Profile & Notifications
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, notifications } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (notifications) user.notifications = notifications;

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        loyaltyPoints: updatedUser.loyaltyPoints,
        addresses: updatedUser.addresses,
        notifications: updatedUser.notifications
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add Address
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { label, name, line1, city, state, pin } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isDefault = user.addresses.length === 0;

    user.addresses.push({ label, name, line1, city, state, pin, isDefault });
    await user.save();

    res.status(200).json({
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Address
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses.filter((addr) => addr._id.toString() !== addressId);
    await user.save();

    res.status(200).json({
      message: 'Address removed successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};