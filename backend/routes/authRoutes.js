 import express from 'express';
import { 
  registerUser, 
  loginUser, 
  updateProfile, 
  addAddress, 
  deleteAddress 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { googleLogin } from '../controllers/googleAuthController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Google Login
router.post('/google', googleLogin);


// Protected routes matching your frontend calls
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);

export default router;