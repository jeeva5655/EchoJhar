import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Brain, MapPin, Utensils, Calendar, TrendingUp, Star, Clock, Shield, Send, Bot, User, Loader2, Sparkles } from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface GeminiResponse {
  success: boolean;
  content: string;
  suggestions?: string[];
  error?: string;
}

export function AIAssistant() {
  const [preferences, setPreferences] = useState("");
  const [healthNeeds, setHealthNeeds] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Travel Assistant powered by Google Gemini. I can help you with personalized travel recommendations, itinerary planning, safety advice, and answer any questions about your destination. How can I help you today?',
      timestamp: new Date(),
      suggestions: [
        'Plan a day trip itinerary',
        'Find safe restaurants nearby',
        'Emergency contact information',
        'Local cultural tips'
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Google Gemini AI Integration
  const callGeminiAPI = async (message: string, context?: string): Promise<GeminiResponse> => {
    try {
      if (apiKey) {
        // Real Google Gemini API call
        const prompt = `
Context: You are a travel safety and experience AI assistant for tourists in the TravelSafe application.
User Profile:
- Preferences: ${preferences}
- Health/Dietary Needs: ${healthNeeds}
- Current Destination: ${destination}
- Trip Duration: ${duration}

User Message: ${message}

Please provide helpful, safety-focused travel advice and recommendations. Keep responses concise but informative. Focus on tourist safety, local insights, and personalized recommendations based on the user's profile.
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH", 
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Gemini API Error Response:', errorText);
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Gemini API Response:', data);
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
          return {
            success: true,
            content: data.candidates[0].content.parts[0].text,
            suggestions: generateContextualSuggestions(message)
          };
        } else if (data.error) {
          throw new Error(`Gemini API Error: ${data.error.message}`);
        } else {
          console.error('Unexpected response format:', data);
          throw new Error('Invalid response format from Gemini API');
        }
      } else {
        // Use mock response when no API key is provided
        const mockResponse = await simulateGeminiResponse(message, {
          preferences,
          healthNeeds,
          destination,
          duration
        });
        return mockResponse;
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      let errorMessage = "Sorry, I'm having trouble connecting to the AI service.";
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = "Invalid API key. Please check your Google Gemini API key and try again.";
        } else if (error.message.includes('403')) {
          errorMessage = "API access forbidden. Please check your API key permissions.";
        } else if (error.message.includes('429')) {
          errorMessage = "API rate limit exceeded. Please wait a moment and try again.";
        } else if (error.message.includes('404')) {
          errorMessage = "API endpoint not found. Please verify your API configuration.";
        } else if (error.message.includes('400')) {
          errorMessage = "Invalid request format. The API request was malformed.";
        }
      }
      
      return {
        success: false,
        content: errorMessage,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  };

  // Generate contextual suggestions based on the user's message
  const generateContextualSuggestions = (message: string): string[] => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('restaurant') || lowerMessage.includes('food')) {
      return ['Find nearby restaurants', 'Dietary restrictions help', 'Local cuisine recommendations', 'Safe dining options'];
    }
    
    if (lowerMessage.includes('safety') || lowerMessage.includes('emergency')) {
      return ['Emergency contacts', 'Safety tips', 'Nearest hospital', 'Report an incident'];
    }
    
    if (lowerMessage.includes('itinerary') || lowerMessage.includes('plan')) {
      return ['Modify itinerary', 'Add activities', 'Check opening hours', 'Transportation options'];
    }
    
    return ['Plan my day', 'Safety information', 'Local recommendations', 'Emergency help'];
  };

  // Simulate Gemini AI responses (replace with actual API call)
  const simulateGeminiResponse = async (message: string, context: any): Promise<GeminiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('itinerary') || lowerMessage.includes('plan')) {
      return {
        success: true,
        content: `Based on your preferences for ${context.destination}, I've created a personalized itinerary. Since you mentioned ${context.preferences}, I've included cultural sites and local experiences. For your dietary needs (${context.healthNeeds}), I've selected restaurants with appropriate options. Here's what I recommend:

🌅 **Morning (9:00 AM)**
- Start at the Heritage Museum - 2 hours of cultural exploration
- Safety tip: Keep your digital ID accessible for entry

🍽️ **Lunch (12:30 PM)**  
- Spice Garden Restaurant - Offers ${context.healthNeeds} friendly options
- Located in a safe, well-monitored tourist district

🏛️ **Afternoon (2:30 PM)**
- Guided walking tour of historical sites
- Low physical intensity, perfect for all fitness levels

🌆 **Evening (6:00 PM)**
- Sunset viewing at Hill Station Viewpoint
- Our safety monitoring confirms this area is currently secure

Would you like me to adjust any part of this itinerary or provide more details about specific locations?`,
        suggestions: [
          'Tell me about local safety tips',
          'Find vegetarian restaurants',
          'Emergency contacts for this area',
          'Modify the itinerary timing'
        ]
      };
    }

    if (lowerMessage.includes('safety') || lowerMessage.includes('emergency')) {
      return {
        success: true,
        content: `Safety is our top priority! Here's important safety information for ${context.destination}:

🚨 **Emergency Contacts:**
- Local Emergency Services: 100
- Tourist Helpline: 1363
- Your registered emergency contact has been notified of your location

🛡️ **Current Safety Status:**
- Your location is in a monitored safe zone
- No current safety alerts in your area
- Geo-fencing is active and functioning

📱 **Safety Features Active:**
- Real-time location tracking
- Automatic check-in reminders
- Emergency button accessible in app

💡 **Local Safety Tips:**
- Keep your digital tourist ID visible when needed
- Stay in well-lit, populated areas
- Use recommended transport options
- Trust your instincts and contact us immediately if you feel unsafe

Is there a specific safety concern I can help you with?`,
        suggestions: [
          'Show nearby hospitals',
          'Find police stations',
          'Safe transport options',
          'Report a safety concern'
        ]
      };
    }

    if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      return {
        success: true,
        content: `Great! I can recommend restaurants that match your dietary preferences. Based on your needs for ${context.healthNeeds}, here are my top picks in ${context.destination}:

🍽️ **Highly Recommended:**

**Spice Garden** ⭐ 4.8/5
- Specializes in ${context.healthNeeds} options
- Verified safe food handling practices
- Location: Heritage District (monitored zone)
- Price Range: Moderate

**Green Leaf Cafe** ⭐ 4.6/5  
- 100% organic, allergy-conscious menu
- Popular with international tourists
- Location: City Center (high security area)
- Price Range: Budget-friendly

**Royal Kitchen** ⭐ 4.7/5
- Traditional cuisine with dietary modifications
- Certified by local health authorities  
- Location: Tourist Quarter (24/7 monitoring)
- Price Range: Premium

All recommended restaurants are in our safety network and regularly monitored. Would you like detailed directions to any of these places?`,
        suggestions: [
          'Get directions to Spice Garden',
          'Check restaurant opening hours',
          'Find more budget options',
          'Book a table recommendation'
        ]
      };
    }

    // Default response
    return {
      success: true,
      content: `I understand you're asking about "${message}". As your AI travel assistant, I'm here to help with:

✈️ **Travel Planning & Itineraries**
🛡️ **Safety Information & Monitoring**  
🍽️ **Restaurant & Dining Recommendations**
🏨 **Accommodation Suggestions**
🚗 **Transportation Guidance**
🏛️ **Local Attractions & Culture**
📱 **Emergency Support & Contacts**

Based on your profile:
- Destination: ${context.destination || 'Not specified'}
- Preferences: ${context.preferences || 'Not specified'}
- Dietary needs: ${context.healthNeeds || 'Not specified'}

How can I specifically help you today? Feel free to ask about any aspect of your travel experience!`,
      suggestions: [
        'Plan my day itinerary',
        'Find safe restaurants',
        'Local safety information',
        'Emergency contacts'
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      const response = await callGeminiAPI(newMessage);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  // Validate API key format
  const isValidApiKey = (key: string): boolean => {
    // Google API keys typically start with "AIza" and are 39 characters long
    return key.startsWith('AIza') && key.length === 39;
  };

  const recommendations = [
    {
      type: "Restaurant",
      name: "Spice Garden",
      rating: 4.8,
      description: "Authentic local cuisine with vegetarian options",
      healthNote: "Allergen-free options available"
    },
    {
      type: "Activity",  
      name: "Heritage Walking Tour",
      rating: 4.6,
      description: "2-hour guided tour of historical sites",
      healthNote: "Low physical intensity, suitable for all ages"
    },
    {
      type: "Transport",
      name: "City Metro Pass", 
      rating: 4.4,
      description: "Convenient and safe public transport",
      healthNote: "Air-conditioned, wheelchair accessible"
    }
  ];

  const itinerary = [
    { time: "09:00", activity: "Hotel Breakfast", location: "The Grand Hotel", notes: "Start with energy-rich meal" },
    { time: "10:30", activity: "Heritage Museum", location: "City Center", notes: "2-hour visit, photography allowed" },
    { time: "13:00", activity: "Lunch at Spice Garden", location: "Heritage District", notes: "Try the recommended local dishes" },
    { time: "15:00", activity: "City Park Walk", location: "Central Park", notes: "Light exercise, fresh air" },
    { time: "17:30", activity: "Shopping District", location: "Main Bazaar", notes: "Local crafts and souvenirs" },
    { time: "19:00", activity: "Sunset Viewpoint", location: "Hill Station", notes: "Perfect photo opportunity" }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
          <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
          AI Travel Assistant
          <Badge variant="secondary" className="ml-2">Powered by Google Gemini</Badge>
        </h1>
        <p className="text-gray-600">Get personalized recommendations and intelligent assistance powered by Google's advanced AI.</p>
      </div>

      {/* AI Chat Interface */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span>AI Chat Assistant</span>
          </CardTitle>
          <CardDescription>
            Chat with Google Gemini AI for instant travel advice and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ScrollArea className="h-96 border rounded-lg p-4">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'assistant' && (
                          <Bot className="w-4 h-4 mt-1 text-blue-600" />
                        )}
                        {message.type === 'user' && (
                          <User className="w-4 h-4 mt-1 text-white" />
                        )}
                        <div className="flex-1">
                          <div className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </div>
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      {message.suggestions && (
                        <div className="mt-3 space-y-1">
                          <p className="text-xs opacity-70">Quick suggestions:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded border transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Ask me anything about your travel plans..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* AI Preferences Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span>Personalization Setup</span>
            </CardTitle>
            <CardDescription>
              Help AI understand your preferences for better recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Travel Preferences
              </label>
              <Textarea
                placeholder="e.g., Historical sites, local food, outdoor activities, photography"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                className="h-20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Health & Dietary Needs
              </label>
              <Textarea
                placeholder="e.g., Vegetarian, no gluten, mobility assistance needed"
                value={healthNeeds}
                onChange={(e) => setHealthNeeds(e.target.value)}
                className="h-20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Current Destination
              </label>
              <Input
                placeholder="e.g., Jaipur, Rajasthan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                // Update AI context with new preferences
                const contextMessage = `Updated my preferences: ${preferences}, health needs: ${healthNeeds}, destination: ${destination}`;
                handleSendMessage();
                setNewMessage(contextMessage);
              }}
            >
              <Brain className="w-4 h-4 mr-2" />
              Update AI Profile
            </Button>
          </CardContent>
        </Card>

        {/* Itinerary Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span>Generate Itinerary</span>
            </CardTitle>
            <CardDescription>
              AI-powered itinerary based on your preferences and local insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Trip Duration
              </label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="half-day">Half Day (4 hours)</SelectItem>
                  <SelectItem value="full-day">Full Day (8 hours)</SelectItem>
                  <SelectItem value="2-days">2 Days</SelectItem>
                  <SelectItem value="3-days">3 Days</SelectItem>
                  <SelectItem value="week">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => {
                const itineraryRequest = `Please create a ${duration} itinerary for ${destination} based on my preferences`;
                setNewMessage(itineraryRequest);
                handleSendMessage();
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Generate Smart Itinerary
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span>AI Recommendations</span>
          </CardTitle>
          <CardDescription>
            Personalized suggestions based on your preferences and health needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">{rec.type}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{rec.rating}</span>
                  </div>
                </div>
                <h4 className="font-semibold mb-2">{rec.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                <p className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  💚 {rec.healthNote}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Google Gemini API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Google Gemini API Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure your Google Gemini API key for enhanced AI capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Setup Instructions:</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Google AI Studio</a></li>
              <li>Create a new API key for Gemini (click "Create API Key")</li>
              <li>Copy the API key (starts with "AIza" and is 39 characters long)</li>
              <li>Enter your API key below (stored locally only)</li>
              <li>Start chatting with enhanced AI capabilities</li>
            </ol>
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              <strong>Note:</strong> Make sure to enable the Gemini API in your Google Cloud Console and ensure billing is enabled for API usage.
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Google Gemini API Key
            </label>
            <Input
              type="password"
              placeholder="AIzaSy... (39 characters)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={`font-mono ${apiKey && !isValidApiKey(apiKey) ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {apiKey && !isValidApiKey(apiKey) && (
              <p className="text-xs text-red-600 mt-1">
                ⚠️ Invalid API key format. Google API keys start with "AIza" and are 39 characters long.
              </p>
            )}
            {!apiKey && (
              <p className="text-xs text-gray-500 mt-1">
                Currently using mock responses. Enter your API key for real Google Gemini integration.
              </p>
            )}
          </div>
          {apiKey && isValidApiKey(apiKey) && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                ✅ API key configured! Google Gemini integration is now active.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Itinerary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span>Today's AI-Generated Itinerary</span>
          </CardTitle>
          <CardDescription>
            Optimized schedule based on your preferences, weather, and local conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {itinerary.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-blue-600 min-w-16">
                  {item.time}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{item.activity}</h4>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {item.location}
                  </p>
                  <p className="text-xs text-green-600 mt-1">{item.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Anomaly Detection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span>AI Safety Monitoring</span>
          </CardTitle>
          <CardDescription>
            Real-time anomaly detection for your safety and security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Route Monitoring</h4>
              <p className="text-sm text-green-600">✓ Following planned itinerary</p>
              <p className="text-sm text-green-600">✓ Normal movement patterns</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Activity Detection</h4>
              <p className="text-sm text-blue-600">✓ Regular check-ins detected</p>
              <p className="text-sm text-blue-600">✓ No distress signals</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}