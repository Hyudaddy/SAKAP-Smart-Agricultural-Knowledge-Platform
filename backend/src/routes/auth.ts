import express from 'express';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', AuthController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', AuthController.login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', AuthController.logout);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', AuthController.getMe);

export default router;