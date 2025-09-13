import express from 'express';
import { ChatbotController } from '../controllers/ChatbotController';

const router = express.Router();

// @route   POST /api/chatbot/message
// @desc    Send message to chatbot
// @access  Public
router.post('/message', ChatbotController.sendMessage);

// @route   GET /api/chatbot/history/:userId
// @desc    Get chat history for user
// @access  Private
router.get('/history/:userId', ChatbotController.getChatHistory);

// @route   DELETE /api/chatbot/history/:userId
// @desc    Clear chat history for user
// @access  Private
router.delete('/history/:userId', ChatbotController.clearChatHistory);

export default router;