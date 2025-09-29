import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './alert';
import { MapPin, Info } from 'lucide-react';

interface GeolocationPolicyHandlerProps {
  onPolicyDetected?: () => void;
  showAlert?: boolean;
}

export function GeolocationPolicyHandler({ onPolicyDetected, showAlert = true }: GeolocationPolicyHandlerProps) {
  const [isPolicyRestricted, setIsPolicyRestricted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkGeolocationPolicy = async () => {
      try {
        if (!navigator.geolocation) {
          setIsChecking(false);
          return;
        }

        // Check permissions API if available
        if (navigator.permissions) {
          try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
            if (permissionStatus.state === 'denied') {
              setIsPolicyRestricted(true);
              onPolicyDetected?.();
            }
          } catch (error) {
            // Silently handle permissions API errors
          }
        }

        // Test geolocation with immediate timeout to detect policy blocks
        const timeoutId = setTimeout(() => {
          setIsPolicyRestricted(true);
          onPolicyDetected?.();
        }, 1000);

        navigator.geolocation.getCurrentPosition(
          () => {
            clearTimeout(timeoutId);
            setIsPolicyRestricted(false);
          },
          (error) => {
            clearTimeout(timeoutId);
            if (error.code === error.PERMISSION_DENIED && 
                error.message && error.message.includes('permissions policy')) {
              setIsPolicyRestricted(true);
              onPolicyDetected?.();
            }
          },
          { timeout: 500 }
        );

      } catch (error) {
        // Silently handle geolocation policy check errors
      } finally {
        setIsChecking(false);
      }
    };

    checkGeolocationPolicy();
  }, [onPolicyDetected]);

  if (!showAlert || isChecking || !isPolicyRestricted) {
    return null;
  }

  return (
    <Alert className="border-blue-200 bg-blue-50 mb-4">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <strong>Location Access Restricted</strong>
            <p className="text-sm mt-1">
              Location services are disabled by browser policy (common in embedded environments). 
              The application will continue to work with simulated location data for demonstration purposes.
            </p>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Hook for using geolocation policy detection
export function useGeolocationPolicy() {
  const [isPolicyRestricted, setIsPolicyRestricted] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const checkPolicy = async () => {
      try {
        if (!navigator.geolocation) {
          setIsChecked(true);
          return;
        }

        if (navigator.permissions) {
          try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
            setIsPolicyRestricted(permissionStatus.state === 'denied');
          } catch (error) {
            // Silently handle permissions API unavailable
          }
        }
      } catch (error) {
        // Silently handle geolocation policy check errors
      } finally {
        setIsChecked(true);
      }
    };

    checkPolicy();
  }, []);

  return { isPolicyRestricted, isChecked };
}