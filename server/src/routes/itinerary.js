const express = require('express');
const Itinerary = require('../models/Itinerary');
const User = require('../models/User');
const { protect, requireSubscription } = require('../middleware/auth');
const aiService = require('../services/aiService');

const router = express.Router();

/**
 * Itinerary Routes - AI Trip Planning (Premium Feature)
 * 
 * Business Model:
 * - Free: Basic planning (limited features)
 * - Premium: AI-powered optimization, bookings
 */

/**
 * @route   POST /api/itinerary/create
 * @desc    Create trip itinerary with AI assistance
 * @access  Private
 */
router.post('/create', protect, async (req, res) => {
    try {
        const {
            tripName,
            destination,
            startDate,
            endDate,
            budget,
            preferences,
            useAI = true
        } = req.body;

        const user = await User.findById(req.user.id);

        let days = [];
        let aiSuggestions = [];

        // BUSINESS LOGIC: AI planning for premium users
        if (useAI && user.subscription.tier !== 'free') {
            const duration = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

            const aiItinerary = await aiService.generateItinerary({
                destination: destination.primary,
                duration,
                budget: budget.total,
                interests: preferences.interests || [],
                travelStyle: preferences.travelStyle || 'moderate'
            });

            days = aiItinerary.days.map((day, index) => ({
                ...day,
                date: new Date(new Date(startDate).getTime() + index * 24 * 60 * 60 * 1000)
            }));

            user.usedPremiumFeatures = user.usedPremiumFeatures || {};
            user.usedPremiumFeatures.aiOptimization = true;
            await user.save();

            console.log(`🧠 AI itinerary generated for ${user.email}`);
        }

        const itinerary = await Itinerary.create({
            userId: user._id,
            tripName,
            destination,
            startDate,
            endDate,
            budget,
            preferences,
            days,
            aiSuggestions,
            usedPremiumFeatures: {
                aiOptimization: useAI && user.subscription.tier !== 'free'
            }
        });

        res.status(201).json({
            success: true,
            message: 'Itinerary created successfully',
            data: { itinerary }
        });

    } catch (error) {
        console.error('Itinerary creation error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to create itinerary',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/itinerary/my-trips
 * @desc    Get user's itineraries
 * @access  Private
 */
router.get('/my-trips', protect, async (req, res) => {
    try {
        const { status } = req.query;

        const query = { userId: req.user.id };
        if (status) {
            query.status = status;
        }

        const itineraries = await Itinerary.find(query)
            .sort('-createdAt')
            .select('-aiSuggestions'); // Reduce response size

        res.json({
            success: true,
            count: itineraries.length,
            data: { itineraries }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch itineraries',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/itinerary/:id/clone
 * @desc    Clone itinerary (viral growth feature!)
 * @access  Private
 */
router.post('/:id/clone', protect, async (req, res) => {
    try {
        const originalItinerary = await Itinerary.findById(req.params.id);

        if (!originalItinerary) {
            return res.status(404).json({
                success: false,
                message: 'Itinerary not found'
            });
        }

        // Check if itinerary is public or owned by user
        if (!originalItinerary.isPublic && originalItinerary.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Cannot clone private itinerary'
            });
        }

        const clonedItinerary = await originalItinerary.clone(req.user.id);

        console.log(`📋 Itinerary cloned: ${originalItinerary.tripName} by ${req.user.email}`);

        res.status(201).json({
            success: true,
            message: 'Itinerary cloned successfully',
            data: { itinerary: clonedItinerary }
        });

    } catch (error) {
        console.error('Itinerary clone error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to clone itinerary',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/itinerary/discover
 * @desc    Discover public itineraries (viral growth!)
 * @access  Public
 */
router.get('/discover', async (req, res) => {
    try {
        const { destination, maxBudget, sort = 'views' } = req.query;

        const query = { isPublic: true, status: 'completed' };

        if (destination) {
            query['destination.primary'] = new RegExp(destination, 'i');
        }

        if (maxBudget) {
            query['budget.total'] = { $lte: parseInt(maxBudget) };
        }

        const sortOptions = {
            views: '-views',
            clones: '-cloned',
            recent: '-createdAt'
        };

        const itineraries = await Itinerary.find(query)
            .sort(sortOptions[sort] || '-views')
            .limit(20)
            .populate('userId', 'profile.name')
            .select('-aiSuggestions');

        res.json({
            success: true,
            count: itineraries.length,
            data: { itineraries }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch itineraries',
            error: error.message
        });
    }
});

module.exports = router;
