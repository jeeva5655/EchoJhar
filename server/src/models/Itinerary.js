const mongoose = require('mongoose');

/**
 * Itinerary Model - AI Trip Planning with Booking Integration
 * 
 * Business Model:
 * - Free tier: Basic planning
 * - Premium: AI-powered optimization, bookings
 * - Commission on linked bookings (hotels, activities)
 */
const itinerarySchema = new mongoose.Schema({
    itineraryId: {
        type: String,
        unique: true,
        default: () => `ITN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    },

    // Owner
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Basic Details
    tripName: { type: String, required: true },
    description: String,
    destination: {
        primary: { type: String, required: true },
        others: [String]
    },

    // Dates
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number }, // Auto-calculated in days

    // BUSINESS LOGIC: Budget Management
    budget: {
        total: { type: Number, required: true },
        currency: { type: String, default: 'INR' },
        breakdown: {
            accommodation: { type: Number, default: 0 },
            food: { type: Number, default: 0 },
            transportation: { type: Number, default: 0 },
            activities: { type: Number, default: 0 },
            shopping: { type: Number, default: 0 },
            miscellaneous: { type: Number, default: 0 }
        },
        spent: { type: Number, default: 0 },
        remaining: { type: Number }
    },

    // Traveler Preferences (for AI personalization)
    preferences: {
        travelStyle: {
            type: String,
            enum: ['budget', 'moderate', 'luxury'],
            default: 'moderate'
        },
        accommodation: {
            type: String,
            enum: ['hostel', 'hotel', 'resort', 'homestay', 'any'],
            default: 'any'
        },
        transportation: {
            type: String,
            enum: ['public', 'rental', 'private', 'any'],
            default: 'any'
        },
        interests: [String], // nature, adventure, culture, food, etc
        dietaryRestrictions: [String],
        accessibility: {
            wheelchairAccess: Boolean,
            specialAssistance: String
        }
    },

    // Day-wise Itinerary
    days: [{
        day: { type: Number, required: true },
        date: { type: Date, required: true },
        title: String,

        activities: [{
            time: String,
            type: {
                type: String,
                enum: ['attraction', 'meal', 'transport', 'accommodation', 'activity', 'free_time']
            },
            name: { type: String, required: true },
            description: String,
            location: {
                name: String,
                address: String,
                coordinates: {
                    lat: Number,
                    lng: Number
                }
            },

            // BUSINESS LOGIC: Booking integration
            booking: {
                required: Boolean,
                status: {
                    type: String,
                    enum: ['not_booked', 'pending', 'confirmed', 'cancelled']
                },
                bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
                price: Number,
                confirmationCode: String
            },

            duration: String,
            estimatedCost: Number,
            notes: String,
            images: [String]
        }]
    }],

    // AI Suggestions
    aiSuggestions: [{
        type: {
            type: String,
            enum: ['activity', 'restaurant', 'attraction', 'optimization', 'alert']
        },
        title: String,
        description: String,
        priority: {
            type: String,
            enum: ['low', 'medium', 'high']
        },
        applied: { type: Boolean, default: false },
        generatedAt: { type: Date, default: Date.now }
    }],

    // BUSINESS LOGIC: Collaboration (Pro Feature)
    collaborators: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: {
            type: String,
            enum: ['viewer', 'editor', 'owner']
        },
        addedAt: { type: Date, default: Date.now }
    }],
    isPublic: { type: Boolean, default: false },

    // Status
    status: {
        type: String,
        enum: ['draft', 'planning', 'booked', 'active', 'completed', 'cancelled'],
        default: 'draft'
    },

    // BUSINESS METRIC: Engagement tracking
    views: { type: Number, default: 0 },
    cloned: { type: Number, default: 0 }, // How many times itinerary was cloned

    // BUSINESS LOGIC: Premium features usage
    usedPremiumFeatures: {
        aiOptimization: { type: Boolean, default: false },
        budgetTracking: { type: Boolean, default: false },
        realTimeUpdates: { type: Boolean, default: false },
        collaborativeEditing: { type: Boolean, default: false }
    },

    // Metadata
    tags: [String],
    season: {
        type: String,
        enum: ['spring', 'summer', 'monsoon', 'autumn', 'winter']
    },
    notes: String

}, {
    timestamps: true
});

// BUSINESS LOGIC: Auto-calculate duration
itinerarySchema.pre('save', function (next) {
    if (this.startDate && this.endDate) {
        this.duration = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1;
    }

    // Calculate remaining budget
    if (this.budget.total && this.budget.spent !== undefined) {
        this.budget.remaining = this.budget.total - this.budget.spent;
    }

    next();
});

// BUSINESS LOGIC: Add booking to activity
itinerarySchema.methods.linkBooking = async function (dayIndex, activityIndex, bookingId, price) {
    if (!this.days[dayIndex] || !this.days[dayIndex].activities[activityIndex]) {
        throw new Error('Invalid day or activity index');
    }

    this.days[dayIndex].activities[activityIndex].booking = {
        required: true,
        status: 'confirmed',
        bookingId: bookingId,
        price: price,
        confirmationCode: `CONF${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    };

    // Update spent budget
    this.budget.spent += price;

    await this.save();
    return this;
};

//BUSINESS LOGIC: Clone itinerary (viral growth feature)
itinerarySchema.methods.clone = async function (newUserId) {
    const cloneData = this.toObject();
    delete cloneData._id;
    delete cloneData.itineraryId;
    delete cloneData.createdAt;
    delete cloneData.updatedAt;

    cloneData.userId = newUserId;
    cloneData.status = 'draft';
    cloneData.collaborators = [];
    cloneData.isPublic = false;
    cloneData.views = 0;
    cloneData.cloned = 0;

    // Remove bookings from clone
    cloneData.days.forEach(day => {
        day.activities.forEach(activity => {
            if (activity.booking) {
                activity.booking.status = 'not_booked';
                activity.booking.bookingId = null;
                activity.booking.confirmationCode = null;
            }
        });
    });

    // Increment clone count on original
    this.cloned += 1;
    await this.save();

    const Itinerary = mongoose.model('Itinerary');
    const newItinerary = new Itinerary(cloneData);
    await newItinerary.save();

    return newItinerary;
};

// Indexes
itinerarySchema.index({ userId: 1, createdAt: -1 });
itinerarySchema.index({ status: 1 });
itinerarySchema.index({ isPublic: 1, views: -1 });
itinerarySchema.index({ 'destination.primary': 1 });

module.exports = mongoose.model('Itinerary', itinerarySchema);
