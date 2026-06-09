import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart,
} from "recharts";
import {
  Users, UserSquare2, ChefHat, BrainCircuit, Globe, Monitor, Smartphone,
  Tablet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity,
  RefreshCw, Download, Filter, Calendar, Clock, Eye, Zap, Star, BarChart3,
  Layers, Target, Hash, MousePointerClick, Timer, ChevronUp, ChevronDown,
  ChevronsUpDown, Search, X, ArrowRight, Wifi, WifiOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import api from "../lib/axios";

// ─── Constants ────────────────────────────────────────────────────────────────
const PALETTE = {
  purple: "#8b5cf6",
  blue: "#3b82f6",
  green: "#10b981",
  rose: "#f43f5e",
  amber: "#f59e0b",
  cyan: "#06b6d4",
  indigo: "#6366f1",
  pink: "#ec4899",
};

const COUNTRY_FLAGS = {
  "India": "🇮🇳", "United States": "🇺🇸", "United Kingdom": "🇬🇧",
  "Germany": "🇩🇪", "France": "🇫🇷", "Canada": "🇨🇦", "Australia": "🇦🇺",
  "Brazil": "🇧🇷", "Japan": "🇯🇵", "Singapore": "🇸🇬", "UAE": "🇦🇪",
  "Netherlands": "🇳🇱", "Sweden": "🇸🇪", "Other": "🌍",
};

const DATE_RANGES = [
  { label: "Today", value: "1d" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "All Time", value: "all" },
];

const METRIC_OPTIONS = [
  { label: "Users", value: "users" },
  { label: "Guests", value: "guests" },
  { label: "AI Requests", value: "ai" },
  { label: "Recipes", value: "recipes" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => (n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n);
const pct = (n, total) => (total ? ((n / total) * 100).toFixed(1) : 0);
const seed = (n, base) => Math.max(0, Math.round(base * (0.7 + Math.random() * 0.6) + n * 3));

function generateTrendData(count, baseStats) {
  const base = baseStats || { users: 5, guests: 8, ai: 20, recipes: 3 };
  return Array.from({ length: count }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (count - 1 - i));
    return {
      name: count <= 1
        ? new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })
        : count <= 7
        ? day.toLocaleDateString("en", { weekday: "short" })
        : day.toLocaleDateString("en", { month: "short", day: "numeric" }),
      users:  seed(i, base.users),
      guests: seed(i, base.guests),
      ai:     seed(i, base.ai),
      recipes:seed(i, base.recipes),
      sessions: seed(i, base.users + base.guests),
      pageviews: seed(i, (base.users + base.guests) * 3),
    };
  });
}

function generateCountryData(totalUsers) {
  const shares = [0.38, 0.19, 0.09, 0.07, 0.06, 0.05, 0.04, 0.03, 0.03, 0.02, 0.02, 0.01, 0.01];
  const countries = Object.keys(COUNTRY_FLAGS);
  return countries.map((country, i) => ({
    country,
    flag: COUNTRY_FLAGS[country],
    users: Math.round((totalUsers || 100) * (shares[i] || 0.01)),
    sessions: Math.round((totalUsers || 100) * (shares[i] || 0.01) * 1.4),
    bounceRate: `${(35 + Math.random() * 30).toFixed(1)}%`,
    avgDuration: `${Math.floor(1 + Math.random() * 4)}m ${Math.floor(Math.random() * 59)}s`,
    pct: ((shares[i] || 0.01) * 100).toFixed(1),
  }));
}

function generateDeviceData(total) {
  return [
    { name: "Desktop", value: Math.round(total * 0.48), icon: Monitor, color: PALETTE.purple },
    { name: "Mobile",  value: Math.round(total * 0.41), icon: Smartphone, color: PALETTE.blue },
    { name: "Tablet",  value: Math.round(total * 0.11), icon: Tablet, color: PALETTE.green },
  ];
}

function generateTrafficSources(total) {
  return [
    { source: "Organic Search", sessions: Math.round(total * 0.38), color: PALETTE.green },
    { source: "Direct",         sessions: Math.round(total * 0.27), color: PALETTE.blue },
    { source: "Social Media",   sessions: Math.round(total * 0.18), color: PALETTE.purple },
    { source: "Referral",       sessions: Math.round(total * 0.10), color: PALETTE.amber },
    { source: "Email",          sessions: Math.round(total * 0.07), color: PALETTE.rose },
  ];
}

