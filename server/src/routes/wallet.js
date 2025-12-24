const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const paymentService = require('../services/paymentService');
const { AnalyticsEvent } = require('../models/Analytics');

const router = express.Router();

/**
 * Wallet Routes - Digital Payments & Rewards
 * 
 * Business Logic:
 * - Wallet recharges (increases user spending)
 * - Reward points conversion
 * - Seamless checkout experience
 */

/**
 * @route   POST /api/wallet/recharge
 * @desc    Recharge wallet
 * @access  Private
 */
router.post('/recharge', protect, async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount < 100) {
            return res.status(400).json({
                success: false,
                message: 'Minimum recharge amount is ₹100'
            });
        }

        const user = await User.findById(req.user.id);

        // Create payment order
        const paymentOrder = await paymentService.createOrder({
            amount,
            receipt: `wallet_recharge_${Date.now()}`,
            notes: {
                userId: user._id.toString(),
                type: 'wallet_recharge'
            }
        });

        res.json({
            success: true,
            message: 'Wallet recharge initiated',
            data: {
                paymentOrder,
                currentBalance: user.wallet.balance
            }
        });

    } catch (error) {
        console.error('Wallet recharge error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Wallet recharge failed',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/wallet/confirm-recharge
 * @desc    Confirm wallet recharge
 * @access  Private
 */
router.post('/confirm-recharge', protect, async (req, res) => {
    try {
        const { orderId, paymentId, signature, amount } = req.body;

        // Verify payment
        const isValid = paymentService.verifyPayment({ orderId, paymentId, signature });

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        const user = await User.findById(req.user.id);

        // Add balance
        await user.addBalance(amount, 'wallet_recharge');

        // BUSINESS LOGIC: Bonus on large recharges
        if (amount >= 5000) {
            const bonus = Math.floor(amount * 0.05); // 5% bonus
            await user.addBalance(bonus, 'recharge_bonus');
            console.log(`🎁 Recharge bonus: ₹${bonus} for ${user.email}`);
        }

        // Track analytics
        await AnalyticsEvent.create({
            eventType: 'wallet_credited',
            userId: user._id,
            userType: user.userType,
            data: { amount },
            revenue: { amount }
        });

        console.log(`💰 Wallet recharged: ${user.email} | Amount: ₹${amount}`);

        res.json({
            success: true,
            message: 'Wallet recharged successfully',
            data: {
                balance: user.wallet.balance,
                amountAdded: amount
            }
        });

    } catch (error) {
        console.error('Wallet recharge confirmation error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Wallet recharge confirmation failed',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/wallet/redeem-points
 * @desc    Convert reward points to wallet balance
 * @access  Private
 */
router.post('/redeem-points', protect, async (req, res) => {
    try {
        const { points } = req.body;

        if (!points || points < 100) {
            return res.status(400).json({
                success: false,
                message: 'Minimum 100 points required for redemption'
            });
        }

        const user = await User.findById(req.user.id);

        if (user.rewards.points < points) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient reward points'
            });
        }

        // BUSINESS LOGIC: Points to rupee conversion
        const pointsToRupeeRatio = parseFloat(process.env.DIGIPIN_POINTS_TO_RUPEE_RATIO) || 0.5;
        const cashValue = points * pointsToRupeeRatio;

        // Deduct points
        user.rewards.points -= points;

        // Add to wallet
        await user.addBalance(cashValue, 'points_redemption');
        await user.save();

        console.log(`💎 Points redeemed: ${user.email} | ${points} pts → ₹${cashValue}`);

        res.json({
            success: true,
            message: `${points} points redeemed for ₹${cashValue}`,
            data: {
                pointsRedeemed: points,
                cashValue,
                remainingPoints: user.rewards.points,
                walletBalance: user.wallet.balance
            }
        });

    } catch (error) {
        console.error('Points redemption error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Points redemption failed',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/wallet/balance
 * @desc    Get wallet balance
 * @access  Private
 */
router.get('/balance', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json({
            success: true,
            data: {
                wallet: {
                    balance: user.wallet.balance,
                    currency: user.wallet.currency,
                    totalDeposited: user.wallet.totalDeposited,
                    totalSpent: user.wallet.totalSpent
                },
                rewards: {
                    points: user.rewards.points,
                    tier: user.rewards.tier,
                    lifetimePoints: user.rewards.lifetimePoints,
                    referralCode: user.rewards.referralCode
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch balance',
            error: error.message
        });
    }
});

module.exports = router;
