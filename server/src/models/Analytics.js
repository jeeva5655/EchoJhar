const mongoose = require('mongoose');

/**
 * Analytics Model - Data for Business Intelligence
 * 
 * Business Use:
 * - Track user behavior patterns
 * - Revenue analytics
 * - Conversion funnel optimization
 * - B2B vendor insights
 */
const analyticsEventSchema = new mongoose.Schema({
    // Event Identification
    eventType: {
        type: String,
        required: true,
        index: true,
        enum: [
            // User events
            'page_view', 'signup', 'login', 'logout',
            // Revenue events
            'ticket_purchase', 'order_placed', 'booking_created',
            'payment_completed', 'payment_failed',
            // Engagement events
            'itinerary_created', 'itinerary_shared', 'review_submitted',
            'chat_message', 'vr_tour_started', 'vr_tour_completed',
            // Business events
            'digipin_checkin', 'digipin_verified', 'reward_earned',
            'wallet_credited', 'wallet_debited',
            // Error events
            'error_occurred', 'api_timeout'
        ]
    },

    // User Context
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    userType: {
        type: String,
        enum: ['tourist', 'admin', 'business', 'anonymous']
    },
    sessionId: String,

    // Event Data
    data: {
        type: mongoose.Schema.Types.Mixed,
        // Flexible schema for different event types
        // Examples:
        // { ticketId, amount, category }
        // { page: '/marketplace', duration: 45 }
        // { searchQuery, resultsCount }
    },

    // BUSINESS METRICS
    revenue: {
        amount: { type: Number, default: 0 },
        currency: { type: String, default: 'INR' },
        platformFee: { type: Number, default: 0 },
        commission: { type: Number, default: 0 }
    },

    // Location Context (for geo-analytics)
    location: {
        coordinates: {
            lat: Number,
            lng: Number
        },
        city: String,
        state: String,
        country: String
    },

    // Device & Technical Info
    device: {
        type: {
            type: String,
            enum: ['mobile', 'tablet', 'desktop', 'unknown']
        },
        os: String,
        browser: String,
        userAgent: String
    },

    // Traffic Source (Marketing Analytics)
    source: {
        type: String,
        enum: ['direct', 'organic', 'social', 'referral', 'email', 'paid', 'unknown'],
        default: 'direct'
    },
    campaign: String,
    referrer: String,

    // Performance Metrics
    performance: {
        duration: Number, // milliseconds
        loadTime: Number,
        apiResponseTime: Number
    },

    // Timestamp
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },

    // Meta
    metadata: mongoose.Schema.Types.Mixed

}, {
    timestamps: false, // Using custom timestamp field
    // TTL Index: Auto-delete old analytics after 1 year
    expireAfterSeconds: 31536000
});

// Compound indexes for business queries
analyticsEventSchema.index({ eventType: 1, timestamp: -1 });
analyticsEventSchema.index({ userId: 1, eventType: 1, timestamp: -1 });
analyticsEventSchema.index({ userType: 1, timestamp: -1 });
analyticsEventSchema.index({ 'revenue.amount': 1, timestamp: -1 });
analyticsEventSchema.index({ timestamp: -1 }); // Time-series queries

/**
 * Aggregated Analytics Model - Pre-computed for dashboards
 */
const aggregatedAnalyticsSchema = new mongoose.Schema({
    // Time period
    period: {
        type: String,
        enum: ['hourly', 'daily', 'weekly', 'monthly'],
        required: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },

    // Dimension (what we're aggregating by)
    dimension: {
        type: String,
        enum: ['overall', 'user_type', 'event_type', 'location', 'source'],
        required: true
    },
    dimensionValue: String, // e.g., 'tourist', 'ticket_purchase', 'Mumbai'

    // BUSINESS METRICS
    metrics: {
        // User metrics
        totalUsers: { type: Number, default: 0 },
        newUsers: { type: Number, default: 0 },
        activeUsers: { type: Number, default: 0 },

        // Revenue metrics (most important for startup!)
        totalRevenue: { type: Number, default: 0 },
        platformFees: { type: Number, default: 0 },
        commissions: { type: Number, default: 0 },
        transactions: { type: Number, default: 0 },
        averageOrderValue: { type: Number, default: 0 },

        // Engagement metrics
        totalEvents: { type: Number, default: 0 },
        pageViews: { type: Number, default: 0 },
        sessions: { type: Number, default: 0 },
        averageSessionDuration: { type: Number, default: 0 },
        bounceRate: { type: Number, default: 0 },

        // Conversion metrics
        signups: { type: Number, default: 0 },
        purchases: { type: Number, default: 0 },
        conversionRate: { type: Number, default: 0 },

        // Product metrics
        ticketsSold: { type: Number, default: 0 },
        ordersFulfilled: { type: Number, default: 0 },
        itinerariesCreated: { type: Number, default: 0 },
        reviewsSubmitted: { type: Number, default: 0 },

        // B2B metrics (for business dashboard)
        businessSignups: { type: Number, default: 0 },
        digipinVerifications: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 }
    },

    // Computed at
    computedAt: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});

// Compound index for dashboard queries
aggregatedAnalyticsSchema.index({ period: 1, date: -1 });
aggregatedAnalyticsSchema.index({ dimension: 1, dimensionValue: 1, date: -1 });

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
const AggregatedAnalytics = mongoose.model('AggregatedAnalytics', aggregatedAnalyticsSchema);

module.exports = {
    AnalyticsEvent,
    AggregatedAnalytics
};
