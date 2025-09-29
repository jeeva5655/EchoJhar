import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Bell, MapPin, Timer } from "lucide-react";

type POI = { id:string; name:string; lat:number; lng:number; etaMins:number };

export default function AIChatbotAlerts() {
  const [alerts, setAlerts] = useState<POI[]>([]);

  useEffect(() => {
    // Demo: mock alerts as if user is about to miss them
    setAlerts([
      { id: 'p1', name: 'Rock Garden', lat: 23.36, lng: 85.33, etaMins: 8 },
      { id: 'p2', name: 'Waterfall Vista Point', lat: 23.45, lng: 85.39, etaMins: 15 },
    ]);
  }, []);

  const nudge = (poi: POI) => {
    // Real impl: push notification or in-app prompt
    alert(`Heads up! You’re near ${poi.name}. Would you like to reroute?`);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">🔔 AI Chatbot Alerts</h1>
      </div>

      {alerts.length === 0 ? (
        <Alert>
          <AlertDescription>No upcoming points of interest to alert.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {alerts.map(a => (
            <Card key={a.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5"/> {a.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-gray-600 flex items-center gap-2"><Timer className="w-4 h-4"/> ETA: {a.etaMins} mins</div>
                <div className="text-sm text-gray-600 flex items-center gap-2"><MapPin className="w-4 h-4"/> ({a.lat.toFixed(3)}, {a.lng.toFixed(3)})</div>
                <Button size="sm" onClick={()=>nudge(a)}>Send Nudge</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
