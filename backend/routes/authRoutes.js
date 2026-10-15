 import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getProfile,
  updateProfile, 
  addAddress, 
  updateAddress,
  setDefaultAddress,
  deleteAddress,
  changePassword 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { googleLogin } from '../controllers/googleAuthController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Google Login
router.post('/google', googleLogin);

// Protected routes matching your frontend calls
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.put('/address/:addressId', protect, updateAddress);
router.put('/address/:addressId/default', protect, setDefaultAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.put('/password', protect, changePassword);

export default router;