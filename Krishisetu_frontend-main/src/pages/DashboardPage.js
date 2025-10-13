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
  Legend
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import {
  Plus,
  Filter,
  Recycle,
  Factory,
  Wind,
  DollarSign,
  AlertTriangle
} from "lucide-react";

// Add Skeleton Components
const SkeletonCard = () => (
  <div className="bg-white rounded-lg p-4 shadow animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-3 w-full">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="w-8 h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white rounded-lg p-4 shadow animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="h-[300px] bg-gray-200 rounded"></div>
  </div>
);

const SkeletonActivity = () => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

// Add this helper function at the top level
const calculatePredictions = (analyticsData, statsData) => {
  try {
    // Safe calculation helper
    const calculatePercentageChange = (current, previous) => {
      if (!current || !previous || previous === 0) return 0;
      return ((current - previous) / previous * 100).toFixed(1);
    };

    // Get last two months data safely
    const currentMonth = analyticsData[analyticsData.length - 1] || { waste: 0, revenue: 0 };
    const previousMonth = analyticsData[analyticsData.length - 2] || { waste: 0, revenue: 0 };

    // Calculate trends safely
    const wasteGrowth = calculatePercentageChange(currentMonth.waste, previousMonth.waste);
    const revenueTrend = calculatePercentageChange(currentMonth.revenue, previousMonth.revenue);

    // Safe calculations for efficiency
    const totalWaste = statsData?.totalWaste || 0;
    const totalRevenue = statsData?.totalRevenue || 0;
    const revenuePerTon = totalWaste > 0 ? Math.floor(totalRevenue / totalWaste) : 0;

    return {
      wasteForecast: {
        title: "Waste Generation Trend",
        prediction: parseFloat(wasteGrowth) !== 0 
          ? `${wasteGrowth > 0 ? 'Increasing' : 'Decreasing'} trend with ${Math.abs(wasteGrowth)}% ${wasteGrowth > 0 ? 'growth' : 'reduction'} in waste generation`
          : "Stable waste generation pattern",
        confidence: 85
      },
      efficiency: {
        title: "Collection Efficiency",
        prediction: revenuePerTon > 0
          ? `Current revenue per ton is ₹${revenuePerTon.toLocaleString()}, with optimization potential`
          : "Establishing baseline efficiency metrics",
        confidence: 78
      },
      revenue: {
        title: "Revenue Forecast",
        prediction: parseFloat(revenueTrend) !== 0
          ? `${revenueTrend > 0 ? 'Upward' : 'Downward'} trend with ${Math.abs(revenueTrend)}% ${revenueTrend > 0 ? 'increase' : 'decrease'} in revenue`
          : "Stable revenue pattern",
        confidence: 82
      }
    };
  } catch (error) {
    console.error('Prediction calculation error:', error);
    // Fallback predictions if calculation fails
    return {
      wasteForecast: {
        title: "Waste Generation Trend",
        prediction: "Analyzing waste generation patterns",
        confidence: 70
      },
      efficiency: {
        title: "Collection Efficiency",
        prediction: "Calculating efficiency metrics",
        confidence: 70
      },
      revenue: {
        title: "Revenue Forecast",
        prediction: "Analyzing revenue patterns",
        confidence: 70
      }
    };
  }
};

// Add this helper function for pie chart colors
const COLORS = [
  '#22c55e', '#15803d', '#059669', '#0d9488', '#0891b2',
  '#0284c7', '#2563eb', '#4f46e5', '#7c3aed', '#9333ea'
];

// Add this static data for locations
const SAMPLE_LOCATION_DATA = [
  { name: "Mumbai", value: 2500 },
  { name: "Delhi", value: 2100 },
  { name: "Bangalore", value: 1800 },
  { name: "Chennai", value: 1500 },
  { name: "Pune", value: 1200 },
  { name: "Hyderabad", value: 1000 },
  { name: "Kolkata", value: 900 },
  { name: "Ahmedabad", value: 800 },
  { name: "Jaipur", value: 700 },
  { name: "Lucknow", value: 600 }
];

// Modify the prepareLocationData function
const prepareLocationData = (locations) => {
  // Use sample data instead of waiting for API data
  return SAMPLE_LOCATION_DATA;
};

