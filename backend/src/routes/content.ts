import express from 'express';
import { ContentController } from '../controllers/ContentController';

const router = express.Router();

// @route   GET /api/content/news
// @desc    Get all news
// @access  Public
router.get('/news', ContentController.getNews);

// @route   GET /api/content/activities
// @desc    Get all activities
// @access  Public
router.get('/activities', ContentController.getActivities);

// @route   GET /api/content/library
// @desc    Get library content
// @access  Public
router.get('/library', ContentController.getLibraryContent);

// @route   POST /api/content/news
// @desc    Create news (Admin/AEW only)
// @access  Private
router.post('/news', ContentController.createNews);

// @route   POST /api/content/activities
// @desc    Create activity (Admin/AEW only)
// @access  Private
router.post('/activities', ContentController.createActivity);

export default router;