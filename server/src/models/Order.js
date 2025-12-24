const mongoose = require('mongoose');

/**
 * Marketplace Order Model - Commission-Based Revenue
 * 
 * Business Model:
 * - 15% commission on each sale (configurable per vendor)
 * - Escrow system (hold payment until delivery)
 * - Vendor payout management
 * - Customer protection
 */
const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        default: () => `ORD${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    },

    // Parties
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Items
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: { type: String, required: true },
        description: String,
        image: String,
        category: String,

        // Pricing
        unitPrice: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        subtotal: { type: Number, required: true },

        // Authenticity (Blockchain simulation)
        blockchainId: String,
        artisanName: String,
        village: String
    }],

    // BUSINESS LOGIC: Revenue Calculation
    pricing: {
        itemsTotal: { type: Number, required: true },

        // Platform commission (Revenue!)
        platformCommission: { type: Number, required: true },
        commissionRate: { type: Number, default: 0.15 }, // 15% commission

        // Shipping
        shippingCost: { type: Number, default: 0 },

        // Tax
        tax: { type: Number, default: 0 },
        taxRate: { type: Number, default: 0.18 }, // 18% GST

        // Discounts
        discount: { type: Number, default: 0 },
        discountCode: String,

        // Final amounts
        totalAmount: { type: Number, required: true },
        vendorPayout: { type: Number, required: true }, // What vendor receives
        currency: { type: String, default: 'INR' }
    },

    // Shipping
    shippingAddress: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: 'India' }
    },

    // Payment
    payment: {
        paymentId: String,
        method: {
            type: String,
            enum: ['razorpay', 'stripe', 'wallet', 'cod'],
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded', 'held_in_escrow'],
            default: 'pending'
        },
        paidAt: Date,

        // BUSINESS LOGIC: Escrow system
        escrowReleased: { type: Boolean, default: false },
        escrowReleasedAt: Date,

        // Refund
        refundId: String,
        refundedAt: Date,
        refundAmount: Number
    },

    // Order Status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },

    // Tracking
    tracking: {
        trackingNumber: String,
        courier: String,
        estimatedDelivery: Date,
        statusHistory: [{
            status: String,
            location: String,
            timestamp: { type: Date, default: Date.now },
            notes: String
        }]
    },

    // BUSINESS LOGIC: Vendor Payout Tracking
    vendorPayout: {
        status: {
            type: String,
            enum: ['pending', 'processing', 'completed'],
            default: 'pending'
        },
        amount: { type: Number, required: true },
        paidAt: Date,
        payoutId: String,
        payoutMethod: {
            type: String,
            enum: ['bank_transfer', 'upi', 'wallet']
        }
    },

    // Customer Protection
    returnPolicy: {
        allowed: { type: Boolean, default: true },
        deadlineDays: { type: Number, default: 7 }
    },
    returnRequest: {
        requested: { type: Boolean, default: false },
        requestedAt: Date,
        reason: String,
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected']
        }
    },

    // Reviews & Ratings
    review: {
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        images: [String],
        submittedAt: Date
    },

    // Metadata
    notes: String,
    customerNotes: String

}, {
    timestamps: true
});

// BUSINESS LOGIC: Auto-calculate pricing
orderSchema.pre('save', function (next) {
    if (this.isModified('items') || this.isModified('pricing.commissionRate')) {
        // Calculate items total
        this.pricing.itemsTotal = this.items.reduce((total, item) => {
            item.subtotal = item.unitPrice * item.quantity;
            return total + item.subtotal;
        }, 0);

        // Calculate platform commission (our revenue!)
        this.pricing.platformCommission = this.pricing.itemsTotal * this.pricing.commissionRate;

        // Calculate tax on items + shipping
        const taxableAmount = this.pricing.itemsTotal + this.pricing.shippingCost;
        this.pricing.tax = taxableAmount * this.pricing.taxRate;

        // Calculate total
        this.pricing.totalAmount =
            this.pricing.itemsTotal +
            this.pricing.shippingCost +
            this.pricing.tax -
            (this.pricing.discount || 0);

        // Calculate vendor payout (what they receive after commission)
        this.pricing.vendorPayout = this.pricing.itemsTotal - this.pricing.platformCommission;
        this.vendorPayout.amount = this.pricing.vendorPayout;
    }
    next();
});

// BUSINESS LOGIC: Release escrow to vendor
orderSchema.methods.releaseEscrow = async function () {
    if (this.status !== 'delivered') {
        throw new Error('Cannot release escrow before delivery confirmation');
    }

    if (this.payment.escrowReleased) {
        throw new Error('Escrow already released');
    }

    this.payment.escrowReleased = true;
    this.payment.escrowReleasedAt = new Date();
    this.vendorPayout.status = 'processing';

    await this.save();

    return this.pricing.vendorPayout;
};

// BUSINESS LOGIC: Check if return is allowed
orderSchema.methods.canReturn = function () {
    if (!this.returnPolicy.allowed) return false;
    if (this.status !== 'delivered') return false;
    if (this.returnRequest.requested) return false;

    const deliveredDate = this.tracking.statusHistory.find(s => s.status === 'delivered')?.timestamp;
    if (!deliveredDate) return false;

    const daysSinceDelivery = (new Date() - deliveredDate) / (1000 * 60 * 60 * 24);
    return daysSinceDelivery <= this.returnPolicy.deadlineDays;
};

// Indexes for business queries
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ vendorId: 1, status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ 'vendorPayout.status': 1 });
orderSchema.index({ orderId: 1 });

module.exports = mongoose.model('Order', orderSchema);
