import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L, { LatLngBoundsExpression, LatLngExpression } from "leaflet";

// Fix default icon paths for Leaflet in bundlers (Vite)
const iconUrl = new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString();
const iconRetinaUrl = new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString();
const shadowUrl = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString();
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

export type GroupMemberLoc = {
  name: string;
  status: 'online' | 'offline';
  battery: number;
  lat: number;
  lng: number;
};

function FitBounds({ bounds, trigger }: { bounds: LatLngBoundsExpression, trigger: number }) {
  const map = useMap();
  useEffect(() => {
    if (!bounds) return;
    try { map.fitBounds(bounds, { padding: [30, 30] }); } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);
  return null;
}

export default function GroupLiveMap({
  members,
  safeZoneCenter,
  safeZoneRadius = 500,
  height = '16rem',
  centerTrigger = 0,
}: {
  members: GroupMemberLoc[];
  safeZoneCenter: LatLngExpression;
  safeZoneRadius?: number;
  height?: string;
  centerTrigger?: number;
}) {
  const bounds = useMemo<LatLngBoundsExpression>(() => {
    if (!members?.length) return [safeZoneCenter as [number, number], safeZoneCenter as [number, number]];
    const pts = members.map(m => [m.lat, m.lng]) as [number, number][];
    return pts.length === 1 ? [pts[0], pts[0]] : (pts as unknown as LatLngBoundsExpression);
  }, [members, safeZoneCenter]);

  return (
    <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden" style={{ height }}>
      <MapContainer center={safeZoneCenter} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {members.map((m) => (
          <Marker key={m.name} position={[m.lat, m.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{m.name}</div>
                <div>Status: {m.status}</div>
                <div>Battery: {m.battery}%</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {safeZoneCenter && (
          <Circle center={safeZoneCenter} radius={safeZoneRadius} pathOptions={{ color: 'green', fillOpacity: 0.15 }} />
        )}
        <FitBounds bounds={bounds} trigger={centerTrigger} />
      </MapContainer>
    </div>
  );
}
