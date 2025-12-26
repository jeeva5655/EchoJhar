# Quick Setup Guide - Get Your Platform Running

## ✅ Step-by-Step Setup (30 minutes)

### Step 1: Get FREE MongoDB Database (5 min)

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** with Google (instant, no credit card)
3. **Create FREE Cluster**:
   - Click "Build a Database"
   - Choose **FREE** (M0 Sandbox)
   - Provider: AWS
   - Region: **Mumbai (ap-south-1)** ← Closest to India!
   - Click "Create"

4. **Create Database User**:
   - Username: `echojhar`
   - Password: (click "Autogenerate Secure Password" and SAVE it!)
   - Click "Create User"

5. **Allow Access**:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

6. **Get Connection String**:
   - Click "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://echojhar:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add `/echojhar` before the `?` like this:
   ```
   mongodb+srv://echojhar:yourpassword@cluster0.xxxxx.mongodb.net/echojhar?retryWrites=true&w=majority
   ```

✅ **Done! You now have a FREE database that supports 50,000 users!**

---

### Step 2: Get FREE Google Gemini AI Key (2 min)

1. **Go to**: https://aistudio.google.com/app/apikey
2. **Sign in** with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)

✅ **Done! You now have AI-powered trip planning!**

---

### Step 3: Get FREE Razorpay Keys (5 min)

1. **Go to**: https://razorpay.com
2. **Sign Up** (use business email)
3. Go to **Settings** → **API Keys**
4. Click **"Generate Test Key"** (for development)
5. Copy both:
   - **Key ID**: `rzp_test_xxxxxxxxx`
   - **Key Secret**: `xxxxxxxxxxxxx`

✅ **Done! You can now accept payments!**

---

### Step 4: Configure Your .env File

Open `server/.env` and update these values:

```env
# Database (from Step 1)
MONGODB_URI=mongodb+srv://echojhar:yourpassword@cluster0.xxxxx.mongodb.net/echojhar?retryWrites=true&w=majority

# JWT Secret (just make this up - any random string)
JWT_SECRET=MySuper_Secret_Key_12345_ChangeMeInProduction

# Gemini AI (from Step 2)
GEMINI_API_KEY=AIzaSyCnJzKoDw-s6yCo4S6fvYTK4K5vRCcuHyQ

# Razorpay (from Step 3)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_here

# Client URL (keep as is for now)
CLIENT_URL=http://localhost:3000
```

**Don't have the keys yet?** That's okay! The server will run with:
- ✅ Mock AI responses (until you add Gemini key)
- ✅ Test payment mode (until you add Razorpay keys)

---

### Step 5: Start Backend Server

```bash
cd c:\Users\ninje\Desktop\tourism\server
npm run dev
```

**You should see**:
```
✅ MongoDB Connected
✅ Gemini AI initialized
🚀 Server running on http://localhost:5000
```

**Test it**: Open http://localhost:5000 in browser
- Should show: "Welcome to EchoJhar Tourism API"

---

### Step 6: Start Frontend

```bash
# Open NEW terminal
cd c:\Users\ninje\Desktop\tourism
npm run dev
```

**Your app will open at**: http://localhost:3000

---

## 🆘 Troubleshooting

**"Cannot find module"**
```bash
cd server
npm install
```

**"MongoDB connection failed"**
- Check MONGODB_URI in .env
- Make sure password doesn't have special characters
- Verify IP address is whitelisted (0.0.0.0/0)

**"Port 5000 already in use"**
```bash
# Change PORT in .env to 5001
PORT=5001
```

---

## 🎯 Quick Test Checklist

Once running, test these:
- [ ] Visit http://localhost:5000 (backend)
- [ ] Visit http://localhost:3000 (frontend)
- [ ] Click "Login" → Use demo credentials
- [ ] Try AI chatbot (might use mock data if no Gemini key)
- [ ] Check if MongoDB is connected (console logs)

---

## 🚀 Next Steps

Once everything works locally:
1. Deploy backend to Render.com (15 min)
2. Deploy frontend to Vercel (5 min)
3. Test live version
4. Submit to StartupTN hackathon!

**Need help?** Check:
- `FREE_SETUP_GUIDE.md` - Detailed deployment guide
- `server/README.md` - Full API documentation
