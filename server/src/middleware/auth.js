const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Business Logic: Protects revenue-generating endpoints
 */
const protect = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // BUSINESS LOGIC: Check if account is active
        if (req.user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Account is suspended or deleted'
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

/**
 * Role Authorization Middleware
 * Business Logic: Protect admin and business-specific endpoints
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.userType)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.userType}' is not authorized to access this route`
            });
        }
        next();
    };
};

/**
 * Subscription Check Middleware
 * Business Logic: Enforce premium features
 */
const requireSubscription = (requiredTier = 'basic') => {
    const tierHierarchy = { free: 0, basic: 1, premium: 2, enterprise: 3 };

    return (req, res, next) => {
        const userTier = req.user.subscription?.tier || 'free';
        const userTierLevel = tierHierarchy[userTier];
        const requiredLevel = tierHierarchy[requiredTier];

        if (userTierLevel < requiredLevel) {
            return res.status(403).json({
                success: false,
                message: `This feature requires ${requiredTier} subscription or higher`,
                upgradeUrl: '/api/subscription/upgrade'
            });
        }

        next();
    };
};

module.exports = { protect, authorize, requireSubscription };
