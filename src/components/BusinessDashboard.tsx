import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Users, ShoppingBag, Star, TrendingUp, MapPin, AlertTriangle, Settings, LineChart, BadgeIndianRupee, BookOpen } from "lucide-react";

interface BusinessDashboardProps {
  userData: any;
  onNavigate?: (section: string) => void;
}

export function BusinessDashboard({ userData, onNavigate }: BusinessDashboardProps) {
  const kpis = useMemo(() => ([
    { label: "Today's Sales", value: "₹ 12,450", delta: "+8%", icon: ShoppingBag, color: "text-green-600" },
    { label: "DigiPin Check-ins", value: "38", delta: "+12%", icon: Star, color: "text-yellow-600" },
    { label: "Visitors Nearby", value: "124", delta: "+5%", icon: Users, color: "text-blue-600" },
    { label: "Conversion Rate", value: "7.2%", delta: "+0.6%", icon: TrendingUp, color: "text-emerald-600" },
  ]), []);

  return (
    <div className="space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {userData?.name || "Business"}</h1>
        <p className="text-gray-600">
          Track sales, manage DigiPin rewards, and discover insights about your visitors.
        </p>
        <div className="mt-3">
          <Badge variant="secondary">Sector: {userData?.sector || "Tourism"}</Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-6 gap-3">
        <Card className="cursor-pointer hover:shadow" onClick={() => onNavigate?.("business-profile")}> 
          <CardContent className="p-4 flex items-center gap-3"><Settings className="w-5 h-5 text-gray-600" /><div>
            <div className="font-medium">Profile</div>
            <div className="text-xs text-gray-500">Identity & Payments</div>
          </div></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow" onClick={() => onNavigate?.("business-products")}>
          <CardContent className="p-4 flex items-center gap-3"><ShoppingBag className="w-5 h-5 text-emerald-600" /><div>
            <div className="font-medium">Products</div>
            <div className="text-xs text-gray-500">Catalog & Offers</div>
          </div></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow" onClick={() => onNavigate?.("business-analytics")}>
          <CardContent className="p-4 flex items-center gap-3"><LineChart className="w-5 h-5 text-blue-600" /><div>
            <div className="font-medium">Analytics</div>
            <div className="text-xs text-gray-500">Insights</div>
          </div></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow" onClick={() => onNavigate?.("business-payments")}>
          <CardContent className="p-4 flex items-center gap-3"><BadgeIndianRupee className="w-5 h-5 text-yellow-700" /><div>
            <div className="font-medium">Payments</div>
            <div className="text-xs text-gray-500">Transactions</div>
          </div></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow" onClick={() => onNavigate?.("business-resources")}>
          <CardContent className="p-4 flex items-center gap-3"><BookOpen className="w-5 h-5 text-purple-600" /><div>
            <div className="font-medium">Resources</div>
            <div className="text-xs text-gray-500">Guides & Schemes</div>
          </div></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow" onClick={() => onNavigate?.("digipin")}>
          <CardContent className="p-4 flex items-center gap-3"><Star className="w-5 h-5 text-amber-600" /><div>
            <div className="font-medium">DigiPin</div>
            <div className="text-xs text-gray-500">Verify & Award</div>
          </div></CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardHeader className="pb-2">
                <CardDescription>{kpi.label}</CardDescription>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{kpi.value}</CardTitle>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-emerald-600">{kpi.delta} vs yesterday</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Handicrafts • Textiles • Food • Experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-gray-50 border border-dashed rounded flex items-center justify-center text-gray-500 text-sm">
              Chart placeholder
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visitor Demographics</CardTitle>
            <CardDescription>Top origins and age groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-gray-50 border border-dashed rounded flex items-center justify-center text-gray-500 text-sm">
              Chart placeholder
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>DigiPin Rewards</CardTitle>
            <CardDescription>Verify and award check-ins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Pending verifications</div>
              <Badge>6</Badge>
            </div>
            <Button className="w-full" onClick={() => onNavigate?.("digipin")}>Open DigiPin Check-ins</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nearby Check-in Spots</CardTitle>
            <CardDescription>Geo-verified points of interest</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-700"><MapPin className="w-4 h-4" /> Rock Garden</div>
              <Badge variant="outline">1.1 km</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-700"><MapPin className="w-4 h-4" /> Tagore Hill</div>
              <Badge variant="outline">2.0 km</Badge>
            </div>
            <Button variant="outline" onClick={() => onNavigate?.("geo-map")}>Open Map</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts & Weather</CardTitle>
            <CardDescription>Conditions that may impact visits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-amber-600 text-sm"><AlertTriangle className="w-4 h-4" /> High UV from 12-3 PM</div>
            <div className="flex items-center gap-2 text-blue-600 text-sm">Light showers expected at 6 PM</div>
            <Button variant="outline" onClick={() => onNavigate?.("weather")}>View Weather</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
