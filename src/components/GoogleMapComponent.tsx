import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
// Removed unused Slider and Avatar imports
import { Alert, AlertDescription } from "./ui/alert";
import { MapPin, Shield, AlertTriangle, Search, Navigation, Layers, Satellite, Map, Route } from "lucide-react";
import { GeolocationPolicyHandler } from "./ui/geolocation-policy-handler";
import FreeMapOSM from "./FreeMapOSM";

// Google Maps configuration with proper types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
    googleMapsCallback: () => void;
  }
}

interface Tourist {
  id: string;
  name: string;
  nationality: string;
  location: { lat: number; lng: number };
  status: 'safe' | 'warning' | 'emergency';
  lastSeen: string;
  groupId?: string;
  emergencyContact: string;
  checkedIn: boolean;
}

interface GeoFence {
  id: string;
  name: string;
  type: 'safe_zone' | 'restricted_zone' | 'tourist_area' | 'emergency_zone';
  center: { lat: number; lng: number };
  radius: number;
  active: boolean;
  alertsEnabled: boolean;
}

interface GoogleMapComponentProps {
  userType: 'tourist' | 'admin' | 'business';
  userData?: any;
}

export function GoogleMapComponent({ userType }: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const userLocationRef = useRef<any>(null);
  const initializedRef = useRef<boolean>(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  // const [geoFenceRadius, setGeoFenceRadius] = useState([500]);
  // const [showNearbyPeople, setShowNearbyPeople] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  // const [selectedFence, setSelectedFence] = useState<string>("all");
  const [mapType, setMapType] = useState<string>("roadmap");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);

  // Google Maps API Key - Using Vite environment variables (no hardcoded fallback)
  const GOOGLE_MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "").trim();
  const hasValidApiKey = /^AIza[0-9A-Za-z-_]{20,}$/.test(GOOGLE_MAPS_API_KEY);

  // Sample tourists data
  const tourists: Tourist[] = [
    {
      id: "TS001234",
      name: "Sophia Clark",
      nationality: "American",
      location: { lat: 26.9124, lng: 75.7873 },
      status: "safe",
      lastSeen: "2 min ago",
      groupId: "GRP001",
      emergencyContact: "+1-555-123-4567",
      checkedIn: true
    },
    {
      id: "TS001235",
      name: "Marco Rodriguez", 
      nationality: "Spanish",
      location: { lat: 26.9164, lng: 75.7903 },
      status: "safe",
      lastSeen: "5 min ago",
      groupId: "GRP001",
      emergencyContact: "+34-666-789-012",
      checkedIn: true
    },
    {
      id: "TS001236",
      name: "Yuki Tanaka",
      nationality: "Japanese", 
      location: { lat: 26.9104, lng: 75.7843 },
      status: "warning",
      lastSeen: "15 min ago",
      emergencyContact: "+81-90-1234-5678",
      checkedIn: false
    },
    {
      id: "TS001237",
      name: "Emma Thompson",
      nationality: "British", 
      location: { lat: 26.9080, lng: 75.7820 },
      status: "emergency",
      lastSeen: "45 min ago",
      emergencyContact: "+44-789-123-456",
      checkedIn: true
    }
  ];

  // Geo-fences configuration
  const geoFences: GeoFence[] = [
    {
      id: "GF001",
      name: "City Palace Safe Zone",
      type: "safe_zone",
      center: { lat: 26.9124, lng: 75.7873 },
      radius: 300,
      active: true,
      alertsEnabled: true
    },
    {
      id: "GF002",
      name: "Amber Fort Tourist Area",
      type: "tourist_area",
      center: { lat: 26.9855, lng: 75.8513 },
      radius: 500,
      active: true,
      alertsEnabled: true
    },
    {
      id: "GF003",
      name: "Restricted Military Zone",
      type: "restricted_zone",
      center: { lat: 26.9000, lng: 75.7900 },
      radius: 200,
      active: true,
      alertsEnabled: true
    },
    {
      id: "GF004",
      name: "Emergency Services Hub",
      type: "emergency_zone",
      center: { lat: 26.9200, lng: 75.7950 },
      radius: 150,
      active: true,
      alertsEnabled: true
    }
  ];

  // Load Google Maps script with proper async loading
  useEffect(() => {
    let isMounted = true;
    
    // Check if we have a valid API key
    if (!hasValidApiKey) {
      if (isMounted) {
        setMapError("Google Maps API key not configured. Using demo mode with simulated data.");
        setIsMapLoaded(true); // Set as loaded to show the demo interface
      }
      return;
    }
    
    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        if (isMounted && !initializedRef.current) {
          initializedRef.current = true;
          initializeMap();
        }
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        const handleLoad = () => {
          if (isMounted && !initializedRef.current) {
            initializedRef.current = true;
            initializeMap();
          }
        };
        existingScript.addEventListener('load', handleLoad);
        return () => {
          existingScript.removeEventListener('load', handleLoad);
        };
      }

      // Create and load the script asynchronously
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=marker,places&loading=async&callback=googleMapsCallback`;
      script.async = true;
      script.defer = true;
      
      script.onerror = (_error) => {
        if (isMounted) {
          setMapError("Failed to load Google Maps. Please check your API key and internet connection.");
        }
      };

      // Set up callback
      window.googleMapsCallback = () => {
        try {
          if (isMounted && !initializedRef.current) {
            initializedRef.current = true;
            initializeMap();
          }
        } catch (error) {
          if (isMounted) {
            setMapError("Failed to initialize Google Maps.");
          }
        }
      };

      // Also initialize on script load as a fallback if callback doesn't fire
      script.addEventListener('load', () => {
        if (isMounted && !initializedRef.current) {
          initializedRef.current = true;
          initializeMap();
        }
      });

      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      isMounted = false;
      // Cleanup
      try {
        if ('googleMapsCallback' in window) {
          delete (window as any).googleMapsCallback;
        }
        
        // Clean up markers safely - only if they exist and have a valid parent
        if (userLocationRef.current) {
          try {
            if (userLocationRef.current.setMap && typeof userLocationRef.current.setMap === 'function') {
              userLocationRef.current.setMap(null);
            }
          } catch (e) {
            // Silently handle marker cleanup errors
          }
          userLocationRef.current = null;
        }
        
        // Clear map reference
        if (googleMapRef.current) {
          googleMapRef.current = null;
        }
      } catch (error) {
        // Silently handle cleanup errors
      }
    };
  }, []);

  // Initialize Google Map
  const initializeMap = useCallback(() => {
    if (!hasValidApiKey) {
      // Skip initialization if no valid API key
      return;
    }
    
    if (!mapRef.current || !window.google || !window.google.maps) {
      return;
    }

    try {
      // Default center (Jaipur, India)
      const defaultCenter = { lat: 26.9124, lng: 75.7873 };

      const mapConfig: any = {
        zoom: 13,
        center: defaultCenter,
        mapTypeId: mapType,
        gestureHandling: 'cooperative',
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true
      };

      // Add mapId only if AdvancedMarkerElement is available
      if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
        mapConfig.mapId = 'TRAVEL_SAFE_MAP';
      }

      const map = new window.google.maps.Map(mapRef.current, mapConfig);

      googleMapRef.current = map;

      // Get user's current location
      getCurrentLocation(map);

      // Add geo-fences
      addGeoFences(map);

      // Add tourist markers
      addTouristMarkers(map);

      // Search for nearby places using new Places API
      searchNearbyPlaces(map, defaultCenter);

      setIsMapLoaded(true);
      setMapError(null);

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError("Failed to initialize Google Maps. Please refresh the page.");
    }
  }, [mapType]);

  // Get user's current location
  const getCurrentLocation = (map: any) => {
    if (!navigator.geolocation) {
      // Silently fallback to default location without displaying error
      const defaultCenter = { lat: 26.9124, lng: 75.7873 };
      searchNearbyPlaces(map, defaultCenter);
      return;
    }

    // Check if geolocation is blocked by permissions policy
    try {
      if (navigator.permissions) {
        navigator.permissions.query({name: 'geolocation'}).then((permissionStatus) => {
          if (permissionStatus.state === 'denied') {
            // Silently use default location without error messages
            const defaultCenter = { lat: 26.9124, lng: 75.7873 };
            searchNearbyPlaces(map, defaultCenter);
            return;
          }
          // Proceed with geolocation request
          requestUserLocation(map);
        }).catch(() => {
          // Permissions API not supported, try direct geolocation
          requestUserLocation(map);
        });
      } else {
        // Permissions API not available, try direct geolocation
        requestUserLocation(map);
      }
    } catch (error) {
      // Permissions API not available, try direct geolocation
      requestUserLocation(map);
    }
  };

  const requestUserLocation = (map: any) => {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          setUserLocation(userPos);

          // Create user location marker with AdvancedMarkerElement support
          let userMarker;
          
          if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
            // Use AdvancedMarkerElement if available
            const markerElement = document.createElement('div');
            markerElement.innerHTML = `
              <div style="
                width: 24px; 
                height: 24px; 
                background: #3B82F6; 
                border: 3px solid white; 
                border-radius: 50%; 
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                position: relative;
              ">
                <div style="
                  width: 8px; 
                  height: 8px; 
                  background: white; 
                  border-radius: 50%; 
                  position: absolute; 
                  top: 50%; 
                  left: 50%; 
                  transform: translate(-50%, -50%);
                "></div>
              </div>
            `;

            userMarker = new window.google.maps.marker.AdvancedMarkerElement({
              map: map,
              position: userPos,
              title: 'Your Location',
              content: markerElement
            });
          } else {
            // Fallback to standard Marker
            userMarker = new window.google.maps.Marker({
              position: userPos,
              map: map,
              title: 'Your Location',
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: '#3B82F6',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3
              },
              animation: window.google.maps.Animation.DROP
            });
          }

          userLocationRef.current = userMarker;

          // Center map on user location
          map.setCenter(userPos);

          // Create info window for user
          const userInfoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 5px 0; color: #1f2937;">📍 Your Current Location</h3>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                  Lat: ${userPos.lat.toFixed(6)}<br/>
                  Lng: ${userPos.lng.toFixed(6)}<br/>
                  <strong>Real-time GPS tracking active</strong>
                </p>
              </div>
            `
          });

          // Add click listener with error handling
          try {
            userMarker.addListener('click', () => {
              userInfoWindow.open(map, userMarker);
            });
          } catch (error) {
            // Silently handle listener errors
          }

          // Search for nearby places around user location
          searchNearbyPlaces(map, userPos);

        } catch (error) {
          console.error('Error creating user location marker:', error);
        }
      },
      (_error) => {
        // Silently handle geolocation errors and use default location
        // No console warnings to prevent React error boundary triggering
        const defaultCenter = { lat: 26.9124, lng: 75.7873 };
        searchNearbyPlaces(map, defaultCenter);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Search for nearby places using new Places API
  const searchNearbyPlaces = async (map: any, location: { lat: number; lng: number }) => {
    try {
      // Mock nearby places data since the new Places API requires different setup
      const mockPlaces = [
        {
          name: "City Palace",
          vicinity: "Jaipur, Rajasthan",
          rating: 4.5,
          types: ['tourist_attraction'],
          geometry: {
            location: { lat: location.lat + 0.001, lng: location.lng + 0.001 }
          }
        },
        {
          name: "Civil Hospital",
          vicinity: "Jaipur, Rajasthan", 
          rating: 4.0,
          types: ['hospital'],
          geometry: {
            location: { lat: location.lat - 0.002, lng: location.lng + 0.001 }
          }
        },
        {
          name: "Police Station",
          vicinity: "Jaipur, Rajasthan",
          rating: 3.8,
          types: ['police'],
          geometry: {
            location: { lat: location.lat + 0.002, lng: location.lng - 0.001 }
          }
        },
        {
          name: "Hotel Heritage",
          vicinity: "Jaipur, Rajasthan",
          rating: 4.2,
          types: ['lodging'],
          geometry: {
            location: { lat: location.lat - 0.001, lng: location.lng - 0.002 }
          }
        },
        {
          name: "Rajasthani Restaurant",
          vicinity: "Jaipur, Rajasthan",
          rating: 4.3,
          types: ['restaurant'],
          geometry: {
            location: { lat: location.lat + 0.003, lng: location.lng + 0.002 }
          }
        }
      ];

      setNearbyPlaces(mockPlaces);

      // Add markers for places with AdvancedMarkerElement support
      mockPlaces.forEach((place: any) => {
        if (place.geometry && place.geometry.location) {
          try {
            const iconColor = getPlaceIconColor(place.types);
            let marker;

            if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
              // Use AdvancedMarkerElement if available
              const markerElement = document.createElement('div');
              markerElement.innerHTML = `
                <div style="
                  width: 20px; 
                  height: 20px; 
                  background: ${iconColor}; 
                  border: 2px solid white; 
                  border-radius: 50%; 
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  color: white;
                  font-weight: bold;
                ">
                  ${getPlaceIcon(place.types)}
                </div>
              `;

              marker = new window.google.maps.marker.AdvancedMarkerElement({
                map: map,
                position: place.geometry.location,
                title: place.name,
                content: markerElement
              });
            } else {
              // Fallback to standard Marker
              marker = new window.google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: iconColor,
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2
                }
              });
            }

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <h4 style="margin: 0 0 5px 0;">${getPlaceIcon(place.types)} ${place.name}</h4>
                  <p style="margin: 0; font-size: 12px; color: #666;">
                    ${place.vicinity}<br/>
                    Rating: ${place.rating || 'N/A'} ⭐
                  </p>
                </div>
              `
            });

            // Add click listener (works for both marker types)
            try {
              if (marker.addListener && typeof marker.addListener === 'function') {
                marker.addListener('click', () => {
                  try {
                    infoWindow.open(map, marker);
                  } catch (e) {
                    // Silently handle info window errors
                  }
                });
              }
            } catch (error) {
              // Silently handle listener errors
            }
          } catch (error) {
            console.error('Error creating place marker:', error);
          }
        }
      });

    } catch (error) {
      console.error('Error searching nearby places:', error);
      setNearbyPlaces([]);
    }
  };

  // Get place icon symbol based on type
  const getPlaceIcon = (types: string[]) => {
    if (types.includes('hospital')) return '🏥';
    if (types.includes('police')) return '🚔';
    if (types.includes('tourist_attraction')) return '🏛️';
    if (types.includes('restaurant')) return '🍽️';
    if (types.includes('lodging')) return '🏨';
    return '📍';
  };

  // Get place icon color based on type
  const getPlaceIconColor = (types: string[]) => {
    if (types.includes('hospital')) return '#ef4444';
    if (types.includes('police')) return '#3b82f6';
    if (types.includes('tourist_attraction')) return '#10b981';
    if (types.includes('restaurant')) return '#f97316';
    if (types.includes('lodging')) return '#8b5cf6';
    return '#6b7280';
  };

  // Add geo-fences to map
  const addGeoFences = (map: any) => {
    geoFences.forEach(fence => {
      const circle = new window.google.maps.Circle({
        strokeColor: getFenceColor(fence.type),
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: getFenceColor(fence.type),
        fillOpacity: 0.15,
        map: map,
        center: fence.center,
        radius: fence.radius
      });

      // Add fence label
      const fenceLabel = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h4 style="margin: 0; color: ${getFenceColor(fence.type)};">${fence.name}</h4>
            <p style="margin: 0; font-size: 12px;">
              Type: ${fence.type.replace('_', ' ')}<br/>
              Radius: ${fence.radius}m<br/>
              Status: ${fence.active ? 'Active' : 'Inactive'}
            </p>
          </div>
        `,
        position: fence.center
      });

      try {
        circle.addListener('click', () => {
          try {
            fenceLabel.open(map);
          } catch (e) {
            // Silently handle info window errors
          }
        });
      } catch (error) {
        // Silently handle listener errors
      }
    });
  };

  // Add tourist markers to map
  const addTouristMarkers = (map: any) => {
    const filteredTourists = filterStatus === "all" ? tourists : tourists.filter(t => t.status === filterStatus);

    filteredTourists.forEach(tourist => {
      try {
        const statusColor = getStatusColor(tourist.status);
        let marker;

        if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
          // Use AdvancedMarkerElement if available
          const markerElement = document.createElement('div');
          markerElement.innerHTML = `
            <div style="
              width: 30px; 
              height: 30px; 
              background: ${statusColor}; 
              border: 3px solid white; 
              border-radius: 50%; 
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
              font-weight: bold;
            ">
              👤
            </div>
          `;

          marker = new window.google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: tourist.location,
            title: tourist.name,
            content: markerElement
          });
        } else {
          // Fallback to standard Marker
          marker = new window.google.maps.Marker({
            position: tourist.location,
            map: map,
            title: tourist.name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 15,
              fillColor: statusColor,
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 3
            }
          });
        }

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="
                  width: 30px; 
                  height: 30px; 
                  background: ${statusColor}; 
                  border-radius: 50%; 
                  margin-right: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 14px;
                ">👤</div>
                <div>
                  <h4 style="margin: 0; color: #1f2937;">${tourist.name}</h4>
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">${tourist.nationality}</p>
                </div>
              </div>
              <div style="font-size: 12px; color: #374151;">
                <p style="margin: 2px 0;"><strong>Status:</strong> <span style="color: ${statusColor};">${tourist.status.toUpperCase()}</span></p>
                <p style="margin: 2px 0;"><strong>Last Seen:</strong> ${tourist.lastSeen}</p>
                <p style="margin: 2px 0;"><strong>Check-in:</strong> ${tourist.checkedIn ? '✅ Active' : '❌ Overdue'}</p>
                ${userType === 'admin' ? `<p style="margin: 2px 0;"><strong>Emergency:</strong> ${tourist.emergencyContact}</p>` : ''}
              </div>
            </div>
          `
        });

        // Add click listener (works for both marker types)
        try {
          if (marker.addListener && typeof marker.addListener === 'function') {
            marker.addListener('click', () => {
              try {
                infoWindow.open(map, marker);
                setSelectedTourist(tourist);
              } catch (e) {
                // Silently handle info window errors
              }
            });
          }
        } catch (error) {
          // Silently handle listener errors
        }
      } catch (error) {
        console.error('Error creating tourist marker:', error);
      }
    });
  };

  // Get fence color based on type
  const getFenceColor = (type: string) => {
    switch (type) {
      case 'safe_zone': return '#10b981';
      case 'restricted_zone': return '#ef4444';
      case 'tourist_area': return '#3b82f6';
      case 'emergency_zone': return '#f59e0b';
      default: return '#6b7280';
    }
  };



  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'emergency': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Handle map type change
  const handleMapTypeChange = (newType: string) => {
    setMapType(newType);
    if (googleMapRef.current) {
      googleMapRef.current.setMapTypeId(newType);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (!googleMapRef.current || !searchQuery || !window.google || !hasValidApiKey) return;

    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchQuery }, (results: any[], status: any) => {
        try {
          if (status === 'OK' && results && results[0] && results[0].geometry) {
            googleMapRef.current.setCenter(results[0].geometry.location);
            googleMapRef.current.setZoom(15);
            
            new window.google.maps.Marker({
              map: googleMapRef.current,
              position: results[0].geometry.location,
              title: searchQuery
            });
          }
        } catch (error) {
          // Silently handle geocoding result errors
        }
      });
    } catch (error) {
      // Silently handle geocoding errors
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            🗺️ Google Maps Integration - Real Location Tracking
          </h1>
          <p className="text-gray-600">
            Live GPS tracking with Google Maps, real-time geo-fencing, and environmental monitoring
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge className="bg-green-100 text-green-800">
            <Navigation className="w-3 h-3 mr-1" />
            Live GPS Active
          </Badge>
          {userType === 'admin' && (
            <Badge className="bg-blue-100 text-blue-800">
              <Shield className="w-3 h-3 mr-1" />
              {tourists.length} Tourists Tracked
            </Badge>
          )}
        </div>
      </div>

      <GeolocationPolicyHandler 
        showAlert={false}
        onPolicyDetected={() => {
          // Silently handle policy detection without console logs
        }}
      />

      {mapError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {mapError}
            {mapError.includes('API key') && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                <strong>Setup Instructions:</strong>
                <ol className="mt-1 ml-4 space-y-1 list-decimal">
                  <li>Get a Google Maps API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Cloud Console</a></li>
                  <li>Enable Maps JavaScript API and Places API</li>
                  <li>Open your <code>.env</code> and set <code>VITE_GOOGLE_MAPS_API_KEY=YOUR_REAL_KEY</code> (then restart the dev server)</li>
                  <li>Add billing information to your Google Cloud account</li>
                </ol>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Map className="w-5 h-5" />
                  <span>Live Google Maps</span>
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Input
                      placeholder="Search location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-40"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button variant="outline" size="sm" onClick={handleSearch}>
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Select value={mapType} onValueChange={handleMapTypeChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="roadmap">
                        <div className="flex items-center">
                          <Map className="w-4 h-4 mr-2" />
                          Road
                        </div>
                      </SelectItem>
                      <SelectItem value="satellite">
                        <div className="flex items-center">
                          <Satellite className="w-4 h-4 mr-2" />
                          Satellite
                        </div>
                      </SelectItem>
                      <SelectItem value="hybrid">
                        <div className="flex items-center">
                          <Layers className="w-4 h-4 mr-2" />
                          Hybrid
                        </div>
                      </SelectItem>
                      <SelectItem value="terrain">
                        <div className="flex items-center">
                          <Route className="w-4 h-4 mr-2" />
                          Terrain
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div 
                ref={mapRef}
                className="w-full h-[500px] bg-gray-100 rounded-lg"
              >
                {!isMapLoaded && !mapError && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Navigation className="w-8 h-8 mx-auto text-gray-400 animate-spin mb-2" />
                      <p className="text-gray-600">Loading Google Maps...</p>
                    </div>
                  </div>
                )}
                {mapError && (
                  <div className="h-full w-full">
                    <div className="p-4 w-full">
                      <div className="mb-4 w-full">
                        <FreeMapOSM />
                      </div>
                      {!hasValidApiKey && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                          <h4 className="font-semibold text-blue-900 mb-2">Enable Google Maps (optional):</h4>
                          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                            <li>Get a Google Maps API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                            <li>Enable Maps JavaScript API and Places API</li>
                            <li>Set <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>.env</code> and restart the dev server</li>
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Real Location Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Live Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userLocation ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm">
                    <p className="font-medium text-green-800">📍 GPS Location Active</p>
                    <p className="text-green-600 mt-1">
                      Lat: {userLocation.lat.toFixed(6)}<br/>
                      Lng: {userLocation.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">📍 Requesting location access...</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-600">{nearbyPlaces.length}</div>
                  <div className="text-xs text-blue-700">Nearby Places</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-semibold text-green-600">{geoFences.filter(f => f.active).length}</div>
                  <div className="text-xs text-green-700">Active Fences</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Filter Tourists</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="safe">Safe</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Nearby Places */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Navigation className="w-5 h-5" />
                <span>Nearby Places</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-60 overflow-y-auto">
              {nearbyPlaces.slice(0, 5).map((place, index) => (
                <div key={index} className="p-2 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{place.name}</p>
                      <p className="text-xs text-gray-600">{place.vicinity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{place.rating && `⭐ ${place.rating}`}</p>
                      <Badge variant="secondary" className="text-xs">
                        {place.types[0]?.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Geo-fence Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Geo-Fences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {geoFences.map(fence => (
                <div key={fence.id} className="p-2 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{fence.name}</p>
                      <p className="text-xs text-gray-600">{fence.radius}m radius</p>
                    </div>
                    <Badge 
                      variant={fence.active ? "default" : "secondary"}
                      style={{ backgroundColor: fence.active ? getFenceColor(fence.type) : undefined }}
                    >
                      {fence.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Tourist Details */}
      {selectedTourist && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tourist Details: {selectedTourist.name}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedTourist(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Personal Information</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Tourist ID:</strong> {selectedTourist.id}</p>
                  <p><strong>Nationality:</strong> {selectedTourist.nationality}</p>
                  <p><strong>Status:</strong> <span style={{ color: getStatusColor(selectedTourist.status) }}>{selectedTourist.status.toUpperCase()}</span></p>
                  <p><strong>Last Seen:</strong> {selectedTourist.lastSeen}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Real-time Location</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>GPS Coordinates:</strong></p>
                  <p>Lat: {selectedTourist.location.lat.toFixed(6)}</p>
                  <p>Lng: {selectedTourist.location.lng.toFixed(6)}</p>
                  <p><strong>Check-in:</strong> {selectedTourist.checkedIn ? '✅ Active' : '❌ Overdue'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Emergency Actions</h4>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Contact:</strong> {selectedTourist.emergencyContact}</p>
                  {userType === 'admin' && (
                    <div className="space-y-2">
                      <Button size="sm" className="w-full">
                        <Navigation className="w-4 h-4 mr-2" />
                        Track on Map
                      </Button>
                      {selectedTourist.status === 'emergency' && (
                        <Button size="sm" variant="destructive" className="w-full">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Dispatch Emergency
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}