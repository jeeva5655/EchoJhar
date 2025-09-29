import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Star,
  MapPin,
  Camera,
  Gift,
  Heart,
  Users,
  Clock,
  Compass,
  Award,
  Sparkles,
  Mountain,
  Building,
  Car,
  Utensils,
  ShoppingBag,
  Calendar,
  Zap,
  Plus,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TouristExperienceHubProps {
  userData?: any;
}

export function TouristExperienceHub({ userData }: TouristExperienceHubProps) {
  const [activeTab, setActiveTab] = useState("discover");
  const [rewardPoints, setRewardPoints] = useState(2840);
  const [currentLevel, setCurrentLevel] = useState("Explorer");
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  // Jharkhand-specific tourist experiences
  const personalizedRecommendations = [
    {
      id: 1,
      title: "Hundru Falls Expedition",
      category: "Natural Wonder",
      duration: "4 hours",
      rating: 4.9,
      price: "₹300",
      image: "https://images.unsplash.com/photo-1735567065045-97ba386867ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKaGFya2hhbmQlMjB3YXRlcmZhbGxzJTIwbmF0dXJlJTIwaGlsbHMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU5MDU4NjUwfDA&ixlib=rb-4.1.0&q=80&w=400",
      description: "Experience the spectacular 98-meter high Hundru Falls, Jharkhand's most famous waterfall with breathtaking views and photo opportunities.",
      difficulty: "Easy",
      rewards: 200,
      tips: ["Best time: Post monsoon", "Carry camera", "Wear comfortable shoes", "Visit sunrise for golden light"]
    },
    {
      id: 2,
      title: "Dokra Art Workshop",
      category: "Cultural Heritage",
      duration: "3 hours",
      rating: 4.8,
      price: "₹600",
      image: "https://images.unsplash.com/photo-1652355045956-41665ecf16fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmliYWwlMjBhcnQlMjBoYW5kaWNyYWZ0cyUyMHRyYWRpdGlvbmFsJTIwY3VsdHVyZXxlbnwxfHx8fDE3NTkwNTg2NTJ8MA&ixlib=rb-4.1.0&q=80&w=400",
      description: "Learn the ancient Dokra metal casting technique from tribal artisans. Create your own brass figurine using 4000-year-old methods.",
      difficulty: "Medium",
      rewards: 250,
      tips: ["Book with tribal cooperatives", "Learn the history", "Support local artisans", "Take home your creation"]
    },
    {
      id: 3,
      title: "Betla Tiger Safari",
      category: "Wildlife Adventure", 
      duration: "5 hours",
      rating: 4.7,
      price: "₹1200",
      image: "https://images.unsplash.com/photo-1649468508663-3cc7829b2956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWdlciUyMHdpbGRsaWZlJTIwbmF0aW9uYWwlMjBwYXJrJTIwZm9yZXN0fGVufDF8fHx8MTc1OTA1ODY1Nnww&ixlib=rb-4.1.0&q=80&w=400",
      description: "Safari through Betla National Park to spot Royal Bengal Tigers, Asian elephants, and over 180 bird species in their natural habitat.",
      difficulty: "Easy",
      rewards: 300,
      tips: ["Early morning best for tigers", "Carry binoculars", "Stay quiet", "Book guide in advance"]
    },
    {
      id: 4,
      title: "Maluti Temples Heritage Walk",
      category: "Archaeological Wonder",
      duration: "3 hours", 
      rating: 4.6,
      price: "₹400",
      image: "https://images.unsplash.com/photo-1708670094480-29a79ae826c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwdGVtcGxlJTIwaGVyaXRhZ2UlMjBhcmNoaXRlY3R1cmUlMjBJbmRpYXxlbnwxfHx8fDE3NTkwNTg2NTl8MA&ixlib=rb-4.1.0&q=80&w=400",
      description: "Explore 108 ancient terracotta temples dating back to 17th-18th century. Marvel at intricate Ramayana and Mahabharata carvings.",
      difficulty: "Easy",
      rewards: 180,
      tips: ["Hire local guide", "Photography allowed", "Best light: Golden hour", "Respect religious sites"]
    },
    {
      id: 5,
      title: "Netarhat Sunset Point",
      category: "Hill Station Experience",
      duration: "6 hours",
      rating: 4.8,
      price: "₹500",
      image: "https://images.unsplash.com/photo-1735567065045-97ba386867ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKaGFya2hhbmQlMjB3YXRlcmZhbGxzJTIwbmF0dXJlJTIwaGlsbHMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU5MDU4NjUwfDA&ixlib=rb-4.1.0&q=80&w=400",
      description: "Visit the 'Queen of Chotanagpur' for mesmerizing sunset views from 1070m above sea level. Experience the cool climate and pine forests.",
      difficulty: "Easy",
      rewards: 220,
      tips: ["Reach by 5 PM", "Carry warm clothes", "Book accommodation in advance", "Try local tribal food"]
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Sarhul Festival Celebration",
      date: "Today 6:00 PM",
      location: "Tribal Cultural Center, Ranchi",
      price: "Free",
      attendees: 200,
      category: "Tribal Festival",
      image: "https://images.unsplash.com/photo-1736866143136-7ffdd4a4cf0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBmZXN0aXZhbCUyMGNlbGVicmF0aW9uJTIwdHJpYmFsJTIwY3VsdHVyZXxlbnwxfHx8fDE3NTkwNTkxNTF8MA&ixlib=rb-4.1.0&q=80&w=300"
    },
    {
      id: 2,
      title: "Jharkhand Handicraft Exhibition",
      date: "Tomorrow 10:00 AM",
      location: "Morhabadi Ground, Ranchi",
      price: "₹50",
      attendees: 150,
      category: "Handicrafts",
      image: "https://images.unsplash.com/photo-1652355045956-41665ecf16fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmliYWwlMjBhcnQlMjBoYW5kaWNyYWZ0cyUyMHRyYWRpdGlvbmFsJTIwY3VsdHVyZXxlbnwxfHx8fDE3NTkwNTg2NTJ8MA&ixlib=rb-4.1.0&q=80&w=300"
    },
    {
      id: 3,
      title: "Coal Mining Heritage Tour",
      date: "Dec 31, 8:00 AM",
      location: "Jharia Coalfields, Dhanbad",
      price: "₹800",
      attendees: 30,
      category: "Industrial Heritage",
      image: "https://images.unsplash.com/photo-1660866837323-0565dfb71ca6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtaW5pbmclMjBjb2FsJTIwaXJvbiUyMG9yZSUyMG1pbmVyYWxzJTIwaW5kdXN0cmlhbHxlbnwxfHx8fDE3NTkwNTkxNTR8MA&ixlib=rb-4.1.0&q=80&w=300"
    }
  ];

  const rewardChallenges = [
    {
      id: 1,
      title: "Jharkhand Waterfall Hunter",
      description: "Visit and photograph all 3 major waterfalls: Hundru, Dassam, and Jonha Falls",
      progress: 2,
      total: 3,
      reward: 300,
      icon: Camera,
      status: "active"
    },
    {
      id: 2,
      title: "Tribal Art Collector", 
      description: "Learn and document 4 traditional art forms: Dokra, Paitkar, Sohrai, and Kohvar",
      progress: 1,
      total: 4,
      reward: 500,
      icon: Building,
      status: "active"
    },
    {
      id: 3,
      title: "Mineral State Explorer",
      description: "Visit coal mines, mica mines, and iron ore sites with guided tours",
      progress: 0,
      total: 3,
      reward: 400,
      icon: Mountain,
      status: "active"
    },
    {
      id: 4,
      title: "Festival Participant",
      description: "Attend 2 tribal festivals: Sarhul and Karma celebrations",
      progress: 1,
      total: 2,
      reward: 350,
      icon: Users,
      status: "active"
    },
    {
      id: 5,
      title: "Wildlife Spotter",
      description: "Spot tigers at Betla and elephants at Palamau Tiger Reserve",
      progress: 1,
      total: 2,
      reward: 450,
      icon: Compass,
      status: "active"
    }
  ];

  const handleActivitySelection = (activityId: string) => {
    setSelectedActivity(activityId);
    // Here you would typically navigate to detailed activity view
  };

  const handleEarnRewards = () => {
    setRewardPoints(prev => prev + 50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header with Rewards */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                🌟 Welcome, {userData?.name?.split(" ")[0] || "Explorer"}!
              </h1>
              <p className="text-blue-100">
                Discover amazing experiences & earn rewards while exploring!
              </p>
            </div>
            <div className="flex items-center gap-6 bg-white/10 rounded-lg p-4">
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span className="text-2xl font-bold">{rewardPoints}</span>
                </div>
                <p className="text-xs text-blue-100">Reward Points</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-300" />
                  <span className="text-lg font-semibold">{currentLevel}</span>
                </div>
                <p className="text-xs text-blue-100">Current Level</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Discover</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700">12</p>
                <p className="text-sm text-green-600">Places Visited</p>
              </Card>
              <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
                <Camera className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700">47</p>
                <p className="text-sm text-blue-600">Photos Uploaded</p>
              </Card>
              <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-700">8</p>
                <p className="text-sm text-purple-600">Experiences Loved</p>
              </Card>
              <Card className="p-4 text-center bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-700">5</p>
                <p className="text-sm text-orange-600">New Reviews</p>
              </Card>
            </div>

            {/* Personalized Recommendations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  🎯 Personalized for You
                </h2>
                <Button variant="outline" size="sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Refresh AI Picks
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalizedRecommendations.map((activity) => (
                  <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                        onClick={() => handleActivitySelection(activity.id.toString())}>
                    <div className="relative h-48">
                      <ImageWithFallback
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-white/90">
                          {activity.category}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-600 text-white">
                          +{activity.rewards} pts
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                          {activity.title}
                        </h3>
                        <span className="text-lg font-bold text-blue-600">
                          {activity.price}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{activity.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{activity.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{activity.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {activity.tips.map((tip, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tip}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Active Challenges */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  🏆 Active Challenges
                </h2>
                {rewardChallenges.map((challenge) => (
                  <Card key={challenge.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        challenge.status === 'completed' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <challenge.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{challenge.title}</h3>
                          <Badge className={challenge.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'}>
                            +{challenge.reward} pts
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{challenge.description}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{challenge.progress}/{challenge.total}</span>
                          </div>
                          <Progress 
                            value={(challenge.progress / challenge.total) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Reward Store */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  🛍️ Reward Store
                </h2>
                <div className="space-y-3">
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Car className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Free Transport</h3>
                          <p className="text-sm text-gray-600">Local bus/auto ride</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">500 pts</p>
                        <Button size="sm" onClick={handleEarnRewards}>Redeem</Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Utensils className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Local Meal</h3>
                          <p className="text-sm text-gray-600">Traditional cuisine</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">300 pts</p>
                        <Button size="sm" variant="outline" onClick={handleEarnRewards}>Redeem</Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <ShoppingBag className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Handicraft Discount</h3>
                          <p className="text-sm text-gray-600">20% off at local shops</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">200 pts</p>
                        <Button size="sm" variant="outline" onClick={handleEarnRewards}>Redeem</Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                🎭 Upcoming Events
              </h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge>{event.category}</Badge>
                      <span className="font-bold text-green-600">{event.price}</span>
                    </div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                    <Button className="w-full">
                      Join Event
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connect with Fellow Travelers
              </h2>
              <p className="text-gray-600 mb-6">
                Share experiences, find travel buddies, and create memories together
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Find Travel Companions
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}