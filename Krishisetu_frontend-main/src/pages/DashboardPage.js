

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import {
  Recycle,
  Factory,
  Wind,
  DollarSign,
  Sparkles,
  Leaf,
  Sun,
  AlertTriangle,
  Activity,
  TrendingUp,
  Brain,
  Gauge,
} from "lucide-react";

// ------------------------
// CONFIGURATION SECTION
// ------------------------
const REFRESH_INTERVAL = 10000; // 10 seconds refresh for dummy data simulation
const COLORS = [
  "#22c55e",
  "#15803d",
  "#059669",
  "#0d9488",
  "#0891b2",
  "#0284c7",
  "#2563eb",
  "#4f46e5",
  "#7c3aed",
  "#9333ea",
];

// Month helper
const getMonthName = (monthNum) =>
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][monthNum - 1];

// Formatting
const formatNumber = (value) =>
  !value || isNaN(value) ? "0" : value.toLocaleString();

// ---------------------------------
// DUMMY BACKEND SIMULATION SECTION
// ---------------------------------
const generateFakeAnalytics = () => {
  const data = [];
  for (let i = 1; i <= 12; i++) {
    const waste = Math.floor(Math.random() * 1000 + 1500);
    const revenue = waste * (Math.random() * 50 + 150);
    data.push({
      month: getMonthName(i),
      waste,
      revenue,
      recycled: Math.floor(waste * (Math.random() * 0.3 + 0.6)),
    });
  }
  return data;
};

const generateFakeStats = (analyticsData) => {
  const totalWaste = analyticsData.reduce((a, b) => a + b.waste, 0);
  const totalRevenue = analyticsData.reduce((a, b) => a + b.revenue, 0);
  const statusBreakdown = { active: 8, idle: 2, underMaintenance: 1 };
  const wasteByType = { Organic: 40, Plastic: 25, Metal: 20, Others: 15 };
  return { totalWaste, totalRevenue, statusBreakdown, wasteByType };
};

const generateFakeLocations = () =>
  [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Pune",
    "Chennai",
    "Hyderabad",
    "Kolkata",
  ].map((city) => ({
    name: city,
    value: Math.floor(Math.random() * 2000 + 500),
    percentage: Math.floor(Math.random() * 20 + 5),
    listings: Math.floor(Math.random() * 80 + 20),
    averagePrice: Math.floor(Math.random() * 500 + 800),
  }));

// ---------------------------------
// FORECAST AND TRENDS
// ---------------------------------
const calculatePredictions = (analyticsData, statsData) => {
  if (!analyticsData.length) return null;
  const current = analyticsData.at(-1);
  const previous = analyticsData.at(-2) || current;

  const wasteGrowth = ((current.waste - previous.waste) / previous.waste) * 100;
  const revenueGrowth = ((current.revenue - previous.revenue) / previous.revenue) * 100;

  return {
    waste: {
      title: "Waste Trend",
      prediction:
        wasteGrowth > 0
          ? `↑ ${wasteGrowth.toFixed(1)}% Increase in waste generation`
          : `↓ ${Math.abs(wasteGrowth).toFixed(1)}% Reduction in waste`,
      confidence: 80 + Math.random() * 10,
    },
    efficiency: {
      title: "Efficiency Forecast",
      prediction: `₹${Math.floor(statsData.totalRevenue / statsData.totalWaste).toLocaleString()} per ton efficiency`,
      confidence: 75 + Math.random() * 10,
    },
    sustainability: {
      title: "Sustainability Impact",
      prediction: `Reduced CO₂ footprint by ${(statsData.totalWaste * 0.5).toFixed(0)} MT`,
      confidence: 85 + Math.random() * 5,
    },
  };
};

