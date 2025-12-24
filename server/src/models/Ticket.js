const mongoose = require('mongoose');

/**
 * Ticket Model - Core Revenue Generator
 * 
 * Business Model:
 * - Platform fee per ticket (5% default)
 * - Dynamic pricing capabilities
 * - Refund handling with business rules
 * - QR verification for authenticity
 */
const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true,
        default: () => `TKT${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    },

    // Customer
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Event/Attraction Details
    eventType: {
        type: String,
        enum: ['attraction', 'tour', 'activity', 'experience', 'vr_tour'],
        required: true
    },
    eventDetails: {
        name: { type: String, required: true },
        location: { type: String, required: true },
        coordinates: {
            lat: Number,
            lng: Number
        },
        date: { type: Date, required: true },
        time: String,
        duration: String,
        description: String,
        category: String,
        image: String
    },

    // BUSINESS LOGIC: Pricing & Revenue
    pricing: {
        basePrice: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        subtotal: { type: Number, required: true }, // basePrice * quantity

        // Platform revenue
        platformFee: { type: Number, required: true },  // % of subtotal
        platformFeePercent: { type: Number, default: 0.05 }, // 5% platform fee

        // Tax (GST)
        tax: { type: Number, default: 0 },
        taxPercent: { type: Number, default: 0.18 }, // 18% GST

        // Discounts
        discount: { type: Number, default: 0 },
        discountCode: String,
        discountPercent: { type: Number, default: 0 },

        // Final amount
        totalAmount: { type: Number, required: true },
        currency: { type: String, default: 'INR' }
    },

    // Payment
    payment: {
        paymentId: String, // Razorpay/Stripe payment ID
        method: {
            type: String,
            enum: ['razorpay', 'stripe', 'wallet', 'upi', 'card'],
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        paidAt: Date,
        refundId: String,
        refundedAt: Date,
        refundAmount: Number
    },

    // QR Code for Verification
    qrCode: {
        data: String, // Base64 encoded QR
        secret: String, // Encrypted ticket verification code
        scannedAt: Date,
        scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        validationAttempts: { type: Number, default: 0 }
    },

    // Status
    status: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled', 'used', 'expired'],
        default: 'pending'
    },
    validUntil: { type: Date, required: true },

    // BUSINESS LOGIC: Validation History (Fraud Prevention)
    validationHistory: [{
        timestamp: { type: Date, default: Date.now },
        location: {
            lat: Number,
            lng: Number,
            address: String
        },
        validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        device: String,
        ipAddress: String,
        success: Boolean
    }],

    // BUSINESS METRIC: Customer Experience
    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        review: String,
        submittedAt: Date
    },

    // BUSINESS LOGIC: Cancellation & Refund Rules
    cancellationPolicy: {
        allowed: { type: Boolean, default: true },
        refundPercent: { type: Number, default: 100 }, // 100% refund if before 24hrs
        deadlineHours: { type: Number, default: 24 } // Hours before event for full refund
    },

    // Metadata
    bookingSource: {
        type: String,
        enum: ['web', 'mobile', 'api', 'partner'],
        default: 'web'
    },
    referralCode: String, // Track marketing effectiveness
    notes: String

}, {
    timestamps: true
});

// BUSINESS LOGIC: Calculate platform revenue
ticketSchema.pre('save', function (next) {
    if (this.isModified('pricing.basePrice') || this.isModified('pricing.quantity')) {
        const subtotal = this.pricing.basePrice * this.pricing.quantity;
        this.pricing.subtotal = subtotal;

        // Calculate platform fee
        this.pricing.platformFee = subtotal * this.pricing.platformFeePercent;

        // Calculate tax
        this.pricing.tax = (subtotal + this.pricing.platformFee) * this.pricing.taxPercent;

        // Apply discount
        const discount = this.pricing.discount || 0;

        // Total amount
        this.pricing.totalAmount = subtotal + this.pricing.platformFee + this.pricing.tax - discount;
    }
    next();
});

// BUSINESS LOGIC: Check if refund is allowed
ticketSchema.methods.canRefund = function () {
    if (!this.cancellationPolicy.allowed) return false;
    if (this.status === 'used' || this.status === 'refunded') return false;

    const now = new Date();
    const eventDate = new Date(this.eventDetails.date);
    const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);

    return hoursUntilEvent >= this.cancellationPolicy.deadlineHours;
};

// BUSINESS LOGIC: Calculate refund amount
ticketSchema.methods.calculateRefund = function () {
    if (!this.canRefund()) {
        return 0;
    }

    const refundPercent = this.cancellationPolicy.refundPercent / 100;
    return this.pricing.totalAmount * refundPercent;
};

// BUSINESS LOGIC: Process refund
ticketSchema.methods.processRefund = async function (refundId) {
    const refundAmount = this.calculateRefund();

    if (refundAmount === 0) {
        throw new Error('Refund not allowed for this ticket');
    }

    this.payment.status = 'refunded';
    this.payment.refundId = refundId;
    this.payment.refundedAt = new Date();
    this.payment.refundAmount = refundAmount;
    this.status = 'cancelled';

    await this.save();

    return refundAmount;
};

// Index for business queries
ticketSchema.index({ userId: 1, createdAt: -1 });
ticketSchema.index({ 'payment.status': 1 });
ticketSchema.index({ status: 1, validUntil: 1 });
ticketSchema.index({ ticketId: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
