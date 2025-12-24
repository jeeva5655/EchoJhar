# 🆓 EchoJhar Tourism Platform - 100% FREE Setup Guide

**Total Cost: ₹0 (Completely Free!)**

This guide ensures you can run your entire tourism startup **without spending a single rupee** using free tiers and open-source tools.

---

## ✅ Free Services Used

| Service | Free Tier | Limits | Enough For |
|---------|-----------|--------|------------|
| **MongoDB Atlas** | 512 MB storage | Unlimited connections | 10,000+ users |
| **Render.com** | 750 hrs/month | Spins down after 15 min idle | MVP + Early growth |
| **Vercel** | Unlimited | Unlimited deployments | Production frontend |
| **Google Gemini AI** | Free | 60 requests/min | 10,000+ daily chats |
| **Razorpay** | Free | 0% setup fee, 2% transaction fee | All payments |
| **Google Maps** | Free | 28,000 loads/month | 900+ daily users |
| **Mailtrap** (Email) | Free | 500 emails/month | Email testing |
| **Redis Cloud** | Free | 30 MB | Caching |

**You only pay transaction fees (2%) when customers actually pay you!**

---

## 🚀 Step-by-Step FREE Setup

### **Step 1: Database - MongoDB Atlas (FREE Forever)**

**Free Tier**: 512 MB storage, shared cluster

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google (free)
3. Create **FREE Shared Cluster**:
   - Cloud Provider: **AWS**
   - Region: **Mumbai (ap-south-1)** (closest to India)
   - Cluster Tier: **M0 Sandbox (FREE)**
4. Create database user:
   - Username: `echojhar`
   - Password: (generate strong password)
5. Network Access → Add IP: `0.0.0.0/0` (allow from anywhere)
6. Click **Connect** → **Connect your application**
7. Copy connection string:
   ```
   mongodb+srv://echojhar:<password>@cluster0.xxxxx.mongodb.net/echojhar?retryWrites=true&w=majority
   ```

**Storage Estimate**: 512 MB = ~50,000 user records

---

### **Step 2: Backend Hosting - Render.com (FREE 750 hrs/month)**

**Free Tier**: 750 hours/month (runs 24/7 for 30+ days!)

1. Go to: https://render.com
2. Sign up with **GitHub** (free, no credit card required!)
3. Click **New +** → **Web Service**
4. Connect your GitHub account
5. Select your repository: `tourism`
6. Configure:
   - **Name**: `echojhar-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free** (select this!)
7. **Add Environment Variables**:
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://echojhar:password@cluster...
   JWT_SECRET=your_random_secret_here
   GEMINI_API_KEY=your_gemini_key
   CLIENT_URL=https://your-app.vercel.app
   ```
8. Click **Create Web Service**
9. Render auto-deploys on every GitHub push!

**Your backend URL**: `https://echojhar-backend.onrender.com`

**Cost**: $0 (FREE tier, spins down after 15 min of inactivity, wakes up in ~30 seconds)

---

### **Step 3: Frontend Hosting - Vercel (FREE Forever)**

**Free Tier**: Unlimited deployments, 100 GB bandwidth/month

1. Go to: https://vercel.com
2. Sign up with **GitHub**
3. **Import Project** → Select your repository
4. Framework: **Vite**
5. **Environment Variables**:
   ```env
   VITE_API_URL=https://echojhar-backend.onrender.com
   ```
6. Click **Deploy**

**Your website URL**: `https://your-app.vercel.app`

**Cost**: $0 (FREE forever for personal projects)

---

### **Step 4: AI - Google Gemini (FREE Tier)**

**Free Tier**: 60 requests per minute (unlimited daily)

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google
3. **Create API Key**
4. Copy key (starts with `AIza...`)

**Usage Limits**:
- 60 requests/minute = 3,600/hour
- Enough for 10,000+ daily AI interactions
- No credit card required!

**Cost**: $0 (FREE tier is generous!)

---

### **Step 5: Payments - Razorpay (FREE, Pay Only on Transactions)**

**Pricing**: 
- Setup: **FREE**
- Transaction fee: **2%** (you only pay when customers pay you!)

1. Go to: https://razorpay.com
2. **Sign Up** (free)
3. Complete KYC:
   - Business PAN card
   - Bank account details
   - Business proof
4. Get **Test Keys** (for development):
   - Dashboard → Settings → **API Keys**
   - Test Mode: `rzp_test_xxxxx`
5. **Important**: Use **Test Mode** until you're ready to go live

