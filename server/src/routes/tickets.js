const express = require('express');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const paymentService = require('../services/paymentService');
const QRCode = require('qrcode');
const crypto = require('crypto');

const router = express.Router();

/**
 * Ticket Routes - Core Revenue Generator
 * 
 * Business Model:
 * - 5% platform fee on all ticket sales
 * - QR verification system
 * - Refund handling with business rules
 */

/**
 * @route   POST /api/tickets/purchase
 * @desc    Purchase tickets (MAIN REVENUE ENDPOINT!)
 * @access  Private
 */
router.post('/purchase', protect, async (req, res) => {
    try {
        const {
            eventType,
            eventDetails,
            quantity,
            basePrice,
            paymentMethod
        } = req.body;

        // Validation
        if (!eventType || !eventDetails || !quantity || !basePrice) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const user = await User.findById(req.user.id);

        // BUSINESS LOGIC: Calculate pricing with platform fee
        const subtotal = basePrice * quantity;
        const platformFeePercent = parseFloat(process.env.TICKET_PLATFORM_FEE) || 0.05;
        const platformFee = subtotal * platformFeePercent;
        const tax = (subtotal + platformFee) * 0.18; // 18% GST
        const totalAmount = subtotal + platformFee + tax;

        // Create payment order
        const paymentOrder = await paymentService.createOrder({
            amount: totalAmount,
            receipt: `ticket_${Date.now()}`,
            notes: {
                userId: user._id.toString(),
                eventType,
                quantity
            }
        });

        // Generate QR code secret
        const qrSecret = crypto.randomBytes(32).toString('hex');
        const qrData = JSON.stringify({
            ticketId: `pending_${Date.now()}`,
            secret: qrSecret,
            userId: user._id
        });
        const qrCodeImage = await QRCode.toDataURL(qrData);

        // Create ticket (pending payment)
        const ticket = await Ticket.create({
            userId: user._id,
            eventType,
            eventDetails,
            pricing: {
                basePrice,
                quantity,
                subtotal,
                platformFee,
                platformFeePercent,
                tax,
                totalAmount
            },
            payment: {
                paymentId: paymentOrder.orderId,
                method: paymentMethod,
                status: 'pending'
            },
            qrCode: {
                data: qrCodeImage,
                secret: qrSecret
            },
            status: 'pending',
            validUntil: new Date(eventDetails.date)
        });

        // BUSINESS METRIC: Track revenue opportunity
        console.log(`💰 Ticket purchase initiated: ₹${totalAmount} (Fee: ₹${platformFee})`);

        res.status(201).json({
            success: true,
            message: 'Ticket purchase initiated. Complete payment to confirm.',
            data: {
                ticket: {
                    id: ticket._id,
                    ticketId: ticket.ticketId,
                    totalAmount: ticket.pricing.totalAmount,
                    platformFee: ticket.pricing.platformFee,
                    qrCode: ticket.qrCode.data
                },
                paymentOrder: {
                    orderId: paymentOrder.orderId,
                    amount: paymentOrder.amount,
                    currency: paymentOrder.currency
                }
            }
        });

    } catch (error) {
        console.error('Ticket purchase error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Ticket purchase failed',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/tickets/:ticketId/confirm
 * @desc    Confirm ticket payment
 * @access  Private
 */
router.post('/:ticketId/confirm', protect, async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { paymentId, signature } = req.body;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        // Verify ticket belongs to user
        if (ticket.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // BUSINESS LOGIC: Verify payment
        const isValid = paymentService.verifyPayment({
            orderId: ticket.payment.paymentId,
            paymentId,
            signature
        });

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // Update ticket status
        ticket.payment.status = 'completed';
        ticket.payment.paidAt = new Date();
        ticket.status = 'confirmed';
        await ticket.save();

        // BUSINESS LOGIC: Award reward points
        const user = await User.findById(req.user.id);
        const rewardPoints = Math.floor(ticket.pricing.totalAmount / 100); // 1 point per ₹100
        await user.addRewardPoints(rewardPoints, 'ticket_purchase');

        console.log(`✅ Ticket confirmed: ${ticket.ticketId} | Revenue: ₹${ticket.pricing.platformFee}`);

        res.json({
            success: true,
            message: 'Ticket confirmed! Check your email for details.',
            data: {
                ticket: {
                    id: ticket._id,
                    ticketId: ticket.ticketId,
                    status: ticket.status,
                    qrCode: ticket.qrCode.data,
                    eventDetails: ticket.eventDetails,
                    validUntil: ticket.validUntil
                },
                rewardPoints: {
                    earned: rewardPoints,
                    total: user.rewards.points
                }
            }
        });

    } catch (error) {
        console.error('Ticket confirmation error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Ticket confirmation failed',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/tickets/my-tickets
 * @desc    Get user's tickets
 * @access  Private
 */
router.get('/my-tickets', protect, async (req, res) => {
    try {
        const { status } = req.query;

        const query = { userId: req.user.id };
        if (status) {
            query.status = status;
        }

        const tickets = await Ticket.find(query)
            .sort('-createdAt')
            .select('-qrCode.secret'); // Don't expose secret

        res.json({
            success: true,
            count: tickets.length,
            data: { tickets }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tickets',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/tickets/:ticketId/cancel
 * @desc    Cancel ticket and request refund
 * @access  Private
 */
router.post('/:ticketId/cancel', protect, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        if (ticket.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // BUSINESS LOGIC: Check if refund allowed
        if (!ticket.canRefund()) {
            return res.status(400).json({
                success: false,
                message: 'Refund not allowed. Check cancellation policy.'
            });
        }

        const refundAmount = ticket.calculateRefund();

        // Process refund
        const refund = await paymentService.processRefund(
            ticket.payment.paymentId,
            refundAmount,
            { ticketId: ticket.ticketId, reason: req.body.reason }
        );

        await ticket.processRefund(refund.refundId);

        console.log(`💸 Refund processed: ${ticket.ticketId} | Amount: ₹${refundAmount}`);

        res.json({
            success: true,
            message: 'Ticket cancelled. Refund will be processed in 5-7 business days.',
            data: {
                refundAmount,
                refundId: refund.refundId
            }
        });

    } catch (error) {
        console.error('Ticket cancellation error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Cancellation failed',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/tickets/:ticketId/validate
 * @desc    Validate ticket (for venue staff/admins)
 * @access  Private (Business/Admin)
 */
router.post('/:ticketId/validate', protect, async (req, res) => {
    try {
        const { secret, location } = req.body;
        const ticket = await Ticket.findById(req.params.ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        // BUSINESS LOGIC: Verify QR secret
        if (ticket.qrCode.secret !== secret) {
            ticket.qrCode.validationAttempts += 1;
            await ticket.save();

            return res.status(400).json({
                success: false,
                message: 'Invalid ticket. Possible fraud attempt.'
            });
        }

        // Check if already used
        if (ticket.status === 'used') {
            return res.status(400).json({
                success: false,
                message: 'Ticket already used'
            });
        }

        // Mark as used
        ticket.status = 'used';
        ticket.qrCode.scannedAt = new Date();
        ticket.qrCode.scannedBy = req.user.id;
        ticket.validationHistory.push({
            validatedBy: req.user.id,
            location,
            success: true
        });
        await ticket.save();

        console.log(`✅ Ticket validated: ${ticket.ticketId}`);

        res.json({
            success: true,
            message: 'Ticket validated successfully',
            data: {
                ticketId: ticket.ticketId,
                eventDetails: ticket.eventDetails,
                userId: ticket.userId
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Validation failed',
            error: error.message
        });
    }
});

module.exports = router;
