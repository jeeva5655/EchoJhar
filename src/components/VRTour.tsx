import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

// Tamil Nadu VR Tour Destinations
const destinations = [
    {
        id: 'meenakshi',
        name: 'Meenakshi Amman Temple, Madurai',
        description: 'Ancient Dravidian architecture marvel with 14 gopurams',
        panorama: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=4096', // Meenakshi Temple
        hotspots: [
            { position: [3, 0, -2], title: 'Main Gopuram', info: '170 feet tall tower' },
            { position: [-3, 0, 2], title: 'Thousand Pillar Hall', info: '985 exquisitely carved pillars' }
        ]
    },
    {
        id: 'marina',
        name: 'Marina Beach, Chennai',
        description: "World's second-longest urban beach (13 km)",
        panorama: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=4096', // Chennai Beach
        hotspots: [
            { position: [4, -1, 0], title: 'Bay of Bengal', info: 'Pristine coastline' },
            { position: [-2, 0, 3], title: 'Lighthouse', info: 'Historic landmark since 1796' }
        ]
    },
    {
        id: 'ooty',
        name: 'Ooty - Queen of Hill Stations',
        description: 'Nilgiri Mountains at 2,240m elevation',
        panorama: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=4096', // Ooty landscape
        hotspots: [
            { position: [3, 1, -1], title: 'Tea Gardens', info: 'British-era plantations' },
            { position: [-4, 0, 0], title: 'Nilgiri Railway', info: 'UNESCO World Heritage' }
        ]
    },
    {
        id: 'rameswaram',
        name: 'Ramanathaswamy Temple, Rameswaram',
        description: 'Sacred pilgrimage site with longest temple corridor',
        panorama: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=4096', // Temple
        hotspots: [
            { position: [2, 0, -4], title: 'Sacred Corridor', info: '1220 meters long' },
            { position: [-3, -1, 1], title: 'Holy Waters', info: '22 sacred wells' }
        ]
    },
    {
        id: 'kodaikanal',
        name: 'Kodaikanal Lake',
        description: 'Star-shaped artificial lake in the hills',
        panorama: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=4096', // Lake
        hotspots: [
            { position: [4, 0, -1], title: 'Boat House', info: 'Pedal & row boats' },
            { position: [-2, 1, 3], title: 'Coakers Walk', info: 'Panoramic valley views' }
        ]
    }
];

// 360° Panorama Sphere Component
function PanoramaSphere({ imageUrl }: { imageUrl: string }) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl);

    return (
        <Sphere args={[500, 60, 40]} scale={[-1, 1, 1]}>
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </Sphere>
    );
}

// Interactive Hotspot Component
function Hotspot({
    position,
    title,
    info,
    onClick
}: {
    position: [number, number, number];
    title: string;
    info: string;
    onClick: () => void;
}) {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={onClick}
            >
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                    color={hovered ? '#00ff00' : '#ffffff'}
                    emissive={hovered ? '#00ff00' : '#0066ff'}
                    emissiveIntensity={hovered ? 1 : 0.5}
                />
            </mesh>

            {hovered && (
                <Html center>
                    <div className="bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                        <h4 className="font-bold text-sm">{title}</h4>
                        <p className="text-xs mt-1">{info}</p>
                    </div>
                </Html>
            )}
        </group>
    );
}

// Main VR Scene Component
function VRScene({
    destination,
    onHotspotClick
}: {
    destination: typeof destinations[0];
    onHotspotClick: (hotspot: any) => void;
}) {
    return (
        <>
            <PanoramaSphere imageUrl={destination.panorama} />

            {/* Hotspots */}
            {destination.hotspots.map((hotspot, index) => (
                <Hotspot
                    key={index}
                    position={hotspot.position as [number, number, number]}
                    title={hotspot.title}
                    info={hotspot.info}
                    onClick={() => onHotspotClick(hotspot)}
                />
            ))}

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
        </>
    );
}

// Main VR Tour Component
export default function VRTour() {
    const [currentDestination, setCurrentDestination] = useState(0);
    const [selectedHotspot, setSelectedHotspot] = useState<any>(null);
    const [isVRMode, setIsVRMode] = useState(false);

    const destination = destinations[currentDestination];

    const handleHotspotClick = (hotspot: any) => {
        setSelectedHotspot(hotspot);
    };

    const nextDestination = () => {
        setCurrentDestination((prev) => (prev + 1) % destinations.length);
        setSelectedHotspot(null);
    };

    const prevDestination = () => {
        setCurrentDestination((prev) => (prev - 1 + destinations.length) % destinations.length);
        setSelectedHotspot(null);
    };

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden">
            {/* VR Canvas */}
            <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
                <Suspense fallback={null}>
                    <VRScene
                        destination={destination}
                        onHotspotClick={handleHotspotClick}
                    />
                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        rotateSpeed={-0.5}
                        minDistance={0.1}
                        maxDistance={100}
                    />
                </Suspense>
            </Canvas>

            {/* UI Overlay */}
            <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
                <div className="text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{destination.name}</h1>
                            <p className="text-lg opacity-90">{destination.description}</p>
                        </div>
                        <div className="bg-blue-600 px-4 py-2 rounded-full text-sm font-semibold pointer-events-auto cursor-pointer hover:bg-blue-700 transition">
                            {currentDestination + 1} / {destinations.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
                <button
                    onClick={prevDestination}
                    className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full hover:bg-white/30 transition font-semibold"
                >
                    ← Previous
                </button>

                <button
                    onClick={() => setIsVRMode(!isVRMode)}
                    className="bg-blue-600 backdrop-blur-md text-white px-8 py-3 rounded-full hover:bg-blue-700 transition font-semibold"
                >
                    {isVRMode ? '👁️ Exit VR' : '🥽 Enter VR Mode'}
                </button>

                <button
                    onClick={nextDestination}
                    className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full hover:bg-white/30 transition font-semibold"
                >
                    Next →
                </button>
            </div>

            {/* Hotspot Info Panel */}
            {selectedHotspot && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-black/80 backdrop-blur-lg text-white p-6 rounded-2xl max-w-sm">
                    <button
                        onClick={() => setSelectedHotspot(null)}
                        className="absolute top-4 right-4 text-2xl hover:text-red-500 transition"
                    >
                        ×
                    </button>
                    <h3 className="text-2xl font-bold mb-3">{selectedHotspot.title}</h3>
                    <p className="text-base opacity-90">{selectedHotspot.info}</p>
                    <button className="mt-4 bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-700 transition w-full font-semibold">
                        Learn More
                    </button>
                </div>
            )}

            {/* Instructions */}
            <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-sm">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🖱️</span>
                    <span>Drag to look around</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⚪</span>
                    <span>Click hotspots for info</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    <span>Works on mobile & VR headsets</span>
                </div>
            </div>

            {/* Destination Thumbnails */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-3">
                {destinations.map((dest, index) => (
                    <button
                        key={dest.id}
                        onClick={() => setCurrentDestination(index)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${index === currentDestination
                                ? 'border-blue-500 scale-110'
                                : 'border-white/30 hover:border-white/60'
                            }`}
                        title={dest.name}
                    >
                        <img
                            src={dest.panorama}
                            alt={dest.name}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
