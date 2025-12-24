const express = require('express');
const { protect } = require('../middleware/auth');
const aiService = require('../services/aiService');
const { AnalyticsEvent } = require('../models/Analytics');

const router = express.Router();

/**
 * AI Routes - Gemini-Powered Features
 * 
 * Business Value:
 * - Improve user experience (higher conversion)
 * - Reduce customer support costs
 * - Personalization (increase bookings)
 */

/**
 * @route   POST /api/ai/chat
 * @desc    Chat with tourism AI assistant
 * @access  Private
 */
router.post('/chat', protect, async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        const response = await aiService.chat(message, context);

        // Track usage for analytics
        await AnalyticsEvent.create({
            eventType: 'chat_message',
            userId: req.user.id,
            userType: req.user.userType,
            data: {
                messageLength: message.length,
                hasContext: !!context
            }
        });

        res.json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error('AI chat error:', error.message);
        res.status(500).json({
            success: false,
            message: 'AI chat failed',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/ai/recommendations
 * @desc    Get personalized recommendations
 * @access  Private
 */
router.post('/recommendations', protect, async (req, res) => {
    try {
        const { interests, budget, location, previousBookings } = req.body;

        const recommendations = await aiService.getRecommendations({
            interests: interests || req.user.profile?.preferences?.interests || [],
            budget: budget || 5000,
            location,
            previousBookings
        });

        res.json({
            success: true,
            data: { recommendations }
        });

    } catch (error) {
        console.error('Recommendations error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to get recommendations',
            error: error.message
        });
    }
});

module.exports = router;
