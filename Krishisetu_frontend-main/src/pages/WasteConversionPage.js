import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Recycle, Search, Info, PlusCircle, X, Award, Globe, Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WasteConversionPage = () => {
  const [wasteType, setWasteType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [output, setOutput] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showInfo, setShowInfo] = useState(null);

  // Global CO2 Impact Tracker
  const [globalImpact, setGlobalImpact] = useState(0);
  const [insight, setInsight] = useState("");

  const [partners, setPartners] = useState([
    {
      name: "GreenFuel Pvt Ltd",
      location: "Pune",
      contact: "+91 9876543210",
      acceptedWaste: "Rice Husk",
      trust: 93,
    },
    {
      name: "EcoCompost India",
      location: "Nagpur",
      contact: "+91 9123456789",
      acceptedWaste: "Crop Residue",
      trust: 87,
    },
    {
      name: "Bagasse BioWorks",
      location: "Kolhapur",
      contact: "+91 9988776655",
      acceptedWaste: "Sugarcane Bagasse",
      trust: 91,
    },
  ]);

  const [newPartner, setNewPartner] = useState({
    name: "",
    location: "",
    contact: "",
    acceptedWaste: "",
  });

  const conversionRates = {
    "Rice Husk": { product: "Biofuel", ratio: 0.4, benefit: 1.5, price: 3 },
    "Crop Residue": { product: "Organic Compost", ratio: 0.7, benefit: 1.0, price: 2 },
    "Sugarcane Bagasse": { product: "Paper Products", ratio: 0.5, benefit: 2.0, price: 4 },
    "Wheat Straw": { product: "Biochar", ratio: 0.6, benefit: 1.8, price: 3.5 },
    "Corn Cobs": { product: "Biogas", ratio: 0.55, benefit: 1.6, price: 3 },
    "Coconut Shells": { product: "Activated Carbon", ratio: 0.45, benefit: 2.3, price: 5 },
    "Banana Peels": { product: "Organic Fertilizer", ratio: 0.8, benefit: 1.2, price: 2.5 },
    "Groundnut Shells": { product: "Briquettes", ratio: 0.5, benefit: 2.1, price: 3.8 },
  };

  const wasteInfo = {
    "Rice Husk": "Rice husk can be converted into biofuel and biogas. It's rich in silica and ideal for renewable energy production.",
    "Crop Residue": "Crop residue can be turned into organic compost, improving soil fertility and reducing open-field burning.",
    "Sugarcane Bagasse": "Sugarcane bagasse is used in paper and biogas production. Eco-friendly and profitable.",
    "Wheat Straw": "Wheat straw can be turned into biochar or eco-panels. It reduces waste and enhances soil carbon levels.",
    "Corn Cobs": "Corn cobs are excellent for biogas or biomass fuel production. Useful for rural energy setups.",
    "Coconut Shells": "Coconut shells are a rich source for activated carbon, widely used in filtration and fuel briquettes.",
    "Banana Peels": "Banana peels produce organic fertilizers rich in potassium and nitrogen for soil enrichment.",
    "Groundnut Shells": "Groundnut shells can be processed into eco-friendly briquettes or used as biofuel raw material.",
  };

  const handleCalculate = () => {
    if (!wasteType || !quantity) return;
    const { product, ratio, benefit, price } = conversionRates[wasteType];
    const estimatedOutput = quantity * ratio;
    const co2Saved = quantity * benefit;
    const estimatedIncome = estimatedOutput * price;
    setOutput({ product, estimatedOutput, co2Saved, estimatedIncome });

    setGlobalImpact((prev) => prev + co2Saved);
    setInsight(
      `✅ ${wasteType} converted successfully! CO₂ saved: ${co2Saved.toFixed(
        1
      )} kg | Global Impact: ${(globalImpact + co2Saved).toFixed(1)} kg 🌍`
    );
  };

  const handleAddPartner = (e) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.location || !newPartner.contact || !newPartner.acceptedWaste) return;
    const trust = Math.floor(Math.random() * 20) + 80;
    const newP = { ...newPartner, trust };
    setPartners([...partners, newP]);
    setNewPartner({ name: "", location: "", contact: "", acceptedWaste: "" });
    setInsight(`🌿 New Partner "${newP.name}" added successfully! Trust Score: ${trust}%`);
  };

  const filteredPartners = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType ? p.acceptedWaste === filterType : true)
  );

  // Auto Refresh Chart Data
  const [data, setData] = useState(
    Object.keys(conversionRates).map((key) => ({
      waste: key,
      ratio: conversionRates[key].ratio,
      benefit: conversionRates[key].benefit * 100,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((d) => ({
          ...d,
          ratio: Math.max(0.1, d.ratio + (Math.random() * 0.02 - 0.01)),
          benefit: Math.max(50, d.benefit + (Math.random() * 2 - 1)),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getBadgeColor = (score) => {
    if (score > 90) return "bg-green-100 text-green-700";
    if (score > 80) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const topPartners = [...partners].sort((a, b) => b.trust - a.trust).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 py-10 px-6 sm:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl border border-green-200 rounded-3xl shadow-xl p-8 space-y-10"
      >
        <header className="flex items-center space-x-3">
          <Recycle className="text-green-600 w-8 h-8" />
          <h1 className="text-3xl font-bold text-green-800">
            Waste-to-Wealth Conversion Dashboard
          </h1>
        </header>

        {/* Global Impact Counter */}
        <motion.div
          className="p-4 bg-gradient-to-r from-green-100 to-emerald-50 rounded-xl shadow-md flex items-center justify-between"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="flex items-center gap-2 text-green-700">
            <Globe className="w-6 h-6" />
            <span className="font-semibold text-lg">
              Global CO₂ Savings: {globalImpact.toFixed(1)} kg
            </span>
          </div>
          <Sparkles className="text-yellow-400 animate-pulse" />
        </motion.div>

        {/* Insight Message */}
        {insight && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-50 to-green-50 border border-green-200 text-green-700 p-3 rounded-xl shadow-sm text-center text-sm"
          >
            {insight}
          </motion.div>
        )}

        {/* Top Performing Partners Leaderboard */}
        <section>
          <h2 className="text-2xl font-bold text-green-700 mb-3 flex items-center gap-2">
            Top Performing Partners <Award className="text-yellow-500" />
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {topPartners.map((p, idx) => (
              <motion.div
                key={p.name}
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  {idx === 0 && <span className="text-2xl">🥇</span>}
                  {idx === 1 && <span className="text-2xl">🥈</span>}
                  {idx === 2 && <span className="text-2xl">🥉</span>}
                  <h3 className="font-semibold text-green-700">{p.name}</h3>
                </div>
                <p className="text-sm text-gray-500">{p.location}</p>
                <p
                  className={`mt-2 inline-block px-3 py-1 text-xs font-medium rounded-full ${getBadgeColor(
                    p.trust
                  )}`}
                >
                  Trust Score: {p.trust}%
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Info Cards */}
        <section>
          <h2 className="text-2xl font-bold text-green-700 mb-4">Waste Types Overview</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {Object.keys(wasteInfo).map((key) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.05 }}
                className="p-5 bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl shadow-md cursor-pointer hover:shadow-lg"
                onClick={() => setShowInfo(key)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-green-700">{key}</h3>
                  <Info className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-xs text-gray-600">{conversionRates[key].product}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Popup Info */}
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md text-center relative">
              <button
                onClick={() => setShowInfo(null)}
                className="absolute top-3 right-3 text-green-600 hover:text-green-800"
              >
                <X />
              </button>
              <h2 className="text-xl font-bold text-green-700 mb-2">{showInfo}</h2>
              <p className="text-gray-600">{wasteInfo[showInfo]}</p>
            </div>
          </motion.div>
        )}

        {/* Conversion & Impact Calculator */}
        <section>
          <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
            Conversion & Impact Calculator 🌾
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <select
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              className="border border-green-300 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-green-400 rounded-xl px-4 py-2 w-full sm:w-1/3 text-gray-700 shadow-sm transition-all"
            >
              <option value="">Select Waste Type</option>
              {Object.keys(conversionRates).map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Enter quantity (kg)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border border-green-300 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-green-400 rounded-xl px-4 py-2 w-full sm:w-1/3 text-gray-700 shadow-sm transition-all"
            />

            <button
              onClick={handleCalculate}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-8 py-2 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
            >
              Calculate
            </button>
          </div>

          {output && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 border border-green-200 shadow-inner space-y-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-green-700">
                  {wasteType} → {output.product}
                </h3>
                <span className="text-sm text-gray-500">Impact Summary</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white/60 rounded-xl border border-green-100 shadow-sm">
                  <p className="text-gray-500 text-sm">Output</p>
                  <p className="text-green-700 font-bold text-xl">
                    {output.estimatedOutput.toFixed(2)} kg
                  </p>
                </div>
                <div className="p-3 bg-white/60 rounded-xl border border-green-100 shadow-sm">
                  <p className="text-gray-500 text-sm">CO₂ Saved</p>
                  <p className="text-green-700 font-bold text-xl">
                    {output.co2Saved.toFixed(2)} kg
                  </p>
                </div>
                <div className="p-3 bg-white/60 rounded-xl border border-green-100 shadow-sm">
                  <p className="text-gray-500 text-sm">Est. Income</p>
                  <p className="text-green-700 font-bold text-xl">
                    ₹{output.estimatedIncome.toFixed(2)}
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(output.co2Saved / 3, 100)}%`,
                }}
                transition={{ duration: 1 }}
                className="h-3 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full mt-4 shadow-sm"
              />
              <p className="text-xs text-gray-500 text-right">
                Live environmental score loading dynamically 🌱
              </p>
            </motion.div>
          )}
        </section>

        {/* Live Dynamic Chart Section */}
        <section>
          <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
            Waste Conversion Analytics (Live)
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
            </span>
          </h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative bg-white/70 backdrop-blur-md border border-green-100 rounded-2xl p-4 shadow-md"
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="waste" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) =>
                    name === "ratio"
                      ? `Conversion Ratio: ${value.toFixed(2)}`
                      : `CO₂ Benefit: ${value.toFixed(1)}`
                  }
                />
                <Bar
                  dataKey="ratio"
                  fill="url(#ratioGradient)"
                  name="Conversion Ratio"
                  animationDuration={1200}
                />
                <Bar
                  dataKey="benefit"
                  fill="url(#benefitGradient)"
                  name="CO₂ Benefit"
                  animationDuration={1200}
                />
                <defs>
                  <linearGradient id="ratioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="benefitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>

            <p className="absolute bottom-2 right-4 text-xs text-gray-500 italic">
              *Auto-refreshing every 5 seconds for real-time impact 🌍
            </p>
          </motion.div>
        </section>

        {/* Live Waste Price Dashboard */}
        <section>
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Live Waste Price Dashboard
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/70 backdrop-blur-md border border-green-100 rounded-2xl shadow-md p-6"
          >
            <LiveWastePriceTable />
          </motion.div>
        </section>

        {/* Partner Directory */}
        <section>
          <h2 className="text-2xl font-bold text-green-700 mb-4">Processing Partner Directory</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center gap-2 bg-white border border-green-200 rounded-xl px-3 py-2 shadow-sm w-full sm:w-1/2">
              <Search className="text-green-600 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or city..."
                className="w-full outline-none text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-green-300 rounded-xl px-4 py-2 text-gray-700 shadow-sm w-full sm:w-1/3"
            >
              <option value="">Filter by Waste Type</option>
              {Object.keys(conversionRates).map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-green-200 bg-white rounded-xl">
              <thead className="bg-green-100 text-green-700">
                <tr>
                  <th className="p-2 text-left">Company</th>
                  <th className="p-2 text-left">Location</th>
                  <th className="p-2 text-left">Contact</th>
                  <th className="p-2 text-left">Accepted Waste</th>
                  <th className="p-2 text-left">Trust Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredPartners.map((p, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border-t border-green-100 hover:bg-green-50 transition-all"
                  >
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.location}</td>
                    <td className="p-2">{p.contact}</td>
                    <td className="p-2">{p.acceptedWaste}</td>
                    <td className="p-2">
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded-full ${getBadgeColor(
                          p.trust
                        )}`}
                      >
                        {p.trust}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add Partner Form */}
        <section>
          <h2 className="text-2xl font-bold text-green-700 mb-4">Add New Partner</h2>
          <form
            onSubmit={handleAddPartner}
            className="grid sm:grid-cols-2 gap-4 bg-green-50 p-6 rounded-2xl border border-green-100"
          >
            <input
              type="text"
              placeholder="Company Name"
              value={newPartner.name}
              onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
              className="border border-green-300 rounded-xl px-4 py-2"
            />
            <input
              type="text"
              placeholder="Location"
              value={newPartner.location}
              onChange={(e) => setNewPartner({ ...newPartner, location: e.target.value })}
              className="border border-green-300 rounded-xl px-4 py-2"
            />
            <input
              type="text"
              placeholder="Contact"
              value={newPartner.contact}
              onChange={(e) => setNewPartner({ ...newPartner, contact: e.target.value })}
              className="border border-green-300 rounded-xl px-4 py-2"
            />
            <select
              value={newPartner.acceptedWaste}
              onChange={(e) =>
                setNewPartner({ ...newPartner, acceptedWaste: e.target.value })
              }
              className="border border-green-300 rounded-xl px-4 py-2"
            >
              <option value="">Accepted Waste Type</option>
              {Object.keys(conversionRates).map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <button
              type="submit"
              className="sm:col-span-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 rounded-xl hover:shadow-lg flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Add Partner
            </button>
          </form>
        </section>
      </motion.div>
    </div>
  );
};

// Live Waste Price Table Component
const LiveWastePriceTable = () => {
  const [prices, setPrices] = useState([
    { type: "Rice Husk", price: 90, range: [80, 110], history: [90] },
    { type: "Crop Residue", price: 75, range: [60, 90], history: [75] },
    { type: "Sugarcane Bagasse", price: 120, range: [100, 140], history: [120] },
    { type: "Wheat Straw", price: 95, range: [85, 110], history: [95] },
    { type: "Corn Cobs", price: 88, range: [70, 105], history: [88] },
    { type: "Coconut Shells", price: 145, range: [120, 160], history: [145] },
    { type: "Banana Peels", price: 70, range: [60, 85], history: [70] },
    { type: "Groundnut Shells", price: 110, range: [90, 130], history: [110] },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((item) => {
          const change = (Math.random() * 0.5 - 0.25).toFixed(2);
          let newPrice = parseFloat(item.price) + parseFloat(change);

          if (newPrice < item.range[0]) newPrice = item.range[0];
          if (newPrice > item.range[1]) newPrice = item.range[1];

          const trend = newPrice > item.price ? "up" : newPrice < item.price ? "down" : "stable";
          return { ...item, price: parseFloat(newPrice.toFixed(2)), trend };
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-green-200 rounded-2xl bg-white/60 text-gray-800">
        <thead className="bg-green-100 text-green-700">
          <tr>
            <th className="p-3 text-left">Waste Type</th>
            <th className="p-3 text-left">Current Price (₹/kg)</th>
            <th className="p-3 text-left">Trend</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((item, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="border-t border-green-100 hover:bg-green-50 transition-all"
            >
              <td className="p-3 font-medium">{item.type}</td>
              <td className="p-3 font-semibold">
                ₹{item.price.toFixed(2)}
              </td>
              <td className="p-3">
                {item.trend === "up" ? (
                  <span className="text-green-600 flex items-center gap-1 animate-pulse">
                    📈 Increasing
                  </span>
                ) : item.trend === "down" ? (
                  <span className="text-red-500 flex items-center gap-1 animate-pulse">
                    📉 Decreasing
                  </span>
                ) : (
                  <span className="text-gray-500 flex items-center gap-1">
                    ➖ Stable
                  </span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-3 italic">
        *Prices fluctuate every 4 seconds to simulate real market trends.
      </p>
    </div>
  );
};



export default WasteConversionPage;
