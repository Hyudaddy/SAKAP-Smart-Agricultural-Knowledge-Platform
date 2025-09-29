import express from 'express';
import { ContentController } from '../controllers/ContentController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

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
// @desc    Get all library content
// @access  Public
router.get('/library', ContentController.getLibraryContent);

// @route   GET /api/content/library/:id
// @desc    Get library content by ID
// @access  Public
router.get('/library/:id', ContentController.getLibraryContentById);

// @route   PUT /api/content/library/:id/view
// @desc    Increment view count for library content
// @access  Public
router.put('/library/:id/view', ContentController.incrementViewCount);

// @route   PUT /api/content/library/:id/download
// @desc    Increment download count for library content
// @access  Public
router.put('/library/:id/download', ContentController.incrementDownloadCount);

// @route   PUT /api/content/library/:id/like
// @desc    Toggle like for library content
// @access  Private
router.put('/library/:id/like', authenticate, ContentController.toggleLike);

// @route   POST /api/content/library
// @desc    Upload library content (Admin/AEW only)
// @access  Private
router.post('/library', authenticate, authorizeAdmin, ContentController.uploadLibraryContent);

// @route   PUT /api/content/library/:id
// @desc    Update library content (Admin/AEW only)
// @access  Private
router.put('/library/:id', authenticate, authorizeAdmin, ContentController.updateLibraryContent);

// @route   DELETE /api/content/library/:id
// @desc    Delete library content (Admin/AEW only)
// @access  Private
router.delete('/library/:id', authenticate, authorizeAdmin, ContentController.deleteLibraryContent);

// @route   POST /api/content/news
// @desc    Create news (Admin/AEW only)
// @access  Private
router.post('/news', authenticate, authorizeAdmin, ContentController.createNews);

// @route   POST /api/content/activities
// @desc    Create activity (Admin/AEW only)
// @access  Private
router.post('/activities', authenticate, authorizeAdmin, ContentController.createActivity);

export default router;