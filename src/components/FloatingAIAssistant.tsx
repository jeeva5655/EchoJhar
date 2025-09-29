import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Languages,
  Radio,
  MapPin,
  Camera,
  Info,
  Volume2,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "location" | "emergency" | "cultural" | "photo";
}

interface FloatingAIAssistantProps {
  userData?: any;
}

export function FloatingAIAssistant({ userData }: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `🌟 Namaste! I'm your EchoJhar AI Assistant. I can help you with Jharkhand tourism, safety alerts, local culture, emergency support, and speak 60+ languages. How can I assist you today?`,
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Emergency keywords
    if (lowerMessage.includes("emergency") || lowerMessage.includes("help") || lowerMessage.includes("danger")) {
      return "🚨 EMERGENCY ALERT ACTIVATED\n\n📞 Immediate Actions:\n• Emergency Helpline: 112\n• Tourist Helpline: 1363\n• D2M Emergency Broadcast: ACTIVATED\n• Sharing your location with authorities\n• Notifying nearest police station\n\n🛡️ Stay calm. Help is on the way.";
    }

    // Location-based queries
    if (lowerMessage.includes("location") || lowerMessage.includes("where") || lowerMessage.includes("direction")) {
      return "📍 LOCATION SERVICES\n\n🗺️ Current Services:\n• Real-time GPS tracking\n• Geo-fencing alerts active\n• Nearest attractions: Hundru Falls (5km)\n• Safe zones marked\n• Weather: Sunny, 25°C\n\n🧭 Would you like directions to a specific destination?";
    }

    // Cultural queries
    if (lowerMessage.includes("culture") || lowerMessage.includes("festival") || lowerMessage.includes("tribal") || lowerMessage.includes("local")) {
      return "🎭 CULTURAL IMMERSION\n\n🌸 Current Festivals:\n• Sarhul Festival (Spring celebration)\n• Karma Festival (Harvest season)\n• Tusu Parab (Winter festival)\n\n🏺 Local Experiences:\n• Tribal village visits\n• Traditional handicraft workshops\n• Folk dance performances\n• Local cuisine tasting\n\n🗣️ Language support: Hindi, Santhali, Ho, Mundari available";
    }

    // Tourism attractions
    if (lowerMessage.includes("waterfall") || lowerMessage.includes("falls") || lowerMessage.includes("nature")) {
      return "🏞️ JHARKHAND WATERFALLS\n\n💎 Top Waterfalls:\n• Hundru Falls - 98m height\n• Dassam Falls - 44m cascade\n• Jonha Falls - Hidden gem\n• Hirni Falls - Serene beauty\n\n📸 Best photo spots marked\n🎥 AR/VR previews available\n⏰ Best visiting time: 6 AM - 6 PM";
    }

    // Wildlife queries
    if (lowerMessage.includes("wildlife") || lowerMessage.includes("tiger") || lowerMessage.includes("national park")) {
      return "🐅 WILDLIFE & NATIONAL PARKS\n\n🏞️ Protected Areas:\n• Betla National Park - Tigers, elephants\n• Palamau Tiger Reserve - 414 tigers\n• Dalma Wildlife Sanctuary - Elephants\n• Hazaribagh Wildlife Sanctuary\n\n🦌 Wildlife: Tigers, elephants, leopards, deer\n📅 Safari timings: 6 AM - 11 AM, 3 PM - 6 PM";
    }

    // Safety queries
    if (lowerMessage.includes("safety") || lowerMessage.includes("secure") || lowerMessage.includes("protection")) {
      return "🛡️ SAFETY MONITORING\n\n✅ Active Protections:\n• Real-time location tracking\n• Geo-fencing alerts\n• 24/7 emergency response\n• D2M emergency broadcasting\n• Smart band monitoring\n\n🚨 Emergency Features:\n• Panic button active\n• Auto-alert system ON\n• Nearest hospital: 2.3km";
    }

    // Food queries
    if (lowerMessage.includes("food") || lowerMessage.includes("eat") || lowerMessage.includes("restaurant")) {
      return "🍽️ LOCAL CUISINE & DINING\n\n🥘 Must-try Dishes:\n• Dhuska - Traditional snack\n• Litti Chokha - Regional specialty\n• Handia - Local rice beer\n• Bamboo shoots curry\n\n🏪 Nearby Restaurants:\n• Authentic Tribal Kitchen (1.2km)\n• Jharkhand Flavors (800m)\n• Traditional Dhaba (500m)";
    }

    // Weather queries
    if (lowerMessage.includes("weather") || lowerMessage.includes("temperature") || lowerMessage.includes("rain")) {
      return "🌤️ WEATHER UPDATE\n\n📊 Current Conditions:\n• Temperature: 25°C (Comfortable)\n• Humidity: 65%\n• Wind: 12 km/h\n• Visibility: 10km\n• UV Index: Moderate\n\n📅 7-Day Forecast:\n• Today: Sunny\n• Tomorrow: Partly cloudy\n• Weekend: Light showers expected";
    }

    // Language queries
    if (lowerMessage.includes("language") || lowerMessage.includes("translate") || lowerMessage.includes("speak")) {
      return "🗣️ MULTILINGUAL SUPPORT\n\n🌍 60+ Languages Available:\n• Indian: Hindi, Bengali, Tamil, Telugu\n• Tribal: Santhali, Ho, Mundari, Kurukh\n• International: English, French, Spanish\n• Voice translation: Real-time\n\n🎯 D2M Technology: Offline support\n📻 Emergency broadcasts in local languages";
    }

    // Transport queries
    if (lowerMessage.includes("transport") || lowerMessage.includes("bus") || lowerMessage.includes("taxi")) {
      return "🚗 TRANSPORTATION\n\n🚌 Available Options:\n• State buses: Every 30 mins\n• Auto-rickshaws: ₹10/km\n• Taxi services: ₹15/km\n• Bike rentals: ₹200/day\n\n📍 Nearest Transport:\n• Bus Stop: 300m\n• Taxi Stand: 500m\n• Railway Station: 5km";
    }

    // Default helpful response
    return `🤖 I understand you're asking about "${userMessage}". Here's how I can help:\n\n🎯 My Capabilities:\n• 🏞️ Tourism & attractions\n• 🛡️ Safety & emergency support\n• 🎭 Cultural experiences\n• 🗣️ 60+ language translation\n• 📍 Navigation & directions\n• 🍽️ Local food recommendations\n• 🌤️ Weather updates\n• 🚗 Transportation info\n\n💬 Try asking: "Show me waterfalls", "Emergency help", "Local culture", or "Translate to Hindi"`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(message),
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    { icon: MapPin, label: "Nearby", action: () => setMessage("What's near me?") },
    { icon: Camera, label: "Photo Spots", action: () => setMessage("Best photo locations") },
    { icon: Languages, label: "Translate", action: () => setMessage("Help me translate") },
    { icon: Info, label: "Culture", action: () => setMessage("Tell me about local culture") },
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
        <div className="absolute -top-12 right-0 bg-black/80 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap">
          EchoJhar AI Assistant
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 transition-all duration-300 shadow-2xl border-0 ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
        <CardHeader className="p-4 pb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm">EchoJhar AI Assistant</CardTitle>
                <p className="text-xs text-blue-100">60+ Languages • D2M Ready</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/20">
                  <Languages className="w-3 h-3 mr-1" />
                  ML
                </Badge>
                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/20">
                  <Radio className="w-3 h-3 mr-1" />
                  D2M
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[440px]">
            {/* Quick Actions */}
            <div className="p-3 bg-gray-50 border-b">
              <div className="grid grid-cols-4 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={action.action}
                  >
                    <action.icon className="w-3 h-3 mr-1" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          msg.sender === "user" ? "bg-white/20" : "bg-blue-100"
                        }`}>
                          {msg.sender === "user" ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Bot className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-line">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === "user" ? "text-blue-100" : "text-gray-500"
                          }`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 text-blue-600" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about Jharkhand tourism, safety, culture..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isTyping || !message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="flex items-center justify-center mt-2 space-x-4">
                <Badge variant="outline" className="text-xs">
                  <Volume2 className="w-3 h-3 mr-1" />
                  Voice Ready
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Radio className="w-3 h-3 mr-1" />
                  D2M Emergency
                </Badge>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}