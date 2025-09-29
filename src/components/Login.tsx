import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import { Brain, Shield, Users, AlertTriangle, User, Lock, Mail, MapPin, Eye, EyeOff } from "lucide-react";
import { hasValidGoogleOAuth } from "../config/environment";
import echoJharLogo from '../assets/0ac3abd4e99f5c9deeebeb2d55a584babb02036d.png';

interface LoginProps {
  onLogin: (userType: 'tourist' | 'admin' | 'business', userData: any) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [activeTab, setActiveTab] = useState("tourist");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Tourist login form state
  const [touristForm, setTouristForm] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  // Admin login form state
  const [adminForm, setAdminForm] = useState({
    badgeId: "",
    password: "",
    department: "",
    rememberMe: false
  });

  // Business login form state
  const [businessForm, setBusinessForm] = useState({
    email: "",
    businessName: "",
    registrationId: "",
    password: "",
    rememberMe: false
  });

  const handleTouristLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (touristForm.email === "tourist@example.com" && touristForm.password === "password") {
        onLogin('tourist', {
          id: "TS001234",
          name: "Sophia Clark",
          email: touristForm.email,
          nationality: "American",
          passportNumber: "US123456789",
          emergencyContact: "+1-555-123-4567",
          checkInDate: new Date().toISOString(),
          digitalIdVerified: true
        });
      } else {
        setError("Invalid email or password. Try: tourist@example.com / password");
      }
      setLoading(false);
    }, 1500);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (adminForm.badgeId === "ADMIN001" && adminForm.password === "admin123") {
        onLogin('admin', {
          id: adminForm.badgeId,
          name: "Officer Sarah Johnson",
          department: adminForm.department || "Tourist Safety Division",
          rank: "Inspector",
          jurisdiction: "Jaipur District",
          clearanceLevel: "Level 3",
          loginTime: new Date().toISOString()
        });
      } else {
        setError("Invalid badge ID or password. Try: ADMIN001 / admin123");
      }
      setLoading(false);
    }, 1500);
  };

  const handleBusinessLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (
        businessForm.email === "business@example.com" &&
        businessForm.password === "password"
      ) {
        onLogin('business', {
          id: "BUS001",
          name: businessForm.businessName || "Shree Handicrafts",
          email: businessForm.email,
          registrationId: businessForm.registrationId || "GSTIN29ABCDE1234F1Z5",
          sector: "Handicrafts",
          contact: "+91-98765-43210",
          digitalIdVerified: true,
          loginTime: new Date().toISOString(),
        });
      } else {
        setError("Invalid business credentials. Try: business@example.com / password");
      }
      setLoading(false);
    }, 1200);
  };

  const handleQuickTouristLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin('tourist', {
        id: "TS001234",
        name: "Demo Tourist",
        email: "demo@tourist.com",
        nationality: "International",
        passportNumber: "DEMO123456",
        emergencyContact: "+1-555-DEMO",
        checkInDate: new Date().toISOString(),
        digitalIdVerified: true
      });
      setLoading(false);
    }, 1000);
  };

  const handleQuickAdminLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin('admin', {
        id: "ADMIN001",
        name: "Demo Administrator",
        department: "Tourist Safety Division",
        rank: "Inspector",
        jurisdiction: "Demo District",
        clearanceLevel: "Level 3",
        loginTime: new Date().toISOString()
      });
      setLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = async (userType: 'tourist' | 'admin' | 'business') => {
    setLoading(true);
    setError("");

    try {
  // const oauthConfig = getGoogleOAuthConfig();
  const hasValidConfig = hasValidGoogleOAuth();
      
      if (hasValidConfig) {
        // Real Google OAuth implementation would go here
        // For now, we'll show a message that proper setup is needed
        setError("Google OAuth is configured but requires proper OAuth flow implementation. Using demo mode.");
        setLoading(false);
        return;
      }
      
      // Mock Google OAuth flow for demonstration
      console.log(`🔐 Simulating Google OAuth for ${userType} user...`);
      
      // Simulate OAuth redirect and callback flow
      setTimeout(() => {
        const mockGoogleProfile = {
          tourist: {
            id: "google_" + Math.random().toString(36).substr(2, 15),
            name: "Alex Johnson",
            email: "alex.johnson@gmail.com",
            picture: "https://via.placeholder.com/150",
            verified_email: true
          },
          admin: {
            id: "google_admin_" + Math.random().toString(36).substr(2, 15),
            name: "Sarah Wilson",
            email: "sarah.wilson@government.gov",
            picture: "https://via.placeholder.com/150",
            verified_email: true
          }
        };

      const profile = mockGoogleProfile[userType === 'admin' ? 'admin' : 'tourist'];

      if (userType === 'tourist') {
        onLogin('tourist', {
          id: "TS" + Math.random().toString(36).substr(2, 9),
          name: profile.name,
          email: profile.email,
          profilePicture: profile.picture,
          nationality: "International",
          passportNumber: "GOOGLE_" + Math.random().toString(36).substr(2, 6).toUpperCase(),
          emergencyContact: "+1-555-GOOGLE",
          checkInDate: new Date().toISOString(),
          digitalIdVerified: true,
          authMethod: "google",
          googleId: profile.id
        });
      } else if (userType === 'business') {
        onLogin('business', {
          id: "BUS" + Math.random().toString(36).substr(2, 6).toUpperCase(),
          name: profile.name || "Google Business User",
          email: profile.email,
          registrationId: "GSTIN_" + Math.random().toString(36).substr(2, 8).toUpperCase(),
          sector: "Handicrafts",
          contact: "+91-99999-00000",
          digitalIdVerified: true,
          authMethod: "google",
          googleId: profile.id,
          loginTime: new Date().toISOString(),
        });
      } else {
        onLogin('admin', {
          id: "GA_" + Math.random().toString(36).substr(2, 6).toUpperCase(),
          name: profile.name,
          email: profile.email,
          profilePicture: profile.picture,
          department: "Tourist Safety Division",
          rank: "Digital Officer",
          jurisdiction: "Google Auth District",
          clearanceLevel: "Level 2",
          loginTime: new Date().toISOString(),
          authMethod: "google",
          googleId: profile.id
        });
      }
        setLoading(false);
      }, 2500); // Slightly longer to simulate OAuth flow
      
    } catch (error) {
      console.error('Google Auth Error:', error);
      setError("Google authentication failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left">
          {/* Jharkhand Banner Image */}
          <div className="mb-6 relative rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1735567065045-97ba386867ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKaGFya2hhbmQlMjB3YXRlcmZhbGxzJTIwbmF0dXJlJTIwaGlsbHMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU5MDU4NjUwfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Jharkhand Natural Beauty - Waterfalls and Hills"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
              <div className="p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">🌿 Discover Jharkhand</h2>
                <p className="text-sm opacity-90">Waterfalls • Hills • Wildlife • Heritage</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-6">
              <img 
                src={echoJharLogo}
                alt="EchoJhar - Explore. Connect. Thrive."
                className="h-48 w-auto mx-auto lg:mx-0"
              />
            </div>
            <p className="text-xl text-gray-600 mb-6">
              Smart Tourism Safety & Cultural Experience Platform
            </p>
            <p className="text-gray-500 max-w-lg">
              Discover Jharkhand's natural beauty, cultural heritage, and tribal traditions while ensuring your safety through AI-powered monitoring, blockchain verification, and D2M emergency broadcasting.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">AI Assistance</h3>
              <p className="text-sm text-gray-600">Smart recommendations</p>
            </div>
            
            <div className="p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold mb-1">Safety Monitor</h3>
              <p className="text-sm text-gray-600">Real-time protection</p>
            </div>
            
            <div className="p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Group Tracking</h3>
              <p className="text-sm text-gray-600">Stay connected</p>
            </div>
            
            <div className="p-4 bg-white/60 rounded-lg backdrop-blur-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-1">Emergency</h3>
              <p className="text-sm text-gray-600">Instant response</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Forms */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Choose your access level to continue to EchoJhar
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="tourist" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Tourist</span>
                  </TabsTrigger>
                  <TabsTrigger value="business" className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Business</span>
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </TabsTrigger>
                </TabsList>

                {error && (
                  <Alert className="mb-4 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Tourist Login */}
                <TabsContent value="tourist" className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Tourist Access</h3>
                    <p className="text-sm text-gray-600">Access your digital identity and travel services</p>
                  </div>

                  <form onSubmit={handleTouristLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tourist-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="tourist-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={touristForm.email}
                          onChange={(e) => setTouristForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tourist-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="tourist-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          value={touristForm.password}
                          onChange={(e) => setTouristForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tourist-remember"
                        checked={touristForm.rememberMe}
                        onCheckedChange={(checked: boolean) => setTouristForm(prev => ({ ...prev, rememberMe: checked }))}
                      />
                      <Label htmlFor="tourist-remember" className="text-sm text-gray-600">
                        Remember me
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      disabled={loading}
                    >
                      {loading ? "Signing In..." : "Sign In as Tourist"}
                    </Button>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mb-4 border-gray-300 hover:bg-gray-50" 
                    onClick={() => handleGoogleLogin('tourist')}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {loading ? "Connecting..." : "Continue with Google"}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Demo Access</p>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleQuickTouristLogin}
                      disabled={loading}
                    >
                      Quick Tourist Demo
                    </Button>
                  </div>
                </TabsContent>

                {/* Business Login */}
                <TabsContent value="business" className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="W-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Business Access</h3>
                    <p className="text-sm text-gray-600">For local vendors and partners</p>
                  </div>

                  <form onSubmit={handleBusinessLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-email">Business Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="business-email"
                          type="email"
                          placeholder="Enter business email"
                          className="pl-10"
                          value={businessForm.email}
                          onChange={(e) => setBusinessForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-name">Business Name</Label>
                      <Input
                        id="business-name"
                        placeholder="e.g. Shree Handicrafts"
                        value={businessForm.businessName}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, businessName: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-reg">Registration / GSTIN</Label>
                      <Input
                        id="business-reg"
                        placeholder="e.g. GSTIN29ABCDE1234F1Z5"
                        value={businessForm.registrationId}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, registrationId: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="business-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          value={businessForm.password}
                          onChange={(e) => setBusinessForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="business-remember"
                        checked={businessForm.rememberMe}
                        onCheckedChange={(checked: boolean) => setBusinessForm(prev => ({ ...prev, rememberMe: checked }))}
                      />
                      <Label htmlFor="business-remember" className="text-sm text-gray-600">
                        Remember me
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      disabled={loading}
                    >
                      {loading ? "Signing In..." : "Sign In as Business"}
                    </Button>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mb-4 border-gray-300 hover:bg-gray-50" 
                    onClick={() => handleGoogleLogin('business')}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {loading ? "Connecting..." : "Continue with Google"}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Demo Access</p>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => onLogin('business', {
                        id: 'BUSDEMO',
                        name: 'Demo Handicrafts',
                        email: 'business@example.com',
                        registrationId: 'GSTINDEMO',
                        sector: 'Handicrafts',
                        loginTime: new Date().toISOString(),
                      })}
                      disabled={loading}
                    >
                      Quick Business Demo
                    </Button>
                  </div>
                </TabsContent>

                {/* Admin Login */}
                <TabsContent value="admin" className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Administrative Access</h3>
                    <p className="text-sm text-gray-600">Law enforcement and emergency services portal</p>
                  </div>

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-badge">Badge ID</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="admin-badge"
                          placeholder="Enter your badge ID"
                          className="pl-10"
                          value={adminForm.badgeId}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, badgeId: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-department">Department</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="admin-department"
                          placeholder="Department/Division"
                          className="pl-10"
                          value={adminForm.department}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, department: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Secure Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="admin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your secure password"
                          className="pl-10 pr-10"
                          value={adminForm.password}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="admin-remember"
                        checked={adminForm.rememberMe}
                        onCheckedChange={(checked: boolean) => setAdminForm(prev => ({ ...prev, rememberMe: checked }))}
                      />
                      <Label htmlFor="admin-remember" className="text-sm text-gray-600">
                        Remember this device
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-red-600 hover:bg-red-700" 
                      disabled={loading}
                    >
                      {loading ? "Authenticating..." : "Admin Access"}
                    </Button>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mb-4 border-gray-300 hover:bg-gray-50" 
                    onClick={() => handleGoogleLogin('admin')}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {loading ? "Authenticating..." : "Continue with Google"}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Demo Access</p>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleQuickAdminLogin}
                      disabled={loading}
                    >
                      Quick Admin Demo
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center mb-3">
                  <p className="text-xs text-gray-500">
                    Protected by blockchain technology and end-to-end encryption
                  </p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Authentication Methods:</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div><strong>Google OAuth:</strong> Sign in with your Google account</div>
                    <div><strong>Demo Tourist:</strong> tourist@example.com / password</div>
                    <div><strong>Demo Admin:</strong> ADMIN001 / admin123</div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      <strong>Note:</strong> Google authentication requires proper OAuth setup in production
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}