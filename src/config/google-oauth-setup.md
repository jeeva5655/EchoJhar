# Google OAuth Setup Guide for TravelSafe

## Overview
This guide explains how to set up Google OAuth authentication for the TravelSafe application.

## Prerequisites
1. Google Cloud Platform (GCP) account
2. A registered domain (for production)
3. HTTPS enabled (required by Google OAuth)

## Setup Steps

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API and OAuth2 API

### 2. Configure OAuth Consent Screen
1. Navigate to APIs & Services > OAuth consent screen
2. Choose "External" for user type (unless using Google Workspace)
3. Fill in required information:
   - App name: "TravelSafe"
   - User support email
   - Developer contact information
4. Add scopes:
   - `openid`
   - `email`
   - `profile`

### 3. Create OAuth Credentials
1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized origins:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### 4. Environment Configuration
The environment configuration is already set up in `/config/environment.ts` with browser-safe environment variable access.

### 5. Environment Variables
Create a `.env` file in your project root (copy from `/config/.env.example`):

```env
# Required for Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
REACT_APP_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# Other TravelSafe API keys
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key_here
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here

NODE_ENV=development
```

**Important Notes:**
- All React environment variables **must** start with `REACT_APP_`
- Never commit your `.env` file to version control
- The environment configuration handles both server and browser environments safely

## Implementation Notes

### Current Mock Implementation
The current implementation in `Login.tsx` includes a mock Google OAuth flow that:
- Simulates the OAuth authentication process
- Creates user accounts with Google-derived data
- Includes proper user type handling for both tourists and admins

### Real Implementation Requirements
To implement real Google OAuth, you would need to:

1. Install Google OAuth library:
   ```bash
   npm install @google-cloud/oauth2
   ```

2. Replace the mock `handleGoogleLogin` function with real OAuth flow:
   ```typescript
   import { OAuth2Client } from '@google-cloud/oauth2';
   
   const oauth2Client = new OAuth2Client(
     GOOGLE_OAUTH_CONFIG.clientId,
     '', // client secret (not needed for frontend)
     GOOGLE_OAUTH_CONFIG.redirectUri
   );
   ```

3. Handle the OAuth flow with proper error handling and token validation

### Security Considerations
1. **Admin Authentication**: Implement additional verification for admin users authenticated via Google
2. **Token Management**: Securely store and refresh OAuth tokens
3. **User Verification**: Verify user identity against your user database
4. **Scope Limitation**: Only request necessary OAuth scopes

### Testing
1. Test with different Google accounts
2. Verify proper user data extraction
3. Test error scenarios (network issues, authentication failures)
4. Ensure proper cleanup on logout

## Support
For implementation support or questions about Google OAuth integration, refer to:
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)