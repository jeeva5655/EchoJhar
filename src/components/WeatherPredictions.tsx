import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { MapPin, Sun, CloudRain, Cloud } from "lucide-react";

type WeatherPoint = { time: string; temperature_2m: number; precipitation_probability: number };

export default function WeatherPredictions() {
  const [coords, setCoords] = useState<{lat:number; lng:number}>({ lat: 23.36, lng: 85.33 }); // Ranchi approx
  const [hourly, setHourly] = useState<WeatherPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {/* ignore permission errors; keep default */}
      );
    }
  }, []);

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&hourly=temperature_2m,precipitation_probability&forecast_days=1&timezone=auto`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        const list: WeatherPoint[] = (d?.hourly?.time || []).map((t: string, i: number) => ({
          time: t,
          temperature_2m: d.hourly.temperature_2m?.[i] ?? 0,
          precipitation_probability: d.hourly.precipitation_probability?.[i] ?? 0,
        }));
        setHourly(list.slice(0, 12));
      })
      .catch(() => setError("Could not load weather data"));
  }, [coords]);

  const iconFor = (p: WeatherPoint) => {
    if (p.precipitation_probability >= 60) return <CloudRain className="w-5 h-5 text-blue-600"/>;
    if (p.precipitation_probability >= 20) return <Cloud className="w-5 h-5 text-gray-500"/>;
    return <Sun className="w-5 h-5 text-yellow-500"/>;
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">🌤️ Weather Predictions</h1>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <MapPin className="w-4 h-4"/> {coords.lat.toFixed(2)}, {coords.lng.toFixed(2)}
        </div>
      </div>

      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hourly.map((p) => (
          <Card key={p.time}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {iconFor(p)}
                {new Date(p.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 flex items-center justify-between">
              <div>Temp: <span className="font-medium">{p.temperature_2m}°C</span></div>
              <div>Rain: <span className="font-medium">{p.precipitation_probability}%</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
