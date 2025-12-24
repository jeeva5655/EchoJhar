const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * User Model with Business Logic
 * 
 * Business Features:
 * - Wallet system for digital payments
 * - Reward points for loyalty program
 * - Subscription tiers for premium features
 * - Referral tracking for growth
 */
const userSchema = new mongoose.Schema({
    // Basic Information
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password in queries
    },

    // User Type - Different business models for each
    userType: {
        type: String,
        enum: ['tourist', 'admin', 'business'],
        default: 'tourist',
        required: true
    },

    // Profile
    profile: {
        name: { type: String, required: true },
        phone: { type: String },
        avatar: { type: String },
        dateOfBirth: { type: Date },
        nationality: { type: String },
        emergencyContact: {
            name: String,
            phone: String,
            relation: String
        },
        preferences: {
            interests: [String], // For personalized recommendations
            language: { type: String, default: 'en' },
            currency: { type: String, default: 'INR' },
            notifications: {
                email: { type: Boolean, default: true },
                sms: { type: Boolean, default: false },
                whatsapp: { type: Boolean, default: false }
            }
        }
    },

    // BUSINESS LOGIC: Digital Wallet
    wallet: {
        balance: {
            type: Number,
            default: 0,
            min: 0 // Can't go negative
        },
        currency: {
            type: String,
            default: 'INR'
        },
        // For accounting and compliance
        totalDeposited: { type: Number, default: 0 },
        totalSpent: { type: Number, default: 0 }
    },

    // BUSINESS LOGIC: Loyalty & Rewards
    rewards: {
        points: {
            type: Number,
            default: 0,
            min: 0
        },
        tier: {
            type: String,
            enum: ['bronze', 'silver', 'gold', 'platinum'],
            default: 'bronze'
        },
        // Lifetime metrics for tier calculation
        lifetimePoints: { type: Number, default: 0 },
        lifetimeSpending: { type: Number, default: 0 },
        // Referral program
        referralCode: { type: String, unique: true, sparse: true },
        referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },

    // BUSINESS LOGIC: Subscription (Premium Features)
    subscription: {
        tier: {
            type: String,
            enum: ['free', 'basic', 'premium', 'enterprise'],
            default: 'free'
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'cancelled', 'expired'],
            default: 'inactive'
        },
        startDate: Date,
        endDate: Date,
        autoRenew: { type: Boolean, default: false },
        // Revenue tracking
        monthlyRevenue: { type: Number, default: 0 }
    },

    // Business-specific fields
    businessProfile: {
        registrationId: String,
        sector: String, // Tourism, Handicraft, Food, etc.
        verified: { type: Boolean, default: false },
        rating: { type: Number, min: 0, max: 5 },
        totalSales: { type: Number, default: 0 },
        commission: { type: Number, default: 0.15 }, // Platform commission rate
        bankDetails: {
            accountName: String,
            accountNumber: String,
            ifscCode: String,
            upiId: String
        }
    },

    // Admin-specific fields
    adminProfile: {
        department: String,
        clearanceLevel: String,
        jurisdiction: String,
        permissions: [String]
    },

    // Security & Verification
    verified: { type: Boolean, default: false },
    verificationToken: String,
    verificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // BUSINESS METRIC: User Activity Tracking
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
    activeSessionCount: { type: Number, default: 0 },

    // Account Status
    status: {
        type: String,
        enum: ['active', 'suspended', 'deleted'],
        default: 'active'
    },

    // GDPR Compliance
    dataProcessingConsent: { type: Boolean, default: false },
    marketingConsent: { type: Boolean, default: false },

}, {
    timestamps: true, // Auto-create createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// BUSINESS LOGIC: Virtual field for wallet display
userSchema.virtual('formattedBalance').get(function () {
    return `₹${this.wallet.balance.toFixed(2)}`;
});

// BUSINESS LOGIC: Calculate reward tier
userSchema.methods.calculateTier = function () {
    const points = this.rewards.lifetimePoints;
    if (points >= 10000) return 'platinum';
    if (points >= 5000) return 'gold';
    if (points >= 2000) return 'silver';
    return 'bronze';
};

// BUSINESS LOGIC: Add reward points
userSchema.methods.addRewardPoints = function (points, reason = 'activity') {
    this.rewards.points += points;
    this.rewards.lifetimePoints += points;
    this.rewards.tier = this.calculateTier();

    // Log for analytics
    console.log(`💎 User ${this.email} earned ${points} points for ${reason}`);
    return this.save();
};

// BUSINESS LOGIC: Deduct wallet balance
userSchema.methods.deductBalance = async function (amount, description = 'payment') {
    if (this.wallet.balance < amount) {
        throw new Error('Insufficient balance');
    }
    this.wallet.balance -= amount;
    this.wallet.totalSpent += amount;

    // Update reward tier based on spending
    this.rewards.lifetimeSpending += amount;

    await this.save();
    return true;
};

// BUSINESS LOGIC: Add wallet balance
userSchema.methods.addBalance = async function (amount, description = 'deposit') {
    this.wallet.balance += amount;
    this.wallet.totalDeposited += amount;

    await this.save();
    return true;
};

// Security: Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Business Logic: Generate referral code on first save
userSchema.pre('save', function (next) {
    if (this.isNew && !this.rewards.referralCode) {
        this.rewards.referralCode = `ECH${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
    next();
});

// Method: Compare password for login
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method: Generate JWT token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            userType: this.userType
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// BUSINESS METRIC: Track login
userSchema.methods.trackLogin = async function () {
    this.lastLogin = new Date();
    this.loginCount += 1;
    this.activeSessionCount += 1;
    await this.save();
};

module.exports = mongoose.model('User', userSchema);