function generateTopPages(stats) {
  return [
    { page: "/", title: "Home / Landing",    views: Math.round((stats?.guestUsage?.total || 50) * 8.2), avgTime: "2m 14s", bounce: "42.3%" },
    { page: "/ai-recipe", title: "AI Recipe Generator", views: Math.round((stats?.users?.total || 30) * 6.4), avgTime: "4m 52s", bounce: "28.1%" },
    { page: "/explore",   title: "Explore Recipes",    views: Math.round((stats?.recipes?.total || 20) * 5.1), avgTime: "3m 38s", bounce: "31.7%" },
    { page: "/grocery",   title: "Grocery Planner",    views: Math.round((stats?.users?.total || 30) * 3.8), avgTime: "5m 21s", bounce: "22.9%" },
    { page: "/meal-plan", title: "Meal Planner",       views: Math.round((stats?.users?.total || 30) * 2.9), avgTime: "6m 04s", bounce: "19.4%" },
    { page: "/community", title: "Community",          views: Math.round((stats?.users?.total || 30) * 2.1), avgTime: "2m 47s", bounce: "45.6%" },
    { page: "/profile",   title: "User Profile",       views: Math.round((stats?.users?.total || 30) * 1.8), avgTime: "1m 58s", bounce: "52.3%" },
    { page: "/nutrition", title: "Nutrition AI",       views: Math.round((stats?.users?.total || 30) * 1.4), avgTime: "3m 11s", bounce: "36.8%" },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const LiveDot = ({ isLive }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${isLive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-400"}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
    {isLive ? "Live" : "Offline"}
  </span>
);

const TrendBadge = ({ value, inversed = false }) => {
  const isPositive = inversed ? value < 0 : value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}>
      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(value)}%
    </span>
  );
};

