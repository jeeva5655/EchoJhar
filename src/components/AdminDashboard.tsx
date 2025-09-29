import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { GeoFencingMap } from "./GeoFencingMap";
import { 
  Search, Users, AlertTriangle, MapPin, FileText, TrendingUp, Clock, Shield, Eye, Download, 
  Radio, Phone, Navigation, Activity, UserCheck, UserX, Zap, Camera, Lock, Bell
} from "lucide-react";

interface AdminDashboardProps {
  userType: 'tourist' | 'admin';
  userData: any;
}

export function AdminDashboard({ userType, userData }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [alertFilter, setAlertFilter] = useState("all");

  // Real-time tourist monitoring data
  const touristStats = {
    totalActive: 2847,
    checkInToday: 3421,
    emergencyAlerts: 3,
    missingPersons: 1,
    safeZoneViolations: 8,
    suspiciousActivity: 2
  };

  // Hourly tourist activity data
  const activityData = [
    { hour: "00:00", active: 45, checkIns: 12, alerts: 0 },
    { hour: "02:00", active: 32, checkIns: 8, alerts: 1 },
    { hour: "04:00", active: 28, checkIns: 5, alerts: 0 },
    { hour: "06:00", active: 85, checkIns: 45, alerts: 2 },
    { hour: "08:00", active: 220, checkIns: 120, alerts: 1 },
    { hour: "10:00", active: 450, checkIns: 280, alerts: 3 },
    { hour: "12:00", active: 620, checkIns: 350, alerts: 5 },
    { hour: "14:00", active: 740, checkIns: 420, alerts: 2 },
    { hour: "16:00", active: 680, checkIns: 380, alerts: 4 },
    { hour: "18:00", active: 520, checkIns: 290, alerts: 3 },
    { hour: "20:00", active: 380, checkIns: 180, alerts: 1 },
    { hour: "22:00", active: 195, checkIns: 95, alerts: 0 }
  ];

  // Security threat levels by area
  const threatLevels = [
    { area: "City Palace", level: "Low", tourists: 245, incidents: 0, color: "#10B981" },
    { area: "Hawa Mahal", level: "Medium", tourists: 180, incidents: 2, color: "#F59E0B" },
    { area: "Amber Fort", level: "Low", tourists: 320, incidents: 1, color: "#10B981" },
    { area: "Jantar Mantar", level: "High", tourists: 95, incidents: 3, color: "#EF4444" },
    { area: "Nahargarh Fort", level: "Medium", tourists: 150, incidents: 1, color: "#F59E0B" }
  ];

  // Live tourist tracking records (reduced for performance)
  const liveTrackingData = [
    {
      id: "TS001234",
      name: "Sophia Clark",
      nationality: "American",
      location: "City Palace",
      coordinates: "26.9124°N, 75.7873°E",
      status: "Safe",
      checkIn: "09:30 AM",
      lastSeen: "2 min ago",
      groupSize: 3,
      emergencyContact: "+1-555-123-4567",
      riskLevel: "Low",
      digitalIdStatus: "Verified",
      geofenceStatus: "Within Safe Zone"
    },
    {
      id: "TS001235",
      name: "Marco Rodriguez",
      nationality: "Spanish", 
      location: "Hawa Mahal",
      coordinates: "26.9239°N, 75.8267°E",
      status: "Safe",
      checkIn: "10:15 AM",
      lastSeen: "5 min ago",
      groupSize: 2,
      emergencyContact: "+34-666-789-012", 
      riskLevel: "Low",
      digitalIdStatus: "Verified",
      geofenceStatus: "Within Tourist Area"
    }
  ];

  // Emergency alerts and incidents
  const emergencyAlerts = [
    {
      id: "EA2024001",
      type: "Missing Person",
      tourist: "David Kim",
      location: "Jantar Mantar Observatory",
      severity: "Critical",
      time: "2 hours 15 min ago",
      status: "Active Investigation",
      assignedOfficer: "Inspector Sharma",
      eFIR: "Generated",
      description: "Tourist failed to check-in after 2 hours. Last GPS location shows Jantar Mantar area."
    },
    {
      id: "EA2024002",
      type: "Panic Button",
      tourist: "Maria Santos",
      location: "Nahargarh Fort - Hill Road",
      severity: "High",
      time: "35 min ago",
      status: "Responded",
      assignedOfficer: "Constable Patel",
      eFIR: "Not Required",
      description: "Tourist activated panic button. Found safe, reported minor accident - vehicle breakdown."
    },
    {
      id: "EA2024003",
      type: "Geofence Violation",
      tourist: "Ahmed Hassan",
      location: "Restricted Military Area",
      severity: "Medium",
      time: "1 hour 20 min ago",
      status: "Resolved",
      assignedOfficer: "Head Constable Singh",
      eFIR: "Warning Issued",
      description: "Tourist entered restricted zone. Contacted and escorted to safe area. Warning documented."
    }
  ];

  // Security monitoring features
  const securityFeatures = [
    {
      title: "Real-time GPS Tracking",
      description: "Continuous location monitoring of all registered tourists",
      status: "Active",
      coverage: "99.8%"
    },
    {
      title: "Geo-fence Monitoring",
      description: "Automated alerts for safe zone violations",
      status: "Active", 
      coverage: "100%"
    },
    {
      title: "Panic Button Response",
      description: "Instant emergency response system",
      status: "Active",
      coverage: "24/7"
    },
    {
      title: "Digital ID Verification",
      description: "Blockchain-secured identity verification",
      status: "Active",
      coverage: "95.2%"
    },
    {
      title: "Suspicious Activity Detection",
      description: "AI-powered anomaly detection",
      status: "Active",
      coverage: "85.7%"
    },
    {
      title: "Emergency Communication",
      description: "Multi-channel communication system",
      status: "Active",
      coverage: "100%"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'safe') return <Badge className="bg-green-100 text-green-800">Safe</Badge>;
    if (statusLower === 'warning') return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
    if (statusLower === 'emergency') return <Badge className="bg-red-100 text-red-800">Emergency</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  const getRiskBadge = (risk: string) => {
    const riskLower = risk.toLowerCase();
    if (riskLower === 'low') return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>;
    if (riskLower === 'medium') return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
    if (riskLower === 'high') return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
    if (riskLower === 'critical') return <Badge className="bg-red-200 text-red-900">Critical Risk</Badge>;
    return <Badge variant="secondary">{risk} Risk</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            🛡️ Tourist Security Monitoring Center
          </h1>
          <p className="text-gray-600">
            Real-time monitoring, threat assessment, and emergency response for tourist safety operations
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className="bg-green-100 text-green-800">
            <Activity className="w-3 h-3 mr-1" />
            All Systems Operational
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            Officer: {userData?.name || 'Admin'}
          </Badge>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {emergencyAlerts.filter(alert => alert.severity === 'Critical').length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>CRITICAL ALERT:</strong> {emergencyAlerts.filter(alert => alert.severity === 'Critical').length} active emergency case(s) requiring immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Security Metrics */}
      <div className="grid grid-cols-6 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Active Tourists</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-2">{touristStats.totalActive.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Currently monitored</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Emergency Alerts</span>
            </div>
            <p className="text-2xl font-bold text-red-600 mt-2">{touristStats.emergencyAlerts}</p>
            <p className="text-xs text-gray-500">Active incidents</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Missing Persons</span>
            </div>
            <p className="text-2xl font-bold text-orange-600 mt-2">{touristStats.missingPersons}</p>
            <p className="text-xs text-gray-500">Under investigation</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Zone Violations</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{touristStats.safeZoneViolations}</p>
            <p className="text-xs text-gray-500">Today</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Suspicious Activity</span>
            </div>
            <p className="text-2xl font-bold text-purple-600 mt-2">{touristStats.suspiciousActivity}</p>
            <p className="text-xs text-gray-500">Under review</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Check-ins Today</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">{touristStats.checkInToday.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Digital verifications</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="live-tracking" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="live-tracking">Live Tracking</TabsTrigger>
          <TabsTrigger value="geo-map">Geo Map</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Center</TabsTrigger>
          <TabsTrigger value="analytics">Security Analytics</TabsTrigger>
          <TabsTrigger value="monitoring">System Monitor</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Live Tourist Tracking */}
        <TabsContent value="live-tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Live Tourist Tracking & Monitoring</CardTitle>
                  <CardDescription>Real-time location and status monitoring of all registered tourists</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={alertFilter} onValueChange={setAlertFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="safe">Safe</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Alert All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by Tourist ID, name, location, or coordinates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Track All
                </Button>
              </div>

              <div className="space-y-4">
                {liveTrackingData.map((tourist) => (
                  <div key={tourist.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={`https://images.unsplash.com/photo-150000${parseInt(tourist.id.slice(-2))}?w=150`} />
                          <AvatarFallback>{tourist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold">{tourist.name}</h4>
                            {getStatusBadge(tourist.status)}
                            {getRiskBadge(tourist.riskLevel)}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p><strong>ID:</strong> {tourist.id}</p>
                              <p><strong>Nationality:</strong> {tourist.nationality}</p>
                              <p><strong>Group Size:</strong> {tourist.groupSize} person(s)</p>
                            </div>
                            <div>
                              <p><strong>Check-in:</strong> {tourist.checkIn}</p>
                              <p><strong>Last Seen:</strong> {tourist.lastSeen}</p>
                              <p><strong>Digital ID:</strong> {tourist.digitalIdStatus}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm"><strong>Current Location:</strong> {tourist.location}</p>
                            <p className="text-xs text-gray-600">Coordinates: {tourist.coordinates}</p>
                            <p className="text-xs text-gray-600">Geofence Status: {tourist.geofenceStatus}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" variant="outline">
                          <MapPin className="w-4 h-4 mr-2" />
                          Track
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                        {tourist.status === 'Emergency' && (
                          <Button size="sm" variant="destructive">
                            <Zap className="w-4 h-4 mr-2" />
                            Dispatch
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interactive Geo Map */}
        <TabsContent value="geo-map" className="space-y-6">
          <GeoFencingMap userType={userType} userData={userData} />
        </TabsContent>

        {/* Emergency Response Center */}
        <TabsContent value="emergency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Emergency Response Center</span>
              </CardTitle>
              <CardDescription>Active incidents, emergency protocols, and response coordination</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="destructive">
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline">
                            {alert.type}
                          </Badge>
                          <span className="text-sm text-gray-600">{alert.time}</span>
                        </div>
                        
                        <h4 className="font-semibold text-red-800 mb-1">
                          {alert.type}: {alert.tourist}
                        </h4>
                        <p className="text-sm text-red-700 mb-2">{alert.description}</p>
                        
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div>
                            <strong>Location:</strong> {alert.location}
                          </div>
                          <div>
                            <strong>Assigned Officer:</strong> {alert.assignedOfficer}
                          </div>
                          <div>
                            <strong>e-FIR Status:</strong> {alert.eFIR}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <Badge className={alert.status === 'Active Investigation' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                          {alert.status}
                        </Badge>
                        <Button size="sm" variant="destructive">
                          <Radio className="w-4 h-4 mr-2" />
                          Respond
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Tourist Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>24-Hour Activity Analysis</CardTitle>
                <CardDescription>Tourist activity patterns and alert frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="active" stroke="#3B82F6" strokeWidth={2} name="Active Tourists" />
                    <Line type="monotone" dataKey="alerts" stroke="#EF4444" strokeWidth={2} name="Security Alerts" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Threat Level by Area */}
            <Card>
              <CardHeader>
                <CardTitle>Security Threat Assessment</CardTitle>
                <CardDescription>Risk levels and incidents by tourist areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {threatLevels.map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: area.color }} />
                        <div>
                          <p className="font-medium">{area.area}</p>
                          <p className="text-sm text-gray-600">{area.tourists} tourists present</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getRiskBadge(area.level)}
                        <p className="text-xs text-gray-600 mt-1">{area.incidents} incidents today</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Monitoring */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security System Status</span>
              </CardTitle>
              <CardDescription>Real-time monitoring of all security and safety systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{feature.title}</h4>
                      <Badge className="bg-green-100 text-green-800">
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Coverage:</span>
                      <span className="font-medium text-green-600">{feature.coverage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Reports & Documentation</CardTitle>
              <CardDescription>Generate and manage security reports, incident logs, and compliance documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center">
                  <FileText className="w-6 h-6 mb-2" />
                  Daily Security Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="w-6 h-6 mb-2" />
                  Export Tourist Data
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <AlertTriangle className="w-6 h-6 mb-2" />
                  Incident Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}