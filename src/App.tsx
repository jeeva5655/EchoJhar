import { useState, useEffect } from "react";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import { UserHeader } from "./components/UserHeader";
import { ConnectivityPage } from "./components/ConnectivityPage";
import { BlockchainDigitalID } from "./components/BlockchainDigitalID";
import { ExploreDestination } from "./components/ExploreDestination";
import { AIAssistant } from "./components/AIAssistant";
import { EnhancedAIAssistant } from "./components/EnhancedAIAssistant";
import { ARVRExperience } from "./components/ARVRExperience";
import { EnhancedSafetyMonitoring } from "./components/EnhancedSafetyMonitoring";
import { GroupTracking } from "./components/GroupTracking";
import { GoogleMapComponent } from "./components/GoogleMapComponent";
import { EmergencyServices } from "./components/EmergencyServices";
import { NotificationCenter } from "./components/NotificationCenter";
import { AdminDashboard } from "./components/AdminDashboard";
import { TouristExperienceHub } from "./components/TouristExperienceHub";
import { SmartItineraryPlanner } from "./components/SmartItineraryPlanner";
import { LocalMarketplace } from "./components/LocalMarketplace";
import { CulturalImmersion } from "./components/CulturalImmersion";
import { TravelEssentialsHub } from "./components/TravelEssentialsHub";
import { MapErrorBoundary } from "./components/MapErrorBoundary";
import { FloatingAIAssistant } from "./components/FloatingAIAssistant";
import AIChatbotAlerts from "./components/AIChatbotAlerts";
import DigitalIDVerification from "./components/DigitalIDVerification";
import WeatherPredictions from "./components/WeatherPredictions.tsx";
import { BusinessDashboard } from "./components/BusinessDashboard.tsx";
import { DigiPinCheckin } from "./components/DigiPinCheckin.tsx";
import BusinessProfile from "./components/BusinessProfile";
import BusinessProducts from "./components/BusinessProducts";
import BusinessAnalytics from "./components/BusinessAnalytics";
import BusinessPayments from "./components/BusinessPayments";
import BusinessResources from "./components/BusinessResources";
import { Button } from "./components/ui/button";
import {
  
  User,
  Map,
  Smartphone,
  
  Brain,
  Shield,
  Users,
  AlertTriangle,
  Bell,
  
  Compass,
  Route,
  ShoppingBag,
  Star,
  Gift,
  Camera,
  Languages,
  Backpack,
  Radio,
  Video,
} from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<
    "tourist" | "admin" | "business" | null
  >(null);
  const [userData, setUserData] = useState<any>(null);
  const [activeSection, setActiveSection] =
    useState("dashboard");

  // Suppress geolocation-related console warnings
  useEffect(() => {
    const originalWarn = console.warn;
    const originalError = console.error;
    
    console.warn = (...args) => {
      const message = args.join(' ').toLowerCase();
      if (message.includes('geolocation') || 
          message.includes('permission') && message.includes('policy')) {
        // Silently ignore geolocation policy warnings
        return;
      }
      originalWarn.apply(console, args);
    };
    
    console.error = (...args) => {
      const message = args.join(' ').toLowerCase();
      if (message.includes('geolocation') || 
          message.includes('permission') && message.includes('policy')) {
        // Silently ignore geolocation policy errors
        return;
      }
      originalError.apply(console, args);
    };
    
    // Cleanup on unmount
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const handleLogin = (
    type: "tourist" | "admin" | "business",
    data: any,
  ) => {
    setUserType(type);
    setUserData(data);
    setIsAuthenticated(true);
    // Set initial section based on user type
    setActiveSection(type === "admin" ? "admin" : type === "business" ? "business" : "dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setUserData(null);
    setActiveSection("dashboard");
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🌍 Welcome back,{" "}
                {userData?.name?.split(" ")[0] || "User"}!
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {userType === "admin"
                  ? "Administrative Dashboard - Monitor tourist safety operations, manage alerts, and coordinate emergency responses across EchoJhar's comprehensive tourism platform."
                  : userType === "business"
                  ? "Business Portal - Track sales, manage DigiPin check-ins, understand visitor demographics, and access AI-driven recommendations to grow your tourism business."
                  : "EchoJhar - Discover Jharkhand's natural beauty and cultural heritage with AI-powered assistance, AR/VR experiences, multilingual support, D2M emergency broadcasting, and comprehensive safety monitoring."}
              </p>
              {userType === "admin" && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
                  <p className="text-sm text-red-800">
                    <strong>Current Status:</strong>{" "}
                    {userData?.department} | Clearance:{" "}
                    {userData?.clearanceLevel} | Jurisdiction:{" "}
                    {userData?.jurisdiction}
                  </p>
                </div>
              )}
              {userType === "business" && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg max-w-2xl mx-auto">
                  <p className="text-sm text-green-800">
                    <strong>Vendor:</strong> {userData?.name} | Reg: {userData?.registrationId || userData?.id} | Sector: {userData?.sector || "Tourism"}
                  </p>
                </div>
              )}
              {userType === "tourist" &&
                userData?.digitalIdVerified && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg max-w-2xl mx-auto">
                    <p className="text-sm text-green-800">
                      ✅{" "}
                      <strong>Digital Identity Verified</strong>{" "}
                      | Emergency Contact:{" "}
                      {userData?.emergencyContact} | Check-in:{" "}
                      {new Date(
                        userData?.checkInDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
            </div>

            {userType === "tourist" ? (
              <div className="grid md:grid-cols-3 gap-6">
                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => setActiveSection("experience-hub")}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Compass className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    Experience Hub
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Discover personalized experiences, earn rewards, and connect with local culture.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <Gift className="w-3 h-3 mr-1" />
                      Earn Points
                    </div>
                    <div className="flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 mr-1" />
                      AI Powered
                    </div>
                  </div>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => setActiveSection("itinerary-planner")}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                    <Route className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-green-600 transition-colors">
                    Smart Itinerary
                  </h3>
                  <p className="text-gray-600 text-sm">
                    AI-powered trip planning that adapts to your interests and budget.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      <Brain className="w-3 h-3 mr-1" />
                      AI Planner
                    </div>
                    <div className="flex items-center text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      <Camera className="w-3 h-3 mr-1" />
                      Photo Spots
                    </div>
                  </div>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => setActiveSection("marketplace")}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                    Local Marketplace
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Authentic handicrafts directly from local artisans with blockchain verification.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <Shield className="w-3 h-3 mr-1" />
                      Authentic
                    </div>
                    <div className="flex items-center text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 mr-1" />
                      Local Artists
                    </div>
                  </div>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => setActiveSection("cultural-immersion")}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <Languages className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                    Cultural Immersion
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Authentic cultural experiences, language assistance, and local guide connections.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      <Languages className="w-3 h-3 mr-1" />
                      Voice Translation
                    </div>
                    <div className="flex items-center text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                      <Users className="w-3 h-3 mr-1" />
                      Local Guides
                    </div>
                  </div>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => setActiveSection("travel-essentials")}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Backpack className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-cyan-600 transition-colors">
                    Travel Essentials
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Medical recommendations, connectivity solutions, and local travel insights.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      <Shield className="w-3 h-3 mr-1" />
                      Health Alerts
                    </div>
                    <div className="flex items-center text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                      <Smartphone className="w-3 h-3 mr-1" />
                      Connectivity
                    </div>
                  </div>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveSection("profile")}
                >
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    Digital Tourist ID
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your verified blockchain-secured identity for
                    contactless travel experiences.
                  </p>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() =>
                    setActiveSection("safety-monitoring")
                  }
                >
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    Safety Monitoring
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Real-time safety alerts, panic button, and
                    geo-fencing protection.
                  </p>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() =>
                    setActiveSection("group-tracking")
                  }
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    Group Tracking
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Stay connected with travel companions through
                    real-time location sharing.
                  </p>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveSection("geo-map")}
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <Map className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    Live Maps
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Real-time location tracking with interactive maps
                    and geo-fencing capabilities.
                  </p>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => setActiveSection("enhanced-ai-assistant")}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                    <Languages className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    EchoJhar AI Assistant
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Multilingual AI with D2M technology, supporting 60+ languages and offline emergency broadcasting.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      <Languages className="w-3 h-3 mr-1" />
                      60+ Languages
                    </div>
                    <div className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <Radio className="w-3 h-3 mr-1" />
                      D2M Ready
                    </div>
                  </div>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => setActiveSection("ar-vr-experience")}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                    AR/VR Experiences
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Immersive virtual reality tours of Jharkhand's waterfalls, wildlife, and heritage sites.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      <Video className="w-3 h-3 mr-1" />
                      VR Tours
                    </div>
                    <div className="flex items-center text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      <Smartphone className="w-3 h-3 mr-1" />
                      YouTube
                    </div>
                  </div>
                </div>
              </div>
            ) : userType === "admin" ? (
              <div className="grid md:grid-cols-3 gap-6">
                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveSection("enhanced-ai-assistant")}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    EchoJhar AI Assistant
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Multilingual AI with D2M technology for emergency broadcasts and tourist assistance.
                  </p>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() =>
                    setActiveSection("safety-monitoring")
                  }
                >
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    Safety Monitoring
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Real-time safety alerts, panic button, and
                    geo-fencing protection.
                  </p>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() =>
                    setActiveSection("group-tracking")
                  }
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    Group Tracking
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Stay connected with travel companions through
                    real-time location sharing.
                  </p>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() =>
                    setActiveSection("emergency-services")
                  }
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    Emergency Services
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Quick access to emergency contacts and backup
                    communication systems.
                  </p>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveSection("profile")}
                >
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Digital Tourist ID</h3>
                  <p className="text-gray-600 text-sm">
                    Your verified blockchain-secured identity for contactless travel experiences.
                  </p>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveSection("notifications")}
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Bell className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    Notifications
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Manage alerts, emergency broadcasting, and multilingual support.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveSection("business")}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Business Dashboard</h3>
                  <p className="text-gray-600 text-sm">Overview of sales, check-ins, and visitor insights.</p>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveSection("digipin")}
                >
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold mb-2">DigiPin Check-ins</h3>
                  <p className="text-gray-600 text-sm">Verify tourist check-ins and award rewards.</p>
                </div>

                <div
                  className="bg-card text-card-foreground p-6 rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveSection("weather")}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Bell className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Alerts & Weather</h3>
                  <p className="text-gray-600 text-sm">Stay updated with conditions and notifications.</p>
                </div>
              </div>
            )}

            {/* Quick AI Assistant Access */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 flex items-center">
                    <Brain className="w-8 h-8 mr-3" />
                    EchoJhar AI Assistant
                  </h3>
                  <p className="text-indigo-100 mb-4 max-w-2xl">
                    Get instant help with Jharkhand tourism, safety alerts, cultural information, emergency support, and multilingual assistance. Always available in the floating assistant button!
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center text-sm bg-white/20 px-3 py-1 rounded-full">
                      <Languages className="w-4 h-4 mr-2" />
                      60+ Languages
                    </div>
                    <div className="flex items-center text-sm bg-white/20 px-3 py-1 rounded-full">
                      <Radio className="w-4 h-4 mr-2" />
                      D2M Emergency Ready
                    </div>
                    <div className="flex items-center text-sm bg-white/20 px-3 py-1 rounded-full">
                      <Shield className="w-4 h-4 mr-2" />
                      24/7 Safety Monitor
                    </div>
                  </div>
                  <Button 
                    onClick={() => setActiveSection("enhanced-ai-assistant")}
                    variant="secondary"
                    className="bg-white text-indigo-600 hover:bg-gray-100"
                  >
                    Open Full AI Assistant
                  </Button>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                    <Brain className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Removed: EchoJhar banner section (blue/purple gradient) per user request */}
          </div>
        );
      case "experience-hub":
        return <TouristExperienceHub userData={userData} />;
      case "itinerary-planner":
        return <SmartItineraryPlanner userData={userData} />;
      case "marketplace":
        return <LocalMarketplace userData={userData} />;
      case "cultural-immersion":
        return <CulturalImmersion userData={userData} />;
      case "travel-essentials":
        return <TravelEssentialsHub userData={userData} />;
      case "ai-assistant":
        return <AIAssistant />;
      case "enhanced-ai-assistant":
        return <EnhancedAIAssistant />;
      case "ar-vr-experience":
        return <ARVRExperience />;
      case "safety-monitoring":
        return <EnhancedSafetyMonitoring />;
      case "group-tracking":
        return <GroupTracking />;
      case "geo-map":
        return (
          <MapErrorBoundary>
            <GoogleMapComponent
              userType={userType! as "tourist" | "admin" | "business"}
              userData={userData}
            />
          </MapErrorBoundary>
        );
      case "emergency-services":
        return <EmergencyServices />;
      case "notifications":
        return <NotificationCenter />;
      case "ai-alerts":
        return <AIChatbotAlerts />;
      case "digital-id-verification":
        return <DigitalIDVerification />;
      case "weather":
        return <WeatherPredictions />;
      case "connectivity":
        return <ConnectivityPage />;
      case "admin":
        return (
          <AdminDashboard
            userType={(userType as "tourist" | "admin")!}
            userData={userData}
          />
        );
      case "business":
        return (
          <BusinessDashboard
            userData={userData}
            onNavigate={(s: string) => setActiveSection(s)}
          />
        );
      case "business-profile":
        return <BusinessProfile userData={userData} />;
      case "business-products":
        return <BusinessProducts />;
      case "business-analytics":
        return <BusinessAnalytics />;
      case "business-payments":
        return <BusinessPayments />;
      case "business-resources":
        return <BusinessResources />;
      case "digipin":
        return <DigiPinCheckin userData={userData} />;
      case "profile":
        return <BlockchainDigitalID />;
      case "explore":
        return <ExploreDestination />;
      default:
        return (
          <div className="p-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome to EchoJhar
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        userType={userType! as "tourist" | "admin" | "business"}
        userData={userData}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <UserHeader
          userType={userType! as "tourist" | "admin" | "business"}
          userData={userData}
          onLogout={handleLogout}
        />

        <div className="flex-1">
          {activeSection === "explore" ? (
            renderContent()
          ) : (
            <div className="p-0">{renderContent()}</div>
          )}
        </div>
      </div>

      {/* Floating AI Assistant for quick access */}
      <FloatingAIAssistant userData={userData} />
    </div>
  );
}