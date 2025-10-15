import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Tag,
  Clock,
  Shield,
  Star,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Info,
} from "lucide-react";

const Rentaldetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("daily");

  const equipment = location.state || {};

  const {
    image = "https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg",
    name = "Equipment Name",
    details = "Equipment details",
    price = "500",
    location: equipmentLocation = "Not specified",
    brand = "Premium Brand",
    distance = "5.2 km",
    availableFrom = "Today",
    availableTo = "Dec 31, 2025",
    leaseDuration = "Daily",
  } = equipment;

  const priceOptions = [
    { id: "daily", label: "Daily", price: price, duration: "per day" },
    {
      id: "weekly",
      label: "Weekly",
      price: (parseInt(price) * 7).toString(),
      duration: "per week",
    },
    {
      id: "monthly",
      label: "Monthly",
      price: (parseInt(price) * 30).toString(),
      duration: "per month",
    },
  ];

  const features = [
    { icon: Shield, label: "Verified Equipment", desc: "Quality checked" },
    { icon: Clock, label: "Flexible Hours", desc: "24/7 support" },
    { icon: Star, label: "Top Rated", desc: "4.8/5 rating" },
    { icon: CheckCircle2, label: "Insured", desc: "Full coverage" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-green-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Listings</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image & Details */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="relative h-96 lg:h-[500px]">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Favorite & Share */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite
                          ? "fill-red-500 text-red-500"
                          : "text-gray-700"
                      }`}
                    />
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg">
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Availability Badge */}
                <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Available Now
                </div>

                {/* Name & Brand */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                    {name}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90">
                    <Tag className="w-4 h-4" />
                    <span className="font-medium">{brand}</span>
                  </div>
                </div>
              </div>

              {/* About Equipment */}
              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About This Equipment
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {details}
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100 hover:shadow-md transition-shadow"
                    >
                      <feature.icon className="w-8 h-8 text-green-600 mb-2" />
                      <div className="text-sm font-semibold text-gray-900">
                        {feature.label}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {feature.desc}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rental Terms */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Rental Terms
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          Valid ID and security deposit required
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          Free delivery within 10 km radius
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          24-hour cancellation policy applies
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          Technical support included during rental period
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Location Details
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">
                      Equipment Location
                    </div>
                    <div className="text-gray-600">{equipmentLocation}</div>
                  </div>
                </div>

                {/* <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Navigation className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">
                      Distance from You
                    </div>
                    <div className="text-gray-600">{distance} away</div>
                  </div>
                </div>

                <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </button> */}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-6">
              {/* Price */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">Rental Price</div>
                <div className="flex items-baseline gap-2">
                  <IndianRupee className="w-7 h-7 text-green-600" />
                  <span className="text-4xl font-bold text-gray-900">
                    {
                      priceOptions.find((p) => p.id === selectedDuration)?.price
                    }
                  </span>
                  <span className="text-gray-600">
                    /{
                      priceOptions.find((p) => p.id === selectedDuration)
                        ?.duration
                    }
                  </span>
                </div>
              </div>

              {/* Select Duration */}
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-900 mb-3">
                  Select Duration
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {priceOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedDuration(option.id)}
                      className={`py-2 px-3 rounded-xl font-medium text-sm transition-all ${
                        selectedDuration === option.id
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                  <Calendar className="w-4 h-4 text-green-600" />
                  Availability Period
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available from:</span>
                    <span className="font-medium text-gray-900">{availableFrom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available until:</span>
                    <span className="font-medium text-gray-900">{availableTo}</span>
                  </div>
                </div>
              </div>

              {/* Book & Contact */}
              <div className="space-y-3">
                  <button
                    onClick={() =>
                        navigate("/booking", {
                        state: {
                            equipment,
                            selectedDuration,
                            pricePerDay: parseInt(price),
                        },
                        })
                    }
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
                    >
                    <CheckCircle2 className="w-5 h-5" />
                    Book Now
                    </button>


                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-blue-50 text-blue-700 py-3 px-4 rounded-xl font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button className="bg-green-50 text-green-700 py-3 px-4 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                </div>
              </div>

              {/* Secure Payment */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  Secure Payment & Verified Owner
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rentaldetails;
