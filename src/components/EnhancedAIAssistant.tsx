import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Brain, 
  MapPin, 
  Languages, 
  Globe, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Radio,
  Smartphone,
  AlertTriangle,
  Wifi,
  WifiOff,
  Mic,
  Volume2,
  Video,
  Camera,
  VolumeX
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  language?: string;
  suggestions?: string[];
  isD2M?: boolean;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
  { code: 'mni', name: 'Manipuri', native: 'মণিপুরী' },
  { code: 'bodo', name: 'Bodo', native: 'बोड़ो' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'ks', name: 'Kashmiri', native: 'کٲشُر' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी' },
  // International languages
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
  { code: 'no', name: 'Norwegian', native: 'Norsk' },
  { code: 'da', name: 'Danish', native: 'Dansk' },
  { code: 'fi', name: 'Finnish', native: 'Suomi' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
  { code: 'tl', name: 'Filipino', native: 'Filipino' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська' },
  { code: 'cs', name: 'Czech', native: 'Čeština' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar' },
  { code: 'ro', name: 'Romanian', native: 'Română' },
  { code: 'bg', name: 'Bulgarian', native: 'Български' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu' },
  { code: 'et', name: 'Estonian', native: 'Eesti' },
  { code: 'fa', name: 'Persian', native: 'فارسی' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ' }
];

export function EnhancedAIAssistant() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to EchoJhar AI Assistant! I support 60+ languages and can assist you even when you\'re offline through D2M technology. How can I help you explore Jharkhand today?',
      timestamp: new Date(),
      suggestions: [
        'Jharkhand tourist spots',
        'Emergency help in my language',
        'Local cultural information',
        'AR/VR site previews'
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [d2mEnabled, setD2mEnabled] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [arVrEnabled, setArVrEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // D2M (Direct-to-Mobile) Technology Simulation
  const simulateD2MBroadcast = () => {
    const d2mMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: '📡 D2M Emergency Broadcast: Tourist safety alert in Netarhat area. Severe weather warning. Seek shelter immediately. Emergency services dispatched. This message was delivered via Direct-to-Mobile broadcasting technology without internet connectivity.',
      timestamp: new Date(),
      isD2M: true
    };
    setChatMessages(prev => [...prev, d2mMessage]);
  };

  // Multilingual AI Response Simulation
  const translateResponse = (text: string, targetLang: string): string => {
    const translations: Record<string, Record<string, string>> = {
      'hi': {
        'Hello! How can I help you explore Jharkhand today?': 'नमस्ते! मैं आज झारखंड का भ्रमण करने में आपकी कैसे मदद कर सकता हूं?',
        'Emergency services have been notified.': 'आपातकालीन सेवाओं को सूचित कर दिया गया है।',
        'Here are the top attractions in Jharkhand:': 'झारखंड के प्रमुख आकर्षण हैं:'
      },
      'bn': {
        'Hello! How can I help you explore Jharkhand today?': 'হ্যালো! আজ ঝাড়খণ্ড অন্বেষণ করতে আমি কীভাবে আপনাকে সাহায্য করতে পারি?',
        'Emergency services have been notified.': 'জরুরি সেবাগুলিকে অবহিত করা হয়েছে।'
      },
      'te': {
        'Hello! How can I help you explore Jharkhand today?': 'హలో! ఈ రోజు ఝార్ఖండ్‌ను అన్వేషించడంలో నేను మీకు ఎలా సహాయం చేయగలను?'
      },
      'es': {
        'Hello! How can I help you explore Jharkhand today?': '¡Hola! ¿Cómo puedo ayudarte a explorar Jharkhand hoy?'
      },
      'fr': {
        'Hello! How can I help you explore Jharkhand today?': 'Bonjour! Comment puis-je vous aider à explorer le Jharkhand aujourd\'hui?'
      }
    };
    
    return translations[targetLang]?.[text] || text;
  };

  // Enhanced AI Response with Jharkhand-specific content
  const generateAIResponse = async (message: string): Promise<ChatMessage> => {
    await new Promise(resolve => setTimeout(resolve, isOffline ? 500 : 1500));
    
    const lowerMessage = message.toLowerCase();
    let content = '';
    let suggestions: string[] = [];

    if (lowerMessage.includes('jharkhand') || lowerMessage.includes('tourist') || lowerMessage.includes('places')) {
      content = `🏞️ **Discover Jharkhand's Treasures:**

**🌊 Waterfalls:**
• **Hundru Falls** - 98m high, most famous waterfall
• **Dassam Falls** - Spectacular 44m cascade
• **Jonha Falls** - Perfect for photography and picnics

**🏔️ Hills & Nature:**
• **Netarhat** - "Queen of Chotanagpur", sunset point
• **Patratu Valley** - Scenic hills and dam views
• **Ranchi Hill** - Hanuman Temple and city views

**🐅 Wildlife:**
• **Betla National Park** - Tigers, elephants, sloth bears
• **Palamau Tiger Reserve** - Project Tiger reserve

**🎨 Cultural Heritage:**
• **Dokra Art** - Ancient metal casting technique
• **Paitkar Paintings** - Traditional scroll paintings
• **Sohrai & Kohvar** - Beautiful tribal wall art

Would you like detailed information about any specific attraction?`;

      suggestions = [
        'Show AR preview of Hundru Falls',
        'Plan Netarhat trip',
        'Tribal festivals information',
        'Emergency contacts'
      ];
    } else if (lowerMessage.includes('ar') || lowerMessage.includes('vr') || lowerMessage.includes('preview')) {
      content = `🥽 **AR/VR Experiences Available:**

**🌊 Virtual Waterfall Tours:**
• 360° Hundru Falls experience
• Dassam Falls immersive view
• Jonha Falls with sound effects

**🏛️ Heritage Site VR:**
• Maluti Temples virtual walkthrough
• Jagannath Temple 3D exploration
• Betla Fort historical recreation

**📱 AR Features:**
• Point camera at landmarks for information
• Cultural artifact recognition
• Wildlife spotting guide
• Traditional art pattern scanner

**🎬 YouTube Integration:**
Currently loading exclusive Jharkhand VR content from verified tourism channels...

*Note: This is a demo. Real implementation would require VR headset or AR-capable device.*`;

      suggestions = [
        'Start AR camera',
        'Watch VR waterfall tour',
        'Heritage site 3D view',
        'Wildlife AR guide'
      ];
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('safety')) {
      content = `🚨 **Emergency & Safety Information:**

**📞 Emergency Contacts:**
• Police: 100
• Fire: 101  
• Ambulance: 108
• Tourist Helpline: 1363
• Jharkhand Tourism: +91-651-2446851

**📡 D2M Alert System:**
Your location is being monitored. In case of emergency, you'll receive direct alerts even without internet connectivity.

**🛡️ Safety Features Active:**
• Real-time GPS tracking
• Geo-fence monitoring
• Panic button activated
• Local guide network alerted

**🏥 Nearest Medical Facilities:**
• RIMS Hospital, Ranchi (15 km)
• Sadar Hospital (8 km)
• Private clinics with tourist support

Need immediate assistance? Use the panic button or call emergency services.`;

      suggestions = [
        'Activate panic button',
        'Find nearest hospital',
        'Contact local guide',
        'Weather alerts'
      ];
      
      // Simulate D2M broadcast for emergency
      if (d2mEnabled) {
        setTimeout(simulateD2MBroadcast, 2000);
      }
    } else if (lowerMessage.includes('d2m') || lowerMessage.includes('offline')) {
      content = `📡 **D2M (Direct-to-Mobile) Technology:**

**🔧 How D2M Works:**
D2M enables direct content broadcasting to mobile devices without internet connectivity, perfect for:

**🚨 Emergency Broadcasting:**
• Weather alerts and warnings
• Safety notifications
• Evacuation instructions
• Emergency contact information

**📺 Tourist Information:**
• Local attraction details
• Cultural program schedules
• Transportation updates
• Language assistance

**🌐 Offline Features:**
• Basic AI responses cached locally
• Essential maps and directions
• Emergency protocols
• Multi-language support

**📡 Coverage Areas:**
• Major tourist destinations
• Remote trekking areas
• Emergency response zones
• Cultural heritage sites

*D2M is especially useful in Jharkhand's remote areas where network coverage may be limited.*`;

      suggestions = [
        'Enable D2M alerts',
        'Test offline mode',
        'Emergency protocols',
        'Coverage area map'
      ];
    } else {
      content = `🤖 I'm EchoJhar AI, your multilingual travel companion for Jharkhand! I can help with:

**🏞️ Tourism:** Attractions, itineraries, local insights
**🛡️ Safety:** Emergency contacts, real-time alerts
**🌐 Languages:** 60+ languages supported
**📡 D2M:** Offline emergency broadcasting
**🥽 AR/VR:** Immersive site previews
**🎨 Culture:** Tribal traditions, festivals, art

What would you like to explore today?`;

      suggestions = [
        'Famous waterfalls in Jharkhand',
        'Tribal art and culture',
        'Safety and emergency info',
        'AR site previews'
      ];
    }

    // Translate if not English
    if (selectedLanguage !== 'en') {
      content = translateResponse(content, selectedLanguage);
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content,
      timestamp: new Date(),
      language: selectedLanguage,
      suggestions
    };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date(),
      language: selectedLanguage
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      const response = await generateAIResponse(newMessage);
      setChatMessages(prev => [...prev, response]);
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

  // Voice functionality simulation
  const handleVoiceInput = () => {
    if (!voiceEnabled) return;
    
    setNewMessage("I want to visit Hundru Falls today");
    const voiceMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: '🎤 Voice input detected: "I want to visit Hundru Falls today"',
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, voiceMessage]);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2 flex items-center">
          <Globe className="w-8 h-8 text-blue-600 mr-3" />
          EchoJhar AI Assistant
          <Badge variant="secondary" className="ml-3">Global Languages</Badge>
          <Badge variant="outline" className="ml-2">D2M Ready</Badge>
        </h1>
        <p className="text-gray-600">
          Multilingual AI assistant with D2M technology, AR/VR previews, and comprehensive Jharkhand tourism support.
        </p>
      </div>

      {/* Technology Status Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Languages className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Language:</span>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.native} ({lang.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">D2M:</span>
              <Switch
                checked={d2mEnabled}
                onCheckedChange={setD2mEnabled}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Mic className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium">Voice:</span>
              <Switch
                checked={voiceEnabled}
                onCheckedChange={setVoiceEnabled}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium">AR/VR:</span>
              <Switch
                checked={arVrEnabled}
                onCheckedChange={setArVrEnabled}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isOffline ? (
              <WifiOff className="w-5 h-5 text-red-500" />
            ) : (
              <Wifi className="w-5 h-5 text-green-500" />
            )}
            <span className="text-sm font-medium">
              {isOffline ? 'Offline Mode' : 'Online'}
            </span>
          </div>
        </div>
      </div>

      {d2mEnabled && (
        <Alert>
          <Radio className="h-4 w-4" />
          <AlertDescription>
            D2M (Direct-to-Mobile) broadcasting is active. You'll receive emergency alerts and tourist information even without internet connectivity.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span>Multilingual Chat Assistant</span>
            {selectedLanguage !== 'en' && (
              <Badge variant="outline">
                {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.native}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Chat in your preferred language with AR/VR integration and offline D2M support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ScrollArea className="h-96 border rounded-lg p-4 bg-gray-50">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.type === 'system'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-white text-gray-900 border'
                      } ${message.isD2M ? 'border-red-300 bg-red-50 text-red-800' : ''}`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'assistant' && (
                          <Bot className="w-4 h-4 mt-1 text-blue-600" />
                        )}
                        {message.type === 'user' && (
                          <User className="w-4 h-4 mt-1 text-white" />
                        )}
                        {message.type === 'system' && (
                          <Sparkles className="w-4 h-4 mt-1 text-green-600" />
                        )}
                        {message.isD2M && (
                          <Radio className="w-4 h-4 mt-1 text-red-600" />
                        )}
                        <div className="flex-1">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>
                          <div className="text-xs opacity-70 mt-2 flex items-center space-x-2">
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            {message.language && message.language !== 'en' && (
                              <Badge variant="outline" className="text-xs">
                                {SUPPORTED_LANGUAGES.find(l => l.code === message.language)?.native}
                              </Badge>
                            )}
                            {message.isD2M && (
                              <Badge variant="destructive" className="text-xs">
                                D2M Broadcast
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {message.suggestions && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs opacity-70">Quick suggestions:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full border transition-colors"
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
                    <div className="bg-white border rounded-lg px-4 py-3 flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                      <span className="text-sm text-gray-600">Processing in {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.native}...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="flex space-x-2">
              <Input
                placeholder={`Type your message in ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.native}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              {voiceEnabled && (
                <Button
                  variant="outline"
                  onClick={handleVoiceInput}
                  disabled={isLoading}
                  className="px-3"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              )}
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

      {/* AR/VR Preview Section */}
      {arVrEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-orange-600" />
              <span>AR/VR Jharkhand Previews</span>
              <Badge variant="secondary">YouTube Integration</Badge>
            </CardTitle>
            <CardDescription>
              Immersive previews of Jharkhand's attractions with YouTube VR content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "Hundru Falls VR",
                  image: "https://images.unsplash.com/photo-1735567065045-97ba386867ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKaGFya2hhbmQlMjB3YXRlcmZhbGxzJTIwbmF0dXJlJTIwaGlsbHMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU5MDU4NjUwfDA&ixlib=rb-4.1.0&q=80&w=300",
                  type: "360° Video"
                },
                {
                  name: "Betla National Park",
                  image: "https://images.unsplash.com/photo-1649468508663-3cc7829b2956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWdlciUyMHdpbGRsaWZlJTIwbmF0aW9uYWwlMjBwYXJrJTIwZm9yZXN0fGVufDF8fHx8MTc1OTA1ODY1Nnww&ixlib=rb-4.1.0&q=80&w=300",
                  type: "Wildlife AR"
                },
                {
                  name: "Maluti Temples",
                  image: "https://images.unsplash.com/photo-1708670094480-29a79ae826c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwdGVtcGxlJTIwaGVyaXRhZ2UlMjBhcmNoaXRlY3R1cmUlMjBJbmRpYXxlbnwxfHx8fDE3NTkwNTg2NTl8MA&ixlib=rb-4.1.0&q=80&w=300",
                  type: "Heritage VR"
                }
              ].map((preview, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <img 
                    src={preview.image} 
                    alt={preview.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-semibold mb-1">{preview.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {preview.type}
                    </Badge>
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => setNewMessage(`Show me AR preview of ${preview.name}`)}
                    >
                      <Video className="w-3 h-3 mr-1" />
                      Launch Preview
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* D2M Technology Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-green-600" />
            <span>D2M Technology</span>
            <Badge variant={d2mEnabled ? "default" : "secondary"}>
              {d2mEnabled ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Direct-to-Mobile broadcasting for offline emergency communication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Emergency Broadcasting</h4>
                <p className="text-sm text-green-700">
                  Receive critical safety alerts and emergency information even without internet connectivity.
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Tourist Information</h4>
                <p className="text-sm text-blue-700">
                  Access local attraction details, cultural programs, and transportation updates offline.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={simulateD2MBroadcast}
                className="flex-1"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Test Emergency Broadcast
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsOffline(!isOffline)}
                className="flex-1"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Simulate {isOffline ? 'Online' : 'Offline'} Mode
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}