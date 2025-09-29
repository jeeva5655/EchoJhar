import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Camera, 
  Video, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize, 
  Eye, 
  MapPin,
  Star,
  Clock,
  Users,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor
} from "lucide-react";

interface ARVRContent {
  id: string;
  title: string;
  location: string;
  type: 'AR' | 'VR' | '360°';
  category: string;
  duration: string;
  rating: number;
  views: string;
  description: string;
  thumbnail: string;
  youtubeId?: string;
  features: string[];
}

const JHARKHAND_ARVR_CONTENT: ARVRContent[] = [
  {
    id: '1',
    title: 'Hundru Falls Virtual Experience',
    location: 'Hundru Falls, Ranchi',
    type: 'VR',
    category: 'Waterfalls',
    duration: '8:45',
    rating: 4.8,
    views: '125K',
    description: 'Experience the breathtaking 98-meter high Hundru Falls in immersive VR. Feel the mist and hear the thunderous roar of water cascading down the rocky cliffs.',
    thumbnail: 'https://images.unsplash.com/photo-1735567065045-97ba386867ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKaGFya2hhbmQlMjB3YXRlcmZhbGxzJTIwbmF0dXJlJTIwaGlsbHMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU5MDU4NjUwfDA&ixlib=rb-4.1.0&q=80&w=400',
    youtubeId: 'jharkhand_hundru_vr',
    features: ['360° View', 'Spatial Audio', 'Weather Effects', 'Multiple Angles']
  },
  {
    id: '2',
    title: 'Betla National Park Safari',
    location: 'Betla National Park, Palamau',
    type: 'AR',
    category: 'Wildlife',
    duration: '12:30',
    rating: 4.9,
    views: '89K',
    description: 'Use AR to spot tigers, elephants, and other wildlife in their natural habitat. Interactive animal information appears when you point your camera.',
    thumbnail: 'https://images.unsplash.com/photo-1649468508663-3cc7829b2956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWdlciUyMHdpbGRsaWZlJTIwbmF0aW9uYWwlMjBwYXJrJTIwZm9yZXN0fGVufDF8fHx8MTc1OTA1ODY1Nnww&ixlib=rb-4.1.0&q=80&w=400',
    youtubeId: 'betla_park_ar_safari',
    features: ['Animal Recognition', 'Information Overlay', 'Sound Effects', 'Interactive Map']
  },
  {
    id: '3',
    title: 'Maluti Temples Heritage Walk',
    location: 'Maluti, Dumka',
    type: '360°',
    category: 'Heritage',
    duration: '15:20',
    rating: 4.7,
    views: '67K',
    description: 'Explore the ancient terracotta temples of Maluti in stunning 360° detail. Learn about the architectural marvels and historical significance.',
    thumbnail: 'https://images.unsplash.com/photo-1708670094480-29a79ae826c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwdGVtcGxlJTIwaGVyaXRhZ2UlMjBhcmNoaXRlY3R1cmUlMjBJbmRpYXxlbnwxfHx8fDE3NTkwNTg2NTl8MA&ixlib=rb-4.1.0&q=80&w=400',
    youtubeId: 'maluti_temples_360',
    features: ['Historical Narration', 'Zoom Details', 'Time Periods', 'Cultural Context']
  },
  {
    id: '4',
    title: 'Netarhat Sunset Point VR',
    location: 'Netarhat, Latehar',
    type: 'VR',
    category: 'Hill Stations',
    duration: '6:15',
    rating: 4.6,
    views: '95K',
    description: 'Watch the mesmerizing sunset from the "Queen of Chotanagpur" in immersive VR. Experience the changing colors of the sky and panoramic hill views.',
    thumbnail: 'https://images.unsplash.com/photo-1735567065045-97ba386867ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKaGFya2hhbmQlMjB3YXRlcmZhbGxzJTIwbmF0dXJlJTIwaGlsbHMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU5MDU4NjUwfDA&ixlib=rb-4.1.0&q=80&w=400',
    youtubeId: 'netarhat_sunset_vr',
    features: ['Time Lapse', 'Weather Simulation', 'Panoramic Views', 'Relaxation Mode']
  },
  {
    id: '5',
    title: 'Tribal Art AR Experience',
    location: 'Various Villages, Jharkhand',
    type: 'AR',
    category: 'Culture',
    duration: '10:45',
    rating: 4.8,
    views: '52K',
    description: 'Point your camera at Dokra art, Paitkar paintings, and Sohrai wall art to learn about techniques, stories, and cultural significance.',
    thumbnail: 'https://images.unsplash.com/photo-1652355045956-41665ecf16fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmliYWwlMjBhcnQlMjBoYW5kaWNyYWZ0cyUyMHRyYWRpdGlvbmFsJTIwY3VsdHVyZXxlbnwxfHx8fDE3NTkwNTg2NTJ8MA&ixlib=rb-4.1.0&q=80&w=400',
    youtubeId: 'tribal_art_ar',
    features: ['Art Recognition', 'Story Telling', 'Artist Profiles', 'Technique Videos']
  },
  {
    id: '6',
    title: 'Dassam Falls 360° Adventure',
    location: 'Dassam Falls, Ranchi',
    type: '360°',
    category: 'Waterfalls',
    duration: '7:30',
    rating: 4.7,
    views: '78K',
    description: 'Experience the spectacular 44-meter Dassam Falls from multiple angles. Feel like you\'re standing right at the base of this magnificent cascade.',
    thumbnail: 'https://images.unsplash.com/photo-1735567065045-97ba386867ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKaGFya2hhbmQlMjB3YXRlcmZhbGxzJTIwbmF0dXJlJTIwaGlsbHMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU5MDU4NjUwfDA&ixlib=rb-4.1.0&q=80&w=400',
    youtubeId: 'dassam_falls_360',
    features: ['Multiple Viewpoints', 'Sound Immersion', 'Drone Perspectives', 'Seasonal Views']
  }
];