export default function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [statsData, setStatsData] = useState({
    totalWaste: 0,
    totalRevenue: 0,
    statusBreakdown: {},
    wasteByType: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState(null);
  // Add new state for location data
  const [locationData, setLocationData] = useState([]);

  // Calculate total values for quick stats
  const calculateTotals = (data) => {
    return data.reduce((acc, month) => ({
      totalQuantity: (acc.totalQuantity || 0) + (month.totalQuantity || 0),
      totalRevenue: (acc.totalRevenue || 0) + (month.totalRevenue || 0)
    }), { totalQuantity: 0, totalRevenue: 0 });
  };

  // Convert month number to name
  const getMonthName = (monthNum) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNum - 1];
  };

  // Add a number formatting helper
  const formatNumber = (value) => {
    return !value || isNaN(value) ? 0 : value.toLocaleString();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsResponse, statsResponse, locationsResponse] = await Promise.all([
          fetch('https://knowcode-protobuf-backend.vercel.app/api/v1/dashboards/analytics/monthly'),
          fetch('https://knowcode-protobuf-backend.vercel.app/api/v1/dashboards/stats'),
          fetch('https://knowcode-protobuf-backend.vercel.app/api/v1/waste/analytics/locations')
        ]);

        if (!analyticsResponse.ok || !statsResponse.ok || !locationsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const analyticsResult = await analyticsResponse.json();
        const statsResult = await statsResponse.json();

        if (analyticsResult.status === 'success') {
          const transformedData = analyticsResult.data.monthlyData.map(item => ({
            month: getMonthName(item.month),
            waste: item.totalQuantity || 0,
            revenue: item.totalRevenue || 0,
            recycled: (item.totalQuantity || 0) * 0.8,
          }));
          setAnalyticsData(transformedData);
        }

        if (statsResult.status === 'success') {
          setStatsData(statsResult.data.stats);
        }

        // Handle locations data
        const locationsResult = await locationsResponse.json();
        if (locationsResult.status === 'success') {
          const transformedLocations = locationsResult.data.stats.locations.map(loc => ({
            name: loc.location,
            value: loc.totalWaste,
            percentage: parseFloat(loc.percentage),
            listings: loc.listings,
            averagePrice: loc.averagePrice
          }));
          setLocationData(transformedLocations);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add effect to calculate predictions when data changes
  useEffect(() => {
    if (analyticsData.length > 0 && statsData) {
      const calculatedPredictions = calculatePredictions(analyticsData, statsData);
      setPredictions(calculatedPredictions);
    }
  }, [analyticsData, statsData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Replace the loading state with skeleton UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-teal-50 pt-20">
        <div className="container py-6">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* Main Content Skeleton */}
          <div className="grid gap-6 md:grid-cols-7">
            <div className="col-span-4">
              <SkeletonChart />
            </div>
            <div className="col-span-3 bg-white rounded-lg p-4 shadow">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <SkeletonActivity key={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Environmental Impact Skeleton */}
          <div className="grid gap-6 md:grid-cols-7 mt-6">
            <div className="col-span-4">
              <SkeletonChart />
            </div>
            <div className="col-span-3">
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Calculate totals for quick stats
  const totals = calculateTotals(analyticsData);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-teal-50 pt-20"
    >
      <div className="container py-6">
        {/* Header Section */}
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent leading-relaxed pb-1">
                Agricultural Waste Management
              </h1>
              <p className="text-green-700/80">Transform waste into sustainable opportunities</p>
            </div>
          </motion.div>

          {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <QuickStatCard
            icon={<Recycle />}
            title="Total Waste Collected"
            value={`${formatNumber(statsData.totalWaste)} MT`}
            change={`${((analyticsData[analyticsData.length - 1]?.waste || 0) - (analyticsData[analyticsData.length - 2]?.waste || 0)).toFixed(1)}%`}
            color="green"
          />
          <QuickStatCard
            icon={<Factory />}
            title="Processing Centers"
            value={Object.keys(statsData.statusBreakdown).length || 0}
            subtext={`${Object.values(statsData.wasteByType).length} Types`}
            color="blue"
          />
          <QuickStatCard
            icon={<Wind />}
            title="CO₂ Emissions Saved"
            value={`${formatNumber(statsData.totalWaste * 0.5)} MT`}
            change="-25%"
            color="emerald"
          />
          <QuickStatCard
            icon={<DollarSign />}
            title="Revenue Generated"
            value={`₹${formatNumber(statsData.totalRevenue)}`}
            change={`${((analyticsData[analyticsData.length - 1]?.revenue || 0) - (analyticsData[analyticsData.length - 2]?.revenue || 0)).toFixed(1)}%`}
            color="purple"
          />
        </motion.div>

        {/* Main Content Grid */}
        <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-7 mt-6">
          {/* Waste Analytics Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Waste Collection Analytics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke="#22c55e" />
                    <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                    <Tooltip 
                      formatter={(value) => {
                        return !value || isNaN(value) ? '0' : value.toLocaleString();
                      }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="waste"
                      stroke="#22c55e"
                      fillOpacity={1}
                      fill="url(#colorWaste)"
                      name="Waste (MT)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      name="Revenue (₹)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <LocationCard locationData={locationData} />
        </motion.div>

        {/* Environmental Impact Section */}
        <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-7 mt-6">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle className="text-green-800">Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-lg bg-green-50"
                >
                  <h3 className="text-sm font-medium text-green-800">Air Quality Improvement</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="text-2xl font-bold text-green-600">32%</div>
                    <span className="text-xs text-green-600">↑</span>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-lg bg-blue-50"
                >
                  <h3 className="text-sm font-medium text-blue-800">Water Saved</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="text-2xl font-bold text-blue-600">1.2M</div>
                    <span className="text-xs">Liters</span>
                  </div>
                </motion.div>
                <div className="col-span-2 h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="recycled" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prediction */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle className="text-green-800">Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions ? (
                  <>
                    <PredictionCard
                      title={predictions.wasteForecast.title}
                      prediction={predictions.wasteForecast.prediction}
                      confidence={predictions.wasteForecast.confidence}
                    />
                    <PredictionCard
                      title={predictions.efficiency.title}
                      prediction={predictions.efficiency.prediction}
                      confidence={predictions.efficiency.confidence}
                    />
                    <PredictionCard
                      title={predictions.revenue.title}
                      prediction={predictions.revenue.prediction}
                      confidence={predictions.revenue.confidence}
                    />
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    Calculating predictions...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

// New component for Quick Stats
const QuickStatCard = ({ icon, title, value, change, color, subtext }) => (
  <Card className={`border-l-4 border-l-${color}-600`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
      {change && <p className="text-xs text-muted-foreground">{change}</p>}
      {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
    </CardContent>
  </Card>
);

// TODO: Create PredictionCard component wth ntegrated Progress component
const PredictionCard = ({ title, prediction, confidence }) => (
  <div className="p-4 bg-green-50/50 rounded-lg border border-green-100">
    <h3 className="text-sm font-medium text-green-800">{title}</h3>
    <p className="text-xs text-muted-foreground">{prediction}</p>
    <Progress value={confidence} className="mt-2" />
  </div>
);

// Add this new component for location stats
const LocationStatItem = ({ name, value, percentage, color, index }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
  >
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm font-medium text-gray-700">{name}</span>
    </div>
    <div className="text-right">
      <span className="text-sm text-gray-600 font-semibold">{value.toLocaleString()} MT</span>
      <div className="text-xs text-gray-400">{percentage}%</div>
    </div>
  </motion.div>
);

// Add this CSS somewhere in your styles
const styles = `
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #22c55e #e2e8f0;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #e2e8f0;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #22c55e;
    border-radius: 3px;
  }
`;

// Replace the Location Waste Distribution card content
const LocationCard = ({ locationData }) => (
  <Card className="col-span-3 overflow-hidden">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-green-800">Waste by Location</CardTitle>
        <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
          {locationData.length} Districts
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                startAngle={90}
                endAngle={450}
              >
                {locationData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity"
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 shadow-lg rounded-lg border z-[60]">
                        <p className="font-medium text-sm">{data.name}</p>
                        <p className="text-green-600 font-semibold">
                          {data.value.toLocaleString()} MT
                        </p>
                        <div className="text-xs text-gray-500 mt-1">
                          <div>{data.listings} Listings</div>
                          <div>₹{data.averagePrice}/MT Avg.</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
                wrapperStyle={{ zIndex: 100 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-[40]">
            <div className="text-2xl font-bold text-gray-800">
              {locationData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Total MT</div>
          </div>
        </div>
        <div className="space-y-1 max-h-[240px] overflow-y-auto custom-scrollbar">
          {locationData.map((item, index) => (
            <LocationStatItem
              key={item.name}
              name={item.name}
              value={item.value}
              percentage={item.percentage}
              color={COLORS[index % COLORS.length]}
              index={index}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Live data</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

