import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { DemoModeAlert } from "./DemoModeAlert";
import { 
  Heart, 
  Wine, 
  Radio, 
  Wifi, 
  MapPin, 
  DollarSign, 
  Car, 
  ShoppingBag, 
  Package,
  Activity,
  Mountain,
  Navigation,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Smartphone,
  Signal,
  CreditCard,
  Bike,
  Store,
  Globe,
  TreePine,
  Thermometer,
  Wind,
  Sun,
  CloudRain,
  Info,
  Star,
  Clock,
  Phone,
  Shield
} from "lucide-react";

interface TravelEssentialsHubProps {
  userData: any;
}

export function TravelEssentialsHub({ userData }: TravelEssentialsHubProps) {
  const [currentLocation, setCurrentLocation] = useState("Manali, Himachal Pradesh");
  const [alcoholDetected, setAlcoholDetected] = useState(false);
  const [fmRadioEnabled, setFmRadioEnabled] = useState(false);
  const [networkStrength, setNetworkStrength] = useState(75);
  const [breathSensorEnabled, setBreathSensorEnabled] = useState(false);

  // Mock environmental data based on location
  const environmentalData = {
    altitude: 2050,
    temperature: 15,
    humidity: 65,
    airQuality: "Good",
    pollenLevel: "High",
    uvIndex: 6
  };

  // Medical recommendations based on location and environment
  const getMedicalRecommendations = () => {
    const recommendations = [];
    
    if (environmentalData.altitude > 1500) {
      recommendations.push({
        type: "altitude",
        medicine: "Diamox (Acetazolamide)",
        reason: "High altitude adaptation",
        priority: "high",
        icon: Mountain
      });
    }
    
    if (environmentalData.pollenLevel === "High") {
      recommendations.push({
        type: "allergy",
        medicine: "Antihistamine (Cetirizine)",
        reason: "High pollen levels in the area",
        priority: "medium",
        icon: TreePine
      });
    }
    
    if (environmentalData.temperature < 20) {
      recommendations.push({
        type: "cold",
        medicine: "Paracetamol & Throat lozenges",
        reason: "Cold weather protection",
        priority: "low",
        icon: Thermometer
      });
    }

    recommendations.push({
      type: "hydration",
      medicine: "ORS sachets & Electrolytes",
      reason: "Mountain climate dehydration",
      priority: "medium",
      icon: Sun
    });

    return recommendations;
  };

  // Network recommendations
  const networkProviders = [
    { name: "Airtel", signal: 85, recommended: true, price: "₹399/month" },
    { name: "Jio", signal: 70, recommended: false, price: "₹349/month" },
    { name: "BSNL", signal: 90, recommended: true, price: "₹429/month" },
    { name: "Vi", signal: 60, recommended: false, price: "₹379/month" }
  ];

  // Adventure activities
  const adventureActivities = [
    {
      name: "River Rafting",
      location: "Beas River",
      difficulty: "Moderate",
      price: "₹1,500",
      duration: "3 hours",
      safetyRating: 4.5,
      icon: Activity
    },
    {
      name: "Paragliding",
      location: "Solang Valley",
      difficulty: "Beginner Friendly",
      price: "₹3,500",
      duration: "30 minutes",
      safetyRating: 4.8,
      icon: Mountain
    },
    {
      name: "Trekking",
      location: "Hampta Pass",
      difficulty: "Challenging",
      price: "₹8,000",
      duration: "4 days",
      safetyRating: 4.2,
      icon: Mountain
    }
  ];

  // ATM and cash points
  const atmLocations = [
    { bank: "SBI", distance: "0.3 km", status: "Available", cashAvailable: true },
    { bank: "HDFC", distance: "0.7 km", status: "Available", cashAvailable: true },
    { bank: "ICICI", distance: "1.2 km", status: "Out of Order", cashAvailable: false },
    { bank: "PNB", distance: "1.5 km", status: "Available", cashAvailable: false }
  ];

  // Rental vehicles
  const rentalVehicles = [
    {
      type: "Royal Enfield",
      category: "Adventure Bike",
      price: "₹1,200/day",
      available: true,
      fuel: "Petrol",
      rating: 4.7
    },
    {
      type: "Mahindra Thar",
      category: "SUV",
      price: "₹3,500/day",
      available: true,
      fuel: "Diesel",
      rating: 4.5
    },
    {
      type: "Honda Activa",
      category: "Scooter",
      price: "₹600/day",
      available: false,
      fuel: "Petrol",
      rating: 4.3
    }
  ];

  // Local markets
  const localMarkets = [
    {
      name: "Mall Road Market",
      specialty: "Handicrafts & Woolens",
      distance: "0.5 km",
      rating: 4.6,
      priceRange: "₹₹"
    },
    {
      name: "Tibetan Market",
      specialty: "Authentic Artifacts",
      distance: "0.8 km",
      rating: 4.4,
      priceRange: "₹₹₹"
    },
    {
      name: "Old Manali Market",
      specialty: "Local Produce",
      distance: "2.1 km",
      rating: 4.2,
      priceRange: "₹"
    }
  ];

  // Travel gear recommendations
  const travelGear = [
    {
      item: "Trekking Backpack 60L",
      price: "₹2,999",
      platform: "Amazon",
      rating: 4.3,
      essential: true
    },
    {
      item: "Waterproof Rain Jacket",
      price: "₹1,499",
      platform: "Flipkart",
      rating: 4.1,
      essential: true
    },
    {
      item: "Portable Power Bank 20000mAh",
      price: "₹1,899",
      platform: "Amazon",
      rating: 4.5,
      essential: true
    },
    {
      item: "Thermal Innerwear Set",
      price: "₹899",
      platform: "Myntra",
      rating: 4.2,
      essential: false
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Demo Mode Alert */}
      <DemoModeAlert 
        show={true} 
        message="Travel Essentials Hub is running in demo mode with simulated location and connectivity data."
      />

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          🎒 Travel Essentials Hub
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your comprehensive travel companion with medical recommendations, safety features, 
          connectivity solutions, and local insights - all in one place.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          <span>Current Location: {currentLocation}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Medical Preparedness */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold">Medical Preparedness</h3>
              <p className="text-sm text-gray-600">Location-based health recommendations</p>
            </div>
          </div>

          {/* Environmental Data */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-sm mb-3">Environmental Conditions</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Mountain className="w-3 h-3 text-gray-500" />
                <span>Altitude: {environmentalData.altitude}m</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-3 h-3 text-gray-500" />
                <span>Temp: {environmentalData.temperature}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-3 h-3 text-gray-500" />
                <span>Humidity: {environmentalData.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <TreePine className="w-3 h-3 text-gray-500" />
                <span>Pollen: {environmentalData.pollenLevel}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {getMedicalRecommendations().map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <rec.icon className="w-4 h-4 mt-1 text-gray-500" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{rec.medicine}</span>
                    <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{rec.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alcohol Detection & Safety */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Wine className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold">Safety Monitoring</h3>
              <p className="text-sm text-gray-600">Alcohol detection & safety alerts</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Breath Sensor</span>
              <Switch 
                checked={breathSensorEnabled} 
                onCheckedChange={setBreathSensorEnabled}
              />
            </div>

            {breathSensorEnabled && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  {alcoholDetected ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  <span className="font-medium text-sm">
                    {alcoholDetected ? "Alcohol Detected" : "Clear"}
                  </span>
                </div>

                {alcoholDetected && (
                  <Alert className="mb-3">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription className="text-sm">
                      Safety recommendations: Avoid driving, consider nearby cab services, alert companions.
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  size="sm" 
                  onClick={() => setAlcoholDetected(!alcoholDetected)}
                  variant={alcoholDetected ? "destructive" : "default"}
                >
                  {alcoholDetected ? "Reset Status" : "Test Sensor"}
                </Button>
              </div>
            )}

            {/* FM Radio Communication */}
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">FM Radio Emergency</span>
                </div>
                <Switch 
                  checked={fmRadioEnabled} 
                  onCheckedChange={setFmRadioEnabled}
                />
              </div>
              {fmRadioEnabled && (
                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                  <p>📻 Emergency Frequency: 103.5 FM</p>
                  <p>🚨 Tourist Helpline: 91.1 FM</p>
                  <p>ℹ️ Local Info: 95.3 FM</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Network & Connectivity */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Signal className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Network Recommendations</h3>
              <p className="text-sm text-gray-600">Best connectivity options in your area</p>
            </div>
          </div>

          <div className="space-y-3">
            {networkProviders.map((provider, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{provider.name}</span>
                      {provider.recommended && (
                        <Badge variant="default" className="text-xs">Recommended</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{provider.price}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Signal className="w-3 h-3 text-gray-500" />
                    <span className="text-xs">{provider.signal}%</span>
                  </div>
                  <Progress value={provider.signal} className="w-16 h-2" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Adventure Activities */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Adventure Recommendations</h3>
              <p className="text-sm text-gray-600">Popular activities in your area</p>
            </div>
          </div>

          <div className="space-y-3">
            {adventureActivities.map((activity, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  <activity.icon className="w-4 h-4 mt-1 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{activity.name}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{activity.safetyRating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{activity.location} • {activity.difficulty}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {activity.price}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ATM & Cash Points */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Cash is King</h3>
              <p className="text-sm text-gray-600">Nearby ATMs and cash withdrawal points</p>
            </div>
          </div>

          <Alert className="mb-4">
            <Info className="w-4 h-4" />
            <AlertDescription className="text-sm">
              ATMs are rare in remote areas. Withdraw cash before venturing into mountain regions.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            {atmLocations.map((atm, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-sm">{atm.bank}</span>
                    <p className="text-xs text-gray-600">{atm.distance}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={atm.status === 'Available' ? 'default' : 'destructive'}
                    className="text-xs mb-1"
                  >
                    {atm.status}
                  </Badge>
                  {atm.cashAvailable && atm.status === 'Available' && (
                    <p className="text-xs text-green-600">💵 Cash Available</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Rental Vehicles */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold">Rental Vehicles</h3>
              <p className="text-sm text-gray-600">Independent travel options</p>
            </div>
          </div>

          <div className="space-y-3">
            {rentalVehicles.map((vehicle, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  {vehicle.category === 'Adventure Bike' ? (
                    <Bike className="w-4 h-4 mt-1 text-gray-500" />
                  ) : (
                    <Car className="w-4 h-4 mt-1 text-gray-500" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{vehicle.type}</span>
                      <Badge 
                        variant={vehicle.available ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {vehicle.available ? 'Available' : 'Booked'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{vehicle.category} • {vehicle.fuel}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {vehicle.price}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {vehicle.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Local Markets */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold">Local Markets</h3>
              <p className="text-sm text-gray-600">One-stop shopping destinations</p>
            </div>
          </div>

          <div className="space-y-3">
            {localMarkets.map((market, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  <ShoppingBag className="w-4 h-4 mt-1 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{market.name}</span>
                      <span className="text-xs text-gray-500">{market.priceRange}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{market.specialty}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {market.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {market.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Travel Gear Recommendations */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold">Travel Gear</h3>
              <p className="text-sm text-gray-600">Affordable equipment recommendations</p>
            </div>
          </div>

          <div className="space-y-3">
            {travelGear.map((gear, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 mt-1 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{gear.item}</span>
                      {gear.essential && (
                        <Badge variant="destructive" className="text-xs">Essential</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {gear.price}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {gear.platform}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {gear.rating}
                      </span>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      View on {gear.platform}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Emergency Contact Strip */}
      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-red-700">
            <Phone className="w-4 h-4" />
            <span>Emergency: 112</span>
          </div>
          <div className="flex items-center gap-2 text-red-700">
            <Shield className="w-4 h-4" />
            <span>Tourist Helpline: 1363</span>
          </div>
          <div className="flex items-center gap-2 text-red-700">
            <Heart className="w-4 h-4" />
            <span>Medical Emergency: 108</span>
          </div>
        </div>
      </Card>
    </div>
  );
}