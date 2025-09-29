VITE_GOOGLE_MAPS_API_KEY=AIzaSyCnJzKoDw-s6yCo4S6fvYTK4K5vRCcuHyQ# 🗺️ Google Maps API Setup Guide - 100% FREE!

## ✅ Step 1: Get Your FREE Google Maps API Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com/google/maps-apis/start
2. **Create a New Project** (or select existing)
3. **Enable Required APIs** (all FREE up to usage limits):
   - ✅ Maps JavaScript API (10,000 free loads/month)
   - ✅ Places API (basic features)
   - ✅ Geocoding API (basic features)

4. **Create API Key**:
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy the generated key

## ✅ Step 2: Set Up Your Environment

1. **Create `.env` file** in your project root:
```bash
# Copy .env.example to .env
cp .env.example .env
```

2. **Edit `.env` file** and add your API key:
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBvYZ1234567890abcdefghijklmnopqrs
```

## ✅ Step 3: Secure Your API Key (Important!)

1. **In Google Cloud Console**, go to your API key
2. **Set Application Restrictions**:
   - HTTP referrers (web sites)
   - Add: `http://localhost:*/*` (for development)
   - Add: `https://yourdomain.com/*` (for production)

3. **Set API Restrictions**:
   - Restrict key to only the APIs you need
   - Select: Maps JavaScript API, Places API, Geocoding API

## ✅ Step 4: Test Your Setup

1. **Start the dev server**:
```bash
npm run dev
```

2. **Check the browser console** for any API errors
3. **Your map should now load with real Google Maps!**

## 💰 Cost Breakdown (FREE LIMITS):

| Service | Free Monthly Limit | Cost After |
|---------|-------------------|------------|
| **Dynamic Maps** | 10,000 loads | $2/1K loads |
| **Static Maps** | 10,000 loads | $2/1K loads |
| **Maps Embed** | **UNLIMITED** | Always FREE |
| **Map Tiles** | 100,000 requests | $2/1K requests |
| **Geocoding** | 40,000 requests | $5/1K requests |

## 🔒 Security Best Practices:

1. **Never commit `.env` to version control**
2. **Use environment-specific keys** (dev vs prod)
3. **Set up proper API restrictions**
4. **Monitor usage** in Google Cloud Console
5. **Set billing alerts** to avoid unexpected charges

## 🚀 Your App Features That Work FREE:

- ✅ Interactive maps with zoom/pan
- ✅ Custom markers and info windows  
- ✅ Geolocation and user positioning
- ✅ Places search and autocomplete
- ✅ Route planning and directions
- ✅ Street View integration
- ✅ Real-time location tracking
- ✅ Geo-fencing capabilities

## 📧 Need Help?

If you encounter any issues:
1. Check browser console for errors
2. Verify API key is correct in `.env`
3. Ensure APIs are enabled in Google Cloud Console
4. Check API key restrictions

Your tourism app will work perfectly with the free tier! 🎉