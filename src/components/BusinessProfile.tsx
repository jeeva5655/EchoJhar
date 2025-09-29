import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { MapPin, CheckCircle2, Upload, Camera } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet default marker icons fix
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type BusinessProfileProps = {
  userData: any;
};

type Profile = {
  name: string;
  type: string;
  registrationId: string;
  contact: string;
  upiId: string;
  acceptsUPI: boolean;
  acceptsQR: boolean;
  acceptsCard: boolean;
  location: { lat: number; lng: number } | null;
  digiPin?: string;
  logo?: string; // data URL
  photos: string[]; // data URLs
  verified: boolean;
};

function LocationPicker({ value, onChange }: { value: { lat: number; lng: number } | null; onChange: (p: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return value ? <Marker position={[value.lat, value.lng]} /> : null;
}

export default function BusinessProfile({ userData }: BusinessProfileProps) {
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem("business_profile");
    if (saved) return JSON.parse(saved);
    return {
      name: userData?.name || "",
      type: userData?.sector || "handicrafts",
      registrationId: userData?.registrationId || "",
      contact: userData?.contact || "",
      upiId: "",
      acceptsUPI: true,
      acceptsQR: true,
      acceptsCard: false,
      location: null,
      digiPin: "",
      logo: undefined,
      photos: [],
      verified: !!userData?.digitalIdVerified,
    };
  });

  useEffect(() => {
    localStorage.setItem("business_profile", JSON.stringify(profile));
  }, [profile]);

  const canSave = useMemo(() => profile.name && profile.type && profile.registrationId, [profile]);

  function handleFileToDataUrl(file: File, cb: (dataUrl: string) => void) {
    const reader = new FileReader();
    reader.onload = () => cb(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
          <p className="text-gray-600">Manage your business identity, contact, payments and DigiPin</p>
        </div>
        <div className="flex items-center gap-2">
          {profile.verified ? (
            <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-4 h-4 mr-1" /> Verified</Badge>
          ) : (
            <Badge variant="secondary">Not Verified</Badge>
          )}
          <Button variant="outline" onClick={() => setProfile(p => ({ ...p, verified: true, digiPin: p.digiPin || `DGPIN-${Math.random().toString(36).slice(2,8).toUpperCase()}` }))}>Verify Now</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
            <CardDescription>Public information visible to tourists</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Business Name</Label>
                <Input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={profile.type} onValueChange={(v: string) => setProfile(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="handicrafts">Handicrafts</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="experience">Experiences</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Registration / GSTIN</Label>
                <Input value={profile.registrationId} onChange={e => setProfile(p => ({ ...p, registrationId: e.target.value }))} />
              </div>
              <div>
                <Label>Contact</Label>
                <Input placeholder="Phone or Email" value={profile.contact} onChange={e => setProfile(p => ({ ...p, contact: e.target.value }))} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>UPI ID</Label>
                <Input placeholder="business@upi" value={profile.upiId} onChange={e => setProfile(p => ({ ...p, upiId: e.target.value }))} />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-6 md:mt-0">
                <label className="flex items-center gap-2 text-sm"><Checkbox checked={profile.acceptsUPI} onCheckedChange={(v: boolean) => setProfile(p => ({ ...p, acceptsUPI: !!v }))} /> UPI</label>
                <label className="flex items-center gap-2 text-sm"><Checkbox checked={profile.acceptsQR} onCheckedChange={(v: boolean) => setProfile(p => ({ ...p, acceptsQR: !!v }))} /> QR</label>
                <label className="flex items-center gap-2 text-sm"><Checkbox checked={profile.acceptsCard} onCheckedChange={(v: boolean) => setProfile(p => ({ ...p, acceptsCard: !!v }))} /> Card</label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Logo and shop photos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Logo</Label>
              <div className="flex items-center gap-3 mt-2">
                <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer">
                  <Upload className="w-4 h-4" /> Upload
                  <input hidden type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileToDataUrl(file, data => setProfile(p => ({ ...p, logo: data })));
                  }} />
                </label>
                {profile.logo && <img src={profile.logo} alt="logo" className="h-10 w-10 rounded" />}
              </div>
            </div>
            <div>
              <Label>Shop/Product Photos</Label>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer">
                  <Camera className="w-4 h-4" /> Add Photo
                  <input hidden type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileToDataUrl(file, data => setProfile(p => ({ ...p, photos: [...p.photos, data] })));
                  }} />
                </label>
                {profile.photos.map((p, i) => (
                  <img key={i} src={p} className="h-12 w-12 object-cover rounded" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Location & DigiPin</CardTitle>
          <CardDescription>Tap on the map to set your shop location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full h-64 rounded overflow-hidden">
            <MapContainer center={(profile.location ? [profile.location.lat, profile.location.lng] : [23.3441, 85.3096]) as LatLngExpression} zoom={13} style={{ width: '100%', height: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
              <LocationPicker value={profile.location} onChange={(pt) => setProfile(p => ({ ...p, location: pt }))} />
            </MapContainer>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Latitude</Label>
              <Input readOnly value={profile.location?.lat ?? ""} />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input readOnly value={profile.location?.lng ?? ""} />
            </div>
            <div>
              <Label>DigiPin</Label>
              <Input readOnly value={profile.digiPin || "Not Assigned"} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Your changes are auto-saved locally</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => { localStorage.removeItem("business_profile"); window.location.reload(); }}>Reset</Button>
          <Button disabled={!canSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}