**Test Cards** (for development):
```
Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

**Cost**: 
- Development: $0
- Production: 2% per successful transaction only
  - Example: Customer pays ₹1000 → You receive ₹980, Razorpay keeps ₹20

---

### **Step 6: Google Maps API (FREE 28,000 loads/month)**

**Free Tier**: $200 credit/month = 28,000 map loads

1. Go to: https://console.cloud.google.com
2. Create **New Project**
3. Enable **Maps JavaScript API**
4. **Credentials** → **Create API Key**
5. **Restrict API Key**:
   - Application restrictions: **HTTP referrers**
   - Add: `https://your-app.vercel.app/*`
   - API restrictions: Select **Maps JavaScript API** only

**Cost**: $0 (FREE tier covers 900+ users daily)

---

### **Step 7: Caching - Redis Cloud (FREE 30MB)**

**Free Tier**: 30 MB RAM (optional but recommended)

1. Go to: https://redis.com/try-free/
2. Create **FREE database**
3. Get connection string:
   ```
   redis://default:password@redis-xxxxx.cloud.redislabs.com:12345
   ```
4. Add to Railway environment variables:
   ```env
   REDIS_URL=redis://default:password@...
   ```

**Cost**: $0 (Optional - app works without Redis too!)

---

### **Step 8: Email (Development) - Mailtrap (FREE)**

**Free Tier**: 500 emails/month

For production emails, use:
- **Gmail SMTP** (FREE, 500 emails/day)
- **Brevo** (FREE, 300 emails/day)

1. Go to: https://mailtrap.io
2. Sign up (free)
3. Get SMTP credentials
4. Add to `.env`:
   ```env
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=your_username
   SMTP_PASSWORD=your_password
   ```

**Cost**: $0

---

## 📝 Complete FREE Environment Variables

Create `server/.env` with:

```env
# Server
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-app.vercel.app

# Database (FREE - MongoDB Atlas)
MONGODB_URI=mongodb+srv://echojhar:password@cluster0.xxxxx.mongodb.net/echojhar

# JWT (FREE - just a random string)
JWT_SECRET=ThisIsAVeryLongRandomSecretKeyForJWTTokens123!@#ChangeThis
JWT_EXPIRE=7d

# AI (FREE - Google Gemini)
GEMINI_API_KEY=AIzaSyCnJzKoDw-s6yCo4S6fvYTK4K5vRCcuHyQ
GEMINI_MODEL=gemini-2.0-flash-exp

# Maps (FREE - Google Maps)
GOOGLE_MAPS_API_KEY=your_google_maps_key_here

# Payments (FREE setup, 2% on transactions)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_here
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxx

# Cache (OPTIONAL - Redis Cloud FREE tier)
REDIS_URL=redis://default:password@redis-cloud.com:12345

# Email (FREE - Mailtrap for dev, Gmail for production)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_username
SMTP_PASSWORD=your_password
FROM_EMAIL=noreply@echojhar.com
FROM_NAME=EchoJhar Tourism

# Business Logic (FREE - just configuration)
MARKETPLACE_COMMISSION_RATE=0.15
TICKET_PLATFORM_FEE=0.05
DIGIPIN_POINTS_TO_RUPEE_RATIO=0.5
REFERRAL_BONUS_POINTS=100
```

---

## 💰 Cost Breakdown

### Development Phase
**Total Monthly Cost: ₹0**

| Service | Cost |
|---------|------|
| MongoDB Atlas | ₹0 (FREE 512MB) |
| Render Backend | ₹0 (FREE 750 hrs) |
| Vercel Frontend | ₹0 (FREE unlimited) |
| Google Gemini AI | ₹0 (FREE 60 req/min) |
| Google Maps | ₹0 (FREE 28k loads) |
| Redis Cloud | ₹0 (FREE 30MB) |
| Email (Mailtrap) | ₹0 (FREE 500/month) |
| **TOTAL** | **₹0/month** |

### Production Phase (With Users)
**Monthly Cost: ₹0 + Transaction Fees Only**

Transaction fees (Razorpay): **2% of revenue**
- If you make ₹1,00,000/month in sales
- You pay ₹2,000 as transaction fees
- **You net ₹98,000**

**You only pay when you earn!**

---

## 🎯 Scaling Limits (Still FREE!)

