import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';

// Fix default marker icon paths for bundlers
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type FreeMapOSMProps = {
  center?: { lat: number; lng: number };
  zoom?: number;
};

export default function FreeMapOSM({ center = { lat: 26.9124, lng: 75.7873 }, zoom = 13 }: FreeMapOSMProps) {
  useEffect(() => {
    // No-op for now.
  }, []);

  const centerLatLng: LatLngExpression = [center.lat, center.lng];

  function ResizeHandler() {
    const map = useMap();
    useEffect(() => {
      const invalidate = () => {
        // Slight delay helps when container CSS transitions/layout settle
        setTimeout(() => {
          map.invalidateSize();
        }, 0);
      };
      invalidate();
      window.addEventListener('resize', invalidate);
      return () => window.removeEventListener('resize', invalidate);
    }, [map]);
    return null;
  }

  return (
    <div className="w-full min-w-0 h-[500px] rounded-lg overflow-hidden">
      <MapContainer center={centerLatLng} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <ResizeHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={centerLatLng} />
      </MapContainer>
    </div>
  );
}
