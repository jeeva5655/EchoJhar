/**
 * Safe geolocation utilities that handle policy restrictions gracefully
 * without console warnings or errors
 */

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface GeolocationResult {
  success: boolean;
  location?: LocationData;
  error?: string;
  usingFallback: boolean;
}

// Default fallback location (Jaipur, India - a popular tourist destination)
const FALLBACK_LOCATION: LocationData = {
  latitude: 26.9124,
  longitude: 75.7873,
  accuracy: 100,
  timestamp: Date.now()
};

/**
 * Safely check if geolocation is available and permitted
 */
export async function checkGeolocationAvailability(): Promise<{
  available: boolean;
  permitted: boolean;
  reason?: string;
}> {
  try {
    // Check if geolocation API exists
    if (!navigator.geolocation) {
      return {
        available: false,
        permitted: false,
        reason: 'Geolocation API not supported'
      };
    }

    // Check permissions if available
    if (navigator.permissions) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permissionStatus.state === 'denied') {
          return {
            available: true,
            permitted: false,
            reason: 'Permission denied'
          };
        }
        
        if (permissionStatus.state === 'granted') {
          return {
            available: true,
            permitted: true
          };
        }
        
        // For 'prompt' state, we consider it available but need to test
        return {
          available: true,
          permitted: true
        };
        
      } catch (permissionError) {
        // Permissions API failed, but geolocation might still work
        return {
          available: true,
          permitted: true
        };
      }
    }

    // No permissions API, assume available
    return {
      available: true,
      permitted: true
    };

  } catch (error) {
    return {
      available: false,
      permitted: false,
      reason: 'Geolocation check failed'
    };
  }
}

/**
 * Safely get current location with fallback to demo data
 */
export async function getSafeCurrentLocation(
  options: PositionOptions = {}
): Promise<GeolocationResult> {
  
  const availability = await checkGeolocationAvailability();
  
  if (!availability.available || !availability.permitted) {
    return {
      success: true,
      location: FALLBACK_LOCATION,
      error: availability.reason,
      usingFallback: true
    };
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      // Timeout - return fallback
      resolve({
        success: true,
        location: FALLBACK_LOCATION,
        error: 'Location request timeout',
        usingFallback: true
      });
    }, options.timeout || 5000);

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeout);
          resolve({
            success: true,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            },
            usingFallback: false
          });
        },
        (error) => {
          clearTimeout(timeout);
          // Always return fallback data instead of errors
          resolve({
            success: true,
            location: FALLBACK_LOCATION,
            error: getGeolocationErrorMessage(error),
            usingFallback: true
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 300000, // 5 minutes
          ...options
        }
      );
    } catch (error) {
      clearTimeout(timeout);
      resolve({
        success: true,
        location: FALLBACK_LOCATION,
        error: 'Geolocation request failed',
        usingFallback: true
      });
    }
  });
}

/**
 * Watch position changes with safe error handling
 */
export function watchSafePosition(
  successCallback: (result: GeolocationResult) => void,
  options: PositionOptions = {}
): () => void {
  
  let watchId: number | null = null;
  let isActive = true;
  
  const cleanup = () => {
    isActive = false;
    if (watchId !== null && navigator.geolocation) {
      try {
        navigator.geolocation.clearWatch(watchId);
      } catch (error) {
        // Silently handle cleanup errors
      }
      watchId = null;
    }
  };
  
  // Check availability first
  checkGeolocationAvailability().then((availability) => {
    if (!isActive) return;
    
    if (!availability.available || !availability.permitted) {
      // Provide fallback data periodically
      const fallbackInterval = setInterval(() => {
        if (!isActive) {
          clearInterval(fallbackInterval);
          return;
        }
        successCallback({
          success: true,
          location: { ...FALLBACK_LOCATION, timestamp: Date.now() },
          error: availability.reason,
          usingFallback: true
        });
      }, 10000); // Update every 10 seconds with current timestamp
      
      // Override cleanup to also clear interval
      const originalCleanup = cleanup;
      cleanup = () => {
        clearInterval(fallbackInterval);
        originalCleanup();
      };
      
      return;
    }
    
    try {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (!isActive) return;
          successCallback({
            success: true,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            },
            usingFallback: false
          });
        },
        (error) => {
          if (!isActive) return;
          // Always provide fallback instead of errors
          successCallback({
            success: true,
            location: { ...FALLBACK_LOCATION, timestamp: Date.now() },
            error: getGeolocationErrorMessage(error),
            usingFallback: true
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
          ...options
        }
      );
    } catch (error) {
      if (!isActive) return;
      // Provide fallback data
      successCallback({
        success: true,
        location: { ...FALLBACK_LOCATION, timestamp: Date.now() },
        error: 'Watch position failed',
        usingFallback: true
      });
    }
  }).catch(() => {
    if (!isActive) return;
    // Provide fallback data
    successCallback({
      success: true,
      location: { ...FALLBACK_LOCATION, timestamp: Date.now() },
      error: 'Geolocation unavailable',
      usingFallback: true
    });
  });
  
  return cleanup;
}

/**
 * Convert geolocation error to user-friendly message
 */
function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location access denied';
    case error.POSITION_UNAVAILABLE:
      return 'Location unavailable';
    case error.TIMEOUT:
      return 'Location request timeout';
    default:
      return 'Location error';
  }
}

/**
 * Get a random location near the fallback for demo purposes
 */
export function getDemoLocationVariation(): LocationData {
  const baseLocation = FALLBACK_LOCATION;
  
  // Add small random variations (within ~1km)
  const latVariation = (Math.random() - 0.5) * 0.01; // ~1.1km at equator
  const lngVariation = (Math.random() - 0.5) * 0.01;
  
  return {
    latitude: baseLocation.latitude + latVariation,
    longitude: baseLocation.longitude + lngVariation,
    accuracy: 50 + Math.random() * 100, // 50-150m accuracy
    timestamp: Date.now()
  };
}