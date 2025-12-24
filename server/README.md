# EchoJhar Tourism Backend - README

## 🌍 Tamil Nadu Tourism Platform with Revenue-First Architecture

A **production-ready** Node.js backend built for the EchoJhar Tamil Nadu tourism startup, focused on **monetization** and **scalability**.

---

## 💰 Revenue Streams

1. **Digital Ticketing** - 5% platform fee on all ticket sales
2. **Marketplace** - 15% commission on handicraft sales
3. **Premium Features** - AI trip planning subscriptions (₹299-999/month)
4. **Wallet System** - Seamless payments with recharge bonuses

---

## 🚀 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Database**: MongoDB (with Mongoose ODM)
- **Cache**: Redis (optional)
- **Payments**: Razorpay (India), Stripe (International)
- **AI**: Google Gemini 2.0
- **Auth**: JWT with bcrypt

---

## 📁 Project Structure

```
server/
├── src/
│   ├── index.js              # Main Express app
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── redis.js          # Redis cache
│   ├── models/              # Mongoose schemas with business logic
│   │   ├── User.js          # Wallet, rewards, subscriptions
│   │   ├── Ticket.js        # Digital ticketing with QR
│   │   ├── Order.js         # Marketplace with commissions
│   │   ├── Itinerary.js     # AI trip planning
│   │   └── Analytics.js     # Business intelligence
│   ├── routes/              # API endpoints
│   │   ├── auth.js          # Login, register, referrals
│   │   ├── tickets.js       # Ticket purchase & validation
│   │   ├── marketplace.js   # Orders & vendor management
│   │   ├── itinerary.js     # Trip planning with AI
│   │   ├── wallet.js        # Digital wallet & rewards
│   │   ├── ai.js            # Gemini chatbot
│   │   ├── analytics.js     # Business metrics
│   │   └── webhooks.js      # Payment gateway webhooks
│   ├── services/
│   │   ├── paymentService.js  # Razorpay integration
│   │   └── aiService.js       # Gemini AI integration
│   └── middleware/
│       └── auth.js            # JWT protection & authorization
├── .env.example
└── package.json
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-key
RAZORPAY_KEY_ID=your-razorpay-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### 3. Run Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on: **http://localhost:5000**

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user (with referral tracking)
- `POST /api/auth/login` - Login & get JWT token
- `GET /api/auth/me` - Get current user profile

### Tickets (Revenue Engine!)
- `POST /api/tickets/purchase` - Purchase tickets
- `POST /api/tickets/:id/confirm` - Confirm payment
- `GET /api/tickets/my-tickets` - User's tickets
- `POST /api/tickets/:id/cancel` - Request refund
- `POST /api/tickets/:id/validate` - Validate QR code

### Marketplace
- `POST /api/marketplace/order` - Place order
- `POST /api/marketplace/order/:id/confirm` - Confirm payment
- `GET /api/marketplace/orders/my-orders` - Customer orders
- `GET /api/marketplace/orders/vendor-orders` - Vendor orders

### Trip Planning
- `POST /api/itinerary/create` - Create itinerary (AI-powered)
- `GET /api/itinerary/my-trips` - User's itineraries
- `POST /api/itinerary/:id/clone` - Clone public itinerary
- `GET /api/itinerary/discover` - Browse public trips

### Wallet & Rewards
- `POST /api/wallet/recharge` - Add money to wallet
- `POST /api/wallet/redeem-points` - Convert points to cash
- `GET /api/wallet/balance` - Get wallet & rewards balance

### AI Features
- `POST /api/ai/chat` - Chat with Gemini AI
- `POST /api/ai/recommendations` - Get personalized suggestions

### Analytics (Business Intelligence)
- `POST /api/analytics/track` - Track event
- `GET /api/analytics/metrics` - Business metrics
- `GET /api/analytics/revenue` - Revenue reports (Admin)

### Webhooks
- `POST /api/webhooks/razorpay` - Razorpay payment webhooks

---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Bcrypt Password Hashing** - Industry-standard encryption
- **Rate Limiting** - Prevent API abuse (100 req/15min)
- **Helmet** - Security headers
- **Mongo Sanitize** - Prevent NoSQL injection
- **CORS** - Configured for frontend domain

---

## 💰 Business Logic Highlights

### 1. Ticket Pricing (Automatic Calculation)
```javascript
basePrice = ₹500
quantity = 2
subtotal = ₹1000
platformFee = ₹50 (5%)
tax = ₹189 (18% GST)
total = ₹1239
```

### 2. Marketplace Commission
```javascript
itemsTotal = ₹2000
commission = ₹300 (15%)
vendorPayout = ₹1700
platformRevenue = ₹300
```

### 3. Reward Points
- Earn: 1 point per ₹100 spent
- Redeem: 100 points = ₹50 cash
- Referral bonus: 100 points per successful referral
- Tiers: Bronze → Silver (2000 pts) → Gold (5000 pts) → Platinum (10000 pts)

### 4. Subscription Tiers
- **Free**: Basic features
- **Basic** (₹299/month): AI trip planning, priority support
- **Premium** (₹599/month): All features + analytics
- **Enterprise** (₹999/month): Custom solutions

---

## 📊 Database Models

All models include **comprehensive business logic**:

- **User**: Wallet, rewards, subscriptions, referrals
- **Ticket**: Platform fees, QR validation, refund rules
- **Order**: Commissions, escrow, vendor payouts
- **Itinerary**: AI suggestions, collaboration, viral cloning
- **Analytics**: Revenue tracking, user behavior, business metrics

---

##🧪 Testing

```bash
# Run tests
npm test

# Test with coverage
npm test -- --coverage
```

### Manual Testing

1. **Health Check**: `GET http://localhost:5000/api/health`
2. **Register**: `POST /api/auth/register`
3. **Purchase Ticket**: `POST /api/tickets/purchase`
4. **Check Analytics**: `GET /api/analytics/metrics`

---

## 🚀 Deployment

### Railway (Recommended)
```bash
railway login
railway init
railway up

# Set environment variables in dashboard
```

### Render
1. Connect GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

---

## 📈 Monitoring

- **Health Endpoint**: `/api/health`
- **Slow Request Logging**: Automatically logs API calls > 1s
- **Revenue Tracking**: All transactions logged to analytics
- **Error Logging**: Comprehensive error messages

---

## 🤝 For Startup Team

### Key Features for Your Pitch
1. ✅ **Revenue-ready**: Payment gateway integrated
2. ✅ **AI-powered**: Gemini for personalization
3. ✅ **Scalable**: Built for growth with caching & optimization
4. ✅ **Analytics**: Real-time business metrics
5. ✅ **Secure**: Industry-standard security practices

### Business Metrics to Track
- Daily Active Users (DAU)
- Gross Merchandise Value (GMV)
- Platform Revenue (fees + commissions)
- Conversion Rate
- Average Order Value

---

## 📝 Environment Variables Reference

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://...

# JWT
JWT_SECRET=secret
JWT_EXPIRE=7d

# Gemini AI
GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-2.0-flash-exp

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# Business Logic
MARKETPLACE_COMMISSION_RATE=0.15
TICKET_PLATFORM_FEE=0.05
DIGIPIN_POINTS_TO_RUPEE_RATIO=0.5
REFERRAL_BONUS_POINTS=100
```

---

## 📞 Support

- **Documentation**: See `/STARTUP_GUIDE.md`
- **API Health**: http://localhost:5000/api/health
- **Issues**: Check console logs

---

**Built with ❤️ for EchoJhar Tourism Startup**

🚀 Ready to scale tourism in Tamil Nadu!