| Metric | Free Tier Limit | Supports |
|--------|-----------------|----------|
| **Users** | 512 MB DB | ~50,000 users |
| **API Calls** | Render 750 hrs | ~750,000 requests/month |
| **AI Chats** | 60/min | ~86,000 daily messages |
| **Map Loads** | 28,000/month | 900 users/day |
| **Bandwidth** | Vercel 100GB | ~1 million page views |

**When to upgrade**: Only when you exceed these limits (which means you're already making money!)

---

## 🚨 Alternative FREE Options

### If Render spins down is annoying:
Use **Railway.app** (FREE $5/month credit):
1. Go to: https://railway.app
2. Deploy from GitHub
3. FREE tier: $5 credit (keeps running 24/7)
4. Note: May require credit card verification

### If Razorpay 2% is too much:
Use **Cashfree** (1.9% transaction fee, slightly cheaper)

### For email in production:
Use **Gmail SMTP** (completely FREE):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASSWORD=app_password
```
**Limit**: 500 emails/day (enough for startup)

---

## ⚡ Quick FREE Deployment

```bash
# 1. Setup backend locally
cd server
npm install

# 2. Create FREE MongoDB Atlas cluster (5 min)
# Get connection string

# 3. Get FREE Gemini API key (2 min)
# Visit https://aistudio.google.com

# 4. Create .env file
cp .env.example .env
# Paste your MongoDB URI and Gemini key

# 5. Test locally (FREE!)
npm run dev

# 6. Deploy to Render (FREE!)
# - Push code to GitHub
# - Go to render.com
# - New Web Service → Connect repo
# - Root Directory: server
# - Add environment variables
# - Click "Create" - Auto-deploys!

# 7. Deploy frontend to Vercel (FREE!)
cd ..
vercel --prod

# 8. Start accepting payments (2% fee only)
# - Enable Razorpay test mode
# - Test with test cards
# - Go live when ready!
```

**Total Setup Time**: 30 minutes  
**Total Cost**: ₹0

---

## 📊 Revenue vs Cost Analysis

### Scenario: First 1000 Users

**Monthly Revenue**:
```
Ticket sales: 50/day × ₹500 × 5% = ₹37,500
Marketplace: 30/day × ₹800 × 15% = ₹1,08,000
Subscriptions: 20 × ₹499 = ₹9,980
Total Revenue = ₹1,55,480/month
```

**Monthly Costs**:
```
Infrastructure: ₹0 (all FREE tiers)
Transaction fees: ₹1,45,500 × 2% = ₹2,910
Total Costs = ₹2,910/month
```

**Net Profit**: ₹1,52,570/month (98% margin!)

---

## 🎓 Pro Tips for Staying FREE

1. **MongoDB**: Delete old analytics data older than 1 year (stay under 512MB)
2. **Railway**: Use Redis cache to reduce DB queries (saves memory)
3. **Gemini AI**: Cache common questions to reduce API calls
4. **Maps**: Load map only when user clicks "Show Map" button
5. **Emails**: Send only critical emails (confirmations, not marketing)

---

## 🆘 When You Outgrow FREE Tiers

**Good Problem to Have!** This means you're successful!

**Upgrade Path** (only when needed):
1. MongoDB Atlas: ₹1,500/month (10GB) - after 50,000 users
2. Render: $7/month (starter) - for 24/7 uptime without spindown
3. Gemini: Still FREE! (60 req/min is huge)
4. Everything else: Still FREE!

**Bottom Line**: You won't need to pay until you're making ₹5+ lakhs/month

---

## ✅ Final Checklist

- [ ] MongoDB Atlas cluster created (FREE)
- [ ] Render account setup with GitHub (FREE, no credit card!)
- [ ] Vercel account connected to GitHub (FREE)
- [ ] Gemini API key obtained (FREE)
- [ ] Google Maps API key created (FREE)
- [ ] Razorpay test account created (FREE)
- [ ] Backend deployed to Render (FREE)
- [ ] Frontend deployed to Vercel (FREE)
- [ ] All environment variables configured
- [ ] Test payment flow working

**Total Spent**: ₹0  
**Time to Setup**: 30-45 minutes  
**Ready to Launch**: YES! 🚀

---

## 🎉 You're Ready to Launch!

Your platform is:
- ✅ **100% FREE** to develop and test
- ✅ **Production-ready** to accept real payments
- ✅ **Scalable** to 50,000+ users without costs
- ✅ **Profitable** from day one (98% margins!)

**Only cost**: 2% transaction fee (you only pay when customers pay you!)

---

**Need Help?** 
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Gemini:https://ai.google.dev/docs

**Good luck with your FREE startup! 🎊**
