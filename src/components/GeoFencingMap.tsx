import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MapPin, Users, Shield, AlertTriangle, Search, Navigation, Radio } from "lucide-react";
import { MapContainer, TileLayer, Marker, Circle, Tooltip, useMap } from "react-leaflet";
import L, { LatLngBoundsExpression } from "leaflet";
import 'leaflet/dist/leaflet.css';

// Fix default icon paths for Leaflet in bundlers (Vite)
const iconUrl = new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString();
const iconRetinaUrl = new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString();
const shadowUrl = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString();
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

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
  type: 'safe_zone' | 'restricted_zone' | 'tourist_area';
  center: { lat: number; lng: number };
  radius: number;
  active: boolean;
  alertsEnabled: boolean;
}

interface GeoFencingMapProps {
  userType: 'tourist' | 'admin';
  userData: any;
}

function FitBounds({ points, trigger }: { points: [number, number][], trigger: any }) {
  const map = useMap();
  useMemo(() => {
    if (!points || points.length === 0) return;
    try {
      const bounds: LatLngBoundsExpression = points.length === 1 ? [points[0], points[0]] : (points as unknown as LatLngBoundsExpression);
      map.fitBounds(bounds, { padding: [30, 30] });
    } catch {/* ignore */}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, points?.length]);
  return null;
}

