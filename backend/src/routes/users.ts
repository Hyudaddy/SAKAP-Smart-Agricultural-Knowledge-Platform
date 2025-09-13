import express from 'express';
import { UserController } from '../controllers/UserController';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', UserController.getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', UserController.getUserById);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', UserController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/:id', UserController.deleteUser);

// @route   GET /api/users/featured/experts
// @desc    Get featured expert farmers for landing page
// @access  Public
router.get('/featured/experts', UserController.getFeaturedExperts);

// @route   PUT /api/users/:id/featured
// @desc    Update user featured status (Admin only)
// @access  Private/Admin
router.put('/:id/featured', UserController.updateFeaturedStatus);

export default router;