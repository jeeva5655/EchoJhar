require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLim it = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');

/**
 * EchoJhar Tourism Platform - Backend Server
 * 
 * Business Focus: Revenue Generation & Scalability
 * - Digital ticketing platform
 * - Marketplace with commissions
 * - Premium subscriptions
 * - B2B vendor analytics
 */

const app = express();

// Connect to Database (Critical for startup!)
connectDB();

// Connect to Redis (Optional caching layer)
connectRedis().catch(err => {
    console.log('Running without Redis cache');
});

// SECURITY: Helmet middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS - Allow frontend access
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// SECURITY: Prevent NoSQL injection
app.use(mongoSanitize());

// PERFORMANCE: Compression
app.use(compression());

// LOGGING: Morgan for development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// BUSINESS LOGIC: Rate limiting (prevent abuse, protect revenue)
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
        success: false,
        message: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    const uptime = Math.floor((new Date() - global.dbConnectedAt) / 1000);
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: `${uptime} seconds`,
        environment: process.env.NODE_ENV || 'development'
    });
});

// BUSINESS METRIC: Track API usage
app.use((req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;

        // Log slow requests (performance monitoring)
        if (duration > 1000) {
            console.warn(`⚠️  Slow API: ${req.method} ${req.path} took ${duration}ms`);
        }
    });

    next();
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/itinerary', require('./routes/itinerary'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/webhooks', require('./routes/webhooks'));

// Welcome endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🌍 Welcome to EchoJhar Tourism API',
        version: '1.0.0',
        documentation: '/api/docs',
        health: '/api/health',
        endpoints: {
            auth: '/api/auth',
            tickets: '/api/tickets',
            marketplace: '/api/marketplace',
            itinerary: '/api/itinerary',
            ai: '/api/ai',
            wallet: '/api/wallet',
            analytics: '/api/analytics'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error(err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║    🌍 EchoJhar Tourism Platform - Backend     ║
║                                                ║
║    Environment: ${(process.env.NODE_ENV || 'development').padEnd(33)}║
║    Port: ${PORT.toString().padEnd(40)}║
║    URL: http://localhost:${PORT.toString().padEnd(28)}║
║                                                ║
║    💰 Revenue streams ready:                   ║
║       ✓ Digital Ticketing                     ║
║       ✓ Marketplace Commissions               ║
║       ✓ Premium Subscriptions                 ║
║       ✓ B2B Vendor Analytics                  ║
║                                                ║
║    🚀 Business logic active:                   ║
║       ✓ Payment Processing (Razorpay)         ║
║       ✓ AI Trip Planning (Gemini)             ║
║       ✓ Wallet & Rewards System               ║
║       ✓ Analytics & Tracking                  ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

module.exports = app;
