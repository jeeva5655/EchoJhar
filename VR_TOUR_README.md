# 🥽 Immersive VR Tour - Tamil Nadu Destinations

## Features

### ✨ Realistic 360° Panoramas
- **Meenakshi Amman Temple, Madurai** - Ancient Dravidian architecture
- **Marina Beach, Chennai** - World's 2nd longest urban beach
- **Ooty Hill Station** - Queen of the Nilgiris
- **Ramanathaswamy Temple** - Sacred pilgrimage site
- **Kodaikanal Lake** - Star-shaped hill station lake

### 🎯 Interactive Elements
- **Click & Drag** to look around (360° view)
- **Interactive Hotspots** - Glowing markers with information
- **Smooth Navigation** - Switch between destinations
- **Mobile Support** - Works on phones, tablets, desktop
- **VR Headset Ready** - Compatible with WebXR devices

### 🎨 Premium UI
- Glass-morphism design
- Smooth transitions
- Destination thumbnails
-Real-time hotspot info panels

## Usage

### Navigate to VR Tour
```
https://your-app.vercel.app/vr-tour
```

### Controls
- **Mouse/Touch**: Drag to rotate view
- **Zoom**: Scroll wheel or pinch
- **Hotspots**: Click glowing orbs for info
- **Navigation**: Use Previous/Next buttons
- **Thumbnails**: Click sidebar icons to jump to destinations

## Integration

The VR Tour is integrated into your main app at `/vr-tour` route.

### Add Navigation Link
```tsx
<Link to="/vr-tour">
  🥽 Experience Virtual Tour
</Link>
```

## Customization

### Add More Destinations
Edit `src/components/VRTour.tsx`:

```typescript
const destinations = [
  {
    id: 'your-destination',
    name: 'Destination Name',
    description: 'Description',
    panorama: 'https://your-360-image-url.jpg',
    hotspots: [
      { position: [x, y, z], title: 'Point of Interest', info: 'Details' }
    ]
  }
];
```

### Get Real 360° Images
1. **Free Sources**:
   - Unsplash 360° collection
   - Pexels panoramic images
   - Google Street View downloads

2. **Create Your Own**:
   - Use 360° camera (Ricoh Theta, Insta360)
   - Smartphone panorama mode
   - Stitch photos with PTGui

## Technical Stack
- **React Three Fiber** - 3D rendering
- **Three.js** - WebGL engine
- **@react-three/drei** - Helpers & controls
- **WebXR API** - VR headset support

## Performance
- Optimized textures (4K max)
- Lazy loading
- Efficient rendering
- Mobile-friendly

## Future Enhancements
- [ ] Add spatial audio
- [ ] Multiplayer VR tours
- [ ] AR mode (phone camera overlay)
- [ ] Voice narration
- [ ] Quiz/gamification

---

**Built for StartupTN Hackathon 2024** 🏆
