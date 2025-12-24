const express = require('express');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const paymentService = require('../services/paymentService');
const { AnalyticsEvent } = require('../models/Analytics');

const router = express.Router();

/**
 * Webhook Routes - Payment Gateway Integrations
 * 
 * Business Critical:
 * - Automate payment confirmations
 * - Update order statuses
 * - Trigger reward points
 * - Real-time revenue tracking
 */

/**
 * @route   POST /api/webhooks/razorpay
 * @desc    Handle Razorpay webhooks
 * @access  Public (but verified)
 */
router.post('/razorpay', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];

        // Verify webhook signature
        const isValid = paymentService.verifyWebhookSignature(
            req.body.toString(),
            signature
        );

        if (!isValid) {
            console.warn('⚠️  Invalid webhook signature');
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        const event = JSON.parse(req.body.toString());

        console.log(`📥 Webhook received: ${event.event}`);

        // Handle different webhook events
        switch (event.event) {
            case 'payment.captured':
                await handlePaymentCaptured(event.payload.payment.entity);
                break;

            case 'payment.failed':
                await handlePaymentFailed(event.payload.payment.entity);
                break;

            case 'refund.created':
                await handleRefundCreated(event.payload.refund.entity);
                break;

            default:
                console.log(`Unhandled webhook event: ${event.event}`);
        }

        res.json({ success: true, message: 'Webhook processed' });

    } catch (error) {
        console.error('Webhook error:', error.message);
        res.status(500).json({ success: false, message: 'Webhook processing failed' });
    }
});

// Helper functions for webhook handling

async function handlePaymentCaptured(payment) {
    try {
        const { id, order_id, amount, notes } = payment;

        console.log(`✅ Payment captured: ${id} | Amount: ₹${amount / 100}`);

        // Find ticket or order by payment ID
        const ticket = await Ticket.findOne({ 'payment.paymentId': order_id });

        if (ticket) {
            ticket.payment.status = 'completed';
            ticket.payment.paidAt = new Date();
            ticket.status = 'confirmed';
            await ticket.save();

            // Award reward points
            const user = await User.findById(ticket.userId);
            if (user) {
                const rewardPoints = Math.floor(ticket.pricing.totalAmount / 100);
                await user.addRewardPoints(rewardPoints, 'ticket_purchase');
            }

            // Track revenue
            await AnalyticsEvent.create({
                eventType: 'payment_completed',
                userId: ticket.userId,
                data: { ticketId: ticket.ticketId },
                revenue: {
                    amount: ticket.pricing.totalAmount,
                    platformFee: ticket.pricing.platformFee,
                    currency: 'INR'
                }
            });

            console.log(`💰 Revenue recorded: ₹${ticket.pricing.platformFee} platform fee`);
        }

    } catch (error) {
        console.error('Payment captured handler error:', error.message);
    }
}

async function handlePaymentFailed(payment) {
    try {
        console.log(`❌ Payment failed: ${payment.id}`);

        const ticket = await Ticket.findOne({ 'payment.paymentId': payment.order_id });

        if (ticket) {
            ticket.payment.status = 'failed';
            await ticket.save();
        }

        // Track failed payment for analytics
        await AnalyticsEvent.create({
            eventType: 'payment_failed',
            data: {
                paymentId: payment.id,
                reason: payment.error_description
            }
        });

    } catch (error) {
        console.error('Payment failed handler error:', error.message);
    }
}

async function handleRefundCreated(refund) {
    try {
        console.log(`💸 Refund created: ${refund.id} | Amount: ₹${refund.amount / 100}`);

        // Update ticket/order refund status
        // This is handled in the refund API route, webhook is just confirmation

    } catch (error) {
        console.error('Refund handler error:', error.message);
    }
}

module.exports = router;
