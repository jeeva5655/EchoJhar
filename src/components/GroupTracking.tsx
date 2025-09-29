import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { getMemberCardClass, getStatusIndicatorClass, getBatteryClass, getBatteryTextClass } from "./ui/class-utils";
import { Users, MapPin, Wifi, Battery, Shield, Plus, Settings, Navigation, Clock, AlertTriangle, Map } from "lucide-react";
import GroupLiveMap, { GroupMemberLoc } from "./GroupLiveMap";

export function GroupTracking() {
  const [shareLocation, setShareLocation] = useState(true);
  const [proximityAlerts, setProximityAlerts] = useState(true);
  const [meshNetwork, setMeshNetwork] = useState(true);
  const [groupCode, setGroupCode] = useState("");

  const groupMembers = [
    {
      name: "Sophia Clark",
      status: "online",
      location: "Heritage Museum",
      distance: "0m",
      battery: 85,
      lastSeen: "now",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c7e7e9de?w=150"
    },
    {
      name: "Ethan Miller",
      status: "online",
      location: "Spice Garden Restaurant",
      distance: "150m",
      battery: 67,
      lastSeen: "2 min ago",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
    {
      name: "Olivia Carter",
      status: "offline",
      location: "Hotel Lobby",
      distance: "2.1 km",
      battery: 23,
      lastSeen: "15 min ago",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
    },
    {
      name: "James Wilson",
      status: "online",
      location: "City Park",
      distance: "320m",
      battery: 91,
      lastSeen: "1 min ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    }
  ];

  // Map members to mock coordinates around a central safe-zone (Ranchi approx)
  const safeCenter: [number, number] = [23.36, 85.33];
  const memberLocs: GroupMemberLoc[] = useMemo(() => {
    const base = safeCenter;
    const offsets = [ [0.003, 0.004], [-0.002, 0.006], [0.005, -0.003], [-0.004, -0.004] ];
    return groupMembers.map((m, i) => ({
      name: m.name,
      status: m.status as 'online' | 'offline',
      battery: m.battery,
      lat: base[0] + (offsets[i % offsets.length][0]),
      lng: base[1] + (offsets[i % offsets.length][1]),
    }));
  }, [groupMembers]);

  const [centerTrigger, setCenterTrigger] = useState(0);

  const nearbyDevices = [
    { id: "TS-001", type: "Smart Bracelet", owner: "Anonymous User", distance: "5m", signal: "Strong" },
    { id: "TS-045", type: "Safety Beacon", owner: "Tour Group #3", distance: "12m", signal: "Good" },
    { id: "TS-112", type: "Travel Tracker", owner: "Family Unit", distance: "25m", signal: "Weak" }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Group & Family Tracking</h1>
        <p className="text-gray-600">Stay connected with your travel companions and monitor group safety.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Privacy Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Privacy Controls</span>
            </CardTitle>
            <CardDescription>
              Manage your location sharing and group visibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Share Location</span>
              <Switch
                checked={shareLocation}
                onCheckedChange={setShareLocation}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Proximity Alerts</span>
              <Switch
                checked={proximityAlerts}
                onCheckedChange={setProximityAlerts}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mesh Networking</span>
              <Switch
                checked={meshNetwork}
                onCheckedChange={setMeshNetwork}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Sharing Level
              </label>
              <Select defaultValue="group-only">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private (No sharing)</SelectItem>
                  <SelectItem value="group-only">Group Members Only</SelectItem>
                  <SelectItem value="emergency-only">Emergency Contacts Only</SelectItem>
                  <SelectItem value="public">Public (Within network)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Advanced Privacy
            </Button>
          </CardContent>
        </Card>

        {/* Group Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Group Management</span>
            </CardTitle>
            <CardDescription>
              Create or join travel groups for shared tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Join Group Code
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter 6-digit code"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  maxLength={6}
                />
                <Button size="sm">Join</Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">or</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create New Group
              </Button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-1">Current Group</h4>
              <p className="text-sm text-blue-600">Family Trip - Code: TSG847</p>
              <p className="text-xs text-blue-600">4 active members</p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Group Features</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Real-time location sharing</li>
                <li>• Automatic proximity alerts</li>
                <li>• Group chat messaging</li>
                <li>• Shared itinerary access</li>
                <li>• Emergency group alerts</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Mesh Network Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="w-5 h-5 text-purple-600" />
              <span>Mesh Network</span>
            </CardTitle>
            <CardDescription>
              Peer-to-peer connectivity for GPS-weak zones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-1">Network Status</h4>
              <p className="text-sm text-green-600">✓ Connected to mesh network</p>
              <p className="text-xs text-green-600">Signal strength: Strong</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Nearby Devices</h4>
              <div className="space-y-2">
                {nearbyDevices.map((device, index) => (
                  <div key={index} className="p-2 border border-gray-200 rounded text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{device.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {device.signal}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{device.type} - {device.distance}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-1">Coverage Area</h4>
              <p className="text-xs text-yellow-700">
                Mesh network extends 500m radius<br/>
                Works offline in GPS-weak zones
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Group Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Map className="w-5 h-5 text-blue-600" />
            <span>Live Group Map</span>
          </CardTitle>
          <CardDescription>
            Real-time visualization of group member locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GroupLiveMap 
            members={memberLocs} 
            safeZoneCenter={safeCenter} 
            safeZoneRadius={500} 
            height="16rem"
            centerTrigger={centerTrigger}
          />

          {/* Map Legend */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Offline</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 border-2 border-green-400 border-dashed rounded-full" />
                <span>Safe Zone</span>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setCenterTrigger(v => v + 1)}>
              <MapPin className="w-4 h-4 mr-2" />
              Center on Group
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Alerts */}
      {groupMembers.some(member => member.status === 'offline' && member.battery < 30) && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Group Alert:</strong> Olivia Carter has been offline for 15 minutes with low battery (23%). 
            Last known location: Hotel Lobby. Consider checking on her status.
          </AlertDescription>
        </Alert>
      )}

      {/* Group Members Live Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-orange-600" />
            <span>Real-Time Group Tracking</span>
          </CardTitle>
          <CardDescription>
            Live location and status of all group members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {groupMembers.map((member, index) => (
              <div key={index} className={getMemberCardClass(member.status)}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className={getStatusIndicatorClass(member.status)}></div>
                    {member.battery < 30 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Battery className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{member.name}</h4>
                      <Badge variant={member.status === 'online' ? 'default' : 'destructive'}>
                        {member.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {member.location}
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <Button size="sm" variant="outline" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      Locate
                    </Button>
                    {member.status === 'offline' && (
                      <Button size="sm" variant="destructive" className="text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Alert
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium">{member.distance}</div>
                    <div className="text-gray-600">Distance</div>
                  </div>
                  <div className={getBatteryClass(member.battery)}>
                    <div className={getBatteryTextClass(member.battery)}>
                      <Battery className="w-3 h-3 mr-1" />
                      {member.battery}%
                    </div>
                    <div className="text-gray-600">Battery</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium flex items-center justify-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {member.lastSeen}
                    </div>
                    <div className="text-gray-600">Last seen</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}