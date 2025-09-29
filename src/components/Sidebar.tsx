import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Home, 
  Compass, 
  Route, 
  ShoppingBag, 
  Languages, 
  Backpack, 
  Brain, 
  Shield, 
  Users, 
  MapPin, 
  AlertTriangle, 
  Bell, 
  Wifi, 
  User, 
  LogOut,
  Cloud,
  Camera,
  Star,
  BadgeIndianRupee,
  LineChart,
  Settings
} from "lucide-react";
import echoJharLogo from "../assets/0ac3abd4e99f5c9deeebeb2d55a584babb02036d.png";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userType: 'tourist' | 'admin' | 'business';
  userData: any;
  onLogout: () => void;
}

export function Sidebar({ activeSection, onSectionChange, userType, userData, onLogout }: SidebarProps) {
  // Define menu items based on user type
  const touristMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "experience-hub", label: "🌟 Experience Hub", icon: Compass },
    { id: "itinerary-planner", label: "🗺️ Smart Itinerary", icon: Route },
    { id: "ai-alerts", label: "🔔 AI Alerts", icon: Bell },
    { id: "marketplace", label: "🛍️ Local Market", icon: ShoppingBag },
    { id: "cultural-immersion", label: "🎭 Cultural Hub", icon: Languages },
    { id: "travel-essentials", label: "🎒 Travel Essentials", icon: Backpack },
    { id: "enhanced-ai-assistant", label: "🌐 EchoJhar AI", icon: Brain },
    { id: "ar-vr-experience", label: "🥽 AR/VR Tours", icon: Camera },
    { id: "safety-monitoring", label: "🔊 Enhanced Safety", icon: Shield },
    { id: "group-tracking", label: "Group Tracking", icon: Users },
    { id: "geo-map", label: "Google Maps", icon: MapPin },
    { id: "weather", label: "🌤️ Weather", icon: Cloud },
    { id: "emergency-services", label: "Emergency", icon: AlertTriangle },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "connectivity", label: "Connectivity", icon: Wifi },
    { id: "profile", label: "🔗 Blockchain ID", icon: User },
    { id: "digital-id-verification", label: "🔐 ID Verification", icon: Shield },
  ];

  const adminMenuItems = [
    { id: "admin", label: "Dashboard", icon: Home },
    { id: "enhanced-ai-assistant", label: "🌐 EchoJhar AI", icon: Brain },
    { id: "ai-alerts", label: "🔔 AI Alerts", icon: Bell },
    { id: "ar-vr-experience", label: "🥽 AR/VR Tours", icon: Camera },
    { id: "safety-monitoring", label: "🔊 Enhanced Safety", icon: Shield },
    { id: "geo-map", label: "🗺️ Google Maps", icon: MapPin },
    { id: "weather", label: "🌤️ Weather", icon: Cloud },
    { id: "notifications", label: "Alert Center", icon: Bell },
    { id: "emergency-services", label: "Emergency Ops", icon: AlertTriangle },
    { id: "connectivity", label: "System Status", icon: Wifi },
    { id: "digital-id-verification", label: "🔐 ID Verification", icon: Shield },
  ];

  const businessMenuItems = [
    { id: "business", label: "Dashboard", icon: Home },
    { id: "business-profile", label: "Profile", icon: Settings },
    { id: "business-products", label: "Products", icon: ShoppingBag },
    { id: "business-analytics", label: "Analytics", icon: LineChart },
    { id: "business-payments", label: "Payments", icon: BadgeIndianRupee },
    { id: "business-resources", label: "Resources", icon: Users },
    { id: "digipin", label: "⭐ DigiPin Check-ins", icon: Star },
    { id: "geo-map", label: "🗺️ Map", icon: MapPin },
    { id: "weather", label: "🌤️ Weather", icon: Cloud },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "emergency-services", label: "Emergency", icon: AlertTriangle },
  ];

  const menuItems = userType === 'admin' ? adminMenuItems : userType === 'business' ? businessMenuItems : touristMenuItems;

  return (
    <div className="w-64 bg-card text-card-foreground border-r border-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="mb-3">
          <img 
            src={echoJharLogo}
            alt="EchoJhar - Explore. Connect. Thrive."
            className="h-16 w-auto"
          />
        </div>
  <p className="text-sm text-muted-foreground">Jharkhand Tourism Platform</p>
        <div className="mt-3">
          <Badge variant={userType === 'admin' ? 'destructive' : 'default'} className="text-xs">
            {userType === 'admin' ? '🛡️ Admin Access' : userType === 'business' ? '� Business Access' : '�🌟 Tourist Access'}
          </Badge>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? userType === 'admin' 
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${
                    isActive 
                      ? userType === 'admin' ? "text-red-600" : "text-blue-600"
                      : "text-muted-foreground"
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={userType === 'admin' ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" : "https://images.unsplash.com/photo-1494790108755-2616c7e7e9de?w=150"} />
            <AvatarFallback>
              {userData?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {userData?.name || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userType === 'admin' 
                ? `Badge: ${userData?.id}` 
                : userType === 'business' ? `Reg: ${userData?.registrationId || userData?.id}` : `ID: ${userData?.id}`}
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}