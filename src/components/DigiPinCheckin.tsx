import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CheckCircle2, XCircle, Star, Camera, MapPin, Search } from "lucide-react";

interface DigiPinCheckinProps {
  userData: any;
}

type PendingCheckin = {
  id: string;
  touristName: string;
  spot: string;
  distanceKm: number;
  photoAttached: boolean;
  purchaseAmount: number; // in INR
  time: string; // ISO
};

export function DigiPinCheckin({ userData }: DigiPinCheckinProps) {
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<PendingCheckin[]>([
    { id: "CK-101", touristName: "Alex Johnson", spot: "Rock Garden", distanceKm: 1.2, photoAttached: true, purchaseAmount: 850, time: new Date().toISOString() },
    { id: "CK-102", touristName: "Priya Sharma", spot: "Tagore Hill", distanceKm: 3.6, photoAttached: false, purchaseAmount: 0, time: new Date().toISOString() },
    { id: "CK-103", touristName: "Marco Rossi", spot: "Pahari Mandir", distanceKm: 12.4, photoAttached: true, purchaseAmount: 1200, time: new Date().toISOString() },
  ]);

  const filtered = useMemo(() => pending.filter(p =>
    p.touristName.toLowerCase().includes(query.toLowerCase()) ||
    p.id.toLowerCase().includes(query.toLowerCase()) ||
    p.spot.toLowerCase().includes(query.toLowerCase())
  ), [pending, query]);

  function computePoints(p: PendingCheckin) {
    // Distance multiplier: <2km x1, 2-10km x2, >10km x3
    const distMul = p.distanceKm < 2 ? 1 : p.distanceKm <= 10 ? 2 : 3;
    const base = 10 * distMul; // base points for check-in
    const photo = p.photoAttached ? 5 : 0; // bonus for photo
    const purchase = Math.floor(p.purchaseAmount / 250) * 2; // 2 pts per ₹250
    return base + photo + purchase;
  }

  function approve(id: string) {
    setPending(prev => prev.filter(p => p.id !== id));
  }

  function reject(id: string) {
    setPending(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DigiPin Check-ins</h1>
          <p className="text-gray-600">Verify tourist check-ins and award reward points</p>
        </div>
        <Badge variant="secondary">Vendor: {userData?.name}</Badge>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input id="search" placeholder="Search by name, ID, or spot" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
        <Button variant="outline">Export CSV</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <Card key={p.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{p.touristName}</CardTitle>
                <Badge variant="outline">{new Date(p.time).toLocaleTimeString()}</Badge>
              </div>
              <CardDescription>ID: {p.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-700"><MapPin className="w-4 h-4" /> Spot: {p.spot}</div>
                <div className="text-gray-600">Distance: {p.distanceKm.toFixed(1)} km</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-700"><Camera className={`w-4 h-4 ${p.photoAttached ? 'text-green-600' : 'text-gray-400'}`} /> Photo: {p.photoAttached ? 'Yes' : 'No'}</div>
                <div className="text-gray-600">Purchase: ₹ {p.purchaseAmount}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-yellow-600"><Star className="w-4 h-4" /> Award Points</div>
                <Badge>{computePoints(p)} pts</Badge>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button className="flex-1" onClick={() => approve(p.id)}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => reject(p.id)}>
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
