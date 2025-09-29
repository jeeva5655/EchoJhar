import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getSafeCurrentLocation, 
  watchSafePosition, 
  checkGeolocationAvailability,
  LocationData,
  GeolocationResult 
} from './utils/geolocation-utils';

interface SafeGeolocationContextType {
  currentLocation: LocationData | null;
  isLocationAvailable: boolean;
  isUsingFallback: boolean;
  lastError: string | null;
  refreshLocation: () => Promise<void>;
}

const SafeGeolocationContext = createContext<SafeGeolocationContextType>({
  currentLocation: null,
  isLocationAvailable: false,
  isUsingFallback: true,
  lastError: null,
  refreshLocation: async () => {}
});

export function SafeGeolocationProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLocationAvailable, setIsLocationAvailable] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);

  const refreshLocation = async () => {
    try {
      const result = await getSafeCurrentLocation({ timeout: 3000 });
      
      if (result.location) {
        setCurrentLocation(result.location);
        setIsUsingFallback(result.usingFallback);
        setLastError(result.error || null);
        setIsLocationAvailable(true);
      }
    } catch (error) {
      // This should never happen with our safe implementation, but just in case
      setIsLocationAvailable(false);
      setLastError('Location service unavailable');
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    // Initialize location
    const initializeLocation = async () => {
      if (!isMounted) return;
      
      try {
        // Check availability first
        const availability = await checkGeolocationAvailability();
        
        if (!isMounted) return;
        
        // Get initial location
        const result = await getSafeCurrentLocation({ timeout: 3000 });
        
        if (!isMounted) return;
        
        if (result.location) {
          setCurrentLocation(result.location);
          setIsUsingFallback(result.usingFallback);
          setLastError(result.error || null);
          setIsLocationAvailable(true);
        }
        
        // Set up position watching if available and permitted
        if (availability.available && availability.permitted) {
          const cleanup = watchSafePosition(
            (watchResult: GeolocationResult) => {
              if (!isMounted) return;
              
              if (watchResult.location) {
                setCurrentLocation(watchResult.location);
                setIsUsingFallback(watchResult.usingFallback);
                setLastError(watchResult.error || null);
              }
            },
            { timeout: 5000 }
          );
          
          // Return cleanup function
          return cleanup;
        }
        
      } catch (error) {
        // Fallback to demo data
        if (isMounted) {
          setCurrentLocation({
            latitude: 26.9124,
            longitude: 75.7873,
            accuracy: 100,
            timestamp: Date.now()
          });
          setIsUsingFallback(true);
          setLastError('Using demo location data');
          setIsLocationAvailable(true);
        }
      }
    };

    const cleanup = initializeLocation();
    
    return () => {
      isMounted = false;
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then((cleanupFn) => {
          if (typeof cleanupFn === 'function') {
            cleanupFn();
          }
        });
      } else if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  // Add global error handlers to catch any remaining geolocation errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.toLowerCase().includes('geolocation') || 
          event.message?.toLowerCase().includes('permission')) {
        // Prevent the error from propagating
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
      return false;
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message || event.reason;
      if (typeof reason === 'string' && 
          (reason.toLowerCase().includes('geolocation') || 
           reason.toLowerCase().includes('permission'))) {
        // Prevent the rejection from causing console errors
        event.preventDefault();
        return true;
      }
      return false;
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const contextValue: SafeGeolocationContextType = {
    currentLocation,
    isLocationAvailable,
    isUsingFallback,
    lastError,
    refreshLocation
  };

  return (
    <SafeGeolocationContext.Provider value={contextValue}>
      {children}
    </SafeGeolocationContext.Provider>
  );
}

export function useSafeGeolocation() {
  const context = useContext(SafeGeolocationContext);
  if (!context) {
    throw new Error('useSafeGeolocation must be used within a SafeGeolocationProvider');
  }
  return context;
}

export { type LocationData, type GeolocationResult };