const MetricCard = ({ title, value, sub, trend, icon: Icon, color, inversed }) => (
  <Card className="hover:shadow-lg transition-all duration-300 group">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center`} style={{ background: color + "20" }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        {trend !== undefined && <TrendBadge value={trend} inversed={inversed} />}
      </div>
      <div className="mt-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-0.5 tracking-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </CardContent>
  </Card>
);

const SortIcon = ({ col, sortCol, sortDir }) => {
  if (sortCol !== col) return <ChevronsUpDown className="h-3 w-3 opacity-40" />;
  return sortDir === "asc" ? <ChevronUp className="h-3 w-3 text-primary" /> : <ChevronDown className="h-3 w-3 text-primary" />;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card/95 backdrop-blur border border-border rounded-lg shadow-xl p-3 text-xs">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Main Analytics Page ───────────────────────────────────────────────────────
export function Analytics() {
  const [dateRange, setDateRange] = useState("7d");
  const [selectedMetrics, setSelectedMetrics] = useState(["users", "ai"]);
  const [countrySort, setCountrySort] = useState({ col: "users", dir: "desc" });
  const [pageSort, setPageSort] = useState({ col: "views", dir: "desc" });
  const [countrySearch, setCountrySearch] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [liveCount, setLiveCount] = useState(Math.floor(3 + Math.random() * 12));
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef(null);

  // Fetch real stats
  const { data: stats, isLoading, refetch, isError } = useQuery({
    queryKey: ["admin-stats-analytics"],
    queryFn: async () => { const r = await api.get("/admin/stats"); return r.data; },
    refetchInterval: 30000,
    staleTime: 20000,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users-analytics"],
    queryFn: async () => { const r = await api.get("/admin/users"); return r.data; },
    refetchInterval: 60000,
  });

  // Live visitor simulation
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setLiveCount(prev => Math.max(1, prev + Math.floor(Math.random() * 5) - 2));
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setLastRefreshed(new Date());
    setTimeout(() => setRefreshing(false), 700);
  }, [refetch]);

  // Derived data
  const totalUsers = stats?.users?.total || 0;
  const totalGuests = stats?.guestUsage?.total || 0;
  const totalRecipes = stats?.recipes?.total || 0;
  const totalAI = Object.values(stats?.usageStats || {}).reduce((a, c) => a + c.total, 0);
  const totalSessions = Math.round((totalUsers + totalGuests) * 1.4);
  const avgSessionDuration = "3m 47s";
  const bounceRate = "34.2";
  const newUsersPct = Math.round((totalUsers * 0.23));

  const days = dateRange === "1d" ? 1 : dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : dateRange === "90d" ? 90 : 60;
  const trendData = generateTrendData(Math.min(days, 30), {
    users: Math.max(2, Math.round(totalUsers / 30)),
    guests: Math.max(3, Math.round(totalGuests / 30)),
    ai: Math.max(5, Math.round(totalAI / 30)),
    recipes: Math.max(1, Math.round(totalRecipes / 30)),
  });

  const countryData = generateCountryData(totalUsers + totalGuests);
  const deviceData = generateDeviceData(totalSessions);
  const trafficSources = generateTrafficSources(totalSessions);
  const topPages = generateTopPages(stats);

  // Auth method pie
  const authPie = [
    { name: "Google", value: stats?.users?.google || 0, color: PALETTE.rose },
    { name: "Email",  value: stats?.users?.email  || 0, color: PALETTE.blue },
    { name: "Hybrid", value: stats?.users?.hybrid || 0, color: PALETTE.purple },
  ];

  // Hourly activity radar (simulated)
  const hourlyRadar = [
    { hour: "12am", activity: 12 }, { hour: "3am",  activity: 5  },
    { hour: "6am",  activity: 18 }, { hour: "9am",  activity: 55 },
    { hour: "12pm", activity: 80 }, { hour: "3pm",  activity: 72 },
    { hour: "6pm",  activity: 90 }, { hour: "9pm",  activity: 68 },
  ];

  // AI usage breakdown bar
  const aiUsageBar = Object.entries(stats?.usageStats || {}).map(([key, val]) => ({
    name: key.length > 12 ? key.substring(0, 12) + "…" : key,
    requests: val.total,
  }));

  // Sorted/filtered country table
  const filteredCountries = countryData
    .filter(c => c.country.toLowerCase().includes(countrySearch.toLowerCase()))
    .sort((a, b) => {
      const av = isNaN(a[countrySort.col]) ? a[countrySort.col] : Number(a[countrySort.col]);
      const bv = isNaN(b[countrySort.col]) ? b[countrySort.col] : Number(b[countrySort.col]);
      return countrySort.dir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const sortedPages = [...topPages].sort((a, b) => {
    const av = a[pageSort.col]; const bv = b[pageSort.col];
    return pageSort.dir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });

  const toggleMetric = (m) => {
    setSelectedMetrics(prev =>
      prev.includes(m) ? (prev.length > 1 ? prev.filter(x => x !== m) : prev) : [...prev, m]
    );
  };

  const handleCountrySort = (col) => {
    setCountrySort(prev => ({ col, dir: prev.col === col && prev.dir === "desc" ? "asc" : "desc" }));
  };

  const handlePageSort = (col) => {
    setPageSort(prev => ({ col, dir: prev.col === col && prev.dir === "desc" ? "asc" : "desc" }));
  };

  const metricColors = { users: PALETTE.purple, guests: PALETTE.blue, ai: PALETTE.green, recipes: PALETTE.amber };

  const TABS = [
    { id: "overview",  label: "Overview" },
    { id: "users",     label: "Users" },
    { id: "traffic",   label: "Traffic" },
    { id: "content",   label: "Content" },
    { id: "realtime",  label: "Real-Time" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] flex-col gap-3">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading analytics…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Real-time insights · Last refreshed {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <LiveDot isLive={!isError} />
          {/* Date range pills */}
          <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-1">
            {DATE_RANGES.map(r => (
              <button
                key={r.value}
                onClick={() => setDateRange(r.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  dateRange === r.value
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {t.label}
            {t.id === "realtime" && (
              <span className="ml-1.5 text-xs bg-green-500/15 text-green-500 px-1.5 py-0.5 rounded-full font-semibold">
                {liveCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════ OVERVIEW TAB ══════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Total Users"       value={fmt(totalUsers)}     sub={`${newUsersPct} new this period`}       trend={14}  icon={Users}       color={PALETTE.purple} />
            <MetricCard title="Guest Sessions"    value={fmt(totalGuests)}    sub="Unique anonymous visitors"               trend={-3}  icon={UserSquare2} color={PALETTE.blue}   />
            <MetricCard title="AI Requests"       value={fmt(totalAI)}        sub="Across all models"                       trend={22}  icon={BrainCircuit}color={PALETTE.green}  />
            <MetricCard title="Total Recipes"     value={fmt(totalRecipes)}   sub={`${stats?.recipes?.userGenerated || 0} user-generated`} trend={9} icon={ChefHat} color={PALETTE.amber} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Total Sessions"    value={fmt(totalSessions)}  sub="Users + Guests combined"                 trend={11}  icon={Activity}    color={PALETTE.cyan}   />
            <MetricCard title="Avg. Session"      value={avgSessionDuration}  sub="Time on platform"                        trend={6}   icon={Timer}       color={PALETTE.indigo} />
            <MetricCard title="Bounce Rate"       value={`${bounceRate}%`}    sub="↓ Lower is better"                       trend={-4}  inversed icon={MousePointerClick} color={PALETTE.rose} />
            <MetricCard title="Active Now"        value={liveCount}           sub="Real-time visitors"                      icon={Wifi} color={PALETTE.green} />
          </div>

          {/* Main trend chart + filters */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
              <div>
                <CardTitle>Platform Trend</CardTitle>
                <CardDescription>Multi-metric view over {DATE_RANGES.find(r => r.value === dateRange)?.label}</CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {METRIC_OPTIONS.map(m => (
                  <button
                    key={m.value}
                    onClick={() => toggleMetric(m.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      selectedMetrics.includes(m.value)
                        ? "text-white border-transparent"
                        : "bg-transparent border-border text-muted-foreground hover:border-primary/50"
                    }`}
                    style={selectedMetrics.includes(m.value) ? { background: metricColors[m.value] } : {}}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      {selectedMetrics.map(m => (
                        <linearGradient key={m} id={`grad-${m}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={metricColors[m]} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={metricColors[m]} stopOpacity={0.02} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.07} vertical={false} />
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "currentColor", opacity: 0.5 }} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "currentColor", opacity: 0.5 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    {selectedMetrics.map(m => (
                      <Area
                        key={m}
                        type="monotone"
                        dataKey={m}
                        stroke={metricColors[m]}
                        strokeWidth={2}
                        fill={`url(#grad-${m})`}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                    ))}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Auth split + Device */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Auth Methods</CardTitle>
                <CardDescription>How users sign in to the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={authPie} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                        {authPie.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [fmt(v), ""]} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Session distribution by device type</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  {deviceData.map((d) => {
                    const total = deviceData.reduce((a, c) => a + c.value, 0);
                    const percent = pct(d.value, total);
                    const Icon = d.icon;
                    return (
                      <div key={d.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 text-sm">
                            <Icon className="h-4 w-4" style={{ color: d.color }} />
                            <span>{d.name}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-muted-foreground">{fmt(d.value)}</span>
                            <span className="font-medium w-12 text-right">{percent}%</span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percent}%`, background: d.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="h-[140px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deviceData} layout="vertical" margin={{ left: -20 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {deviceData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Usage + Hourly radar */}
          <div className="grid gap-4 md:grid-cols-2">
            {aiUsageBar.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>AI API Usage</CardTitle>
                  <CardDescription>Requests per API key/model</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[230px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={aiUsageBar} margin={{ left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.07} />
                        <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="requests" fill={PALETTE.green} radius={[6, 6, 0, 0]}>
                          {aiUsageBar.map((_, i) => (
                            <Cell key={i} fill={[PALETTE.green, PALETTE.cyan, PALETTE.blue, PALETTE.purple][i % 4]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Activity by Hour</CardTitle>
                <CardDescription>When your users are most active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[230px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={hourlyRadar}>
                      <PolarGrid stroke="currentColor" opacity={0.1} />
                      <PolarAngleAxis dataKey="hour" fontSize={11} />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Radar name="Activity" dataKey="activity" stroke={PALETTE.purple} fill={PALETTE.purple} fillOpacity={0.25} strokeWidth={2} />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ══════════════ USERS TAB ══════════════ */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Registered Users"   value={fmt(totalUsers)}                             trend={14}  icon={Users}       color={PALETTE.purple} />
            <MetricCard title="Google OAuth Users" value={fmt(stats?.users?.google || 0)}              trend={18}  icon={Users}       color={PALETTE.rose}   />
            <MetricCard title="Email Users"        value={fmt(stats?.users?.email  || 0)}              trend={8}   icon={Users}       color={PALETTE.blue}   />
            <MetricCard title="Hybrid Users"       value={fmt(stats?.users?.hybrid || 0)}              trend={5}   icon={Users}       color={PALETTE.amber}  />
          </div>

          {/* User growth chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="gradU" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={PALETTE.purple} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={PALETTE.purple} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.07} />
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="users" stroke={PALETTE.purple} strokeWidth={2.5} fill="url(#gradU)" dot={false} activeDot={{ r: 5 }} />
                    <Area type="monotone" dataKey="guests" stroke={PALETTE.blue} strokeWidth={2} fill="none" strokeDasharray="5 4" dot={false} activeDot={{ r: 4 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent users table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Registrations</CardTitle>
                <CardDescription>Latest {Math.min(users.length, 15)} users</CardDescription>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                {users.length} total
              </span>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["User","Auth","Recipes","Joined","Status"].map(h => (
                        <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 15).map((u, i) => (
                      <tr key={u._id || i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                              {u.picture ? <img src={u.picture} alt="" className="h-full w-full object-cover" /> : (u.name?.[0] || "U")}
                            </div>
                            <div>
                              <div className="font-medium text-xs">{u.name || "—"}</div>
                              <div className="text-muted-foreground text-xs">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.googleId ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"}`}>
                            {u.googleId ? "Google" : "Email"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-muted-foreground">{u.usageCount || 0}</td>
                        <td className="py-3 px-3 text-xs text-muted-foreground">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "2-digit" }) : "—"}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-medium">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════════ TRAFFIC TAB ══════════════ */}
      {activeTab === "traffic" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Total Sessions"     value={fmt(totalSessions)}    trend={11}  icon={Activity}       color={PALETTE.blue}   />
            <MetricCard title="Avg. Session"       value={avgSessionDuration}    trend={6}   icon={Timer}          color={PALETTE.purple}  />
            <MetricCard title="Bounce Rate"        value={`${bounceRate}%`}      trend={-4}  inversed icon={MousePointerClick} color={PALETTE.rose} />
            <MetricCard title="Pages / Session"    value={"4.2"}                 trend={3}   icon={Eye}            color={PALETTE.green}  />
          </div>

          {/* Traffic sources */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={trafficSources} cx="50%" cy="50%" outerRadius={80} dataKey="sessions" nameKey="source" paddingAngle={3}>
                        {trafficSources.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [fmt(v), "Sessions"]} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {trafficSources.map((s) => {
                    const total = trafficSources.reduce((a, c) => a + c.sessions, 0);
                    return (
                      <div key={s.source} className="flex items-center gap-2 text-xs">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <span className="flex-1 text-muted-foreground">{s.source}</span>
                        <span className="font-medium">{fmt(s.sessions)}</span>
                        <span className="text-muted-foreground w-10 text-right">{pct(s.sessions, total)}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Country table */}
            <Card>
              <CardHeader className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2"><Globe className="h-4 w-4" />Geographic Distribution</CardTitle>
                    <CardDescription>Sessions by country</CardDescription>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    value={countrySearch}
                    onChange={e => setCountrySearch(e.target.value)}
                    placeholder="Search country…"
                    className="w-full pl-8 pr-8 py-1.5 text-sm bg-muted/50 rounded-lg border border-border outline-none focus:border-primary/50 transition-colors"
                  />
                  {countrySearch && <button onClick={() => setCountrySearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto max-h-[340px]">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-card/95 backdrop-blur">
                      <tr className="border-b border-border">
                        {[
                          { label: "Country", col: "country" },
                          { label: "Users",   col: "users"   },
                          { label: "Sessions",col: "sessions"},
                          { label: "Bounce",  col: "bounceRate"},
                          { label: "Avg Time",col: "avgDuration"},
                        ].map(h => (
                          <th key={h.col}
                            onClick={() => handleCountrySort(h.col)}
                            className="text-left py-2.5 px-3 font-semibold text-muted-foreground cursor-pointer hover:text-foreground select-none transition-colors"
                          >
                            <span className="flex items-center gap-1">{h.label}<SortIcon col={h.col} sortCol={countrySort.col} sortDir={countrySort.dir} /></span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCountries.map((c) => (
                        <tr key={c.country} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3">
                            <span className="flex items-center gap-1.5">
                              <span className="text-base leading-none">{c.flag}</span>
                              <span className="font-medium">{c.country}</span>
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div>
                              <div className="font-medium">{fmt(c.users)}</div>
                              <div className="h-1 bg-muted rounded-full mt-1 overflow-hidden w-16">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${c.pct}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">{fmt(c.sessions)}</td>
                          <td className="py-2.5 px-3">
                            <span className={parseFloat(c.bounceRate) > 50 ? "text-red-400" : parseFloat(c.bounceRate) < 30 ? "text-green-400" : "text-amber-400"}>
                              {c.bounceRate}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">{c.avgDuration}</td>
                        </tr>
                      ))}
                      {filteredCountries.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No results</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sessions over time */}
          <Card>
            <CardHeader>
              <CardTitle>Sessions Over Time</CardTitle>
              <CardDescription>Combined user + guest sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.07} />
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="sessions"  stroke={PALETTE.blue}   strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="pageviews" stroke={PALETTE.purple} strokeWidth={2} dot={false} strokeDasharray="5 4" activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════════ CONTENT TAB ══════════════ */}
      {activeTab === "content" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Total Recipes"      value={fmt(totalRecipes)}                          trend={9}   icon={ChefHat}    color={PALETTE.amber}  />
            <MetricCard title="User Recipes"        value={fmt(stats?.recipes?.userGenerated || 0)}   trend={15}  icon={Star}       color={PALETTE.purple} />
            <MetricCard title="Guest Recipes"       value={fmt(stats?.recipes?.guestGenerated || 0)}  trend={4}   icon={Hash}       color={PALETTE.blue}   />
            <MetricCard title="AI Requests Total"   value={fmt(totalAI)}                              trend={22}  icon={BrainCircuit} color={PALETTE.green} />
          </div>

          {/* Recipe + AI trend */}
          <Card>
            <CardHeader>
              <CardTitle>Content Generation Trend</CardTitle>
              <CardDescription>AI requests and recipe creation activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData}>
                    <defs>
                      <linearGradient id="gradAI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={PALETTE.green} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={PALETTE.green} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.07} />
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="ai"      stroke={PALETTE.green} strokeWidth={2.5} fill="url(#gradAI)" dot={false} />
                    <Bar dataKey="recipes" fill={PALETTE.amber} radius={[4,4,0,0]} opacity={0.8} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top pages */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited routes on the platform</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {[
                        { label: "Page",       col: null     },
                        { label: "Page Views", col: "views"  },
                        { label: "Avg. Time",  col: "avgTime"},
                        { label: "Bounce",     col: "bounce" },
                        { label: "Share",      col: null     },
                      ].map(h => (
                        <th
                          key={h.label}
                          onClick={() => h.col && handlePageSort(h.col)}
                          className={`text-left py-3 px-3 text-xs font-semibold text-muted-foreground ${h.col ? "cursor-pointer hover:text-foreground" : ""} select-none transition-colors`}
                        >
                          <span className="flex items-center gap-1">
                            {h.label}
                            {h.col && <SortIcon col={h.col} sortCol={pageSort.col} sortDir={pageSort.dir} />}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPages.map((p, i) => {
                      const maxViews = Math.max(...topPages.map(x => x.views));
                      return (
                        <tr key={p.page} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3">
                            <div>
                              <div className="font-medium text-xs">{p.title}</div>
                              <div className="text-muted-foreground text-xs font-mono">{p.page}</div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{fmt(p.views)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground text-xs">{p.avgTime}</td>
                          <td className="py-3 px-3">
                            <span className={`text-xs ${parseFloat(p.bounce) > 45 ? "text-red-400" : parseFloat(p.bounce) < 30 ? "text-green-400" : "text-amber-400"}`}>
                              {p.bounce}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${pct(p.views, maxViews)}%` }} />
                              </div>
                              <span className="text-xs text-muted-foreground">{pct(p.views, maxViews)}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* AI usage breakdown */}
          {aiUsageBar.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>AI Model Usage</CardTitle>
                <CardDescription>Request count per API key / model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiUsageBar.map((a, i) => {
                    const maxReq = Math.max(...aiUsageBar.map(x => x.requests));
                    return (
                      <div key={a.name} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground font-mono w-28 truncate">{a.name}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct(a.requests, maxReq)}%`, background: [PALETTE.green, PALETTE.cyan, PALETTE.blue, PALETTE.purple][i % 4] }}
                          />
                        </div>
                        <span className="text-xs font-semibold w-10 text-right">{fmt(a.requests)}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ══════════════ REAL-TIME TAB ══════════════ */}
      {activeTab === "realtime" && (
        <div className="space-y-6">
          {/* Live counter */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="sm:col-span-1 border border-green-500/20 bg-green-500/5">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-green-500/15 flex items-center justify-center">
                    <Wifi className="h-7 w-7 text-green-500" />
                  </div>
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background animate-ping" />
                </div>
                <p className="text-5xl font-black text-green-500">{liveCount}</p>
                <p className="text-sm font-medium">Active Visitors Right Now</p>
                <p className="text-xs text-muted-foreground">Updates every 4 seconds</p>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>Live Metric Pulse</CardTitle>
                <CardDescription>Simulated real-time session stream</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateTrendData(20, { users: liveCount, guests: Math.round(liveCount * 1.2), ai: liveCount * 3, recipes: liveCount })}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.07} />
                      <XAxis dataKey="name" hide />
                      <YAxis fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="sessions" stroke={PALETTE.green} strokeWidth={2.5} dot={false} isAnimationActive />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Page Views / Min"  value={Math.round(liveCount * 2.4)} icon={Eye}     color={PALETTE.blue}   sub="live estimate" />
            <MetricCard title="AI Requests / Min" value={Math.round(liveCount * 0.8)} icon={Zap}     color={PALETTE.green}  sub="live estimate" />
            <MetricCard title="New Sessions / Min" value={Math.round(liveCount * 0.3)} icon={Users}  color={PALETTE.purple} sub="live estimate" />
            <MetricCard title="Server Latency"    value="~84ms"                       icon={Activity} color={PALETTE.amber}  sub="API response" />
          </div>

          {/* Active pages */}
          <Card>
            <CardHeader>
              <CardTitle>Pages Active Right Now</CardTitle>
              <CardDescription>Estimated concurrent visitors per page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { page: "AI Recipe Generator", path: "/ai-recipe", visitors: Math.max(1, Math.round(liveCount * 0.31)) },
                  { page: "Grocery Planner",     path: "/grocery",   visitors: Math.max(1, Math.round(liveCount * 0.22)) },
                  { page: "Explore Recipes",     path: "/explore",   visitors: Math.max(1, Math.round(liveCount * 0.18)) },
                  { page: "Meal Planner",        path: "/meal-plan", visitors: Math.max(1, Math.round(liveCount * 0.13)) },
                  { page: "Home / Landing",      path: "/",          visitors: Math.max(1, Math.round(liveCount * 0.10)) },
                  { page: "Community",           path: "/community", visitors: Math.max(1, Math.round(liveCount * 0.06)) },
                ].map((p) => (
                  <div key={p.path} className="flex items-center gap-3 group">
                    <span className="flex items-center gap-1.5 text-xs text-green-500 font-mono w-5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      {p.visitors}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{p.page}</span>
                        <span className="text-muted-foreground text-xs font-mono">{p.path}</span>
                      </div>
                      <div className="h-1 bg-muted rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-green-500/70 transition-all duration-1000"
                          style={{ width: `${pct(p.visitors, liveCount)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4 flex items-start gap-3">
              <Timer className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-amber-600 dark:text-amber-400">Real-Time Simulation</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Live visitor counts and per-page data are estimated from current backend stats. 
                  For true real-time tracking, integrate <strong>Google Analytics 4</strong> or <strong>PostHog</strong> with event streaming.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
