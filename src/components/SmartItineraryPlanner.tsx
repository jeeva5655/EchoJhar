import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Progress } from "./ui/progress";
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Camera,
  Utensils,
  Car,
  Bed,
  Plane,
  Star,
  Bookmark,
  Share2,
  Download,
  Plus,
  Minus,
  ChevronRight,
  Bot,
  Sparkles,
  Route,
  Wallet,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SmartItineraryPlannerProps {
  userData?: any;
}

export function SmartItineraryPlanner({ userData }: SmartItineraryPlannerProps) {
  const [activeTab, setActiveTab] = useState("planner");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [budget, setBudget] = useState("medium");
  const [interests, setInterests] = useState<string[]>(["heritage", "culture"]);
  const [travelStyle, setTravelStyle] = useState("moderate");
  const [groupSize, setGroupSize] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState<any>(null);
  const [showAIHelper, setShowAIHelper] = useState(false);

  // Mock itinerary data
  const sampleItinerary = {
    id: 1,
    title: "3-Day Cultural Heritage Experience",
    duration: "3 days",
    totalCost: "₹4,500",
    rating: 4.8,
    activities: 12,
    transportCost: "₹800",
    accommodationCost: "₹2,400",
    foodCost: "₹900",
    activityCost: "₹400",
    days: [
      {
        day: 1,
        date: "Dec 29, 2024",
        theme: "Heritage & History",
        activities: [
          {
            id: 1,
            time: "9:00 AM",
            title: "Golden Temple Visit",
            type: "heritage",
            duration: "3 hours",
            cost: "Free",
            description: "Sacred Sikh pilgrimage site with stunning architecture",
            tips: ["Dress modestly", "Remove shoes", "Try the langar"],
            location: "Harmandir Sahib, Amritsar",
            image: "https://images.unsplash.com/photo-1558877397-3c1caa28d831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0b3VyaXN0JTIwYXR0cmFjdGlvbnMlMjB0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU5MDQ5MzQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            rewards: 150
          },
          {
            id: 2,
            time: "1:00 PM",
            title: "Traditional Punjabi Lunch",
            type: "food",
            duration: "1 hour",
            cost: "₹300",
            description: "Authentic local cuisine experience",
            tips: ["Try the sarson da saag", "Don't miss lassi"],
            location: "Heritage Restaurant",
            rewards: 50
          },
          {
            id: 3,
            time: "3:00 PM",
            title: "Local Handicraft Market",
            type: "shopping",
            duration: "2 hours",
            cost: "₹500",
            description: "Shop for traditional Punjabi handicrafts",
            tips: ["Bargain respectfully", "Buy authentic items"],
            location: "Heritage Market",
            rewards: 100
          }
        ]
      },
      {
        day: 2,
        date: "Dec 30, 2024",
        theme: "Culture & Arts",
        activities: [
          {
            id: 4,
            time: "10:00 AM",
            title: "Traditional Art Workshop",
            type: "culture",
            duration: "3 hours",
            cost: "₹800",
            description: "Learn traditional painting techniques",
            tips: ["Bring camera", "Wear old clothes"],
            location: "Cultural Center",
            image: "https://images.unsplash.com/photo-1717913491408-d316a523efc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kaWNyYWZ0cyUyMG1hcmtldHBsYWNlJTIwYXJ0aXNhbnxlbnwxfHx8fDE3NTkwNDkzNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            rewards: 200
          },
          {
            id: 5,
            time: "2:00 PM",
            title: "Heritage Walk",
            type: "heritage",
            duration: "2 hours",
            cost: "₹200",
            description: "Guided tour of historical sites",
            tips: ["Wear comfortable shoes", "Carry water"],
            location: "Old City Area",
            rewards: 120
          }
        ]
      },
      {
        day: 3,
        date: "Dec 31, 2024",
        theme: "Adventure & Nature",
        activities: [
          {
            id: 6,
            time: "8:00 AM",
            title: "Mountain Trek",
            type: "adventure",
            duration: "5 hours",
            cost: "₹600",
            description: "Scenic mountain trail with panoramic views",
            tips: ["Start early", "Carry snacks", "Check weather"],
            location: "Hills Area",
            rewards: 300
          }
        ]
      }
    ]
  };

  const interestOptions = [
    { id: "heritage", label: "Heritage Sites", icon: "🏛️" },
    { id: "culture", label: "Cultural Arts", icon: "🎭" },
    { id: "adventure", label: "Adventure", icon: "⛰️" },
    { id: "food", label: "Food Tours", icon: "🍽️" },
    { id: "nature", label: "Nature", icon: "🌿" },
    { id: "shopping", label: "Shopping", icon: "🛍️" },
    { id: "photography", label: "Photography", icon: "📸" },
    { id: "wellness", label: "Wellness", icon: "🧘" }
  ];

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setCurrentItinerary(sampleItinerary);
    setIsGenerating(false);
    setActiveTab("itinerary");
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "heritage": return "🏛️";
      case "culture": return "🎭";
      case "food": return "🍽️";
      case "shopping": return "🛍️";
      case "adventure": return "⛰️";
      default: return "📍";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            🗺️ Smart Itinerary Planner
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered personalized trip planning that adapts to your interests, budget, and style
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit">
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Planner</span>
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="flex items-center gap-2">
              <Route className="w-4 h-4" />
              <span className="hidden sm:inline">My Itinerary</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planner" className="space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Tell us about your perfect trip
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column - Trip Details */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Trip Duration</label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant={selectedDates.length === 3 ? "default" : "outline"}
                        onClick={() => setSelectedDates([new Date(), new Date(), new Date()])}
                      >
                        3 Days
                      </Button>
                      <Button
                        variant={selectedDates.length === 5 ? "default" : "outline"}
                        onClick={() => setSelectedDates([new Date(), new Date(), new Date(), new Date(), new Date()])}
                      >
                        5 Days
                      </Button>
                      <Button
                        variant={selectedDates.length === 7 ? "default" : "outline"}
                        onClick={() => setSelectedDates([new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()])}
                      >
                        7 Days
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Budget Range</label>
                    <Select value={budget} onValueChange={setBudget}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Budget Friendly (₹1,000-2,000/day)</SelectItem>
                        <SelectItem value="medium">Moderate (₹2,000-5,000/day)</SelectItem>
                        <SelectItem value="high">Premium (₹5,000+/day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Travel Style</label>
                    <Select value={travelStyle} onValueChange={setTravelStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relaxed">Relaxed (2-3 activities/day)</SelectItem>
                        <SelectItem value="moderate">Moderate (4-5 activities/day)</SelectItem>
                        <SelectItem value="packed">Action-Packed (6+ activities/day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Group Size</label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-semibold min-w-[60px] text-center">
                        {groupSize} {groupSize === 1 ? 'person' : 'people'}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGroupSize(groupSize + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Interests */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-4">What interests you?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {interestOptions.map((option) => (
                        <Button
                          key={option.id}
                          variant={interests.includes(option.id) ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => toggleInterest(option.id)}
                        >
                          <span className="mr-2">{option.icon}</span>
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Special Requirements</label>
                    <Textarea
                      placeholder="Any accessibility needs, dietary restrictions, or special preferences..."
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button
                  size="lg"
                  onClick={generateItinerary}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Creating Your Perfect Trip...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate AI Itinerary
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* AI Helper */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-600 rounded-full">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">AI Travel Assistant</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    I'll analyze your preferences, local events, weather, and real-time data to create the perfect itinerary. 
                    I can also adjust plans on-the-go based on your feedback!
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">Real-time Updates</Badge>
                    <Badge variant="secondary" className="text-xs">Weather Integration</Badge>
                    <Badge variant="secondary" className="text-xs">Local Events</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="itinerary" className="space-y-6">
            {currentItinerary ? (
              <>
                {/* Itinerary Overview */}
                <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-green-900 mb-2">
                        {currentItinerary.title}
                      </h2>
                      <div className="flex items-center gap-4 text-green-700">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          <span>{currentItinerary.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current text-yellow-500" />
                          <span>{currentItinerary.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{currentItinerary.activities} activities</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-900">{currentItinerary.totalCost}</p>
                        <p className="text-sm text-green-600">Total estimated cost</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Cost Breakdown */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">💰 Cost Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Car className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-blue-900">{currentItinerary.transportCost}</p>
                      <p className="text-sm text-blue-600">Transport</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Bed className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-green-900">{currentItinerary.accommodationCost}</p>
                      <p className="text-sm text-green-600">Stay</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Utensils className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-orange-900">{currentItinerary.foodCost}</p>
                      <p className="text-sm text-orange-600">Food</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Camera className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-purple-900">{currentItinerary.activityCost}</p>
                      <p className="text-sm text-purple-600">Activities</p>
                    </div>
                  </div>
                </Card>

                {/* Daily Itinerary */}
                <div className="space-y-6">
                  {currentItinerary.days.map((day: any) => (
                    <Card key={day.day} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold">Day {day.day}: {day.theme}</h3>
                          <p className="text-gray-600">{day.date}</p>
                        </div>
                        <Badge className="bg-blue-600">{day.activities.length} activities</Badge>
                      </div>

                      <div className="space-y-4">
                        {day.activities.map((activity: any, index: number) => (
                          <div key={activity.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-2xl border-2 border-gray-200">
                                {getActivityIcon(activity.type)}
                              </div>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-lg">{activity.title}</h4>
                                  <p className="text-gray-600 text-sm">{activity.description}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-green-600">{activity.cost}</p>
                                  {activity.rewards && (
                                    <Badge variant="secondary" className="text-xs">+{activity.rewards} pts</Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{activity.time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{activity.location}</span>
                                </div>
                                <span>Duration: {activity.duration}</span>
                              </div>
                              
                              {activity.tips && (
                                <div className="flex flex-wrap gap-1">
                                  {activity.tips.map((tip: string, tipIndex: number) => (
                                    <Badge key={tipIndex} variant="outline" className="text-xs">
                                      💡 {tip}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-12 text-center">
                <Route className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Itinerary Yet</h2>
                <p className="text-gray-600 mb-6">
                  Create your first AI-powered itinerary to see it here
                </p>
                <Button onClick={() => setActiveTab("planner")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Itinerary
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Pre-built Templates
              </h2>
              <p className="text-gray-600 mb-6">
                Quick-start templates for popular trip types
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}