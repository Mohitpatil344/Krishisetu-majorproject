import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Book,
  PlayCircle,
  Volume2,
  CheckCircle,
  CloudSun,
  MessageCircle,
  X,
  ArrowRight,
  Lightbulb,
  Camera,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const PLANT_ID_KEY = process.env.a5c6de37e6890471e495eb0e5ddada39	|| ""; // optional

const FarmerResources = () => {
  const [lang, setLang] = useState("hi");
  const [showVideo, setShowVideo] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [chat, setChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [weather, setWeather] = useState(null);
  const [crop, setCrop] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [videoFilter, setVideoFilter] = useState("सभी");

  // 🌤 Mock weather (soft green header)
  useEffect(() => {
    setWeather({
      condition: "☀️ Sunny",
      tip: {
        en: "Today's weather is clear — irrigate in the morning or evening 🌞",
        hi: "आज मौसम साफ़ है — सुबह या शाम को सिंचाई करें 🌞",
        mr: "आज हवामान स्वच्छ आहे — सकाळी किंवा संध्याकाळी पाणी द्या 🌞",
        pa: "ਅੱਜ ਮੌਸਮ ਸਾਫ਼ ਹੈ — ਸਵੇਰੇ ਜਾਂ ਸ਼ਾਮ ਨੂੰ ਸਿੰਚਾਈ ਕਰੋ 🌞",
        ta: "இன்று வானிலை தெளிவாக உள்ளது — காலை அல்லது மாலை நீர் பாய்ச்சி செய்யவும் 🌞",
      },
    });
  }, []);

  // Weather-based crop advice
  const weatherAdvice = {
    en: {
      Sunny: "Irrigate crops in the morning or evening. Avoid watering leaves.",
      Rainy: "Do not irrigate extra during rain. Avoid waterlogging.",
      Cloudy: "Irrigate lightly, check soil moisture.",
    },
    hi: {
      "Sunny": "धूप में फसल की सिंचाई सुबह या शाम करें। पत्तियों पर पानी न डालें।",
      "Rainy": "बारिश में अतिरिक्त सिंचाई न करें। जलभराव से बचें।",
      "Cloudy": "आंशिक सिंचाई करें, नमी जांचें।",
    },
    mr: {
      "Sunny": "सूर्यप्रकाशात सकाळी किंवा संध्याकाळी सिंचन करा.",
      "Rainy": "पावसात अतिरिक्त पाणी देऊ नका.",
      "Cloudy": "आंशिक सिंचन करा, ओलावा तपासा.",
    },
    pa: {
      "Sunny": "ਧੁੱਪ ਵਿੱਚ ਸਵੇਰੇ ਜਾਂ ਸ਼ਾਮ ਨੂੰ ਸਿੰਚਾਈ ਕਰੋ.",
      "Rainy": "ਮੀਂਹ ਵਿੱਚ ਵਧੀਕ ਪਾਣੀ ਨਾ ਦਿਓ.",
      "Cloudy": "ਹਲਕੀ ਸਿੰਚਾਈ ਕਰੋ, ਨਮੀ ਜਾਂਚੋ.",
    },
    ta: {
      "Sunny": "வெயிலில் காலை/மாலை நீர் பாய்ச்சி செய்யவும்.",
      "Rainy": "மழையில் கூடுதல் நீர் பாய்ச்சி வேண்டாம்.",
      "Cloudy": "சிறிது நீர் பாய்ச்சி செய்யவும், ஈரப்பதம் பார்க்கவும்.",
    },
  };

  // 💡 Daily tips (per language)
  const tips = {
    en: [
      "Remove weeds from the field 🌿",
      "Spray neem extract 🍃",
      "Check soil moisture before irrigation 💧",
      "Plant trees on field boundaries 🌳",
      "Prepare organic fertilizer today 🌱",
    ],
    hi: [
      "आज खेत में खरपतवार निकालें 🌿",
      "नीम अर्क स्प्रे करें 🍃",
      "सिंचाई से पहले मिट्टी की नमी जांचें 💧",
      "खेत की मेढ़ पर पेड़ लगाएँ 🌳",
      "आज जैविक खाद तैयार करें 🌱",
    ],
    mr: [
      "आज शेतातील तणे काढा 🌿",
      "निंबोळी अर्क फवारणी करा 🍃",
      "पाणी देण्याआधी मातीची ओलावा तपासा 💧",
      "मेढांवर झाडे लावा 🌳",
      "आज सेंद्रिय खत तयार करा 🌱",
    ],
    pa: [
      "ਅੱਜ ਖੇਤ ਵਿੱਚ ਘਾਹ ਕੱਢੋ 🌿",
      "ਨੀਮ ਦਾ ਸਪਰੇ ਕਰੋ 🍃",
      "ਪਾਣੀ ਤੋਂ ਪਹਿਲਾਂ ਮਿੱਟੀ ਦੀ ਨਮੀ ਜਾਂਚੋ 💧",
      "ਡਿੱਗ ਤੇ ਰੁੱਖ ਲਗਾਓ 🌳",
      "ਅੱਜ ਜੈਵਿਕ ਖਾਦ ਬਣਾਓ 🌱",
    ],
    ta: [
      "இன்று நிலத்தில் புதர்கள் அகற்றவும் 🌿",
      "வேப்பம் ஸ்ப்ரே செய்யவும் 🍃",
      "நீர்ப்பாசனத்திற்கு முன் மண்ணின் ஈரப்பதம் பார்க்கவும் 💧",
      "வேலிக்கருகே மரங்கள் நடவும் 🌳",
      "இன்று இயற்கை உரம் தயாரிக்கவும் 🌱",
    ],
  };
  const tipsLine = tips[lang].join("   •   ");

  // 🔊 Speak helper
  const speak = (text) => {
    const map = { en: "en-US", hi: "hi-IN", mr: "mr-IN", pa: "pa-IN", ta: "ta-IN" };
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = map[lang] || "en-US";
    speechSynthesis.speak(utter);
  };

  // ✅ Mark as done
  const toggleComplete = (title) =>
    setCompleted((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );

  // 🤖 Chatbot (simple multilingual)
  const botReply = (msg) => {
    const m = msg.toLowerCase();
    const replies = {
      hi: "कृषि जानकारी जल्द उपलब्ध होगी 🌾",
      mr: "शेती माहिती लवकरच उपलब्ध होईल 🌾",
      pa: "ਖੇਤੀਬਾੜੀ ਜਾਣਕਾਰੀ ਜਲਦੀ ਉਪਲਬਧ ਹੋਵੇਗੀ 🌾",
      ta: "விவசாய தகவல் விரைவில் வழங்கப்படும் 🌾",
    };
    if (m.includes("खाद") || m.includes("compost"))
      return lang === "hi"
        ? "सूखा और गीला कचरा बराबर मिलाएँ 🌿"
        : replies[lang];
    if (m.includes("water") || m.includes("सिंचाई"))
      return lang === "hi"
        ? "सुबह या शाम को हल्की सिंचाई करें 💧"
        : replies[lang];
    if (m.includes("कीट") || m.includes("pest"))
      return lang === "hi" ? "नीम अर्क का छिड़काव करें 🪴" : replies[lang];
    return replies[lang];
  };

  const sendMessage = async (msg) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { user: true, text: msg }]);

    try {
      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`

        },
        body: JSON.stringify({
          model: "gpt-5-nano",
          input: msg,
          store: true
        })
      });
      const data = await res.json();
      console.log(data); // Debugging के लिए response देखें
      const reply = data.result || "माफ़ कीजिए, जवाब नहीं मिला।";
      setMessages((prev) => [...prev, { user: false, text: reply }]);
    } catch (e) {
      setMessages((prev) => [...prev, { user: false, text: "AI से जवाब नहीं मिल पाया।" }]);
    }
  };

  // 🧠 Text-based checker (keeps your behavior; shows a quick tip)
  const simpleTextAdvice = () => {
    if (!crop || !problem) {
      return {
        text: {
          en: "Please enter crop and problem 🌱",
          hi: "कृपया फसल और समस्या दर्ज करें 🌱",
          mr: "कृपया पिक आणि समस्या लिहा 🌱",
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਫਸਲ ਅਤੇ ਸਮੱਸਿਆ ਦਾਖਲ ਕਰੋ 🌱",
          ta: "பயிர் மற்றும் பிரச்சினையை உள்ளிடவும் 🌱",
        }[lang],
        severity: "Low",
        next: "",
      };
    }
    // lightweight varied suggestions
    const variants = [
      {
        text: {
          en: "Spray neem extract and maintain water balance 💧",
          hi: "नीम अर्क स्प्रे करें और पानी का संतुलन रखें 💧",
          mr: "निंबोळी अर्क फवारणी करा आणि पाण्याचे संतुलन ठेवा 💧",
          pa: "ਨੀਮ ਸਪਰੇ ਕਰੋ ਅਤੇ ਪਾਣੀ ਦਾ ਸੰਤੁਲਨ ਰੱਖੋ 💧",
          ta: "வேப்பம் ஸ்ப்ரே செய்து நீர்ப்பாசனத்தை சமநிலைப்படுத்தவும் 💧",
        }[lang],
        severity: "Medium",
        next: { hi: "5–7 दिन बाद जांचें", mr: "५–७ दिवसांनी तपासा", pa: "5–7 ਦਿਨਾਂ ਬਾਅਦ ਚੈਕ ਕਰੋ", ta: "5–7 நாட்களில் மீண்டும் பார்க்கவும்" }[lang],
      },
      {
        text: {
          en: "Possibly nutrient deficiency — apply light urea/DAP 🌿",
          hi: "संभवतः पोषक कमी — हल्का यूरिया/डीएपी दें 🌿",
          mr: "कदाचित पोषक कमी — हलकी युरिया/डीएपी द्या 🌿",
          pa: "ਸ਼ਾਇਦ ਪੋਸ਼ਕ ਘਾਟ — ਹਲਕਾ ਯੂਰੀਆ/ਡੀਏਪੀ ਦਿਓ 🌿",
          ta: "ஊட்டச்சத்து குறைவு இருக்கலாம் — யூரியா/டிஏபி லேசாக கொடுங்கள் 🌿",
        }[lang],
        severity: "Medium",
        next: { hi: "मिट्टी की नमी जाँचे", mr: "माती ओलावा तपासा", pa: "ਮਿੱਟੀ ਦੀ ਨਮੀ ਜਾਂਚੋ", ta: "மண் ஈரப்பதம் பார்க்கவும்" }[lang],
      },
      {
        text: {
          en: "Crops look normal — continue with organic fertilizer 🌱",
          hi: "फसल सामान्य दिख रही है — जैविक खाद जारी रखें 🌱",
          mr: "पिक सामान्य दिसते — सेंद्रिय खत सुरू ठेवा 🌱",
          pa: "ਫਸਲ ਠੀਕ ਲੱਗਦੀ — ਜੈਵਿਕ ਖਾਦ ਜਾਰੀ ਰੱਖੋ 🌱",
          ta: "பயிர் சாதாரணமாக உள்ளது — இயற்கை உரம் தொடருங்கள் 🌱",
        }[lang],
        severity: "Low",
        next: { hi: "साप्ताहिक निरीक्षण करें", mr: "साप्ताहिक तपासणी", pa: "ਹਫ਼ਤਾਵਾਰੀ ਜਾਂਚ", ta: "வாராந்திர ஆய்வு" }[lang],
      },
    ];
    return variants[Math.floor(Math.random() * variants.length)];
  };

  // 📸 Image → AI (Plant.id) OR smart offline fall back
  const analyzeImage = async (file) => {
    // preview
    const url = URL.createObjectURL(file);
    setImgPreview(url);

    // loading
    setSolution({
      text: {
        hi: "📸 चित्र का विश्लेषण हो रहा है...",
        mr: "📸 प्रतिमा विश्लेषण सुरू आहे...",
        pa: "📸 ਚਿੱਤਰ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
        ta: "📸 படம் பகுப்பாய்வு செய்யப்படுகிறது...",
      }[lang],
      severity: "",
      next: "",
    });

    // Convert to base64
    const toBase64 = (f) =>
      new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result.split(",")[1]);
        r.onerror = reject;
        r.readAsDataURL(f);
      });

    try {
      const base64 = await toBase64(file);

      if (PLANT_ID_KEY) {
        // Real API
        const res = await fetch("https://api.plant.id/v2/health_assessment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Api-Key": PLANT_ID_KEY,
          },
          body: JSON.stringify({
            images: [base64],
            modifiers: ["crops_fast"],
            disease_details: ["common_names", "description", "treatment"],
          }),
        });

        const data = await res.json();
        const diseases = data?.health_assessment?.diseases || [];

        if (diseases.length) {
          const d = diseases[0];
          const name =
            (d.common_names && d.common_names[0]) ||
            d.name ||
            { hi: "रोग", mr: "रोग", pa: "ਰੋਗ", ta: "நோய்" }[lang];
          const treat =
            d?.treatment?.biological ||
            d?.treatment?.chemical ||
            {
              hi: "नीम अर्क/जैविक स्प्रे अपनाएँ",
              mr: "निंबोळी/जैविक फवारणी",
              pa: "ਨੀਮ/ਜੈਵਿਕ ਸਪਰੇ ਵਰਤੋ",
              ta: "வேப்பம்/இயற்கை தெளிப்பு செய்யவும்",
            }[lang];

          setSolution({
            text: `${name} — ${treat}`,
            severity: d.severity?.toString().includes("high") ? "High" : "Medium",
            next: {
              hi: "3–5 दिन निगरानी रखें",
              mr: "३–५ दिवस लक्ष ठेवा",
              pa: "3–5 ਦਿਨ ਨਿਗਰਾਨੀ ਕਰੋ",
              ta: "3–5 நாட்கள் கவனிக்கவும்",
            }[lang],
          });
          return;
        }
        // no disease
        setSolution({
          text: {
            hi: "कोई बड़ी समस्या नहीं दिखी 🌿 — सामान्य रख-रखाव जारी रखें",
            mr: "मोठी समस्या दिसली नाही 🌿 — नियमित देखभाल चालू ठेवा",
            pa: "ਕੋਈ ਵੱਡੀ ਸਮੱਸਿਆ ਨਹੀਂ 🌿 — ਆਮ ਸੰਭਾਲ ਜਾਰੀ ਰੱਖੋ",
            ta: "பிரச்சினை தெரியவில்லை 🌿 — வழக்கமான பராமரிப்பு தொடரவும்",
          }[lang],
          severity: "Low",
          next: "",
        });
      } else {
        // Offline smart mock
        const detect = ["yellow leaves", "pest attack", "fungus", "dry soil"];
        const pick = detect[Math.floor(Math.random() * detect.length)];
        const map = {
          "yellow leaves": {
            text: {
              hi: "पत्ते पीले — नाइट्रोजन कमी, हल्का यूरिया स्प्रे करें 🌿",
              mr: "पाने पिवळी — नायट्रोजन कमी, हलकी युरिया फवारणी 🌿",
              pa: "ਪੱਤੇ ਪੀਲੇ — ਨਾਈਟਰੋਜਨ ਘਾਟ, ਯੂਰੀਆ ਸਪਰੇ ਕਰੋ 🌿",
              ta: "இலை மஞ்சள் — நைட்ரஜன் குறைவு, யூரியா தெளிக்கவும் 🌿",
            }[lang],
            severity: "Medium",
          },
          "pest attack": {
            text: {
              hi: "कीट हमला — नीम अर्क/ट्रैप लगाएँ 🪴",
              mr: "कीटक हल्ला — निंबोळी अर्क/ट्रॅप लावा 🪴",
              pa: "ਕੀਟ ਹਮਲਾ — ਨੀਮ ਸਪਰੇ/ਟ੍ਰੈਪ ਲਗਾਓ 🪴",
              ta: "பூச்சி தாக்கு — வேப்பம் தெளி/பரோமோன் வலை 🪴",
            }[lang],
            severity: "High",
          },
          fungus: {
            text: {
              hi: "फफूंदी — सल्फर/बायो-फंगीसाइड का स्प्रे करें 🌾",
              mr: "बुरशी — सल्फर/बायो फंगीसाइड फवारणी 🌾",
              pa: "ਫਫੂਂਦ — ਗੰਧਕ/ਬਾਇਓ ਫੰਗੀਸਾਈਡ ਸਪਰੇ ਕਰੋ 🌾",
              ta: "பூஞ்சை — சல்பர்/உயிரி பூஞ்சைநாசினி தெளிக்கவும் 🌾",
            }[lang],
            severity: "Medium",
          },
          "dry soil": {
            text: {
              hi: "मिट्टी सूखी — ड्रिप/मल्चिंग से नमी बनाए रखें 💧",
              mr: "माती कोरडी — ड्रिप/मल्चिंग करा 💧",
              pa: "ਸੁੱਕੀ ਮਿੱਟੀ — ਡ੍ਰਿਪ/ਮਲਚਿੰਗ ਨਾਲ ਨਮੀ ਰੱਖੋ 💧",
              ta: "உலர் மண் — டிரிப்/மல்சிங் மூலம் ஈரத்தன்மை காக்கவும் 💧",
            }[lang],
            severity: "Low",
          },
        };
        setSolution({ ...map[pick], next: { hi: "3 दिन बाद जाँचें", mr: "३ दिवसांनी तपासा", pa: "3 ਦਿਨਾਂ ਬਾਅਦ ਚੈਕ ਕਰੋ", ta: "3 நாட்களில் சரிபார்க்கவும்" }[lang] });
      }
    } catch (e) {
      console.error(e);
      setSolution({
        text: {
          hi: "AI विश्लेषण विफल — बाद में पुनः प्रयास करें ⚠️",
          mr: "AI विश्लेषण अयशस्वी — नंतर पुन्हा प्रयत्न करा ⚠️",
          pa: "AI ਵਿਸ਼ਲੇਸ਼ਣ ਫੇਲ — ਬਾਅਦ ਵਿੱਚ ਕੋਸ਼ਿਸ਼ ਕਰੋ ⚠️",
          ta: "AI பகுப்பாய்வு தோல்வி — பின்னர் முயற்சிக்கவும் ⚠️",
        }[lang],
        severity: "",
        next: "",
      });
    }
  };

  // 🧠 Crop checker (button)
  const checkCropHealth = () => {
    setSolution(simpleTextAdvice());
  };

  // 🌾 Success stories
  const stories = {
    en: "Drip irrigation saved water and increased yield 🌾",
    hi: "ड्रिप सिंचाई से पानी की बचत और पैदावार दोनों बढ़ीं 🌾",
    mr: "ड्रिप सिंचनाने पाणी बचत आणि उत्पादन वाढले 🌾",
    pa: "ਡ੍ਰਿਪ ਸਿੰਚਾਈ ਨਾਲ ਪਾਣੀ ਬਚਿਆ ਤੇ ਪੈਦਾਵਾਰ ਵਧੀ 🌾",
    ta: "ட்ரிப் நீர்ப்பாசனத்தால் நீர் சேமிப்பு மற்றும் விளைச்சல் உயர்ந்தது 🌾",
  };

  // Add English resources (fill in actual content as needed)
  const resources = {
    en: [
      {
        title: "Learn Composting",
        desc: "How to turn farm waste into compost, watch the video.",
        video: "https://www.youtube.com/embed/7hBnlajtfxc",
        steps: ["Collect wet and dry waste", "Add soil to each layer", "Turn every 10 days"],
      },
      {
        title: "Right Materials for Compost",
        desc: "What can be added to compost?",
        video: "https://www.youtube.com/embed/HjdjpU1ajw0",
        steps: ["Leaves, vegetable peels, manure", "Do not add plastic", "Mix every week"],
      },
      {
        title: "Composting Process",
        desc: "Learn how to make compost in easy steps.",
        video: "https://www.youtube.com/embed/gksTs72L7sc",
        steps: ["Gather all materials", "Dig a pit", "Turn once a week"],
      },
      {
        title: "Benefits of Composting",
        desc: "What are the advantages of composting?",
        video: "https://www.youtube.com/embed/7pP0wxShfEk",
        steps: ["Improves plant growth", "Enhances soil quality", "Saves water"],
      },
      {
        title: "Tips for Making Compost",
        desc: "What to keep in mind while making compost?",
        video: "https://www.youtube.com/embed/PYGOuG5Xcg",
        steps: ["Use balanced materials", "Do not add too much water", "Stir once a week"],
      },

      // सिंचाई (Irrigation) - 5 items
      {
        title: "Improving Irrigation",
        desc: "More irrigation with less water — learn drip and timing techniques.",
        video: "https://www.youtube.com/embed/CuWQ22I0tJA",
        steps: ["Lay drip lines", "Connect main pipe", "Irrigate morning and evening"],
      },
      {
        title: "Irrigation for Crops",
        desc: "When and how much water to give to which crop?",
        video: "https://www.youtube.com/embed/pLQebU7RA5I",
        steps: ["Check soil moisture", "Schedule time according to crop", "Avoid overwatering"],
      },
      {
        title: "Benefits of Proper Irrigation",
        desc: "What are the advantages of proper irrigation?",
        video: "https://www.youtube.com/embed/qcaf7OZRo8w",
        steps: ["Improves crop growth", "Saves water", "Maintains soil quality"],
      },
      {
        title: "Setting Up Drip Irrigation",
        desc: "How to install drip irrigation in your field?",
        video: "https://www.youtube.com/embed/71An1n4yUQg",
        steps: ["Lay drip tubes", "Install filter and pump", "Set timer"],
      },
      {
        title: "Common Mistakes in Irrigation",
        desc: "What mistakes to avoid while irrigating?",
        video: "https://www.youtube.com/embed/VaTkzYv8sMo",
        steps: ["Do not overwater", "Irrigate at the right time", "Avoid water wastage"],
      },

      // कीटनाशक (Pesticide) - 5 items
      {
        title: "Make Natural Pesticides",
        desc: "Use neem extract and herbal remedies instead of chemical drugs.",
        video: "https://www.youtube.com/embed/Vof1GmL2DAQ",
        steps: ["Prepare neem extract", "Prepare spray", "Test before spraying"],
      },
      {
        title: "Pest Control Measures",
        desc: "What to do when pests attack the crop?",
        video: "https://www.youtube.com/embed/hZNszVlamm8",
        steps: ["Spray neem oil", "Set pheromone traps", "Inspect once a week"],
      },
      {
        title: "Proper Use of Pesticides",
        desc: "How to use pesticides effectively and safely?",
        video: "https://www.youtube.com/embed/rpVawxKx9IQ",
        steps: ["Determine dose as per instructions", "Spray in morning or evening", "Keep away from children and pets"],
      },
      {
        title: "Protecting Crop from Pests",
        desc: "What to do to protect the crop from pests?",
        video: "https://www.youtube.com/embed/rpVawxKx9IQ",
        steps: ["Plant neem trees", "Set pheromone traps", "Inspect once a week"],
      },
      {
        title: "Biological Pest Control Methods",
        desc: "Use biological methods instead of chemical options to control pests.",
        video: "https://www.youtube.com/embed/UFP3pZ679W0",
        steps: ["Neem oil", "Garlic spray", "Onion juice"],
      },
    ],

     hi: [
      // खाद (Compost) - 5 items
      { 
        title: "कंपोस्ट बनाना सीखें",
        desc: "खेत का जैविक कचरा खाद में कैसे बदलें, जानिए वीडियो में।",
        video: "https://www.youtube.com/embed/7hBnlajtfxc",
        steps: ["गीला और सूखा कचरा इकट्ठा करें", "हर परत पर मिट्टी डालें", "हर 10 दिन में पलटें"],
      },
      {
        title: "कंपोस्ट के लिए सही सामग्री",
        desc: "कंपोस्ट में क्या-क्या डाल सकते हैं?",
        video: "https://www.youtube.com/embed/HjdjpU1ajw0",
        steps: ["पत्ते, सब्जी छिलके, गोबर", "प्लास्टिक न डालें", "हर सप्ताह मिलाएँ"],
      },
      {
        title: "कंपोस्ट बनाने की प्रक्रिया",
        desc: "कंपोस्ट कैसे बनाते हैं, जानिए आसान चरणों में।",
        video: "https://www.youtube.com/embed/gksTs72L7sc",
        steps: ["सभी सामग्री इकट्ठा करें", "एक जगह गड्ढा खोदें", "सप्ताह में एक बार पलटें"],
      },
      {
        title: "कंपोस्ट के लाभ",
        desc: "कंपोस्ट करने के क्या-क्या फायदे हैं?",
        video: "https://www.youtube.com/embed/7pP0wxShfEk",
        steps: ["पौधों की वृद्धि में सुधार", "मिट्टी की गुणवत्ता बढ़ाएँ", "पानी की बचत करें"],
      },
      {
        title: "खाद बनाते समय क्या ध्यान रखें",
        desc: "कंपोस्ट बनाते समय किन बातों का ध्यान रखें?",
        video: "https://www.youtube.com/embed/PYGOuG5Xcg",
        steps: ["संतुलित सामग्री का उपयोग करें", "अधिक पानी न डालें", "सप्ताह में एक बार हिलाएँ"],
      },

      // सिंचाई (Irrigation) - 5 items
      {
        title: "सिंचाई सुधार",
        desc: "कम पानी में ज्यादा सिंचाई — ड्रिप और टाइमिंग तकनीक सीखें।",
        video: "https://www.youtube.com/embed/CuWQ22I0tJA",
        steps: ["ड्रिप लाइन बिछाएँ", "मुख्य पाइप जोड़ें", "सुबह-शाम सिंचाई करें"],
      },
      {
        title: "फसल के लिए सही सिंचाई",
        desc: "किस फसल को कब और कितना पानी दें?",
        video: "https://www.youtube.com/embed/pLQebU7RA5I",
        steps: ["मिट्टी की नमी जांचें", "फसल के अनुसार समय तय करें", "अत्यधिक पानी से बचें"],
      },
      {
        title: "सिंचाई के लाभ",
        desc: "सही सिंचाई करने के क्या-क्या फायदे हैं?",
        video: "https://www.youtube.com/embed/qcaf7OZRo8w",
        steps: ["फसल की वृद्धि में सुधार", "पानी की बचत", "मिट्टी की गुणवत्ता बनाए रखें"],
      },
      {
        title: "ड्रिप सिंचाई प्रणाली कैसे स्थापित करें",
        desc: "अपने खेत में ड्रिप सिंचाई कैसे लगाएँ?",
        video: "https://www.youtube.com/embed/71An1n4yUQg",
        steps: ["ड्रिप ट्यूब बिछाएँ", "फिल्टर और पंप लगाएँ", "टाइमर सेट करें"],
      },
      {
        title: "सिंचाई के सामान्य गलतियाँ",
        desc: "सिंचाई करते समय क्या गलतियाँ न करें?",
        video: "https://www.youtube.com/embed/VaTkzYv8sMo",
        steps: ["अधिक पानी न दें", "सही समय पर सिंचाई करें", "पानी की बर्बादी न करें"],
      },

      // कीटनाशक (Pesticide) - 5 items
      {
        title: "प्राकृतिक कीटनाशक बनाएं",
        desc: "रासायनिक दवाओं की जगह नीम अर्क और हर्बल उपाय अपनाएं।",
        video: "https://www.youtube.com/embed/Vof1GmL2DAQ",
        steps: ["नीम अर्क बनाएं", "स्प्रे तैयार करें", "छिड़काव से पहले परीक्षण करें"],
      },
      {
        title: "कीट नियंत्रण के उपाय",
        desc: "फसल में कीट लगने पर क्या करें?",
        video: "https://www.youtube.com/embed/hZNszVlamm8",
        steps: ["नीम तेल स्प्रे करें", "फेरोमोन ट्रैप लगाएँ", "सप्ताह में एक बार निरीक्षण"],
      },
      {
        title: "कीटनाशक का सही उपयोग",
        desc: "कीटनाशक का प्रभावी और सुरक्षित उपयोग कैसे करें?",
        video: "https://www.youtube.com/embed/rpVawxKx9IQ",
        steps: ["निर्देशों के अनुसार मात्रा तय करें", "सुबह या शाम को छिड़काव करें", "बच्चों और पालतू जानवरों से दूर रखें"],
      },
      {
        title: "कीटों से फसल की सुरक्षा",
        desc: "फसल को कीटों से बचाने के लिए क्या करें?",
        video: "https://www.youtube.com/embed/rpVawxKx9IQ",
        steps: ["नीम के पेड़ लगाएँ", "फेरोमोन ट्रैप लगाएँ", "सप्ताह में एक बार निरीक्षण करें"],
      },
      {
        title: "कीट नियंत्रण के लिए जैविक उपाय",
        desc: "कीटों को नियंत्रित करने के लिए रासायनिक विकल्पों के बजाय जैविक उपायों का उपयोग करें।",
        video: "https://www.youtube.com/embed/UFP3pZ679W0",
        steps: ["नीम का तेल", "लहसुन का स्प्रे", "प्याज का रस"],
      },  

    ],
    mr: [
      {
        title: "कंपोस्ट बनवायला शिका",
        desc: "शेतीतील कचरा खतामध्ये कसा बदलायचा ते शिका.",
        video: "https://www.youtube.com/embed/7hBnlajtfxc",
        steps: ["ओला-कोरडा कचरा जमा करा", "प्रत्येक थरावर माती टाका", "दर 10 दिवसांनी पलटा"],
      },
      {
        title: "कंपोस्टसाठी योग्य सामग्री",
        desc: "कंपोस्टमध्ये काय-काय टाकू शकतो?",
        video: "https://www.youtube.com/embed/3NCUE5E2kxs",
        steps: ["पानं, भाज्यांचे साल, गोबर", "प्लास्टिक टाळा", "प्रत्येक आठवड्यात मिसळा"],
      },
      {
        title: "कंपोस्ट बनवण्याची प्रक्रिया",
        desc: "कंपोस्ट कशी बनवायची, सोप्या टप्प्यात शिका.",
        video: "https://www.youtube.com/embed/ADshyXgB_mc",
        steps: ["सर्व साहित्य एकत्र करा", "एक जागा खोदून गड्ढा तयार करा", "आठवड्यातून एकदा पलटा"],
      },
      {
        title: "कंपोस्टचे फायदे",
        desc: "कंपोस्ट केल्याचे काय-काय फायदे आहेत?",
        video: "https://www.youtube.com/embed/r0mCZD1vOrU",
        steps: ["पिकांची वाढ सुधारणा", "मातीची गुणवत्ता वाढवा", "पाण्याची बचत करा"],
      },
      {
        title: "खाद बनवताना काय लक्षात ठेवावे",
        desc: "कंपोस्ट बनवताना कोणत्या गोष्टींचा विचार करावा?",
        video: "https://www.youtube.com/embed/xyz3",
        steps: ["संतुलित सामग्रीचा वापर करा", "अधिक पाणी टाळा", "आठवड्यातून एकदा ढवळा"],
      },
      {
        title: "सिंचन सुधार",
        desc: "कमी पाण्यात अधिक सिंचन — ड्रिप आणि वेळ तंत्र शिका.",
        video: "https://www.youtube.com/embed/Xej22GsLLQA",
        steps: ["ड्रिप लाईन अंथरा", "मुख्य पाईप जोडा", "सकाळ-संध्याकाळ पाणी द्या"],
      },
      {
        title: "पिकांसाठी योग्य सिंचन",
        desc: "किस पिकाला कधी आणि किती पाणी द्यावे?",
        video: "https://www.youtube.com/embed/abc2",
        steps: ["मातीची ओलावा तपासा", "पिकाच्या अनुसार वेळ ठरवा", "अत्यधिक पाण्यापासून वाचा"],
      },
      {
        title: "सिंचनाचे फायदे",
        desc: "योग्य सिंचनाचे काय-काय फायदे आहेत?",
        video: "https://www.youtube.com/embed/xyz9",
        steps: ["पिकांची वाढ सुधारणा", "पाण्याची बचत", "मातीची गुणवत्ता राखा"],
      },
      {
        title: "ड्रिप सिंचन प्रणाली कशी स्थापित करावी",
        desc: "तुमच्या शेतात ड्रिप सिंचन कसे लावावे?",
        video: "https://www.youtube.com/embed/xyz10",
        steps: ["ड्रिप ट्यूब अंथरा", "फिल्टर आणि पंप लावा", "टाइमर सेट करा"],
      },
      {
        title: "सिंचनाच्या सामान्य चुका",
        desc: "सिंचन करताना कोणत्या चुका करू नयेत?",
        video: "https://www.youtube.com/embed/xyz11",
        steps: ["अधिक पाणी देऊ नका", "योग्य वेळी सिंचन करा", "पाण्याची वाया नका"],
      },
      {
        title: "प्राकृतिक कीटनाशक बनाएं",
        desc: "रासायनिक दवाओं की जगह नीम अर्क और हर्बल उपाय अपनाएं।",
        video: "https://www.youtube.com/embed/Vof1GmL2DAQ",
        steps: ["नीम अर्क बनाएं", "स्प्रे तैयार करें", "छिड़काव से पहले परीक्षण करें"],
      },
      {
        title: "कीट नियंत्रण के उपाय",
        desc: "फसल में कीट लगने पर क्या करें?",
        video: "https://www.youtube.com/embed/abc3",
        steps: ["नीम तेल स्प्रे करें", "फेरोमोन ट्रैप लगाएँ", "सप्ताह में एक बार निरीक्षण"],
      },
      {
        title: "कीटनाशक का सही उपयोग",
        desc: "कीटनाशक का प्रभावी और सुरक्षित उपयोग कैसे करें?",
        video: "https://www.youtube.com/embed/xyz17",
        steps: ["निर्देशों के अनुसार मात्रा तय करें", "सुबह या शाम को छिड़काव करें", "बच्चों और पालतू जानवरों से दूर रखें"],
      },
      {
        title: "कीटों से फसल की सुरक्षा",
        desc: "फसल को कीटों से बचाने के लिए क्या करें?",
        video: "https://www.youtube.com/embed/xyz18",
        steps: ["नीम के पेड़ लगाएँ", "फेरोमोन ट्रैप लगाएँ", "सप्ताह में एक बार निरीक्षण करें"],
      },
      {
        title: "कीट नियंत्रण के लिए जैविक उपाय",
        desc: "कीटों को नियंत्रित करने के लिए रासायनिक विकल्पों के बजाय जैविक उपायों का उपयोग करें।",
        video: "https://www.youtube.com/embed/xyz19",
        steps: ["नीम का तेल", "लहसुन का स्प्रे", "प्याज का रस"],
      },
    ],
    pa: [
      {
        title: "ਖਾਦ ਬਣਾਉਣਾ ਸਿੱਖੋ",
        desc: "ਖੇਤ ਦੇ ਕੂੜੇ ਨੂੰ ਖਾਦ ਵਿੱਚ ਬਦਲਣ ਦਾ ਤਰੀਕਾ ਸਿੱਖੋ।",
        video: "https://www.youtube.com/embed/7hBnlajtfxc",
        steps: ["ਗੀਲਾ ਤੇ ਸੁੱਕਾ ਕੂੜਾ ਇਕੱਠਾ ਕਰੋ", "ਮਿੱਟੀ ਦੀ ਪਰਤ ਲਗਾਓ", "10 ਦਿਨਾਂ ਬਾਅਦ ਮੋੜੋ"],
      },
      {
        title: "ਖਾਦ ਲਈ ਸਹੀ ਸਮੱਗਰੀ",
        desc: "ਖਾਦ ਵਿੱਚ ਕੀ-ਕੀ ਪਾ ਸਕਦੇ ਹਾਂ?",
        video: "https://www.youtube.com/embed/abc1",
        steps: ["ਪੱਤੇ, ਸਬਜ਼ੀ ਦੇ ਛਿਲਕੇ, ਗੋਬਰ", "ਪਲਾਸਟਿਕ ਨਾ ਪਾਓ", "ਹਰ ਹਫ਼ਤੇ ਮਿਲਾਓ"],
      },
      {
        title: "ਖਾਦ ਬਣਾਉਣ ਦੀ ਪ੍ਰਕਿਰਿਆ",
        desc: "ਖਾਦ ਕਿਵੇਂ ਬਣਾਉਂਦੇ ਹਨ, ਆਸਾਨ ਕਦਮਾਂ ਵਿੱਚ ਸਿੱਖੋ।",
        video: "https://www.youtube.com/embed/xyz1",
        steps: ["ਸਾਰੀ ਸਮੱਗਰੀ ਇਕੱਠੀ ਕਰੋ", "ਇੱਕ ਜਗ੍ਹਾ ਖੁਦਾਈ ਕਰੋ", "ਹਫ਼ਤੇ ਵਿੱਚ ਇੱਕ ਵਾਰੀ ਮੋੜੋ"],
      },
      {
        title: "ਖਾਦ ਦੇ ਫਾਇਦੇ",
        desc: "ਖਾਦ ਕਰਨ ਦੇ ਕੀ-ਕੀ ਫਾਇਦੇ ਹਨ?",
        video: "https://www.youtube.com/embed/xyz2",
        steps: ["ਪੌਦਿਆਂ ਦੀ ਵਾਧਾ ਵਿੱਚ ਸੁਧਾਰ", "ਮਿੱਟੀ ਦੀ ਗੁਣਵੱਤਾ ਵਧਾਓ", "ਪਾਣੀ ਦੀ ਬਚਤ ਕਰੋ"],
      },
      {
        title: "ਖਾਦ ਬਣਾਉਂਦੇ ਸਮੇਂ ਕੀ ਧਿਆਨ ਰੱਖਣਾ ਚਾਹੀਦਾ ਹੈ",
        desc: "ਖਾਦ ਬਣਾਉਂਦੇ ਸਮੇਂ ਕਿਹੜੀਆਂ ਗੱਲਾਂ ਦਾ ਧਿਆਨ ਰੱਖਣਾ ਚਾਹੀਦਾ ਹੈ?",
        video: "https://www.youtube.com/embed/xyz3",
        steps: ["ਸੰਤੁਲਿਤ ਸਮੱਗਰੀ ਦੀ ਵਰਤੋਂ ਕਰੋ", "ਜ਼ਿਆਦਾ ਪਾਣੀ ਨਾ ਪਾਓ", "ਹਫ਼ਤੇ ਵਿੱਚ ਇੱਕ ਵਾਰੀ ਹਿਲਾਓ"],
      },
      {
        title: "ਸਿੰਚਾਈ ਸੁਧਾਰੋ",
        desc: "ਘੱਟ ਪਾਣੀ ਨਾਲ ਵੱਧ ਸਿੰਚਾਈ — ਡ੍ਰਿਪ ਤਕਨੀਕ ਸਿੱਖੋ।",
        video: "https://www.youtube.com/embed/Xej22GsLLQA",
        steps: ["ਡ੍ਰਿਪ ਲਾਈਨ ਵਿਛਾਓ", "ਮੁੱਖ ਪਾਈਪ ਜੋੜੋ", "ਸਵੇਰੇ-ਸ਼ਾਮ ਪਾਣੀ ਦਿਓ"],
      },
      {
        title: "ਫਸਲ ਲਈ ਸਹੀ ਸਿੰਚਾਈ",
        desc: "ਕਿਸ ਫਸਲ ਨੂੰ ਕਦੋਂ ਅਤੇ ਕਿੰਨਾ ਪਾਣੀ ਦਿਓ?",
        video: "https://www.youtube.com/embed/abc2",
        steps: ["ਮਿੱਟੀ ਦੀ ਨਮੀ ਜਾਂਚੋ", "ਫਸਲ ਦੇ ਅਨੁਸਾਰ ਸਮਾਂ ਨਿਰਧਾਰਿਤ ਕਰੋ", "ਅਤਿਥੀ ਪਾਣੀ ਤੋਂ ਬਚੋ"],
      },
      {
        title: "ਸਿੰਚਾਈ ਦੇ ਫਾਇਦੇ",
        desc: "ਸਹੀ ਸਿੰਚਾਈ ਕਰਨ ਦੇ ਕੀ-ਕੀ ਫਾਇਦੇ ਹਨ?",
        video: "https://www.youtube.com/embed/xyz9",
        steps: ["ਫਸਲ ਦੀ ਵਾਧਾ ਵਿੱਚ ਸੁਧਾਰ", "ਪਾਣੀ ਦੀ ਬਚਤ", "ਮਿੱਟੀ ਦੀ ਗੁਣਵੱਤਾ ਬਣਾਈ ਰੱਖੋ"],
      },
      {
        title: "ਡ੍ਰਿਪ ਸਿੰਚਾਈ ਪ੍ਰਣਾਲੀ ਕਿਵੇਂ ਸਥਾਪਿਤ ਕਰੀਏ",
        desc: "ਆਪਣੇ ਖੇਤ ਵਿੱਚ ਡ੍ਰਿਪ ਸਿੰਚਾਈ ਕਿਵੇਂ ਲਗਾਈਏ?",
        video: "https://www.youtube.com/embed/xyz10",
        steps: ["ਡ੍ਰਿਪ ਟਿਊਬ ਵਿਛਾਓ", "ਫਿਲਟਰ ਅਤੇ ਪੰਪ ਲਗਾਓ", "ਟਾਈਮਰ ਸੈਟ ਕਰੋ"],
      },
      {
        title: "ਸਿੰਚਾਈ ਦੀਆਂ ਆਮ ਗਲਤੀਆਂ",
        desc: "ਸਿੰਚਾਈ ਕਰਦਿਆਂ ਕੀ ਗਲਤੀਆਂ ਨਾ ਕਰੋ?",
        video: "https://www.youtube.com/embed/xyz11",
        steps: ["ਜ਼ਿਆਦਾ ਪਾਣੀ ਨਾ ਦਿਓ", "ਸਹੀ ਸਮੇਂ 'ਤੇ ਸਿੰਚਾਈ ਕਰੋ", "ਪਾਣੀ ਦੀ ਬਰਬਾਦੀ ਨਾ ਕਰੋ"],
      },
      {
        title: "ਪ੍ਰाकृतिक ਕੀਟਨਾਸ਼ਕ ਬਣਾਓ",
        desc: "ਰਸਾਇਣਕ ਦਵਾਈਆਂ ਦੀ ਥਾਂ ਨੀਮ ਅਤੇ ਜੈਵਿਕ ਉਪਚਾਰ ਵਰਤੋ।",
        video: "https://www.youtube.com/embed/Vof1GmL2DAQ",
        steps: ["ਨੀਮ ਦਾ ਅਰਕ ਬਣਾਓ", "ਸਪਰੇ ਤਿਆਰ ਕਰੋ", "ਛਿੜਕਾਅ ਤੋਂ ਪਹਿਲਾਂ ਟੈਸਟ ਕਰੋ"],
      },
      {
        title: "ਕੀਟ ਨਿਯੰਤਰਣ ਦੇ ਉਪਾਅ",
        desc: "ਫਸਲ ਵਿੱਚ ਕੀਟ ਲੱਗਣ 'ਤੇ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        video: "https://www.youtube.com/embed/abc3",
        steps: ["ਨੀਮ ਤੇਲ ਸਪਰੇ ਕਰੋ", "ਫੇਰੋਮੋਨ ਟ੍ਰੈਪ ਲਗਾਓ", "ਸਪਤਾਹ ਵਿੱਚ ਇੱਕ ਵਾਰੀ ਨਿਰੀਖਣ ਕਰੋ"],
      },
      {
        title: "ਕੀਟਨਾਸ਼ਕ ਦਾ ਸਹੀ ਉਪਯੋਗ",
        desc: "ਕੀਟਨਾਸ਼ਕ ਦਾ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਅਤੇ ਸੁਰੱਖਿਅਤ ਉਪਯੋਗ ਕਿਵੇਂ ਕਰਨਾ ਹੈ?",
        video: "https://www.youtube.com/embed/xyz17",
        steps: ["ਹਦਾਇਤਾਂ ਦੇ ਅਨੁਸਾਰ ਮਾਤਰਾ ਨਿਰਧਾਰਿਤ ਕਰੋ", "ਸਵੇਰੇ ਜਾਂ ਸ਼ਾਮ ਨੂੰ ਛਿੜਕਾਅ ਕਰੋ", "ਬੱਚਿਆਂ ਅਤੇ ਪਾਲਤੂ ਜਾਨਵਰਾਂ ਤੋਂ ਦੂਰ ਰੱਖੋ"],
      },
      {
        title: "ਕੀਟਾਂ ਤੋਂ ਫਸਲ ਦੀ ਸੁਰੱਖਿਆ",
        desc: "ਫਸਲ ਨੂੰ ਕੀਟਾਂ ਤੋਂ ਬਚਾਉਣ ਲਈ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        video: "https://www.youtube.com/embed/xyz18",
        steps: ["ਨੀਮ ਦੇ ਦਰੱਖਤ ਲਗਾਓ", "ਫੇਰੋਮੋਨ ਟ੍ਰੈਪ ਲਗਾਓ", "ਸਪਤਾਹ ਵਿੱਚ ਇੱਕ ਵਾਰੀ ਨਿਰੀਖਣ ਕਰੋ"],
      },
      {
        title: "ਕੀਟ ਨਿਯੰਤਰਣ ਲਈ ਜੈਵਿਕ ਉਪਾਅ",
        desc: "ਕੀਟਾਂ ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਨ ਲਈ ਰਸਾਇਣਕ ਵਿਕਲਪਾਂ ਦੀ ਥਾਂ ਜੈਵਿਕ ਉਪਾਅ ਦਾ ਉਪਯੋਗ ਕਰੋ।",
        video: "https://www.youtube.com/embed/xyz19",
        steps: ["ਨੀਮ ਦਾ ਤੇਲ", "ਲਹਸੁਣ ਦਾ ਸਪਰੇ", "ਪਿਆਜ਼ ਦਾ ਰਸ"],
      },
    ],
    ta: [
      {
        title: "கம்போஸ்ட் செய்வது கற்பீர்",
        desc: "பயிர் கழிவுகளை உரமாக மாற்றுவது எப்படி என்பதை அறிக.",
        video: "https://www.youtube.com/embed/7hBnlajtfxc",
        steps: ["ஈர/உலர் கழிவுகள் சேகரிக்க", "ஒவ்வொரு அடுக்கிலும் மண் சேர்க்க", "10 நாட்களுக்கு பிறகு திருப்பவும்"],
      },
      {
        title: "கம்போஸ்டுக்கு உரிய பொருட்கள்",
        desc: "கம்போஸ்டில் என்னென்ன போடலாம்?",
        video: "https://www.youtube.com/embed/abc1",
        steps: ["இலைகள், காய்கறி தோல், மாட்டுப் பசு கழிவு", "பிளாஸ்டிக் போடாதே", "ஒவ்வொரு வாரமும் கலக்கவும்"],
      },
      {
        title: "கம்போஸ்ட் தயாரிக்கும் செயல்முறை",
        desc: "கம்போஸ்ட் எப்படி தயாரிக்க வேண்டும் என்பதை எளிய படிகளில் கற்றுக்கொள்ளுங்கள்.",
        video: "https://www.youtube.com/embed/xyz1",
        steps: ["அனைத்து பொருட்களையும் சேகரிக்கவும்", "ஒரு இடத்தில் கிணறு தோண்டவும்", "வாரத்திற்கு ஒரு முறை திருப்பவும்"],
      },
      {
        title: "கம்போஸ்ட் செய்வதன் பயன்கள்",
        desc: "கம்போஸ்ட் செய்வதன் மூலம் என்னென்ன பயன்கள் உள்ளன?",
        video: "https://www.youtube.com/embed/xyz2",
        steps: ["தாவர வளர்ச்சியில் மேம்பாடு", "மண்ணின் தரத்தை மேம்படுத்தவும்", "தண்ணீரைச் சேமிக்கவும்"],
      },
      {
        title: "கம்போஸ்ட் செய்வதற்கான கவனிக்க வேண்டியவை",
        desc: "கம்போஸ்ட் செய்வதற்கான சில முக்கிய குறிப்புகள்.",
        video: "https://www.youtube.com/embed/xyz3",
        steps: ["சமநிலையுள்ள பொருட்களைப் பயன்படுத்தவும்", "அதிக தண்ணீர் போடாதே", "வாரத்திற்கு ஒரு முறை கிளறவும்"],
      },
      {
        title: "நீர்ப்பாசனம் மேம்படுத்தல்",
        desc: "குறைந்த நீரிலும் அதிக விளைச்சல் — டிரிப் தொழில்நுட்பம்.",
        video: "https://www.youtube.com/embed/Xej22GsLLQA",
        steps: ["டிரிப் லைன் அமைக்க", "முக்கிய குழாயை இணைக்க", "காலை/மாலை பாய்ச்சி செய்ய"],
      },
      {
        title: "பயிருக்கு உரிய நீர்ப்பாசனம்",
        desc: "எந்த பயிருக்கு எப்போது மற்றும் எவ்வளவு நீர் தர வேண்டும்?",
        video: "https://www.youtube.com/embed/abc2",
        steps: ["மண்ணின் ஈரப்பதம் பார்க்கவும்", "பயிரின் அடிப்படையில் நேரம் நிர்ணயிக்கவும்", "அதிக நீர்ப்பாசனத்திலிருந்து காத்திருங்கள்"],
      },
      {
        title: "நீர்ப்பாசனத்தின் பயன்கள்",
        desc: "சரியான நீர்ப்பாசனம் செய்வதன் மூலம் என்னென்ன பயன்கள் உள்ளன?",
        video: "https://www.youtube.com/embed/xyz9",
        steps: ["பயிரின் வளர்ச்சியில் மேம்பாடு", "தண்ணீர் சேமிப்பு", "மண்ணின் தரத்தை பராமரிக்கவும்"],
      },
      {
        title: "டிரிப் நீர்ப்பாசன அமைப்பை எப்படி நிறுவுவது",
        desc: "உங்கள் வயலில் டிரிப் நீர்ப்பாசனம் எப்படி அமைக்க வேண்டும்?",
        video: "https://www.youtube.com/embed/xyz10",
        steps: ["டிரிப் குழாய்களைப் போடவும்", "வடிகட்டி மற்றும் பம்ப் அமைக்கவும்", "டைமர் அமைக்கவும்"],
      },
      {
        title: "நீர்ப்பாசனத்தில் உள்ள பொதுவான பிழைகள்",
        desc: "நீர்ப்பாசனம் செய்யும்போது என்ன பிழைகள் செய்யக்கூடாது?",
        video: "https://www.youtube.com/embed/xyz11",
        steps: ["அதிக நீர் அளிக்காதே", "சரியான நேரத்தில் நீர்ப்பாசனம் செய்யவும்", "நீரின் வீணாக்கத்தைத் தவிர்க்கவும்"],
      },
      {
        title: "இயற்கை பூச்சிக்கொல்லி தயாரிப்பு",
        desc: "வேப்பம் மற்றும் மூலிகைச்சாறு கொண்டு பூச்சிக் கட்டுப்பாடு.",
        video: "https://www.youtube.com/embed/Vof1GmL2DAQ",
        steps: ["வேப்பச் சாறு தயாரிக்க", "ஸ்ப்ரே கலவை செய்ய", "பயன்படுத்தும் முன் சோதிக்க"],
      },
      {
        title: "பூச்சி கட்டுப்பாட்டு வழிமுறைகள்",
        desc: "பயிரில் பூச்சிகள் தாக்கினால் என்ன செய்ய வேண்டும்?",
        video: "https://www.youtube.com/embed/abc3",
        steps: ["வேப்பம் எண்ணெய் ஸ்ப்ரே செய்யவும்", "பெரோமோன் சிக்கல்களை அமைக்கவும்", "வாரத்திற்கு ஒரு முறை ஆய்வு செய்யவும்"],
      },
      {
        title: "பூச்சிக்கொல்லியின் சரியான பயன்பாடு",
        desc: "பூச்சிக்கொல்லியை எவ்வாறு பயனுள்ள மற்றும் பாதுகாப்பான முறையில் பயன்படுத்துவது?",
        video: "https://www.youtube.com/embed/xyz17",
        steps: ["அறிக்கைகளின் அடிப்படையில் அளவை நிர்ணயிக்கவும்", "காலை அல்லது மாலை நேரங்களில் ஸ்ப்ரே செய்யவும்", "குழந்தைகள் மற்றும் வீட்டுமனோரங்களை அப்பால் வைக்கவும்"],
      },
      {
        title: "பூச்சிகளால் பயிர்களை பாதுகாப்பது",
        desc: "பயிர்களை பூச்சிகளால் காயப்படுத்தாமல் பாதுகாப்பதற்கான வழிமுறைகள்.",
        video: "https://www.youtube.com/embed/xyz18",
        steps: ["வேப்பம் மரங்களை நடவும்", "பெரோமோன் சிக்கல்களை அமைக்கவும்", "வாரத்திற்கு ஒரு முறை ஆய்வு செய்யவும்"],
      },
      {
        title: "பூச்சி கட்டுப்பாட்டிற்கான உயிரியல் வழிமுறைகள்",
        desc: "பூச்சிகளை கட்டுப்படுத்த கெமிக்கல் விருப்பங்களுக்குப் பதிலாக உயிரியல் வழிமுறைகளைப் பயன்படுத்தவும்.",
        video: "https://www.youtube.com/embed/xyz19",
        steps: ["வேப்பம் எண்ணெய்", "பூண்டு ஸ்ப்ரே", "வெங்காயம் ஜூஸ்"],
      },
    ],
  };

  // 📜 Govt Schemes (multi-language)
  const schemes = [
    {
      name: {
        en: "PM Kisan Samman Nidhi Scheme",
        hi: "प्रधानमंत्री किसान सम्मान निधि योजना",
        mr: "पंतप्रधान किसान सन्मान निधी",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਕਿਸਾਨ ਸਨਮਾਨ ਨਿਧਿ",
        ta: "பிரதமர் விவசாயி கௌரவ நிதி",
      },
      desc: {
        en: "Eligible farmers get ₹6000 annual support in 3 installments.",
        hi: "पात्र किसानों को ₹6000 वार्षिक सहायता 3 किश्तों में।",
        mr: "पात्र शेतकऱ्यांना ₹6000 वार्षिक मदत 3 हप्त्यांत.",
        pa: "ਯੋਗ ਕਿਸਾਨਾਂ ਨੂੰ ₹6000 ਸਾਲਾਨਾ ਸਹਾਇਤਾ 3 ਕਿਸ਼ਤਾਂ ਵਿੱਚ.",
        ta: "தகுதி விவசாயிகளுக்கு ₹6000 ஆண்டு உதவி 3 தவணைகளில்.",
      },
      link: "https://pmkisan.gov.in/",
    },
    {
      name: {
        en: "PM Crop Insurance Scheme",
        hi: "प्रधानमंत्री फसल बीमा योजना",
        mr: "पंतप्रधान पिक विमा योजना",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ",
        ta: "பிரதமர் பயிர் காப்பீட்டு திட்டம்",
      },
      desc: {
        en: "Insurance coverage for crop loss/disaster.",
        hi: "फसल नुकसान/आपदा पर बीमा सुरक्षा।",
        mr: "पिक नुकसानी/आपत्तीवर विमा संरक्षण.",
        pa: "ਫਸਲ ਨੁਕਸਾਨ/ਆਫ਼ਤ ਤੇ ਬੀਮਾ ਸੁਰੱਖਿਆ.",
        ta: "பயிர் சேதம்/இயற்கை பேரழிவுக்கு காப்பீடு.",
      },
      link: "https://pmfby.gov.in/",
    },
    {
      name: {
        en: "Soil Health Card",
        hi: "मृदा स्वास्थ्य कार्ड",
        mr: "मृदा आरोग्य कार्ड",
        pa: "ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ",
        ta: "மண் ஆரோக்கிய அட்டை",
      },
      desc: {
        en: "Report on soil quality and nutrients.",
        hi: "मिट्टी की गुणवत्ता और पोषक तत्व रिपोर्ट।",
        mr: "माती गुणवत्ता आणि पोषक घटक अहवाल.",
        pa: "ਮਿੱਟੀ ਦੀ ਗੁਣਵੱਤਾ ਅਤੇ ਪੋਸ਼ਕ ਤੱਤ ਰਿਪੋਰਟ.",
        ta: "மண்ணின் தரம் மற்றும் ஊட்டச்சத்து அறிக்கை.",
      },
      link: "https://soilhealth.dac.gov.in/",
    },
    {
      name: {
        en: "National Food Security Mission",
        hi: "राष्ट्रीय खाद्य सुरक्षा मिशन",
        mr: "राष्ट्रीय अन्न सुरक्षा अभियान",
        pa: "ਰਾਸ਼ਟਰੀ ਖਾਦ ਸੁਰੱਖਿਆ ਮਿਸ਼ਨ",
        ta: "தேசிய உணவு பாதுகாப்பு திட்டம்",
      },
      desc: {
        en: "Focus on increasing productivity of rice/wheat/pulses.",
        hi: "धान/गेहूं/दलहन उत्पादकता वृद्धि पर केंद्रित।",
        mr: "तांदूळ/गहू/कडधान्य उत्पादकता वाढ.",
        pa: "ਧਾਨ/ਗੰਹੂ/ਦਾਲਾਂ ਦੀ ਉਤਪਾਦਕਤਾ ਵਧਾਉਣਾ.",
        ta: "அரிசி/கோதுமை/பருப்பு உற்பத்தி உயர்வு.",
      },
      link: "https://nfsm.gov.in/",
    },
    {
      name: {
        en: "PM Agricultural Irrigation Scheme",
        hi: "प्रधानमंत्री कृषि सिंचाई योजना",
        mr: "पंतप्रधान कृषि सिंचन योजना",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਖੇਤੀ ਸਿੰਚਾਈ ਯੋਜਨਾ",
        ta: "பிரதமர் விவசாய நீர்ப்பாசன திட்டம்",
      },
      desc: {
        en: "Subsidy for micro irrigation, drip and sprinkler.",
        hi: "सूक्ष्म सिंचाई, ड्रिप और स्प्रिंकलर के लिए सब्सिडी।",
        mr: "सूक्ष्म सिंचन, ड्रिप व स्प्रिंकलर साठी अनुदान.",
        pa: "ਮਾਈਕ੍ਰੋ ਸਿੰਚਾਈ, ਡ੍ਰਿਪ ਤੇ ਸਪ੍ਰਿੰਕਲਰ ਲਈ ਸਬਸਿਡੀ.",
        ta: "மைக்ரோ நீர்ப்பாசனம், டிரிப் மற்றும் ஸ்பிரிங்க்லர் சலுகை.",
      },
      link: "https://pmksy.gov.in/",
    },
    {
      name: {
        en: "National Horticulture Mission",
        hi: "राष्ट्रीय बागवानी मिशन",
        mr: "राष्ट्रीय फलोत्पादन अभियान",
        pa: "ਰਾਸ਼ਟਰੀ ਬਾਗਬਾਨੀ ਮਿਸ਼ਨ",
        ta: "தேசிய தோட்டக்கலை திட்டம்",
      },
      desc: {
        en: "Support for fruit, vegetable, flower production.",
        hi: "फल, सब्जी, फूल उत्पादन के लिए सहायता।",
        mr: "फळ, भाज्या, फुलांचे उत्पादनासाठी मदत.",
        pa: "ਫਲ, ਸਬਜ਼ੀ, ਫੁੱਲ ਉਤਪਾਦਨ ਲਈ ਸਹਾਇਤਾ.",
        ta: "பழம், காய்கறி, மலர் உற்பத்திக்கு உதவி.",
      },
      link: "https://nhm.gov.in/",
    },
    {
      name: {
        en: "National Agricultural Development Scheme",
        hi: "राष्ट्रीय कृषि विकास योजना",
        mr: "राष्ट्रीय कृषी विकास योजना",
        pa: "ਰਾਸ਼ਟਰੀ ਖੇਤੀ ਵਿਕਾਸ ਯੋਜਨਾ",
        ta: "தேசிய விவசாய மேம்பாட்டு திட்டம்",
      },
      desc: {
        en: "For innovation and development in agriculture.",
        hi: "कृषि क्षेत्र में नवाचार और विकास के लिए।",
        mr: "कृषी क्षेत्रातील नवकल्पना व विकासासाठी.",
        pa: "ਖੇਤੀ ਖੇਤਰ ਵਿੱਚ ਨਵੀਨਤਾ ਅਤੇ ਵਿਕਾਸ ਲਈ.",
        ta: "விவசாய வளர்ச்சி மற்றும் புதுமை.",
      },
      link: "https://rkvy.nic.in/",
    },
    {
      name: {
        en: "Agricultural Mechanization Scheme",
        hi: "कृषि यांत्रिकीकरण योजना",
        mr: "कृषी यांत्रिकीकरण योजना",
        pa: "ਖੇਤੀ ਮਕੈਨਾਈਜ਼ੇਸ਼ਨ ਯੋਜਨਾ",
        ta: "விவசாய இயந்திர திட்டம்",
      },
      desc: {
        en: "Subsidy on agricultural equipment.",
        hi: "कृषि उपकरणों पर सब्सिडी।",
        mr: "कृषी उपकरणांवर अनुदान.",
        pa: "ਖੇਤੀ ਉਪਕਰਨਾਂ 'ਤੇ ਸਬਸਿਡੀ.",
        ta: "விவசாய கருவிகள் சலுகை.",
      },
      link: "https://agrimachinery.nic.in/",
    },
    {
      name: {
        en: "National Livestock Mission",
        hi: "राष्ट्रीय पशुधन मिशन",
        mr: "राष्ट्रीय पशुधन अभियान",
        pa: "ਰਾਸ਼ਟਰੀ ਪਸ਼ੂਧਨ ਮਿਸ਼ਨ",
        ta: "தேசிய கால்நடை திட்டம்",
      },
      desc: {
        en: "Support for animal husbandry, dairy, poultry.",
        hi: "पशुपालन, डेयरी, पोल्ट्री के लिए सहायता।",
        mr: "पशुपालन, डेअरी, पोल्ट्रीसाठी मदत.",
        pa: "ਪਸ਼ੂਪਾਲਨ, ਡੇਅਰੀ, ਪੋਲਟਰੀ ਲਈ ਸਹਾਇਤਾ.",
        ta: "கால்நடை, பண்ணை, கோழி வளர்ப்பு உதவி.",
      },
      link: "https://nlm.udyamimitra.in/",
    },
    {
      name: {
        en: "National Seed Scheme",
        hi: "राष्ट्रीय बीज योजना",
        mr: "राष्ट्रीय बियाणे योजना",
        pa: "ਰਾਸ਼ਟਰੀ ਬੀਜ ਯੋਜਨਾ",
        ta: "தேசிய விதை திட்டம்",
      },
      desc: {
        en: "For availability of quality seeds.",
        hi: "गुणवत्ता बीज उपलब्धता के लिए।",
        mr: "उत्तम बियाणे उपलब्धतेसाठी.",
        pa: "ਉੱਤਮ ਬੀਜ ਉਪਲਬਧਤਾ ਲਈ.",
        ta: "நல்ல விதைகள் வழங்கல்.",
      },
      link: "https://seednet.gov.in/",
    },
    {
      name: {
        en: "National Agricultural Marketing Scheme",
        hi: "राष्ट्रीय कृषि विपणन योजना",
        mr: "राष्ट्रीय कृषी विपणन योजना",
        pa: "ਰਾਸ਼ਟਰੀ ਖੇਤੀ ਮਾਰਕੀਟਿੰਗ ਯੋਜਨਾ",
        ta: "தேசிய விவசாய சந்தை திட்டம்",
      },
      desc: {
        en: "For marketing of agricultural products.",
        hi: "कृषि उत्पादों के विपणन के लिए।",
        mr: "कृषी उत्पादनांच्या विपणनासाठी.",
        pa: "ਖੇਤੀ ਉਤਪਾਦਾਂ ਦੀ ਮਾਰਕੀਟਿੰਗ ਲਈ.",
        ta: "விவசாய பொருட்கள் சந்தை.",
      },
      link: "https://enam.gov.in/",
    },
    {
      name: {
        en: "PM Gramin Awas Yojana",
        hi: "प्रधानमंत्री ग्रामीण आवास योजना",
        mr: "पंतप्रधान ग्रामीण गृहनिर्माण योजना",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਪਿੰਡ ਆਵਾਸ ਯੋਜਨਾ",
        ta: "பிரதமர் கிராம வீடு திட்டம்",
      },
      desc: {
        en: "Support for rural housing construction.",
        hi: "ग्रामीण आवास निर्माण के लिए सहायता।",
        mr: "ग्रामीण गृहनिर्माणासाठी मदत.",
        pa: "ਪਿੰਡਾਂ ਵਿੱਚ ਘਰ ਬਣਾਉਣ ਲਈ ਸਹਾਇਤਾ.",
        ta: "கிராம வீடு கட்ட உதவி.",
      },
      link: "https://pmayg.nic.in/",
    },
    {
      name: {
        en: "PM Ujjwala Yojana",
        hi: "प्रधानमंत्री उज्ज्वला योजना",
        mr: "पंतप्रधान उज्ज्वला योजना",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਉੱਜਵਲਾ ਯੋਜਨਾ",
        ta: "பிரதமர் உஜ்ஜ்வலா திட்டம்",
      },
      desc: {
        en: "Free gas connection to poor families.",
        hi: "गरीब परिवारों को मुफ्त गैस कनेक्शन।",
        mr: "गरिब कुटुंबांना मोफत गॅस कनेक्शन.",
        pa: "ਗਰੀਬ ਪਰਿਵਾਰਾਂ ਨੂੰ ਮੁਫ਼ਤ ਗੈਸ ਕਨੈਕਸ਼ਨ.",
        ta: "ஏழை குடும்பங்களுக்கு இலவச எல்பிஜி.",
      },
      link: "https://pmuy.gov.in/",
    },
    {
      name: {
        en: "PM Jan Dhan Yojana",
        hi: "प्रधानमंत्री जनधन योजना",
        mr: "पंतप्रधान जनधन योजना",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਜਨਧਨ ਯੋਜਨਾ",
        ta: "பிரதமர் ஜனதன் திட்டம்",
      },
      desc: {
        en: "Banking facility for all.",
        hi: "बैंकिंग सुविधा सभी के लिए।",
        mr: "सर्वांसाठी बँकिंग सुविधा.",
        pa: "ਸਭ ਲਈ ਬੈਂਕਿੰਗ ਸਹੂਲਤ.",
        ta: "அனைவருக்கும் வங்கி வசதி.",
      },
      link: "https://pmjdy.gov.in/",
    },
    {
      name: {
        en: "PM Jeevan Jyoti Bima Yojana",
        hi: "प्रधानमंत्री जीवन ज्योति बीमा योजना",
        mr: "पंतप्रधान जीवन ज्योती विमा योजना",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਜੀਵਨ ਜੋਤੀ ਬੀਮਾ ਯੋਜਨਾ",
        ta: "பிரதமர் ஜீவன் ஜோதி காப்பீடு",
      },
      desc: {
        en: "Life insurance at low premium.",
        hi: "कम प्रीमियम पर जीवन बीमा।",
        mr: "कमी प्रीमियमवर जीवन विमा.",
        pa: "ਘੱਟ ਪ੍ਰੀਮੀਅਮ 'ਤੇ ਜੀਵਨ ਬੀਮਾ.",
        ta: "குறைந்த கட்டணத்தில் காப்பீடு.",
      },
      link: "https://jansuraksha.gov.in/",
    },
    {
      name: {
        en: "PM Suraksha Bima Yojana",
        hi: "प्रधानमंत्री सुरक्षा बीमा योजना",
        mr: "पंतप्रधान सुरक्षा विमा योजना",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਸੁਰੱਖਿਆ ਬੀਮਾ ਯੋਜਨਾ",
        ta: "பிரதமர் பாதுகாப்பு காப்பீடு",
      },
      desc: {
        en: "Accident insurance at low premium.",
        hi: "दुर्घटना बीमा कम प्रीमियम पर।",
        mr: "अपघात विमा कमी प्रीमियमवर.",
        pa: "ਘੱਟ ਪ੍ਰੀਮੀਅਮ 'ਤੇ ਹਾਦਸਾ ਬੀਮਾ.",
        ta: "விபத்து காப்பீடு குறைந்த கட்டணத்தில்.",
      },
      link: "https://jansuraksha.gov.in/",
    },
    {
      name: {
        en: "PM Shram Yogi Maandhan Yojana",
        hi: "प्रधानमंत्री श्रम योगी मानधन योजना",
        mr: "पंतप्रधान श्रमयोगी मानधन योजना",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਸ਼੍ਰਮ ਯੋਗੀ ਮਾਨਧਨ ਯੋਜਨਾ",
        ta: "பிரதமர் தொழிலாளர் ஓய்வூதிய திட்டம்",
      },
      desc: {
        en: "Pension for unorganized sector workers.",
        hi: "असंगठित क्षेत्र के श्रमिकों के लिए पेंशन।",
        mr: "असंघटित क्षेत्रातील कामगारांसाठी निवृत्ती वेतन.",
        pa: "ਅਸੰਗਠਿਤ ਖੇਤਰ ਦੇ ਮਜ਼ਦੂਰਾਂ ਲਈ ਪੈਨਸ਼ਨ.",
        ta: "ஒழுங்கற்ற தொழிலாளர்களுக்குப் ஓய்வூதியம்.",
      },
      link: "https://maandhan.in/",
    },
    {
      name: {
        en: "PM Ayushman Bharat Yojana",
        hi: "प्रधानमंत्री आयुष्मान भारत योजना",
        mr: "पंतप्रधान आयुष्मान भारत योजना",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ ਯੋਜਨਾ",
        ta: "பிரதமர் ஆயுஷ்மான் பாரத் திட்டம்",
      },
      desc: {
        en: "Free health insurance to poor families.",
        hi: "गरीब परिवारों को मुफ्त स्वास्थ्य बीमा।",
        mr: "गरिब कुटुंबांना மோ஫त ஆரोग்ய विमா.",
        pa: "ਗਰੀਬ ਪਰਿਵਾਰਾਂ ਨੂੰ ਮੁਫ਼ਤ ਸਿਹਤ ਬੀਮਾ.",
        ta: "ஏழை குடும்பங்களுக்கு இலவச மருத்துவ காப்பீடு.",
      },
      link: "https://pmjay.gov.in/",
    },
    {
      name: {
        en: "PM Self Employment Scheme",
        hi: "प्रधानमंत्री स्वरोजगार योजना",
        mr: "पंतप्रधान स्वयंरोजगार योजना",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਸਵੈਰੋਜ਼ਗਾਰ ਯੋਜਨਾ",
        ta: "பிரதமர் சுயதொழில் திட்டம்",
      },
      desc: {
        en: "Loan and assistance for self-employment.",
        hi: "स्वरोजगार के लिए ऋण व सहायता।",
        mr: "स्वयंरोजगारासाठी कर्ज व मदत.",
        pa: "ਸਵੈਰੋਜ਼ਗਾਰ ਲਈ ਕਰਜ਼ਾ ਤੇ ਸਹਾਇਤਾ.",
        ta: "சுயதொழிலுக்கு கடன் மற்றும் உதவி.",
      },
      link: "https://msme.gov.in/",
    },
    {
      name: {
        en: "PM Gramin Sadak Yojana",
        hi: "प्रधानमंत्री ग्रामीण सड़क योजना",
        mr: "पंतप्रधान ग्रामीण रस्ता योजना",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਪਿੰਡ ਸੜਕ ਯੋਜਨਾ",
        ta: "பிரதமர் கிராம சாலை திட்டம்",
      },
      desc: {
        en: "Road construction in rural areas.",
        hi: "ग्रामीण क्षेत्रों में सड़क निर्माण।",
        mr: "ग्रामीण भागात रस्ते बांधणी.",
        pa: "ਪਿੰਡਾਂ ਵਿੱਚ ਸੜਕ ਬਣਾਉਣ ਲਈ.",
        ta: "கிராமப்புற சாலை அமைப்பு.",
      },
      link: "https://pmgsy.nic.in/",
    },
    {
      name: {
        en: "PM Digital India Scheme",
        hi: "प्रधानमंत्री डिजिटल इंडिया योजना",
        mr: "पंतप्रधान डिजिटल इंडिया योजना",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਡਿਜੀਟਲ ਇੰਡੀਆ ਯੋਜਨਾ",
        ta: "பிரதமர் டிஜிட்டல் இந்தியா திட்டம்",
      },
      desc: {
        en: "Expansion of digital services.",
        hi: "डिजिटल सेवाओं का विस्तार।",
        mr: "डिजिटल सेवा विस्तार.",
        pa: "ਡਿਜੀਟਲ ਸੇਵਾਵਾਂ ਦਾ ਵਿਸਥਾਰ.",
        ta: "டிஜிட்டல் சேவைகள் விரிவாக்கம்.",
      },
      link: "https://digitalindia.gov.in/",
    },
    {
      name: {
        en: "PM Skill Development Scheme",
        hi: "प्रधानमंत्री कौशल विकास योजना",
        mr: "पंतप्रधान कौशल्य विकास योजना",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਕੌਸ਼ਲ ਵਿਕਾਸ ਯੋਜਨਾ",
        ta: "பிரதமர் திறன் மேம்பாட்டு திட்டம்",
      },
      desc: {
        en: "Skill training for youth.",
        hi: "युवाओं के लिए कौशल प्रशिक्षण।",
        mr: "युवांसाठी कौशल्य प्रशिक्षण.",
        pa: "ਨੌਜਵਾਨਾਂ ਲਈ ਕੌਸ਼ਲ ਟ੍ਰੇਨਿੰਗ.",
        ta: "இளைஞர்களுக்குத் திறன் பயிற்சி.",
      },
      link: "https://www.pmkvyofficial.org/",
    },
    {
      name: {
        en: "PM Atal Pension Scheme",
        hi: "प्रधानमंत्री अटल पेंशन योजना",
        mr: "पंतप्रधान अटल पेन्शन योजना",
        pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਅਟਲ ਪੈਨਸ਼ਨ ਯੋਜਨਾ",
        ta: "பிரதமர் அட்டல் ஓய்வூதிய திட்டம்",
      },
      desc: {
        en: "Pension scheme for all citizens.",
        hi: "सभी नागरिकों के लिए पेंशन योजना।",
        mr: "सर्व नागरिकांसाठी पेन्शन योजना.",
        pa: "ਸਭ ਲਈ ਪੈਨਸ਼ਨ ਯੋਜਨਾ.",
        ta: "அனைவருக்கும் ஓய்வூதிய திட்டம்.",
      },
      link: "https://npscra.nsdl.co.in/nsdl-atp.php",
    },
  ];

  const filterLabels = {
    en: ["Compost", "Irrigation", "Pesticide", "All"],
    hi: ["खाद", "सिंचाई", "कीटनाशक", "सभी"],
    mr: ["खत", "सिंचन", "कीटकनाशक", "सर्व"],
    pa: ["ਖਾਦ", "ਸਿੰਚਾਈ", "ਕੀਟਨਾਸ਼ਕ", "ਸਭ"],
    ta: ["உரம்", "நீர்ப்பாசனம்", "பூச்சிக்கொல்லி", "அனைத்தும்"],
  };

  const filterMap = {
    en: {
      Compost: "Compost",
      Irrigation: "Irrigation",
      Pesticide: "Pesticide",
      All: "",
    },
    hi: {
      "खाद": "कंपोस्ट",
      "सिंचाई": "सिंचाई",
      "कीटनाशक": "कीटनाशक",
      "सभी": "",
    },
    mr: {
      "खत": "कंपोस्ट",
      "सिंचन": "सिंचन",
      "कीटकनाशक": "कीटकनाशक",
      "सर्व": "",
    },
    pa: {
      "ਖਾਦ": "ਖਾਦ",
      "ਸਿੰਚਾਈ": "ਸਿੰਚਾਈ",
      "ਕੀਟਨਾਸ਼ਕ": "ਕੀਟਨਾਸ਼ਕ",
      "ਸਭ": "",
    },
    ta: {
      "உரம்": "கம்போஸ்ட்",
      "நீர்ப்பாசனம்": "நீர்ப்பாசனம்",
      "பூச்சிக்கொல்லி": "பூச்சிக்கொல்லி",
      "அனைத்தும்": "",
    },
  };

 const resourceList = resources[lang] || resources.en;
const filteredResources = videoFilter === filterLabels[lang][3]
  ? resourceList
  : resourceList.filter(res =>
      res.title.includes(filterMap[lang][videoFilter])
    );
  return (
    <div className="min-h-screen bg-[#eaf7ec] pt-20 pb-10 text-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        {/* 🌐 Language Selector (top-right) */}
        <div className="flex justify-end mb-4">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="border border-green-300 rounded-xl px-3 py-2 bg-white text-green-700 shadow-sm"
          >
            <option value="en">🇬🇧 English</option>
            <option value="hi">🇮🇳 हिंदी</option>
            <option value="mr">🪔 मराठी</option>
            <option value="pa">🧿 ਪੰਜਾਬੀ</option>
            <option value="ta">🌺 தமிழ்</option>
          </select>
        </div>

        {/* 🌤 Weather header + Advice (सिर्फ एक कार्ड) */}
        {weather && (
          <Card className="bg-gradient-to-r from-[#53b46d] to-[#3a8f52] text-white rounded-2xl p-4 mb-6 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <CloudSun className="w-8 h-8" />
              <div>
                <h3 className="text-lg font-semibold">
                  {weather.condition} - {weatherAdvice[lang][weather.condition.replace("☀️ ", "").replace("🌧️ ", "").replace("⛅ ", "")] || ""}
                </h3>
                <p className="text-sm">{weather.tip[lang]}</p>
              </div>
            </div>
            <Button onClick={() => speak(weather.tip[lang])} className="bg-white text-green-700 hover:bg-green-50">
              🔊
            </Button>
          </Card>
        )}

        {/* 💡 Moving Daily Tips Ticker */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#d5f5df] to-[#c4efd2] border border-green-100 rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 px-4 py-3">
            <Lightbulb className="text-green-600 w-6 h-6 flex-shrink-0" />
            <div className="w-full overflow-hidden">
              <motion.div
                animate={{ x: ["100%", "-100%"] }}
                transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
                className="whitespace-nowrap text-green-800 font-medium text-base"
              >
                {tipsLine}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Video Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {filterLabels[lang].map((label) => (
            <button
              key={label}
              onClick={() => setVideoFilter(label)}
              className={`px-4 py-1 rounded-full border border-green-400 ${
                videoFilter === label
                  ? "bg-green-500 text-white"
                  : "bg-white text-green-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 🎥 Resource cards (2-column) */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {filteredResources.map((res, i) => (
            <Card key={i} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-green-100 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-700 p-3 rounded-xl">
                    <Book className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-green-800">{res.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">{res.desc}</p>
                <div className="flex gap-3 mb-3">
                  <button
                    onClick={() => setShowVideo(res.video)}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <PlayCircle className="w-4 h-4" /> Watch
                  </button>
                  <button
                    onClick={() => speak(res.desc)}
                    className="text-amber-600 hover:text-amber-700 text-sm flex items-center gap-1"
                  >
                    <Volume2 className="w-4 h-4" /> Listen
                  </button>
                </div>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mb-3">
                  {res.steps.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
                <div
                  onClick={() => toggleComplete(res.title)}
                  className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                >
                  <CheckCircle
                    className={`w-5 h-5 ${completed.includes(res.title) ? "text-green-600 fill-green-500" : "text-gray-400"}`}
                  />
                  {completed.includes(res.title) ? "✅ पूरा किया" : "Mark as Done"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🧠 Crop Health Checker (Text + Photo AI) */}
        <Card className="bg-white rounded-2xl border border-green-100 shadow-sm mb-10">
          <CardHeader>
            <CardTitle className="text-green-800 font-bold text-xl">
              {/* Crop Health Check Title */}
              { { en: "🧠 Crop Health Check", hi: "🧠 फ़सल स्वास्थ्य जांच", mr: "🧠 पिक आरोग्य तपासणी", pa: "🧠 ਫਸਲ ਸਿਹਤ ਜਾਂਚ", ta: "🧠 பயிர் ஆரோக்கியம்" }[lang] }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <input
                type="text"
                placeholder={
                  { en: "Crop name", hi: "फसल का नाम", mr: "पिकाचे नाव", pa: "ਫਸਲ ਦਾ ਨਾਮ", ta: "பயிர் பெயர்" }[lang]
                }
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="border rounded-xl px-3 py-2 flex-1"
              />
              <input
                type="text"
                placeholder={
                  { en: "Describe problem (optional)", hi: "समस्या लिखें (optional)", mr: "समस्या लिहा (पर्यायी)", pa: "ਸਮੱਸਿਆ ਲਿਖੋ (ਚੋਣਵਾਂ)", ta: "பிரச்சினை (விருப்பம்)" }[lang]
                }
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="border rounded-xl px-3 py-2 flex-1"
              />

              {/* Hidden file input */}
              <input
                id="cropImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) analyzeImage(file);
                }}
              />
              <label
                htmlFor="cropImage"
                className="bg-[#eaf7ec] border border-green-300 rounded-xl px-3 py-2 cursor-pointer text-green-700 flex items-center justify-center gap-2"
                title={PLANT_ID_KEY ? "Photo → AI analysis" : "Photo → Smart offline analysis"}
              >
                <Camera className="w-4 h-4" />
                { { en: "Upload Photo", hi: "फोटो अपलोड", mr: "फोटो अपलोड", pa: "ਫੋਟੋ ਅੱਪਲੋਡ", ta: "படத்தை பதிவேற்று" }[lang] }
              </label>

              <Button onClick={checkCropHealth} className="bg-[#4ba862] text-white">
                { { en: "Check", hi: "जांचें", mr: "तपासा", pa: "ਚੈਕ ਕਰੋ", ta: "சரிபார்க்க" }[lang] }
              </Button>
            </div>

            {/* Preview + Result */}
            {imgPreview && (
              <img
                src={imgPreview}
                alt="preview"
                className="w-full max-w-xs rounded-xl border border-green-100 mb-3"
              />
            )}

            {solution && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="bg-gradient-to-r from-[#e8f9ec] to-[#d9f4e1] border border-green-200 rounded-xl p-4"
              >
                <p className="text-green-800 font-semibold mb-2">
                  {/* Solution label */}
                  { { en: "🌾 Solution:", hi: "🌾 समाधान:", mr: "🌾 उपाय:", pa: "🌾 ਹੱਲ:", ta: "🌾 தீர்வு:" }[lang] }
                </p>
                <p className="text-gray-700 mb-2">{solution.text}</p>
                <div className="flex items-center gap-3 mb-1">
                  {solution.severity && (
                    <span className="text-sm text-gray-700">
                      {/* Severity label */}
                      { { en: "🌡 Severity:", hi: "🌡 गंभीरता:", mr: "🌡 तीव्रता:", pa: "🌡 ਗੰਭੀਰਤਾ:", ta: "🌡 தீவிரம்:" }[lang] }
                      <span
                        className={`font-semibold ${
                          solution.severity === "High"
                            ? "text-red-600"
                            : solution.severity === "Medium"
                            ? "text-orange-500"
                            : "text-green-600"
                        }`}
                      >
                        {solution.severity}
                      </span>
                    </span>
                  )}
                  <button
                    onClick={() => speak(solution.text)}
                    className="text-amber-600 hover:text-amber-700 text-sm"
                  >
                    {/* Listen label */}
                    { { en: "🔊 Listen", hi: "🔊 सुनें", mr: "🔊 ऐका", pa: "🔊 ਸੁਣੋ", ta: "🔊 கேள்" }[lang] }
                  </button>
                </div>
                {solution.next && <p className="text-sm text-green-700 italic">{solution.next}</p>}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* 🌾 Success Story */}
        <Card className="bg-gradient-to-r from-[#53b46d] to-[#3a8f52] text-white rounded-2xl shadow-md mb-10">
          <CardContent className="p-5">
            <h3 className="text-xl font-bold mb-2">
              🌾 { { hi: "प्रेरणादायक कहानी", mr: "प्रेरणादायी कथा", pa: "ਪ੍ਰੇਰਣਾਦਾਇਕ ਕਹਾਣੀ", ta: "உத்வேகக் கதை" }[lang] }
            </h3>
            <p>{stories[lang]}</p>
          </CardContent>
        </Card>

        {/* 📜 Govt Schemes Section */}
        <Card className="bg-white rounded-2xl border border-green-100 shadow-sm mb-10">
          <CardHeader>
            <CardTitle className="text-green-800 font-bold text-xl">
              📜 { { hi: "सरकारी योजनाएं", mr: "शासकीय योजना", pa: "ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ", ta: "அரசுத் திட்டங்கள்" }[lang] }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-5">
              {schemes.map((s, i) => (
                <div key={i} className="p-4 rounded-xl border border-green-100 bg-[#f7fff8] shadow-sm hover:shadow-md transition-all">
                  <h4 className="font-semibold text-green-800 mb-2">{s.name[lang]}</h4>
                  <p className="text-sm text-gray-700 mb-3">{s.desc[lang]}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => speak(s.desc[lang])}
                      className="text-amber-600 hover:text-amber-700 text-sm"
                    >
                      🔊 { { hi: "सुनें", mr: "ऐका", pa: "ਸੁਣੋ", ta: "கேளுங்கள்" }[lang] }
                    </button>
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      🌐 { { hi: "अधिक जानें", mr: "अधिक जाणून घ्या", pa: "ਹੋਰ ਜਾਣੋ", ta: "மேலும் அறிக" }[lang] }
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 🤖 Chatbot Button */}
        <Button onClick={() => setChat(true)} className="fixed bottom-6 right-6 bg-[#4ba862] text-white rounded-full p-4 shadow-lg">
          <MessageCircle className="w-6 h-6" />
        </Button>

        {/* 🎥 Video Modal */}
        {showVideo && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-4 max-w-3xl w-full">
              <iframe width="100%" height="400" src={showVideo} title="video" allowFullScreen></iframe>
              <Button onClick={() => setShowVideo(null)} className="mt-4 w-full bg-red-500 text-white rounded-xl">
                { { hi: "बंद करें", mr: "बंद करा", pa: "ਬੰਦ ਕਰੋ", ta: "மூடு" }[lang] }
              </Button>
            </div>
          </div>
        )}

        {/* 💬 Chatbot Window */}
        {chat && (
          <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-2xl flex flex-col z-50">
            <div className="bg-[#4ba862] text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
              <span className="font-semibold">
                { { hi: "किसान मित्र", mr: "शेतकरी मित्र", pa: "ਕਿਸਾਨ ਮਿੱਤਰ", ta: "விவசாயி நண்பன்" }[lang] } 🤖
              </span>
              <X className="cursor-pointer" onClick={() => setChat(false)} />
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {messages.map((m, i) => (
                <div key={i} className={`p-2 rounded-xl ${m.user ? "bg-green-100 self-end" : "bg-gray-100"}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const msg = e.target.msg.value;
                sendMessage(msg);
                e.target.reset();
              }}
              className="p-3 border-t flex"
            >
              <input
                name="msg"
                placeholder={{ hi: "प्रश्न पूछें...", mr: "प्रश्न विचारा...", pa: "ਸਵਾਲ ਪੁੱਛੋ...", ta: "கேள்வி கேளுங்கள்..." }[lang]}
                className="flex-1 border rounded-xl px-3 py-2"
              />
              <Button type="submit" className="ml-2 bg-[#4ba862] text-white rounded-xl px-3">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerResources;