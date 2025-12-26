@echo off
echo ================================================
echo  EchoJhar Backend - Environment Configuration
echo ================================================
echo.
echo Creating .env file with your MongoDB connection...
echo.

(
echo # ========================================
echo # EchoJhar Backend - Environment Variables
echo # ========================================
echo.
echo # Server Configuration
echo NODE_ENV=development
echo PORT=5000
echo CLIENT_URL=http://localhost:3000
echo.
echo # Database ^(MongoDB Atlas - FREE tier^)
echo MONGODB_URI=mongodb+srv://echojhar:j39ZQJWP18UZa8yt@cluster0.lf29fat.mongodb.net/echojhar?retryWrites=true^&w=majority^&appName=Cluster0
echo.
echo # JWT Authentication
echo JWT_SECRET=EchoJhar_Secret_Key_TamilNadu_Tourism_2025_ChangeInProduction
echo JWT_EXPIRE=7d
echo JWT_REFRESH_EXPIRE=30d
echo.
echo # Redis Cache ^(OPTIONAL^)
echo REDIS_URL=redis://localhost:6379
echo REDIS_PASSWORD=
echo.
echo # Google Services
echo GEMINI_API_KEY=your_gemini_api_key_here
echo GEMINI_MODEL=gemini-2.0-flash-exp
echo.
echo # Payment Gateways
echo RAZORPAY_KEY_ID=your_razorpay_key_id
echo RAZORPAY_KEY_SECRET=your_razorpay_secret
echo RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
echo.
echo # Business Logic
echo MARKETPLACE_COMMISSION_RATE=0.15
echo TICKET_PLATFORM_FEE=0.05
echo DIGIPIN_POINTS_TO_RUPEE_RATIO=0.5
echo REFERRAL_BONUS_POINTS=100
) > .env

echo.
echo ✅ .env file created successfully!
echo.
echo ✅ MongoDB configured and ready!
echo.
echo ⚠️  Next steps:
echo    1. Get Gemini API key: https://aistudio.google.com/app/apikey
echo    2. Edit .env and add your GEMINI_API_KEY
echo    3. Run: npm run dev
echo.
echo ================================================
pause
