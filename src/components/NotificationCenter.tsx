import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Bell, AlertTriangle, Info, CheckCircle, Radio, Battery, Volume2, Smartphone } from "lucide-react";

export function NotificationCenter() {
  const [safetyAlerts, setSafetyAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [batteryOptimization, setBatteryOptimization] = useState(false);
  const [fmBroadcast, setFmBroadcast] = useState(true);

  const recentAlerts = [
    {
      id: 1,
      type: "safety",
      title: "Construction Zone Alert",
      message: "Heavy machinery active on MG Road. Consider alternate route.",
      time: "5 min ago",
      priority: "medium",
      icon: AlertTriangle,
      color: "orange"
    },
    {
      id: 2,
      type: "weather",
      title: "Weather Advisory",
      message: "Heavy rainfall expected after 6 PM in hill areas.",
      time: "15 min ago",
      priority: "high",
      icon: Info,
      color: "blue"
    },
    {
      id: 3,
      type: "group",
      title: "Group Member Update",
      message: "Ethan Miller checked in at Spice Garden Restaurant.",
      time: "23 min ago",
      priority: "low",
      icon: CheckCircle,
      color: "green"
    },
    {
      id: 4,
      type: "safety",
      title: "Festival Traffic",
      message: "Cultural festival causing traffic delays in city center. Allow extra time.",
      time: "1 hour ago",
      priority: "medium",
      icon: Info,
      color: "purple"
    },
    {
      id: 5,
      type: "emergency",
      title: "Emergency Broadcast Test",
      message: "Monthly emergency system test completed successfully.",
      time: "2 hours ago",
      priority: "low",
      icon: Radio,
      color: "gray"
    }
  ];

  const activeAlerts = [
    {
      title: "Air Quality Moderate",
      description: "AQI: 87 - Sensitive individuals should consider limiting outdoor activities",
      type: "environmental"
    },
    {
      title: "High Tourist Season",
      description: "Popular attractions may have longer wait times. Plan accordingly.",
      type: "tourism"
    },
    {
      title: "Road Construction",
      description: "MG Road construction active 9 AM - 6 PM weekdays",
      type: "traffic"
    }
  ];

  const environmentalConditions = [
    { name: "Air Quality Index", value: "87 (Moderate)", status: "warning", icon: "🌫️" },
    { name: "UV Index", value: "7 (High)", status: "alert", icon: "☀️" },
    { name: "Pollen Count", value: "Low", status: "good", icon: "🌸" },
    { name: "Water Quality", value: "Safe", status: "good", icon: "💧" }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Notification Center</h1>
        <p className="text-gray-600">Manage alerts, notifications, and emergency broadcasting systems.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Alert Preferences</span>
            </CardTitle>
            <CardDescription>
              Customize which notifications you receive and how
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Safety Alerts</span>
                <p className="text-xs text-gray-600">Zone warnings, hazard alerts</p>
              </div>
              <Switch
                checked={safetyAlerts}
                onCheckedChange={setSafetyAlerts}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Weather & Environment</span>
                <p className="text-xs text-gray-600">Weather, air quality, disasters</p>
              </div>
              <Switch
                checked={weatherAlerts}
                onCheckedChange={setWeatherAlerts}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Group Notifications</span>
                <p className="text-xs text-gray-600">Group member updates, check-ins</p>
              </div>
              <Switch
                checked={groupNotifications}
                onCheckedChange={setGroupNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">FM Emergency Broadcast</span>
                <p className="text-xs text-gray-600">Auto-tune to 107.8 MHz for alerts</p>
              </div>
              <Switch
                checked={fmBroadcast}
                onCheckedChange={setFmBroadcast}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Battery Saver Mode</span>
                <p className="text-xs text-gray-600">Reduce notification frequency</p>
              </div>
              <Switch
                checked={batteryOptimization}
                onCheckedChange={setBatteryOptimization}
              />
            </div>
          </CardContent>
        </Card>

        {/* Active Broadcasting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-red-600" />
              <span>Emergency Broadcasting</span>
            </CardTitle>
            <CardDescription>
              Active emergency communication channels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Radio className="h-4 w-4" />
              <AlertDescription>
                📻 FM Emergency Frequency: 107.8 MHz - Active and monitoring
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Volume2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Audio Alerts</span>
                </div>
                <p className="text-xs text-green-600">✓ Enabled</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Push Notifications</span>
                </div>
                <p className="text-xs text-blue-600">✓ Active</p>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Multilingual Support</h4>
              <p className="text-sm text-yellow-700">
                Alerts available in: English, Hindi, Rajasthani, Gujarati, Punjabi, Bengali, Tamil, Telugu, Malayalam, Kannada
              </p>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Accessibility Features</h4>
              <p className="text-sm text-purple-700">
                • Voice alerts for visually impaired<br/>
                • Vibration patterns for hearing impaired<br/>
                • Large text notifications available
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>Recent Alerts</span>
          </CardTitle>
          <CardDescription>
            Latest safety, weather, and system notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div key={alert.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className={`w-8 h-8 bg-${alert.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 text-${alert.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm">{alert.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {alert.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Warnings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-blue-600" />
            <span>Active Warnings</span>
          </CardTitle>
          <CardDescription>
            Current active alerts and advisories in your area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {activeAlerts.map((alert, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold mb-2">{alert.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                <Badge variant="outline" className="text-xs">
                  {alert.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Environmental Conditions</span>
          </CardTitle>
          <CardDescription>
            Current environmental health indicators for your location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {environmentalConditions.map((condition, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg text-center">
                <div className="text-2xl mb-2">{condition.icon}</div>
                <h4 className="font-semibold text-sm mb-1">{condition.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{condition.value}</p>
                <Badge 
                  variant={condition.status === 'good' ? 'default' : condition.status === 'warning' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {condition.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Battery Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Battery className="w-5 h-5 text-green-600" />
            <span>Battery Optimization</span>
          </CardTitle>
          <CardDescription>
            Extend device usage during extended travel periods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Current Battery Status</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-green-600">Phone: 78%</span>
                <p className="text-xs text-green-600">~8 hours remaining</p>
              </div>
              <div>
                <span className="text-green-600">Smart Band: 45%</span>
                <p className="text-xs text-green-600">~2 days remaining</p>
              </div>
              <div>
                <span className="text-green-600">Backup Device: 67%</span>
                <p className="text-xs text-green-600">Standby mode</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Power Saving Features</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Reduce location update frequency</li>
              <li>• Essential notifications only</li>
              <li>• Dim screen brightness automatically</li>
              <li>• Activate mesh network backup</li>
              <li>• Enable low-power IoT device mode</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}