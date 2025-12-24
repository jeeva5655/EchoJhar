const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const paymentService = require('../services/paymentService');
const { AnalyticsEvent } = require('../models/Analytics');

const router = express.Router();

/**
 * Marketplace Routes - Commission-Based Revenue
 * 
 * Business Model:
 * - 15% commission on sales
 * - Escrow payment system
 * - Vendor payout management
 */

/**
 * @route   POST /api/marketplace/order
 * @desc    Place marketplace order
 * @access  Private
 */
router.post('/order', protect, async (req, res) => {
    try {
        const {
            vendorId,
            items,
            shippingAddress,
            paymentMethod
        } = req.body;

        const customer = await User.findById(req.user.id);
        const vendor = await User.findById(vendorId);

        if (!vendor || vendor.userType !== 'business') {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        // BUSINESS LOGIC: Calculate commission
        const commissionRate = vendor.businessProfile?.commission ||
            parseFloat(process.env.MARKETPLACE_COMMISSION_RATE) || 0.15;

        // Create order
        const order = await Order.create({
            customerId: customer._id,
            vendorId: vendor._id,
            items,
            shippingAddress,
            pricing: {
                commissionRate
            },
            payment: {
                method: paymentMethod,
                status: 'pending'
            }
        });

        // Create payment order
        const paymentOrder = await paymentService.createOrder({
            amount: order.pricing.totalAmount,
            receipt: `order_${order.orderId}`,
            notes: {
                orderId: order.orderId,
                customerId: customer._id.toString(),
                vendorId: vendor._id.toString()
            }
        });

        console.log(`🛒 Order created: ${order.orderId} | Commission: ₹${order.pricing.platformCommission}`);

        res.status(201).json({
            success: true,
            message: 'Order created. Complete payment to confirm.',
            data: {
                order: {
                    id: order._id,
                    orderId: order.orderId,
                    totalAmount: order.pricing.totalAmount,
                    items: order.items.length
                },
                paymentOrder
            }
        });

    } catch (error) {
        console.error('Order creation error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Order creation failed',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/marketplace/order/:id/confirm
 * @desc    Confirm order payment
 * @access  Private
 */
router.post('/order/:id/confirm', protect, async (req, res) => {
    try {
        const { paymentId, signature } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Verify payment
        const isValid = paymentService.verifyPayment({
            orderId: order.payment.paymentId,
            paymentId,
            signature
        });

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // Update order status
        order.payment.status = 'held_in_escrow'; // Hold until delivery
        order.payment.paidAt = new Date();
        order.status = 'confirmed';
        await order.save();

        // Track revenue
        await AnalyticsEvent.create({
            eventType: 'order_placed',
            userId: order.customerId,
            data: {
                orderId: order.orderId,
                itemCount: order.items.length
            },
            revenue: {
                amount: order.pricing.totalAmount,
                commission: order.pricing.platformCommission,
                currency: 'INR'
            }
        });

        console.log(`✅ Order confirmed: ${order.orderId} | Commission: ₹${order.pricing.platformCommission}`);

        res.json({
            success: true,
            message: 'Order confirmed! Your items will be shipped soon.',
            data: {
                order: {
                    id: order._id,
                    orderId: order.orderId,
                    status: order.status,
                    estimatedDelivery: order.tracking.estimatedDelivery
                }
            }
        });

    } catch (error) {
        console.error('Order confirmation error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Order confirmation failed',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/marketplace/orders/my-orders
 * @desc    Get customer orders
 * @access  Private
 */
router.get('/orders/my-orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user.id })
            .sort('-createdAt')
            .populate('vendorId', 'profile.name businessProfile.sector');

        res.json({
            success: true,
            count: orders.length,
            data: { orders }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/marketplace/orders/vendor-orders
 * @desc    Get vendor orders (Business dashboard)
 * @access  Private (Business)
 */
router.get('/orders/vendor-orders', protect, authorize('business'), async (req, res) => {
    try {
        const orders = await Order.find({ vendorId: req.user.id })
            .sort('-createdAt')
            .populate('customerId', 'profile.name profile.phone');

        res.json({
            success: true,
            count: orders.length,
            data: { orders }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

module.exports = router;