export function ARVRExperience() {
  const [selectedContent, setSelectedContent] = useState<ARVRContent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Waterfalls', 'Wildlife', 'Heritage', 'Hill Stations', 'Culture'];

  const filteredContent = activeCategory === 'All' 
    ? JHARKHAND_ARVR_CONTENT 
    : JHARKHAND_ARVR_CONTENT.filter(content => content.category === activeCategory);

  const handlePlayContent = (content: ARVRContent) => {
    setSelectedContent(content);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4 flex items-center justify-center">
          <Camera className="w-8 h-8 text-purple-600 mr-3" />
          AR/VR Jharkhand Experience
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Immerse yourself in Jharkhand's natural beauty and cultural heritage through cutting-edge AR/VR technology with exclusive YouTube content.
        </p>
      </div>

      {/* VR Setup Banner */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl border">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img 
            src="https://images.unsplash.com/photo-1758526213673-19757e3b594c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWUiUyMGhlYWRzZXQlMjB2aXJ0dWFsJTIwcmVhbGl0eSUyMHRvdXJpc20lMjBleHBlcmllbmNlfGVufDF8fHx8MTc1OTA1ODgyMHww&ixlib=rb-4.1.0&q=80&w=200"
            alt="VR Experience"
            className="w-32 h-32 object-cover rounded-lg"
          />
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold text-purple-800 mb-2">
              Best Experience with VR Headset
            </h3>
            <p className="text-purple-700 mb-4">
              For the ultimate immersive experience, we recommend using a VR headset. Mobile VR and desktop 360° viewing are also supported.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge variant="outline" className="bg-white">
                <Monitor className="w-3 h-3 mr-1" />
                Desktop 360°
              </Badge>
              <Badge variant="outline" className="bg-white">
                <Smartphone className="w-3 h-3 mr-1" />
                Mobile AR
              </Badge>
              <Badge variant="outline" className="bg-white">
                <Eye className="w-3 h-3 mr-1" />
                VR Headset
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content Categories */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Content Library */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-blue-600" />
                <span>VR/AR Content Library</span>
                <Badge variant="secondary">{filteredContent.length} Experiences</Badge>
              </CardTitle>
              <CardDescription>
                Exclusive AR/VR content showcasing Jharkhand's attractions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {filteredContent.map((content) => (
                    <div
                      key={content.id}
                      className="flex space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handlePlayContent(content)}
                    >
                      <div className="relative">
                        <img
                          src={content.thumbnail}
                          alt={content.title}
                          className="w-32 h-20 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="absolute top-1 right-1 text-xs"
                        >
                          {content.type}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 truncate">
                          {content.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{content.location}</span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>{content.duration}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            <span>{content.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            <span>{content.views} views</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                          {content.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Player/Viewer */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-purple-600" />
                <span>VR/AR Viewer</span>
              </CardTitle>
              <CardDescription>
                Immersive content player
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedContent ? (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <img
                      src={selectedContent.thumbnail}
                      alt={selectedContent.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      {isPlaying ? (
                        <div className="text-white text-center">
                          <div className="animate-pulse mb-2">
                            <Eye className="w-8 h-8 mx-auto" />
                          </div>
                          <p className="text-sm">VR Experience Active</p>
                        </div>
                      ) : (
                        <Button
                          onClick={togglePlayPause}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          <Play className="w-6 h-6" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Player Controls */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={togglePlayPause}
                          className="text-white hover:bg-white/20"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={toggleMute}
                          className="text-white hover:bg-white/20"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                        >
                          <Maximize className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div>
                    <h4 className="font-semibold mb-2">{selectedContent.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {selectedContent.location}
                      </div>
                      <Badge variant="outline">{selectedContent.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {selectedContent.description}
                    </p>
                    
                    {/* Features */}
                    <div>
                      <h5 className="font-medium text-sm mb-2">Features:</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedContent.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a VR/AR experience to begin</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Device Compatibility */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Device Compatibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop 360°
                </span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Supported
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile AR
                </span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Supported
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  VR Headset
                </span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Recommended
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* YouTube Integration Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-red-600" />
            <span>YouTube VR Integration</span>
            <Badge variant="secondary">Premium Content</Badge>
          </CardTitle>
          <CardDescription>
            Exclusive Jharkhand tourism VR content sourced from verified YouTube channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Tourism Board Official</h4>
              <p className="text-sm text-red-700">
                Official VR content from Jharkhand Tourism Development Corporation with 4K quality.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Documentary Channels</h4>
              <p className="text-sm text-blue-700">
                Educational content from National Geographic, Discovery, and travel documentarians.
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Local Creators</h4>
              <p className="text-sm text-green-700">
                Authentic experiences from local content creators and tour guides.
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is a demonstration. In production, real YouTube VR content would be integrated through YouTube's VR API and content partnerships with verified channels.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}