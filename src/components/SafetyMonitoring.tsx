import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { AlertTriangle, Shield, MapPin, Zap, Wind, Thermometer, Siren, Phone, Navigation } from "lucide-react";

export function SafetyMonitoring() {
  const [geoFencingEnabled, setGeoFencingEnabled] = useState(true);
  const [panicMode, setPanicMode] = useState(false);
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(true);

  const handlePanicButton = () => {
    setPanicMode(true);
    // Trigger panic protocols
    alert("🚨 PANIC BUTTON ACTIVATED\n\n✓ Loud alarm triggered\n✓ Location sent to emergency contacts\n✓ Emergency services notified\n✓ Medical info displayed for bystanders");
  };

  const environmentalAlerts = [
    { type: "Air Quality", status: "Good", color: "green", icon: Wind, value: "AQI: 45" },
    { type: "Temperature", status: "Normal", color: "blue", icon: Thermometer, value: "24°C" },
    { type: "Weather", status: "Clear", color: "green", icon: Navigation, value: "No alerts" },
    { type: "Seismic", status: "Stable", color: "green", icon: Zap, value: "No activity" }
  ];

  const riskZones = [
    { name: "Construction Zone - MG Road", level: "Medium", distance: "2.1 km", warning: "Heavy machinery active" },
    { name: "Flood-prone Area - River Bank", level: "High", distance: "5.3 km", warning: "Avoid during monsoon" },
    { name: "Landslide Zone - Hill Station", level: "Medium", distance: "8.7 km", warning: "Recent rainfall warnings" }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Safety Monitoring Center</h1>
        <p className="text-muted-foreground">Real-time safety monitoring and emergency response system.</p>
      </div>

      {/* Panic Button - Prominent */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <Button
            size="lg"
            className={`w-32 h-32 rounded-full text-white font-bold text-lg ${
              panicMode ? 'bg-red-800 animate-pulse' : 'bg-red-600 hover:bg-red-700'
            }`}
            onClick={handlePanicButton}
          >
            <div className="flex flex-col items-center">
              <Siren className="w-8 h-8 mb-2" />
              <span>PANIC</span>
              <span className="text-sm">BUTTON</span>
            </div>
          </Button>
          <p className="text-sm text-red-700 mt-4">
            Emergency activation: Triggers alarm, sends location to contacts & emergency services
          </p>
        </CardContent>
      </Card>

      {panicMode && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            🚨 PANIC MODE ACTIVE - Emergency services have been notified. Help is on the way.
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4 text-red-600 border-red-600"
              onClick={() => setPanicMode(false)}
            >
              Deactivate
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Geo-Fencing & Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Geo-Fencing Alerts</span>
            </CardTitle>
            <CardDescription>
              Automatic alerts when entering restricted or high-risk zones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Geo-Fencing Active</span>
              <Switch
                checked={geoFencingEnabled}
                onCheckedChange={setGeoFencingEnabled}
              />
            </div>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                ✓ Currently in safe zone: Tourist District, Jaipur
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Nearby Risk Zones</h4>
              {riskZones.map((zone, index) => (
                <div key={index} className="p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{zone.name}</span>
                    <Badge variant={zone.level === "High" ? "destructive" : "secondary"}>
                      {zone.level} Risk
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{zone.distance} away</p>
                  <p className="text-xs text-orange-600">{zone.warning}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Environmental Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wind className="w-5 h-5 text-green-600" />
              <span>Environmental Monitoring</span>
            </CardTitle>
            <CardDescription>
              Real-time environmental conditions and hazard alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {environmentalAlerts.map((alert, index) => {
                const Icon = alert.icon;
                return (
                  <div key={index} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className={`w-4 h-4 text-${alert.color}-600`} />
                      <span className="text-sm font-medium">{alert.type}</span>
                    </div>
                    <p className={`text-xs text-${alert.color}-600 font-medium`}>{alert.status}</p>
                    <p className="text-xs text-muted-foreground">{alert.value}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-purple-600" />
              <span>Activity Monitoring</span>
            </CardTitle>
            <CardDescription>
              Automated wellness checks and anomaly detection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auto Wellness Check</span>
              <Switch
                checked={autoCheckEnabled}
                onCheckedChange={setAutoCheckEnabled}
              />
            </div>

            <Alert>
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ✓ Last movement detected: 2 minutes ago<br/>
                ✓ Following planned route<br/>
                ✓ No anomalies detected
              </AlertDescription>
            </Alert>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Inactive Check Settings</h4>
              <p className="text-sm text-blue-600">
                • Wellness check after 30 minutes of inactivity<br/>
                • Emergency alert after 60 minutes of no response<br/>
                • Auto-notification to emergency contacts
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Broadcasting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Siren className="w-5 h-5 text-red-600" />
              <span>Emergency Communications</span>
            </CardTitle>
            <CardDescription>
              Emergency alerts and communication channels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Siren className="h-4 w-4" />
              <AlertDescription>
                📻 FM Emergency Frequency: 107.8 MHz (Active)
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Emergency Services: 112
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Tourist Helpline: 1363
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Medical Emergency: 108
              </Button>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-1">Active Alerts</h4>
              <p className="text-sm text-yellow-700">
                ⚠️ Heavy rainfall expected in hill areas after 6 PM<br/>
                ℹ️ Festival procession - expect traffic delays in city center
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}