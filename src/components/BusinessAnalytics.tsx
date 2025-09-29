import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  Users,
  ShoppingBag,
  Star,
  Target,
  Gauge,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type TimeRange = "7d" | "30d" | "90d";
type GroupBy = "day" | "week" | "month";

type FootfallPoint = {
  date: string; // yyyy-mm-dd
  local: number;
  domestic: number;
  international: number;
};

type RevenuePoint = {
  date: string;
  revenue: number; // total revenue for the period
  dokra?: number;
  bamboo?: number;
  paintings?: number;
  services?: number;
};

export default function BusinessAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(() => (localStorage.getItem("ba_timeRange") as TimeRange) || "30d");
  const [groupBy, setGroupBy] = useState<GroupBy>(() => (localStorage.getItem("ba_groupBy") as GroupBy) || "day");
  const [shareWithGov, setShareWithGov] = useState<boolean>(() => localStorage.getItem("ba_shareGov") === "1");

  useEffect(() => {
    localStorage.setItem("ba_timeRange", timeRange);
  }, [timeRange]);
  useEffect(() => {
    localStorage.setItem("ba_groupBy", groupBy);
  }, [groupBy]);
  useEffect(() => {
    localStorage.setItem("ba_shareGov", shareWithGov ? "1" : "0");
  }, [shareWithGov]);

  // Generate baseline synthetic data (stable across renders)
  const baseData = useMemo(() => generateBaseData(90), []);

  const rangeDays = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const footfallRaw = useMemo(() => baseData.footfall.slice(-rangeDays), [baseData, rangeDays]);
  const revenueRaw = useMemo(() => baseData.revenue.slice(-rangeDays), [baseData, rangeDays]);

  // Aggregate depending on groupBy
  const footfall = useMemo(() => aggregateFootfall(footfallRaw, groupBy), [footfallRaw, groupBy]);
  const revenue = useMemo(() => aggregateRevenue(revenueRaw, groupBy), [revenueRaw, groupBy]);

  // KPIs derived
  const totals = useMemo(() => {
    const visits = footfall.reduce((acc, d) => acc + d.local + d.domestic + d.international, 0);
    const totalRevenue = revenue.reduce((acc, d) => acc + d.revenue, 0);
    const avgOrderVal = visits ? Math.round((totalRevenue / Math.max(1, Math.floor(visits * 0.6))) ) : 0; // assume ~60% converting
    return { visits, totalRevenue, avgOrderVal };
  }, [footfall, revenue]);

  const topProducts = useMemo(() => getTopProducts(), []);
  const originBreakdown = useMemo(() => getOriginBreakdown(footfallRaw), [footfallRaw]);
  const ratings = useMemo(() => baseData.ratings, [baseData]);
  const engagement = useMemo(() => baseData.engagement.slice(-rangeDays), [baseData, rangeDays]);
  const forecast = useMemo(() => generateForecast(revenueRaw), [revenueRaw]);

  const kpiDelta = {
    visits: +12,
    revenue: +9,
    rating: +0.2,
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header & Filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
          <p className="text-gray-600">Footfall, sales, demographics, rewards, feedback, and forecast</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border bg-white overflow-hidden">
            {(["7d", "30d", "90d"] as TimeRange[]).map((r) => (
              <Button key={r} variant={timeRange === r ? "default" : "ghost"} onClick={() => setTimeRange(r)} className="rounded-none">
                {r.toUpperCase()}
              </Button>
            ))}
          </div>
          <div className="flex rounded-lg border bg-white overflow-hidden">
            {(["day", "week", "month"] as GroupBy[]).map((g) => (
              <Button key={g} variant={groupBy === g ? "default" : "ghost"} onClick={() => setGroupBy(g)} className="rounded-none capitalize">
                {g}
              </Button>
            ))}
          </div>
          <Badge variant="secondary">Last {rangeDays} days</Badge>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tourist Footfall</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{totals.visits.toLocaleString()}</CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-emerald-600">{kpiDelta.visits}% vs prev period</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenue</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">₹ {formatINR(totals.totalRevenue)}</CardTitle>
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-emerald-600">{kpiDelta.revenue}% vs prev period</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Order Value</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">₹ {totals.avgOrderVal.toLocaleString()}</CardTitle>
              <Gauge className="w-5 h-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">Typical spend per purchase</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Rating</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{ratings.average.toFixed(1)}</CardTitle>
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-emerald-600">+{kpiDelta.rating.toFixed(1)} vs prev</div>
          </CardContent>
        </Card>
      </div>

      {/* Graphs Row 1: Footfall & Sales/Revenue */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tourist Footfall</CardTitle>
            <CardDescription>Local vs Domestic vs International</CardDescription>
          </CardHeader>
          <CardContent className="" style={{ height: 288 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={footfall} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="gradLocal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDomestic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradIntl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="local" stackId="1" name="Local" stroke="#60a5fa" fill="url(#gradLocal)" />
                <Area type="monotone" dataKey="domestic" stackId="1" name="Domestic" stroke="#34d399" fill="url(#gradDomestic)" />
                <Area type="monotone" dataKey="international" stackId="1" name="International" stroke="#f59e0b" fill="url(#gradIntl)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales & Revenue</CardTitle>
            <CardDescription>Revenue trend with category comparison</CardDescription>
          </CardHeader>
          <CardContent className="" style={{ height: 288 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedRevenueChart data={revenue} />
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphs Row 2: Top Products Pie & Origin Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Products/Services</CardTitle>
            <CardDescription>Share of total sales</CardDescription>
          </CardHeader>
          <CardContent className="" style={{ height: 288 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={topProducts} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                  {topProducts.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tourist Origin</CardTitle>
            <CardDescription>Heat by region (approx.)</CardDescription>
          </CardHeader>
          <CardContent className="" style={{ height: 288 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={originBreakdown} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="region" width={120} />
                <Tooltip />
                <Bar dataKey="count" name="Visitors" fill="#6366f1">
                  {originBreakdown.map((_, i) => (
                    <Cell key={i} fill={heatColors[i % heatColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphs Row 3: Rewards & Engagement and Ratings */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rewards & Engagement</CardTitle>
            <CardDescription>Claims, DigiPin photos, social shares</CardDescription>
          </CardHeader>
          <CardContent className="" style={{ height: 288 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rewards" name="Rewards Claimed" stackId="a" fill="#34d399" />
                <Bar dataKey="photos" name="DigiPin Photos" stackId="a" fill="#60a5fa" />
                <Bar dataKey="shares" name="Social Shares" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback & Ratings</CardTitle>
            <CardDescription>Distribution and trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratings.distribution} layout="vertical" margin={{ left: 24 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="label" width={40} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f59e0b" />
                    <ReferenceLine x={0} stroke="#000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ratings.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" />
                    <YAxis domain={[3, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="avg" name="Average" stroke="#f59e0b" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Predictive Demand Forecast</CardTitle>
          <CardDescription>Projected revenue (festival uplift)</CardDescription>
        </CardHeader>
        <CardContent className="" style={{ height: 288 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="#3b82f6" dot={false} />
              <Line type="monotone" dataKey="predicted" name="Forecast" stroke="#10b981" strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Government/Community Insights opt-in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="w-4 h-4" /> Government/Community Insights</CardTitle>
          <CardDescription>Share anonymized analytics to help seasonal planning for eco-tourism and handicrafts</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Opt-in to share insights with Tourism Dept. and community (no personal data)</div>
          <div className="flex items-center gap-2">
            <Switch checked={shareWithGov} onCheckedChange={setShareWithGov} />
            <span className="text-sm text-gray-700">{shareWithGov ? "Enabled" : "Disabled"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper components and data
function ComposedRevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis dataKey="label" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="dokra" name="Dokra" fill="#f59e0b" />
      <Bar dataKey="bamboo" name="Bamboo" fill="#34d399" />
      <Bar dataKey="paintings" name="Paintings" fill="#60a5fa" />
      <Bar dataKey="services" name="Services" fill="#a78bfa" />
      <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#111827" dot={false} />
    </LineChart>
  );
}

const pieColors = ["#60a5fa", "#34d399", "#f59e0b", "#a78bfa", "#ef4444"];
const heatColors = ["#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5"];

function formatINR(v: number) {
  if (v >= 100000) return (v / 100000).toFixed(1) + "L";
  if (v >= 1000) return (v / 1000).toFixed(1) + "K";
  return v.toLocaleString();
}

function generateBaseData(days: number) {
  const today = new Date();
  const footfall: FootfallPoint[] = [];
  const revenue: RevenuePoint[] = [];
  const engagement: Array<{ label: string; rewards: number; photos: number; shares: number }> = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

    // Simulate seasonality: weekends and festivals higher
    const day = d.getDay();
    const weekendBoost = day === 0 || day === 6 ? 1.25 : 1.0;
    const month = d.getMonth();
    const festivalBoost = [9, 10].includes(month) ? 1.2 : 1.0; // Oct-Nov festivals

    const base = 20 + Math.round(15 * Math.sin(i / 6));
    const local = Math.max(5, Math.round(base * 1.0 * weekendBoost * rand(0.9, 1.2)));
    const domestic = Math.max(3, Math.round(base * 0.8 * weekendBoost * festivalBoost * rand(0.9, 1.3)));
    const international = Math.max(1, Math.round(base * 0.25 * weekendBoost * festivalBoost * rand(0.8, 1.4)));
    footfall.push({ date, local, domestic, international, ...( { label } as any) });

    const dokra = Math.round((local * 120 + domestic * 220 + international * 260) * rand(0.6, 1.2));
    const bamboo = Math.round((local * 80 + domestic * 140) * seasonal(month, 7, 1.1) * rand(0.7, 1.3));
    const paintings = Math.round((domestic * 180 + international * 240) * seasonal(month, 10, 1.3) * rand(0.7, 1.2));
    const services = Math.round((local * 70 + domestic * 90 + international * 110) * rand(0.7, 1.2));
    const total = dokra + bamboo + paintings + services;
    revenue.push({ date, revenue: total, dokra, bamboo, paintings, services, ...( { label } as any) });

    engagement.push({ label, rewards: Math.round((domestic + international) * 0.3), photos: Math.round((local + domestic) * 0.25), shares: Math.round(international * 0.4) });
  }

  const ratings = generateRatings(days);
  return { footfall, revenue, engagement, ratings };
}

function aggregateFootfall(data: FootfallPoint[], by: GroupBy) {
  if (by === "day") return data.map((d, idx) => ({ ...d, label: (d as any).label || `${idx}` }));
  const grouped: Record<string, { local: number; domestic: number; international: number } & { label: string }> = {};
  for (const d of data) {
    const key = by === "week" ? weekKey(d.date) : monthKey(d.date);
    if (!grouped[key]) grouped[key] = { local: 0, domestic: 0, international: 0, label: key };
    grouped[key].local += d.local;
    grouped[key].domestic += d.domestic;
    grouped[key].international += d.international;
  }
  return Object.values(grouped);
}

function aggregateRevenue(data: RevenuePoint[], by: GroupBy) {
  if (by === "day") return data.map((d, idx) => ({ ...d, label: (d as any).label || `${idx}` }));
  const grouped: Record<string, RevenuePoint & { label: string }> = {} as any;
  for (const d of data) {
    const key = by === "week" ? weekKey(d.date) : monthKey(d.date);
    if (!grouped[key]) grouped[key] = { date: key, revenue: 0, dokra: 0, bamboo: 0, paintings: 0, services: 0, label: key };
    grouped[key].revenue += d.revenue;
    grouped[key].dokra! += d.dokra || 0;
    grouped[key].bamboo! += d.bamboo || 0;
    grouped[key].paintings! += d.paintings || 0;
    grouped[key].services! += d.services || 0;
  }
  return Object.values(grouped);
}

function weekKey(isoDate: string) {
  const d = new Date(isoDate);
  const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
  const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `W${week}`;
}
function monthKey(isoDate: string) {
  const d = new Date(isoDate);
  return d.toLocaleString(undefined, { month: "short" });
}

function getTopProducts() {
  // Try to derive from localStorage if present
  const products: Array<{ name: string; price: number }> = JSON.parse(localStorage.getItem("business_products") || "[]");
  const base = products.length
    ? products.slice(0, 5).map((p, i) => ({ name: p.name || `Item ${i + 1}`, value: Math.round(p.price * rand(10, 40)) }))
    : [
        { name: "Sohrai Paintings", value: 45 },
        { name: "Dokra Art", value: 25 },
        { name: "Bamboo Crafts", value: 15 },
        { name: "Textiles", value: 10 },
        { name: "Guided Tours", value: 5 },
      ];
  const sum = base.reduce((a, b) => a + b.value, 0);
  return base.map((b) => ({ ...b, value: Math.round((b.value / sum) * 100) }));
}

function getOriginBreakdown(footfall: FootfallPoint[]) {
  const totals = { Local: 0, Domestic: 0, International: 0 } as Record<string, number>;
  for (const d of footfall) {
    totals.Local += d.local;
    totals.Domestic += d.domestic;
    totals.International += d.international;
  }
  // Expand Domestic into states (example)
  const regions = [
    { region: "Jharkhand (Local)", count: Math.round(totals.Local) },
    { region: "Delhi", count: Math.round(totals.Domestic * 0.22) },
    { region: "Kolkata", count: Math.round(totals.Domestic * 0.18) },
    { region: "Bihar", count: Math.round(totals.Domestic * 0.15) },
    { region: "Maharashtra", count: Math.round(totals.Domestic * 0.12) },
    { region: "Intl (EU/US)", count: Math.round(totals.International * 0.5) },
    { region: "Intl (SE Asia)", count: Math.round(totals.International * 0.5) },
  ];
  return regions.sort((a, b) => b.count - a.count).slice(0, 7);
}

function generateRatings(days: number) {
  const distribution = [
    { label: "5★", count: 220 },
    { label: "4★", count: 120 },
    { label: "3★", count: 45 },
    { label: "2★", count: 18 },
    { label: "1★", count: 12 },
  ];
  const total = distribution.reduce((a, b) => a + b.count, 0);
  const avg = (5 * 220 + 4 * 120 + 3 * 45 + 2 * 18 + 1 * 12) / total;
  const trend = Array.from({ length: Math.min(days, 12) }).map((_, i) => ({
    label: new Date(Date.now() - (11 - i) * 86400000 * 7).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    avg: +(avg + Math.sin(i / 3) * 0.1).toFixed(2),
  }));
  return { average: avg, distribution, trend };
}

function generateForecast(revenue: RevenuePoint[]) {
  const sliced = revenue.slice(-30);
  const data = sliced.map((d) => ({ label: (d as any).label, actual: d.revenue }));
  // naive forecast: last average + festival uplift in upcoming 2 weeks
  const avg = Math.round(sliced.reduce((a, b) => a + b.revenue, 0) / Math.max(1, sliced.length));
  const future = Array.from({ length: 14 }).map((_, i) => ({
    label: new Date(Date.now() + (i + 1) * 86400000).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    predicted: Math.round(avg * (1 + (i > 7 ? 0.15 : 0.05)) * rand(0.9, 1.1)),
  }));
  return mergeByLabel(data, future);
}

function mergeByLabel(a: any[], b: any[]) {
  const map = new Map<string, any>();
  for (const x of a) map.set(x.label, { ...x });
  for (const y of b) map.set(y.label, { ...(map.get(y.label) || {}), ...y });
  return Array.from(map.values());
}

function seasonal(month: number, target: number, boost: number) {
  return month === target - 1 ? boost : 1.0;
}
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
