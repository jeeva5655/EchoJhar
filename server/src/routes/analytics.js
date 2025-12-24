const express = require('express');
const { AnalyticsEvent, AggregatedAnalytics } = require('../models/Analytics');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * Analytics Routes - Business Intelligence
 * 
 * Business Use:
 * - Track revenue metrics
 * - User behavior insights
 * - B2B vendor dashboards
 */

/**
 * @route   POST /api/analytics/track
 * @desc    Track analytics event
 * @access  Private
 */
router.post('/track', protect, async (req, res) => {
    try {
        const { eventType, data, revenue, location, performance } = req.body;

        await AnalyticsEvent.create({
            eventType,
            userId: req.user.id,
            userType: req.user.userType,
            data,
            revenue,
            location,
            performance,
            device: {
                userAgent: req.headers['user-agent']
            }
        });

        res.status(201).json({
            success: true,
            message: 'Event tracked'
        });

    } catch (error) {
        // Don't fail request if analytics fails
        console.error('Analytics tracking error:', error.message);
        res.status(200).json({
            success: true,
            message: 'Event logged (with errors)'
        });
    }
});

/**
 * @route   GET /api/analytics/metrics
 * @desc    Get business metrics
 * @access  Private (Admin/Business)
 */
router.get('/metrics', protect, authorize('admin', 'business'), async (req, res) => {
    try {
        const { period = 'daily', days = 7 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const metrics = await AggregatedAnalytics.find({
            period,
            date: { $gte: startDate },
            dimension: 'overall'
        }).sort('date');

        // Calculate totals
        const totals = metrics.reduce((acc, m) => ({
            totalRevenue: acc.totalRevenue + (m.metrics.totalRevenue || 0),
            transactions: acc.transactions + (m.metrics.transactions || 0),
            newUsers: acc.newUsers + (m.metrics.newUsers || 0)
        }), { totalRevenue: 0, transactions: 0, newUsers: 0 });

        res.json({
            success: true,
            data: {
                metrics,
                totals,
                period
            }
        });

    } catch (error) {
        console.error('Metrics fetch error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch metrics',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/analytics/revenue
 * @desc    Get revenue analytics (Admin only)
 * @access  Private (Admin)
 */
router.get('/revenue', protect, authorize('admin'), async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = {
            eventType: { $in: ['ticket_purchase', 'order_placed', 'payment_completed'] },
            'payment.status': 'completed'
        };

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const revenueEvents = await AnalyticsEvent.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$revenue.amount' },
                    platformFees: { $sum: '$revenue.platformFee' },
                    commissions: { $sum: '$revenue.commission' },
                    transactions: { $sum: 1 }
                }
            }
        ]);

        const revenue = revenueEvents[0] || {
            totalRevenue: 0,
            platformFees: 0,
            commissions: 0,
            transactions: 0
        };

        res.json({
            success: true,
            data: { revenue }
        });

    } catch (error) {
        console.error('Revenue fetch error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch revenue',
            error: error.message
        });
    }
});

module.exports = router;