export function GeoFencingMap({ userType }: GeoFencingMapProps) {
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [geoFenceRadius, setGeoFenceRadius] = useState([500]);
  const [showNearbyPeople, setShowNearbyPeople] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedFence, setSelectedFence] = useState<string>("all");

  // Mock data for tourists in the area (reduced for performance)
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
    }
  ];

  // Mock geo-fences
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
    }
  ];

  const statusColors = {
    safe: 'bg-green-500',
    warning: 'bg-yellow-500', 
    emergency: 'bg-red-500'
  };

  const getStatusBadge = (status: string) => {
    if (status === 'safe') return <Badge className="bg-green-100 text-green-800">Safe</Badge>;
    if (status === 'warning') return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
    if (status === 'emergency') return <Badge className="bg-red-100 text-red-800">Emergency</Badge>;
    return <Badge variant="secondary">Unknown</Badge>;
  };

  const filteredTourists = useMemo(() => {
    if (filterStatus === "all") return tourists;
    return tourists.filter(tourist => tourist.status === filterStatus);  
  }, [filterStatus]);

  const nearbyCount = useMemo(() => filteredTourists.filter(t => t.checkedIn).length, [filteredTourists]);
  const emergencyCount = useMemo(() => tourists.filter(t => t.status === 'emergency').length, []);
  const warningCount = useMemo(() => tourists.filter(t => t.status === 'warning').length, []);

  // Compute map center (Jaipur default) and bounds points
  const defaultCenter: [number, number] = [26.9124, 75.7873];
  const fenceCenters = (selectedFence === 'all' ? geoFences : geoFences.filter(f => f.id === selectedFence))
    .map(f => [f.center.lat, f.center.lng] as [number, number]);
  const markerPoints = (showNearbyPeople ? filteredTourists : [])
    .map(t => [t.location.lat, t.location.lng] as [number, number]);
  const allPoints: [number, number][] = [...fenceCenters, ...markerPoints];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {userType === 'admin' ? '🗺️ Tourist Monitoring & Geo-Fencing' : '🗺️ Interactive Map & Location Services'}
          </h1>
          <p className="text-gray-600">
            {userType === 'admin' 
              ? 'Real-time tourist location tracking, geo-fence management, and safety monitoring'
              : 'Discover nearby attractions, find other travelers, and stay within safe zones'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge className="bg-blue-100 text-blue-800">
            <Navigation className="w-3 h-3 mr-1" />
            Live Tracking
          </Badge>
          {userType === 'admin' && (
            <Badge className="bg-red-100 text-red-800">
              <Shield className="w-3 h-3 mr-1" />
              {tourists.length} Tourists Monitored
            </Badge>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Interactive Map</span>
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search Location
                  </Button>
                  <Select value={selectedFence} onValueChange={setSelectedFence}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Zones</SelectItem>
                      {geoFences.map(fence => (
                        <SelectItem key={fence.id} value={fence.id}>
                          {fence.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="w-full h-[500px] rounded-lg overflow-hidden">
                <MapContainer center={defaultCenter} zoom={13} style={{ height: '500px', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

                  {/* Geo-fences */}
                  {(selectedFence === 'all' ? geoFences : geoFences.filter(f => f.id === selectedFence)).map(fence => (
                    <Circle key={fence.id} center={[fence.center.lat, fence.center.lng]} radius={fence.radius}
                      pathOptions={{
                        color: fence.type === 'safe_zone' ? 'green' : fence.type === 'restricted_zone' ? 'red' : 'blue',
                        fillOpacity: 0.15
                      }}
                    >
                      <Tooltip permanent direction="top" offset={[0, -10]}>
                        <span>{fence.name}</span>
                      </Tooltip>
                    </Circle>
                  ))}

                  {/* Tourist Markers */}
                  {showNearbyPeople && filteredTourists.map(tourist => (
                    <Marker key={tourist.id} position={[tourist.location.lat, tourist.location.lng]} eventHandlers={{ click: () => setSelectedTourist(tourist) }}>
                      <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent>
                        <span>{tourist.name}</span>
                      </Tooltip>
                    </Marker>
                  ))}

                  {/* Fit bounds to visible elements */}
                  <FitBounds points={allPoints.length ? allPoints : [defaultCenter]} trigger={`${selectedFence}-${filterStatus}-${showNearbyPeople}`} />
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>
                  {userType === 'admin' ? 'Tourist Status' : 'Nearby People'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-semibold text-green-600">{nearbyCount}</div>
                  <div className="text-xs text-green-700">Active</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-semibold text-yellow-600">{warningCount}</div>
                  <div className="text-xs text-yellow-700">Warnings</div>
                </div>
              </div>
              
              {userType === 'admin' && emergencyCount > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-red-700 font-medium">Emergency Alerts</span>
                    <Badge className="bg-red-100 text-red-800">{emergencyCount}</Badge>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Filter by Status</Label>
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="nearby-people"
                  checked={showNearbyPeople}
                  onCheckedChange={setShowNearbyPeople}
                />
                <Label htmlFor="nearby-people" className="text-sm">
                  Show nearby people
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Geo-fence Controls */}
          {userType === 'tourist' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Safety Zone</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Alert Radius (meters)</Label>
                  <Slider
                    value={geoFenceRadius}
                    onValueChange={setGeoFenceRadius}
                    max={1000}
                    min={100}
                    step={50}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600">{geoFenceRadius[0]}m radius</div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium">Currently in safe zone</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    You are within the designated tourist area. Stay alert and follow local guidelines.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tourist List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{userType === 'admin' ? 'Monitored Tourists' : 'Nearby Travelers'}</span>
                <Badge variant="secondary">{filteredTourists.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-80 overflow-y-auto">
              {filteredTourists.map(tourist => (
                <div 
                  key={tourist.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTourist?.id === tourist.id ? 'border-blue-300 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTourist(tourist)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={`https://images.unsplash.com/photo-150000${parseInt(tourist.id.slice(-2))}?w=150`} />
                      <AvatarFallback>{tourist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm truncate">{tourist.name}</p>
                        <div className={`w-2 h-2 rounded-full ${statusColors[tourist.status] || 'bg-gray-500'}`} />
                      </div>
                      <p className="text-xs text-gray-600">{tourist.nationality}</p>
                      <p className="text-xs text-gray-500">{tourist.lastSeen}</p>
                    </div>
                    
                    {getStatusBadge(tourist.status)}
                  </div>
                  
                  {userType === 'admin' && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">ID: {tourist.id}</span>
                        <span className={`px-2 py-1 rounded ${tourist.checkedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {tourist.checkedIn ? 'Checked In' : 'Not Checked In'}
                        </span>
                      </div>
                    </div>
                  )}
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
                  <p><strong>Status:</strong> {getStatusBadge(selectedTourist.status)}</p>
                  <p><strong>Last Seen:</strong> {selectedTourist.lastSeen}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Location & Safety</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Coordinates:</strong> {selectedTourist.location.lat.toFixed(4)}, {selectedTourist.location.lng.toFixed(4)}</p>
                  <p><strong>Check-in Status:</strong> {selectedTourist.checkedIn ? '✅ Checked In' : '❌ Not Checked In'}</p>
                  {selectedTourist.groupId && (
                    <p><strong>Group ID:</strong> {selectedTourist.groupId}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Emergency Contact</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Contact:</strong> {selectedTourist.emergencyContact}</p>
                  {userType === 'admin' && (
                    <div className="space-y-2">
                      <Button size="sm" className="w-full">
                        <Radio className="w-4 h-4 mr-2" />
                        Contact Tourist
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