// Helper function to safely access environment variables
const getEnvVar = (key: string, fallback: string = ''): string => {
  // For Vite applications, use import.meta.env
  try {
    return (import.meta.env as any)[key] || fallback;
  } catch {
    return fallback;
  }
};

// Helper function to get current origin safely
const getCurrentOrigin = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000'; // fallback for SSR
};

// Environment configuration for TravelSafe application
export const config = {
  // Feature flags
  enableGeminiPro25: true,
  // Google Maps API Key
  googleMapsApiKey: getEnvVar('VITE_GOOGLE_MAPS_API_KEY') || 
                   "AIzaSyCnJzKoDw-s6yCo4S6fvYTK4K5vRCcuHyQ",
  
  // OpenWeather API Key (for real environmental data)
  openWeatherApiKey: getEnvVar('VITE_OPENWEATHER_API_KEY') || 
                    "YOUR_OPENWEATHER_API_KEY_HERE",
  
  // Google Gemini AI API Key
  geminiApiKey: getEnvVar('VITE_GEMINI_API_KEY') || 
               "YOUR_GEMINI_API_KEY_HERE",
  geminiModel: "gemini-2.5-pro",
  
  // Google OAuth Configuration
  googleOAuth: {
    clientId: getEnvVar('VITE_GOOGLE_CLIENT_ID') || 
             "YOUR_GOOGLE_CLIENT_ID_HERE",
    redirectUri: getEnvVar('VITE_GOOGLE_REDIRECT_URI') || 
                getCurrentOrigin() + '/auth/callback',
    scope: 'openid email profile',
  },
  
  // Development flags
  isDevelopment: getEnvVar('NODE_ENV') === 'development',
  isProduction: getEnvVar('NODE_ENV') === 'production',
  
  // API endpoints
  apiEndpoints: {
    openWeatherMap: 'https://api.openweathermap.org/data/2.5',
    googleMaps: 'https://maps.googleapis.com/maps/api/js',
    gemini: 'https://generativelanguage.googleapis.com/v1beta/models'
  },
  
  // Default locations for fallback
  defaultLocations: {
    jaipur: { lat: 26.9124, lng: 75.7873, name: 'Jaipur, India' },
    delhi: { lat: 28.6139, lng: 77.2090, name: 'Delhi, India' },
    mumbai: { lat: 19.0760, lng: 72.8777, name: 'Mumbai, India' }
  },
  
  // API validation helpers
  validation: {
    isValidGoogleMapsKey: (key: string): boolean => {
      return !!(key && key !== "YOUR_GOOGLE_MAPS_API_KEY_HERE" && key.length > 20 && key.startsWith('AIza'));
    },
    
    isValidOpenWeatherKey: (key: string): boolean => {
      return !!(key && key !== "YOUR_OPENWEATHER_API_KEY_HERE" && key.length === 32);
    },
    
    isValidGeminiKey: (key: string): boolean => {
      return !!(key && key !== "YOUR_GEMINI_API_KEY_HERE" && key.length > 20 && key.startsWith('AIza'));
    },
    
    isValidGoogleClientId: (clientId: string): boolean => {
      return !!(clientId && clientId !== "YOUR_GOOGLE_CLIENT_ID_HERE" && clientId.includes('.apps.googleusercontent.com'));
    }
  }
};

// Helper functions for environment checks
export const getGoogleMapsApiKey = (): string => config.googleMapsApiKey;
export const hasValidGoogleMapsKey = (): boolean => config.validation.isValidGoogleMapsKey(config.googleMapsApiKey);

export const getOpenWeatherApiKey = (): string => config.openWeatherApiKey;
export const hasValidOpenWeatherKey = (): boolean => config.validation.isValidOpenWeatherKey(config.openWeatherApiKey);

export const getGeminiApiKey = (): string => config.geminiApiKey;
export const hasValidGeminiKey = (): boolean => config.validation.isValidGeminiKey(config.geminiApiKey);

export const getGoogleOAuthConfig = () => config.googleOAuth;
export const hasValidGoogleOAuth = (): boolean => config.validation.isValidGoogleClientId(config.googleOAuth.clientId);

// Console warnings for missing API keys in development (only in browser environment)
if (typeof window !== 'undefined' && config.isDevelopment) {
  setTimeout(() => {
    if (!hasValidGoogleMapsKey()) {
      console.warn('⚠️ Google Maps API key is missing or invalid. Map functionality will use fallback mode.');
    }
    
    if (!hasValidOpenWeatherKey()) {
      console.warn('⚠️ OpenWeather API key is missing or invalid. Environmental data will use simulated values.');
    }
    
    if (!hasValidGeminiKey()) {
      console.warn('⚠️ Google Gemini API key is missing or invalid. AI Assistant will use mock responses.');
    }
    
    if (!hasValidGoogleOAuth()) {
      console.warn('⚠️ Google OAuth client ID is missing or invalid. Google authentication will use mock responses.');
    }
  }, 100); // Delay to ensure config is fully initialized
}