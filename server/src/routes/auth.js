const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * Authentication Routes
 * 
 * Business Logic:
 * - Secure user registration with referral tracking
 * - Login with session management
 * - Wallet and rewards initialization
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
    try {
        const {
            email,
            password,
            userType,
            name,
            phone,
            referralCode // BUSINESS: Track who referred this user
        } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, password, and name'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // BUSINESS LOGIC: Handle referral
        let referrer = null;
        if (referralCode) {
            referrer = await User.findOne({ 'rewards.referralCode': referralCode });
            if (referrer) {
                console.log(`🎁 New user referred by ${referrer.email}`);
            }
        }

        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            password,
            userType: userType || 'tourist',
            profile: {
                name,
                phone
            },
            rewards: {
                referredBy: referrer?._id
            }
        });

        // BUSINESS LOGIC: Reward referrer
        if (referrer) {
            const referralBonus = parseInt(process.env.REFERRAL_BONUS_POINTS) || 100;
            await referrer.addRewardPoints(referralBonus, 'referral');
            referrer.rewards.referrals.push(user._id);
            await referrer.save();

            console.log(`💎 ${referrer.email} earned ${referralBonus} points for referral`);
        }

        // BUSINESS LOGIC: Welcome bonus for new users
        await user.addRewardPoints(50, 'signup_bonus');

        // Generate token
        const token = user.generateAuthToken();

        // Track login
        await user.trackLogin();

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.profile.name,
                    userType: user.userType,
                    rewardPoints: user.rewards.points,
                    walletBalance: user.wallet.balance
                },
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user (include password for comparison)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // BUSINESS LOGIC: Check account status
        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: `Account is ${user.status}. Please contact support.`
            });
        }

        // Generate token
        const token = user.generateAuthToken();

        // BUSINESS METRIC: Track login
        await user.trackLogin();

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.profile.name,
                    userType: user.userType,
                    avatar: user.profile.avatar,
                    rewardPoints: user.rewards.points,
                    rewardTier: user.rewards.tier,
                    walletBalance: user.wallet.balance,
                    subscription: user.subscription.tier,
                    lastLogin: user.lastLogin
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    userType: user.userType,
                    profile: user.profile,
                    wallet: user.wallet,
                    rewards: {
                        points: user.rewards.points,
                        tier: user.rewards.tier,
                        referralCode: user.rewards.referralCode
                    },
                    subscription: user.subscription,
                    verified: user.verified,
                    status: user.status,
                    createdAt: user.createdAt
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (decrease active session count)
 * @access  Private
 */
router.post('/logout', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.activeSessionCount > 0) {
            user.activeSessionCount -= 1;
            await user.save();
        }

        res.json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
});

module.exports = router;