// ---------------------------------
// MAIN DASHBOARD COMPONENT
// ---------------------------------
export default function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [statsData, setStatsData] = useState({});
  const [locationData, setLocationData] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate data refresh (future backend ready)
  useEffect(() => {
    const loadData = async () => {
      const analytics = generateFakeAnalytics();
      const stats = generateFakeStats(analytics);
      const locations = generateFakeLocations();

      setAnalyticsData(analytics);
      setStatsData(stats);
      setLocationData(locations);
      setPredictions(calculatePredictions(analytics, stats));
      setLoading(false);
    };

    loadData();
    const interval = setInterval(loadData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-green-700 text-xl">
        Loading live data simulation...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-teal-50 pt-20"
    >
      <div className="container mx-auto p-6">
        {/* HEADER */}

        {/* QUICK STATS */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <QuickStatCard
            icon={<Recycle />}
            title="Total Waste Collected"
            value={`${formatNumber(statsData.totalWaste)} MT`}
            color="green"
          />
          <QuickStatCard
            icon={<Factory />}
            title="Processing Centers"
            value={Object.keys(statsData.statusBreakdown || {}).length}
            color="blue"
          />
          <QuickStatCard
            icon={<Wind />}
            title="CO₂ Saved"
            value={`${formatNumber(statsData.totalWaste * 0.5)} MT`}
            color="emerald"
          />
          <QuickStatCard
            icon={<DollarSign />}
            title="Revenue"
            value={`₹${formatNumber(statsData.totalRevenue)}`}
            color="purple"
          />
        </div>

        {/* ANALYTICS */}
        <div className="grid gap-6 md:grid-cols-7 mt-8">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Waste & Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="waste"
                    stroke="#22c55e"
                    fill="url(#colorWaste)"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <LocationCard locationData={locationData} />
        </div>

        {/* ENVIRONMENTAL & FORECAST */}
        <div className="grid gap-6 md:grid-cols-7 mt-6">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Leaf className="text-green-600" /> Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnvironmentalImpact statsData={statsData} />
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Sparkles /> AI Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {predictions ? (
                <div className="space-y-3">
                  {Object.values(predictions).map((p) => (
                    <PredictionCard
                      key={p.title}
                      title={p.title}
                      prediction={p.prediction}
                      confidence={p.confidence}
                    />
                  ))}
                </div>
              ) : (
                <div>Analyzing trends...</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 🌟 NEW ADVANCED SECTIONS */}
        <DashboardExtras
          analyticsData={analyticsData}
          statsData={statsData}
          locationData={locationData}
        />
      </div>
    </motion.div>
  );
}

// ----------------------
// SUB COMPONENTS
// ----------------------
const QuickStatCard = ({ icon, title, value, color }) => (
  <Card className={`border-l-4 border-l-${color}-600`}>
    <CardHeader className="flex justify-between items-center">
      <CardTitle className="text-sm">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
    </CardContent>
  </Card>
);

const PredictionCard = ({ title, prediction, confidence }) => (
  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
    <h3 className="text-sm font-medium text-green-800">{title}</h3>
    <p className="text-xs text-gray-700">{prediction}</p>
    <Progress value={confidence} className="mt-2" />
  </div>
);

const EnvironmentalImpact = ({ statsData }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-green-50 p-4 rounded-lg text-center">
      <Sun className="mx-auto text-yellow-500" />
      <p className="text-sm text-green-700 font-medium">Energy Saved</p>
      <h3 className="text-2xl font-bold text-green-700">
        {formatNumber(statsData.totalWaste * 3)} kWh
      </h3>
    </div>
    <div className="bg-blue-50 p-4 rounded-lg text-center">
      <Leaf className="mx-auto text-blue-600" />
      <p className="text-sm text-blue-700 font-medium">Recycling Ratio</p>
      <h3 className="text-2xl font-bold text-blue-700">
        {Math.floor(Math.random() * 30 + 60)}%
      </h3>
    </div>
  </div>
);

const LocationCard = ({ locationData }) => (
  <Card className="col-span-3 overflow-hidden">
    <CardHeader>
      <CardTitle className="text-green-800">Waste by Location</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={locationData}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            nameKey="name"
            startAngle={90}
            endAngle={450}
          >
            {locationData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="space-y-1 max-h-[240px] overflow-y-auto">
        {locationData.map((loc, i) => (
          <div key={i} className="flex justify-between text-sm p-1">
            <span>{loc.name}</span>
            <span>{formatNumber(loc.value)} MT</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// ✅ ------------------ EXTRAS SECTION ------------------
function DashboardExtras({ analyticsData, statsData, locationData }) {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshing(true);
      setTimeout(() => setRefreshing(false), 1000);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Smart Alerts
  const alerts = [];
  analyticsData.forEach((m) => {
    if (m.waste > 2300)
      alerts.push(`⚠️ High waste detected in ${m.month} (${m.waste} MT)`);
    if (m.revenue < 200000)
      alerts.push(`📉 Low revenue in ${m.month}`);
  });
  locationData.forEach((loc) => {
    if (loc.value > 2200)
      alerts.push(`🏙️ Heavy waste in ${loc.name}`);
  });

  const ecoScore = Math.min(100, 70 + Math.random() * 30);
  const nextForecast = Array.from({ length: 3 }, (_, i) => ({
    month: `+${i + 1}M`,
    waste: Math.floor(analyticsData.at(-1)?.waste * (1 + 0.05 * (i + 1))),
    revenue: Math.floor(analyticsData.at(-1)?.revenue * (1 + 0.08 * (i + 1))),
  }));

  const recommendations = [
    "Optimize processing units in Pune.",
    "Enhance recycling systems in Chennai.",
    "Deploy energy recovery tech in Mumbai.",
    "Monitor CO₂ offset in Delhi zone.",
  ];

  return (
    <div className="mt-10 space-y-6">
      {/* 🟢 Live Sync */}
      <motion.div
        animate={refreshing ? { scale: [1, 1.2, 1] } : {}}
        className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm shadow-sm w-fit mx-auto"
      >
        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
        {refreshing ? "🟢 Live Sync Active" : "Idle"}
      </motion.div>

      {/* ⚠️ Smart Alerts */}
      <Card className="border border-yellow-200 bg-yellow-50/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <AlertTriangle className="text-yellow-600" /> Smart Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length ? (
            <ul className="space-y-2 text-sm text-yellow-800">
              {alerts.map((a, i) => (
                <motion.li key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {a}
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No critical alerts detected.</p>
          )}
        </CardContent>
      </Card>

      {/* 🌍 Sustainability Score */}
      <Card className="bg-emerald-50 border border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Activity className="text-emerald-600" /> Sustainability Scorecard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 text-sm">Eco Efficiency</span>
            <span className="font-bold text-emerald-700">{ecoScore.toFixed(0)}%</span>
          </div>
          <Progress value={ecoScore} className="mt-2 h-2" />
        </CardContent>
      </Card>

      {/* 📈 Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <TrendingUp className="text-green-600" /> AI Forecast (Next 3 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={nextForecast}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="waste" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 🧠 AI Recommendations */}
      <Card className="border border-blue-200 bg-blue-50/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Brain className="text-blue-600" /> AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-sm text-blue-900 space-y-1">
            {recommendations.slice(0, 3).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  
}
