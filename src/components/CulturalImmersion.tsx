import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  Heart,
  Share2,
  Bookmark,
  Play,
  Music,
  Camera,
  Gift,
  Award,
  MessageCircle,
  Phone,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Languages,
  Volume2,
  Mic,
  Globe,
  Sparkles,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CulturalImmersionProps {
  userData?: any;
}

export function CulturalImmersion({ userData }: CulturalImmersionProps) {
  const [activeTab, setActiveTab] = useState("events");
  const [selectedLanguage, setSelectedLanguage] = useState("hindi");
  const [isListening, setIsListening] = useState(false);

  // Mock cultural events data
  const culturalEvents = [
    {
      id: 1,
      title: "Traditional Bharatanatyam Performance",
      type: "Dance",
      date: "Tonight 7:00 PM",
      location: "Cultural Center Auditorium",
      price: "₹300",
      artist: "Priya Nataraj",
      description: "Classical South Indian dance performance with live music",
      image: "https://images.unsplash.com/photo-1756370256926-e48ca54c5efe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdWx0dXJhbCUyMGZlc3RpdmFsJTIwZGFuY2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NTkwNDk2ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.9,
      attendees: 120,
      duration: "2 hours",
      category: "performing-arts",
      highlights: ["Live Music", "Traditional Costumes", "English Narration"],
      rewardPoints: 150
    },
    {
      id: 2,
      title: "Holi Color Festival",
      type: "Festival",
      date: "March 8, 10:00 AM",
      location: "City Park",
      price: "Free",
      artist: "Community Event",
      description: "Celebrate the festival of colors with locals and visitors",
      image: "https://images.unsplash.com/photo-1553057176-4b036c0a0fb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2xpJTIwZmVzdGl2YWwlMjBpbmRpYXxlbnwxfHx8fDE3NTkwNDk2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.8,
      attendees: 500,
      duration: "4 hours",
      category: "festival",
      highlights: ["Organic Colors", "Traditional Sweets", "Group Photos"],
      rewardPoints: 200
    },
    {
      id: 3,
      title: "Sitar Recital by Master Ravi",
      type: "Music",
      date: "Dec 31, 8:00 PM",
      location: "Heritage Hall",
      price: "₹500",
      artist: "Pandit Ravi Shankar Jr.",
      description: "Classical Indian string instrument performance",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaXRhciUyMGluZGlhbiUyMG11c2ljfGVufDF8fHx8MTc1OTA0OTY4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.95,
      attendees: 80,
      duration: "2.5 hours",
      category: "music",
      highlights: ["Classical Ragas", "Meditation Music", "Interactive Session"],
      rewardPoints: 180
    }
  ];

  const languageHelpers = [
    {
      phrase: "Namaste",
      translation: "Hello/Goodbye",
      pronunciation: "nah-mas-tay",
      audio: "/audio/namaste.mp3",
      context: "Universal greeting in India"
    },
    {
      phrase: "Dhanyawad",
      translation: "Thank you",
      pronunciation: "dhan-ya-waad",
      audio: "/audio/dhanyawad.mp3",
      context: "Polite way to express gratitude"
    },
    {
      phrase: "Kshama kariye",
      translation: "Excuse me/Sorry",
      pronunciation: "ksha-ma ka-ri-ye",
      audio: "/audio/kshama.mp3",
      context: "When asking for attention or apologizing"
    },
    {
      phrase: "Kitna paisa?",
      translation: "How much money?",
      pronunciation: "kit-na pai-sa",
      audio: "/audio/kitna.mp3",
      context: "Essential for shopping and bargaining"
    }
  ];

  const localGuides = [
    {
      id: 1,
      name: "Rajesh Sharma",
      specialty: "Heritage Tours",
      languages: ["Hindi", "English", "French"],
      rating: 4.9,
      reviews: 156,
      experience: "8 years",
      price: "₹800/day",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBhcnRpc2FufGVufDF8fHx8MTc1OTA0OTM3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      certifications: ["Licensed Guide", "Cultural Expert"],
      description: "Passionate storyteller specializing in ancient architecture and local folklore"
    },
    {
      id: 2,
      name: "Meera Patel",
      specialty: "Food & Culture",
      languages: ["Hindi", "English", "Gujarati"],
      rating: 4.8,
      reviews: 89,
      experience: "5 years",
      price: "₹600/day",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGFydGlzYW58ZW58MXx8fHwxNzU5MDQ5MzcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      certifications: ["Culinary Expert", "Cultural Ambassador"],
      description: "Local food enthusiast who brings authentic culinary experiences to life"
    }
  ];

  const immersiveExperiences = [
    {
      id: 1,
      title: "Traditional Cooking Class",
      duration: "4 hours",
      price: "₹1,200",
      type: "hands-on",
      description: "Learn to cook authentic regional dishes with a local family",
      includes: ["Ingredients", "Recipe Book", "Family Meal"],
      maxParticipants: 8,
      difficulty: "Beginner Friendly"
    },
    {
      id: 2,
      title: "Village Homestay Experience",
      duration: "2 days",
      price: "₹2,500",
      type: "overnight",
      description: "Live with a local family and experience rural Indian lifestyle",
      includes: ["Accommodation", "All Meals", "Farm Activities"],
      maxParticipants: 4,
      difficulty: "Authentic"
    },
    {
      id: 3,
      title: "Artisan Workshop Tour",
      duration: "6 hours",
      price: "₹800",
      type: "educational",
      description: "Visit multiple artisan workshops and learn traditional crafts",
      includes: ["Transport", "Workshop Access", "Small Craft"],
      maxParticipants: 12,
      difficulty: "All Levels"
    }
  ];

  const playAudio = (audioFile: string) => {
    // Mock audio playback - in real app would play actual audio
    console.log(`Playing audio: ${audioFile}`);
  };

  const startVoiceTranslation = () => {
    setIsListening(!isListening);
    // Mock voice recognition - in real app would use speech recognition API
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            🎭 Cultural Immersion Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dive deep into local culture through authentic experiences, language assistance, and cultural events
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">Language</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Guides</span>
            </TabsTrigger>
            <TabsTrigger value="experiences" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Experiences</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <Music className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-700">12</p>
                <p className="text-sm text-purple-600">Live Shows</p>
              </Card>
              <Card className="p-4 text-center bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                <Calendar className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-pink-700">5</p>
                <p className="text-sm text-pink-600">Festivals</p>
              </Card>
              <Card className="p-4 text-center bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-700">300+</p>
                <p className="text-sm text-orange-600">Participants</p>
              </Card>
              <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700">50+</p>
                <p className="text-sm text-green-600">Reward Points</p>
              </Card>
            </div>

            {/* Cultural Events */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  🎨 Upcoming Cultural Events
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {culturalEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative h-48">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-purple-600 text-white">
                          {event.type}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90">
                          <Share2 className="w-4 h-4 text-gray-600" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600">by {event.artist}</p>
                      </div>

                      <p className="text-gray-600 text-sm">{event.description}</p>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.date} • {event.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">{event.price}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{event.rating}</span>
                          </div>
                        </div>
                        <Badge className="bg-blue-600 text-white">
                          +{event.rewardPoints} pts
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {event.highlights.map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>

                      <Button className="w-full">
                        Join Event
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="language" className="space-y-6">
            {/* Language Helper */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  🗣️ Language Assistant
                </h2>
                <Button
                  onClick={startVoiceTranslation}
                  className={`${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isListening ? (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Listening...
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Voice Translation
                    </>
                  )}
                </Button>
              </div>
              <p className="text-blue-700 mb-4">
                Learn essential phrases and get real-time voice translation to communicate with locals
              </p>
            </Card>

            {/* Essential Phrases */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Essential Phrases</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {languageHelpers.map((phrase, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">{phrase.phrase}</h4>
                          <p className="text-gray-600">{phrase.translation}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playAudio(phrase.audio)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-blue-600">
                          <strong>Pronunciation:</strong> {phrase.pronunciation}
                        </p>
                        <p className="text-xs text-gray-500">
                          <strong>Context:</strong> {phrase.context}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Translation Features */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <Mic className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Voice Translation</h4>
                <p className="text-sm text-gray-600">Speak and get instant translation</p>
              </Card>
              <Card className="p-4 text-center">
                <Camera className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Sign Translation</h4>
                <p className="text-sm text-gray-600">Point camera at signs for translation</p>
              </Card>
              <Card className="p-4 text-center">
                <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Chat Helper</h4>
                <p className="text-sm text-gray-600">Type to translate conversations</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                🎯 Verified Local Guides
              </h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Request Guide
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {localGuides.map((guide) => (
                <Card key={guide.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={guide.image} alt={guide.name} />
                      <AvatarFallback>{guide.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{guide.name}</h3>
                        <p className="text-gray-600">{guide.specialty}</p>
                        <p className="text-sm text-green-600 font-semibold">{guide.price}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{guide.rating}</span>
                        </div>
                        <span>({guide.reviews} reviews)</span>
                        <span>{guide.experience} experience</span>
                      </div>

                      <p className="text-gray-600 text-sm">{guide.description}</p>

                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs font-medium text-gray-700">Languages:</span>
                          {guide.languages.map((lang, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs font-medium text-gray-700">Certifications:</span>
                          {guide.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experiences" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                ✨ Immersive Experiences
              </h2>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter by Interest
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {immersiveExperiences.map((experience) => (
                <Card key={experience.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{experience.title}</h3>
                      <p className="text-gray-600 text-sm">{experience.description}</p>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{experience.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Price:</span>
                        <span className="font-bold text-green-600">{experience.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Max Participants:</span>
                        <span className="font-medium">{experience.maxParticipants}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Difficulty:</span>
                        <Badge variant="outline" className="text-xs">
                          {experience.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Includes:</p>
                      <div className="flex flex-wrap gap-1">
                        {experience.includes.map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full">
                      Book Experience
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}