// AILab.jsx — Clean, Easy-to-understand version (Bar chart + Summary + Smart Forecast)

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Sprout,
  Ruler,
  Wheat,
  Droplet,
  Loader,
  BrainCircuit,
  TrendingUp,
  Recycle,
  PieChart,
  DownloadCloud,
  Save,
  Clock,
} from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement
);

const AILab = () => {
  const [formData, setFormData] = useState({
    crop_area: "",
    crop_type: "",
    harvest_season: "summer",
    soil_type: "",
    farming_technique: "traditional",
    temperature: "",
    rainfall: "",
    humidity: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [savedScenarios, setSavedScenarios] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ai_lab_scenarios") || "[]");
    setSavedScenarios(saved);
  }, []);

  const soilConditions = ["Sandy", "Clay", "Loamy","Silty","Peaty","Chalky","Alluvial", "Red Soil", "Black Soil"];
  const cropTypes = ["Rice", "Wheat", "Sugarcane", "Corn","Groundnut", "Mustard", "Paddy", "Bajra", "Jowar", "Millet", "Tea", "Coffee",
  "Banana", "Potato", "Tomato", "Onion", "Sunflower", "Chickpea", "Pulses",
  "Peas", "Cauliflower", "Cabbage", "Carrot", "Ginger", "Turmeric", "Sugar beet",
  "Tobacco", "Sesame", "Pepper", "Lentil", "Sorghum", "Oats"];
  const harvestSeasons = ["Summer", "Winter", "Monsoon",];

  const computeConfidenceHeuristic = (apiConfidence) => {
    if (typeof apiConfidence === "number") return Math.round(apiConfidence * 100);
    const fields = [
      "crop_area",
      "crop_type",
      "harvest_season",
      "soil_type",
      "temperature",
      "rainfall",
      "humidity",
    ];
    const filled = fields.reduce((acc, f) => acc + (formData[f] ? 1 : 0), 0);
    return Math.min(95, Math.round((filled / fields.length) * 100));
  };

  const computeBreakdownHeuristic = (predictedWaste, crop) => {
    let compostablePct = 0.65;
    if ((crop || "").toLowerCase() === "rice") compostablePct = 0.6;
    if ((crop || "").toLowerCase() === "sugarcane") compostablePct = 0.75;

    const compostable = +(predictedWaste * compostablePct).toFixed(2);
    const recyclable = +((predictedWaste * 0.28)).toFixed(2);
const hazardous = +(predictedWaste - compostable - recyclable).toFixed(2);
    return {
      compostable,
      recyclable,
      hazardous,
      compostablePct: Math.round(compostablePct * 100),
      recyclablePct: 28,
      hazardousPct: Math.round((hazardous / predicted_waste_or_1(predictedWaste)) * 100),
    };
  };
  const predicted_waste_or_1 = (v) => (v ? v : 1);

// 🌿 SMART GEN-AI Recommendation system (adds intelligence + animation)
const makeRecommendations = (breakdown) => {
  const recs = [];
  const crop = (formData.crop_type || "").toLowerCase();
  const soil = (formData.soil_type || "").toLowerCase();
  const temp = parseFloat(formData.temperature) || 0;
  const rain = parseFloat(formData.rainfall) || 0;
  const hum = parseFloat(formData.humidity) || 0;

  // Base logic (your same one, improved)
  if (breakdown.compostablePct >= 60) {
    recs.push("♻️ Most of your waste is compostable — start on-site composting or biofertilizer conversion.");
    recs.push("🌿 Use green manure techniques to enrich soil naturally.");
  } else {
    recs.push("🌱 Organic waste is low — collaborate with local composting centers.");
  }
  if (breakdown.recyclable >= 0.5)
    recs.push("🧺 Segregate recyclable residues (plastic twines, packaging) and send to recycling units.");
  if (breakdown.hazardous > 0.1)
    recs.push("⚠️ Store chemical containers safely and follow disposal norms.");
  recs.push("📊 Keep track of seasonal waste trends for better planning.");

  // 💡 Smart AI tips (context-based)
  if (crop === "rice") recs.push("💧 Tip: Rice husk can be used as biochar to improve soil quality.");
  if (crop === "sugarcane") recs.push("🌾 Convert bagasse waste into eco-friendly fuel briquettes.");
  if (crop === "wheat") recs.push("🔥 Avoid stubble burning — turn straw into mulch or compost.");
  if (crop === "corn") recs.push("🌽 Corn stalks can be used for organic fodder or biogas.");

  if (soil === "sandy") recs.push("🪴 Sandy soil benefits from moisture-retaining compost layers.");
  if (soil === "clay") recs.push("🌱 Clay soil requires aeration — add organic matter regularly.");
  if (soil === "loamy") recs.push("🌼 Loamy soil is ideal — maintain balance with organic manure.");

  if (temp > 35) recs.push("☀️ High temperature detected — use shade nets and mulch to protect crops.");
  if (rain < 60) recs.push("💧 Low rainfall — adopt drip irrigation or water harvesting systems.");
  if (hum > 70) recs.push("💨 High humidity — apply organic antifungal treatments.");

  // 🧠 Random Gen-AI insight (adds uniqueness)
  const smartTips = [
    "🤖 AI Insight: IoT sensors can track waste composition in real-time.",
    "🧬 Smart Suggestion: Use satellite crop monitoring for better yield prediction.",
    "🌿 Sustainable Idea: Try vermicomposting for faster organic breakdown.",
    "💡 Data Tip: Analyze historical rainfall & waste patterns for smarter decisions.",
    "📈 Smart Move: Use AI-based yield forecasting to reduce resource waste.",
  ];
  recs.push(smartTips[Math.floor(Math.random() * smartTips.length)]);

  // ✨ Typing animation for Gen-AI feel
  setTimeout(() => {
    const box = document.querySelector(".ai-gen-output");
    if (box) {
      box.innerHTML = "";
      recs.forEach((r, i) => {
        const p = document.createElement("p");
        p.textContent = "💬 " + r;
        p.style.opacity = 0;
        p.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
          box.appendChild(p);
          p.style.opacity = 1;
        }, i * 350);
      });
    }
  }, 300);

  return recs;
};


  // SMART 5-year forecast — reacts to conditions
  const createForecast = (baseWaste) => {
    const temp = parseFloat(formData.temperature) || 0;
    const rain = parseFloat(formData.rainfall) || 0;
    const hum = parseFloat(formData.humidity) || 0;

    // Start with neutral, then adjust
    let rate = 0.0;
    // Temperature impact
    if (temp > 35) rate += 0.05;
    else if (temp >= 28) rate += 0.02;
    else if (temp < 20) rate -= 0.03;

    // Rainfall impact
    if (rain < 60) rate += 0.02;
    else if (rain > 180) rate -= 0.01;

    // Humidity impact
    if (hum < 30) rate += 0.015;
    else if (hum > 70) rate += 0.005;

    const years = [1, 2, 3, 4, 5];
    const series = years.map((y) => +(baseWaste * Math.pow(1 + rate, y)).toFixed(2));
    return {
      labels: years.map((y) => `Year ${y}`),
      datasets: [
        {
          label: "Predicted Waste (tons)",
          data: series,
          fill: true,
          borderWidth: 3,
          borderColor: "#10b981",
          backgroundColor: "rgba(16,185,129,0.18)",
          pointBackgroundColor: "#10b981",
          tension: 0.35,
        },
      ],
      meta: { rate },
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiData = {
        crop_area: parseFloat(formData.crop_area),
        crop_type: (formData.crop_type || "").toLowerCase(),
        harvest_season: (formData.harvest_season || "").toLowerCase(),
        soil_type: (formData.soil_type || "").toLowerCase(),
        farming_technique: formData.farming_technique,
        temperature: parseFloat(formData.temperature),
        rainfall: parseFloat(formData.rainfall),
        humidity: parseFloat(formData.humidity),
      };

      const response = await fetch(
        "https://knowcode-protobuf-ml-lmds.onrender.com/waste_predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        }
      );

      let farm_area, predicted_waste, confidence, breakdown, recommendations;

      if (!response.ok) {
        // fallback heuristic
        const baseFactorMap = { rice: 2.5, wheat: 1.8, sugarcane: 3.2, corn: 2.0 };
        const base = baseFactorMap[(formData.crop_type || "").toLowerCase()] || 2.0;
        predicted_waste = +((parseFloat(formData.crop_area || 0) || 0) * base).toFixed(2);
        farm_area = parseFloat(formData.crop_area || 0) || 0;
        confidence = computeConfidenceHeuristic(null);
        breakdown = computeBreakdownHeuristic(predicted_waste, formData.crop_type || "");
        recommendations = makeRecommendations(breakdown);
      } else {
        const data = await response.json();
farm_area = data.farm_area ?? (parseFloat(formData.crop_area ?? 0));
        predicted_waste =
          data.predicted_waste ??
          (() => {
            const baseFactor = { rice: 2.5, wheat: 1.8, sugarcane: 3.2, corn: 2.0 }[
              (formData.crop_type || "").toLowerCase()
            ] || 2.0;
            return +((parseFloat(formData.crop_area || 0) || 0) * baseFactor).toFixed(2);
          })();
        confidence = computeConfidenceHeuristic(data.confidence);
        breakdown = data.breakdown ?? computeBreakdownHeuristic(predicted_waste, formData.crop_type || "");
        recommendations = data.recommendations ?? makeRecommendations(breakdown);
      }

      setResult({ farm_area, predicted_waste, confidence, breakdown, recommendations });
      setForecastData(createForecast(predicted_waste));
    } catch (err) {
      console.error(err);
      setError("Failed to get predictions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const lineOptions = {
    plugins: { legend: { position: "bottom" } },
    scales: { y: { beginAtZero: true } },
  };

  // Util: dynamic color for bars + status text
  const colorFor = (value, type) => {
    if (type === "temp") return value > 35 ? "#f87171" : value < 20 ? "#fb923c" : "#34d399";
    if (type === "rain") return value > 180 ? "#60a5fa" : value < 60 ? "#f97316" : "#60a5fa";
    if (type === "hum") return value > 70 ? "#f59e0b" : value < 30 ? "#ef4444" : "#22c55e";
    return "#86efac";
  };
  const statusText = (value, type) => {
    if (type === "temp") return value > 35 ? "High" : value < 20 ? "Low" : "Ideal";
    if (type === "rain") return value > 180 ? "Excess" : value < 60 ? "Low" : "Moderate";
    if (type === "hum") return value > 70 ? "High" : value < 30 ? "Low" : "Good";
    return "";
  };

  const downloadReport = (format = "json") => {
    if (!result) return;
    const report = {
      timestamp: new Date().toISOString(),
      inputs: formData,
      results: result,
      forecast: forecastData?.datasets?.[0]?.data || [],
    };
    if (format === "json") {
      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `waste_report_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const rows = [
        ["field", "value"],
        ...Object.entries(formData).map(([k, v]) => [k, v]),
        ["predicted_waste", result.predicted_waste],
        ["farm_area", result.farm_area],
        ["confidence", result.confidence],
      ];
      const csv = rows
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `waste_report_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const saveScenario = () => {
    if (!result) return;
    const scenario = {
      id: Date.now(),
      name: `${formData.crop_type || "Scenario"}_${new Date().toLocaleString()}`,
      inputs: formData,
      result,
    };
    const updated = [scenario, ...savedScenarios].slice(0, 10);
    setSavedScenarios(updated);
    localStorage.setItem("ai_lab_scenarios", JSON.stringify(updated));
  };

  const loadScenario = (scenario) => {
    if (!scenario) return;
    setFormData(scenario.inputs);
    setResult(scenario.result);
    const fw = scenario.result?.predicted_waste ?? 0;
    setForecastData(createForecast(fw));
  };

  // Bar chart data (built directly from formData)
  const envBarData = {
    labels: ["Temperature (°C)", "Rainfall (mm)", "Humidity (%)", "Area (acres)"],
    datasets: [
      {
        label: "Environmental Factors",
        data: [
          parseFloat(formData.temperature || 0),
          parseFloat(formData.rainfall || 0),
          parseFloat(formData.humidity || 0),
          parseFloat(formData.crop_area || 0),
        ],
        backgroundColor: [
          colorFor(parseFloat(formData.temperature || 0), "temp"),
          colorFor(parseFloat(formData.rainfall || 0), "rain"),
          colorFor(parseFloat(formData.humidity || 0), "hum"),
          "#86efac",
        ],
        borderRadius: 10,
      },
    ],
  };

  const envBarOptions = {
    responsive: true,
    indexAxis: "y",
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true },
      y: { ticks: { font: { size: 12 } } },
    },
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-green-100 mb-3">
            <BrainCircuit className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            AI Agricultural Waste Predictor
          </h1>
          <p className="text-base md:text-lg text-green-700/80 max-w-2xl mx-auto">
            Get accurate predictions and easy-to-understand environmental insights
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Form Card */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 lg:sticky lg:top-24 h-fit"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <Ruler className="w-4 h-4 mr-2 text-green-600" />
                    Land Area (in acres)
                  </label>
                  <input
                    type="number"
                    value={formData.crop_area}
                    onChange={(e) => setFormData({ ...formData, crop_area: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="Enter land area"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <Wheat className="w-4 h-4 mr-2 text-green-600" />
                    Crop Type
                  </label>
                  <select
                    value={formData.crop_type}
                    onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    required
                  >
                    <option value="">Select crop type</option>
                    {cropTypes.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <Droplet className="w-4 h-4 mr-2 text-green-600" />
                    Soil Type
                  </label>
                  <select
                    value={formData.soil_type}
                    onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    required
                  >
                    <option value="">Select soil type</option>
                    {soilConditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                    Harvest Season
                  </label>
                  <select
                    value={formData.harvest_season}
                    onChange={(e) => setFormData({ ...formData, harvest_season: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    required
                  >
                    {harvestSeasons.map((season) => (
                      <option key={season} value={season.toLowerCase()}>
                        {season}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                    Average Temperature (°C)
                  </label>
                  <input
                    type="number"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="Enter temperature"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <Droplet className="w-4 h-4 mr-2 text-green-600" />
                    Average Rainfall (mm)
                  </label>
                  <input
                    type="number"
                    value={formData.rainfall}
                    onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="Enter rainfall"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-gray-700 font-medium mb-2">
                    <Droplet className="w-4 h-4 mr-2 text-green-600" />
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    value={formData.humidity}
                    onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="Enter humidity"
                    required
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      <span>Predict Waste</span>
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={() => {
                    downloadReport("json");
                  }}
                  className="px-4 py-4 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center gap-2"
                >
                  <DownloadCloud className="w-5 h-5 text-slate-600" />{" "}
                  <span className="text-sm">Download</span>
                </button>

                <button
                  type="button"
                  onClick={saveScenario}
                  className="px-4 py-4 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center gap-2"
                >
                  <Save className="w-5 h-5 text-slate-600" />{" "}
                  <span className="text-sm">Save</span>
                </button>
              </div>
            </form>

            {/* Saved Scenarios */}
            {savedScenarios.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Saved Scenarios</h4>
                <div className="flex flex-col gap-2">
                  {savedScenarios.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => loadScenario(s)}
                      className="text-left px-3 py-2 bg-gray-50 rounded-md border"
                    >
                      <div className="text-xs text-gray-600">{s.name}</div>
                      <div className="text-sm font-medium text-gray-800">
                        {s.inputs.crop_type} — {s.result?.predicted_waste ?? "—"} tons
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Results Card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            {result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-600 mb-1">Farm Area</p>
                    <p className="text-2xl font-bold text-green-700">
                      {result.farm_area} acres
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl">
                    <p className="text-sm text-amber-600 mb-1">Predicted Waste</p>
                    <p className="text-2xl font-bold text-amber-700">
                      {result.predicted_waste} tons
                    </p>
                  </div>
                </div>

                {/* Waste per acre & confidence */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-xl border">
                    <p className="text-xs text-gray-500">Waste per acre</p>
                    <p className="text-lg font-semibold">
                      {(result.predicted_waste / Math.max(1, result.farm_area)).toFixed(2)}{" "}
                      tons/acre
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border">
                    <p className="text-xs text-gray-500">Model confidence</p>
                    <p className="text-lg font-semibold">
                      {result.confidence ?? computeConfidenceHeuristic(null)}%
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border">
                    <p className="text-xs text-gray-500">Last updated</p>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Environmental Factors (Bar instead of Radar) */}
                <div className="p-4 bg-white rounded-xl border">
                  <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-green-600" />
                    Environmental Factors Analysis
                  </h3>
                  <div className="h-64">
                    <Bar data={envBarData} options={envBarOptions} />
                  </div>

                  {/* Easy Summary */}
                  <div className="mt-3 grid md:grid-cols-4 grid-cols-2 gap-2">
                    <div className="text-xs bg-green-50 border rounded-lg p-2">
                      <div className="font-semibold">🌡️ Temperature</div>
                      <div>
                        {formData.temperature || 0}°C —{" "}
                        {statusText(parseFloat(formData.temperature || 0), "temp")}
                      </div>
                    </div>
                    <div className="text-xs bg-blue-50 border rounded-lg p-2">
                      <div className="font-semibold">🌧️ Rainfall</div>
                      <div>
                        {formData.rainfall || 0}mm —{" "}
                        {statusText(parseFloat(formData.rainfall || 0), "rain")}
                      </div>
                    </div>
                    <div className="text-xs bg-emerald-50 border rounded-lg p-2">
                      <div className="font-semibold">💧 Humidity</div>
                      <div>
                        {formData.humidity || 0}% —{" "}
                        {statusText(parseFloat(formData.humidity || 0), "hum")}
                      </div>
                    </div>
                    <div className="text-xs bg-lime-50 border rounded-lg p-2">
                      <div className="font-semibold">🌾 Area</div>
                      <div>{formData.crop_area || 0} acres</div>
                    </div>
                  </div>
                </div>

                {/* 5-Year Forecast */}
                {forecastData && (
                  <div className="p-4 bg-white rounded-xl border">
                    <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      5-Year Waste Forecast
                    </h3>
                    <div className="h-56">
                      <Line options={lineOptions} data={forecastData} />
                    </div>

                    {/* Summary of change */}
                    <div className="mt-3 text-sm bg-green-50 p-3 rounded-xl">
                      {(() => {
                        const d = forecastData.datasets[0].data;
                        const start = d[0];
                        const end = d[d.length - 1];
                        const diff = +(end - start).toFixed(2);
                        const pct = +(((end - start) / (start || 1)) * 100).toFixed(2);
                        if (diff > 0)
                          return (
                            <p>
                              📊 Waste expected to <b className="text-red-600">increase</b> by{" "}
                              <b>{pct}%</b> over 5 years (rate ≈{" "}
                              {(forecastData.meta.rate * 100).toFixed(1)}%/yr).
                            </p>
                          );
                        if (diff < 0)
                          return (
                            <p>
                              📊 Waste expected to <b className="text-green-600">decrease</b>{" "}
                              by <b>{Math.abs(pct)}%</b> over 5 years (rate ≈{" "}
                              {(forecastData.meta.rate * 100).toFixed(1)}%/yr).
                            </p>
                          );
                        return <p>📊 Waste generation is predicted to remain stable.</p>;
                      })()}
                    </div>
                  </div>
                )}

                {/* Breakdown & recommendations */}
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Recycle className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">Waste Management Insights</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-white rounded-md text-center">
                      <p className="text-xs text-gray-500">Compostable</p>
                      <p className="text-lg font-bold">{result.breakdown.compostable} tons</p>
                      <p className="text-xs text-gray-600">{result.breakdown.compostablePct}%</p>
                    </div>
                    <div className="p-3 bg-white rounded-md text-center">
                      <p className="text-xs text-gray-500">Recyclable</p>
                      <p className="text-lg font-bold">{result.breakdown.recyclable} tons</p>
                      <p className="text-xs text-gray-600">{result.breakdown.recyclablePct}%</p>
                    </div>
                    <div className="p-3 bg-white rounded-md text-center">
                      <p className="text-xs text-gray-500">Hazardous / Other</p>
                      <p className="text-lg font-bold">{result.breakdown.hazardous} tons</p>
                      <p className="text-xs text-gray-600">{result.breakdown.hazardousPct}%</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    Based on your farm's characteristics, our AI model predicts that your{" "}
                    {(formData.crop_type || "").toLowerCase()} cultivation will generate approximately{" "}
                    {result.predicted_waste} tons of agricultural waste.
                  </p>

                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {result.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button onClick={() => downloadReport("json")} className="px-4 py-2 bg-white rounded-lg border">
                      Download JSON
                    </button>
                    <button onClick={() => downloadReport("csv")} className="px-4 py-2 bg-white rounded-lg border">
                      Download CSV
                    </button>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 rounded-xl text-red-600 text-sm">{error}</div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8">
                <Sprout className="w-12 h-12 text-green-500/50 mb-3" />
                <p className="text-sm">Fill out the form to get waste predictions</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AILab;
