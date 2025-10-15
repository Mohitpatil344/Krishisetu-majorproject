import React, { useState } from "react";
import {
  Search,
  Filter,
  Heart,
  MapPin,
  Package,
  TrendingUp,
  Users,
  ShoppingBag,
  Plus,
} from "lucide-react";
import CreateListingModal from "./CreateListingForm"; // Adjust path if needed

// Mock Data
const initialListings = [
  {
    id: 1,
    wasteType: "Organic Waste",
    location: "Mumbai",
    category: "organic",
    quantity: "500 kg",
    price: "15",
    image: "🌱",
  },
  {
    id: 2,
    wasteType: "Crop Residue",
    location: "Pune",
    category: "crop",
    quantity: "1000 kg",
    price: "20",
    image: "🌾",
  },
  {
    id: 3,
    wasteType: "Food Waste",
    location: "Delhi",
    category: "food",
    quantity: "300 kg",
    price: "12",
    image: "🥬",
  },
];

const orders = [
  {
    id: 1,
    wasteType: "Organic Waste",
    quantity: "200 kg",
    status: "Delivered",
    date: "2024-10-01",
  },
  {
    id: 2,
    wasteType: "Crop Residue",
    quantity: "500 kg",
    status: "In Transit",
    date: "2024-10-10",
  },
];

const buyers = [
  {
    id: 1,
    name: "Green Energy Corp",
    type: "Biogas Producer",
    location: "Mumbai",
    orders: 24,
  },
  {
    id: 2,
    name: "Organic Solutions",
    type: "Compost Manufacturer",
    location: "Pune",
    orders: 18,
  },
];

const priceHistory = {
  "Organic Waste": [
    { date: "Oct 1", price: 14 },
    { date: "Oct 5", price: 15 },
    { date: "Oct 10", price: 15 },
  ],
  "Crop Residue": [
    { date: "Oct 1", price: 18 },
    { date: "Oct 5", price: 19 },
    { date: "Oct 10", price: 20 },
  ],
};

const ListingCard = ({
  listing,
  userType,
  favorites,
  toggleFavorite,
  onSelect,
  onBid,
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="h-40 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-6xl">
      {listing.image}
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {listing.wasteType}
        </h3>
        <button
          onClick={() => toggleFavorite(listing.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Heart
            className={
              favorites.includes(listing.id) ? "fill-red-500 text-red-500" : ""
            }
            size={20}
          />
        </button>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={16} className="mr-2 text-green-600" />
          {listing.location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Package size={16} className="mr-2 text-green-600" />
          {listing.quantity}
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Price per kg</p>
          <p className="text-xl font-bold text-green-600">₹{listing.price}</p>
        </div>
        <button
          onClick={onBid}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Place Bid
        </button>
      </div>
    </div>
  </div>
);

const OrderCard = ({ order }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {order.wasteType}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{order.date}</p>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          order.status === "Delivered"
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {order.status}
      </span>
    </div>
    <div className="flex items-center text-gray-600">
      <Package size={18} className="mr-2 text-green-600" />
      <span className="font-medium">{order.quantity}</span>
    </div>
  </div>
);

const BuyerCard = ({ buyer }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
          <Users size={24} className="text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{buyer.name}</h3>
          <p className="text-sm text-gray-500">{buyer.type}</p>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <div className="flex items-center text-sm text-gray-600">
        <MapPin size={16} className="mr-2 text-green-600" />
        {buyer.location}
      </div>
      <div className="text-sm">
        <span className="font-semibold text-green-600">{buyer.orders}</span>
        <span className="text-gray-500 ml-1">orders</span>
      </div>
    </div>
  </div>
);

const Marketplaces = () => {
  const sections = ["Marketplace", "Orders", "Buyers", "Analytics"];
  const [activeSection, setActiveSection] = useState("Marketplace");
  const [userType, setUserType] = useState("farmer");
  const [selectedListing, setSelectedListing] = useState(null);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [listingItems, setListingItems] = useState(initialListings);

  const filteredListings = listingItems.filter((listing) => {
    const matchesSearch =
      listing.wasteType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || listing.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (listingId) => {
    setFavorites((prev) =>
      prev.includes(listingId)
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId]
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Marketplace":
        return (
          <>
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by waste type or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-6 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="organic">Organic</option>
                <option value="crop">Crop Residue</option>
                <option value="food">Food Waste</option>
              </select>
              <button
                onClick={() => setShowCreateListing(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Create Listing
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.length ? (
                filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    userType={userType}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    onSelect={() => setSelectedListing(listing)}
                    onBid={() => {
                      setSelectedListing(listing);
                      setShowBidModal(true);
                    }}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full py-12">
                  No listings found.
                </p>
              )}
            </div>
          </>
        );
      case "Orders":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        );
      case "Buyers":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buyers.map((buyer) => (
              <BuyerCard key={buyer.id} buyer={buyer} />
            ))}
          </div>
        );
      case "Analytics":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.keys(priceHistory).map((wasteType) => (
              <div
                key={wasteType}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center mb-6">
                  <TrendingUp className="text-green-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Price Trend - {wasteType}
                  </h3>
                </div>
                <div className="space-y-3">
                  {priceHistory[wasteType].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-sm text-gray-600">{item.date}</span>
                      <span className="text-lg font-semibold text-green-600">
                        ₹{item.price}/kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {showBidModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Place Bid</h3>
            <div className="mb-6">
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {selectedListing.wasteType}
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-2 text-green-600" />
                    {selectedListing.location}
                  </div>
                  <div className="flex items-center">
                    <Package size={14} className="mr-2 text-green-600" />
                    {selectedListing.quantity}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Bid (₹ per kg)
                  </label>
                  <input
                    type="number"
                    placeholder={`Current: ₹${selectedListing.price}`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBidModal(false);
                  setSelectedListing(null);
                }}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Bid placed successfully!");
                  setShowBidModal(false);
                  setSelectedListing(null);
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
              >
                Confirm Bid
              </button>
            </div>
          </div>
        </div>
      )}
      {showCreateListing && (
        <CreateListingModal
          onClose={() => setShowCreateListing(false)}
          onListingCreated={(newListing) => {
            setListingItems((prev) => [
              {
                id: Date.now(),
                image: "🆕",
                category: newListing.category || "organic",
                ...newListing,
              },
              ...prev,
            ]);
            setShowCreateListing(false);
          }}
        />
      )}

      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 mt-4">
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                activeSection === section
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {section}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 p-8 mt-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {activeSection}
            </h1>
            <p className="text-gray-600">
              {activeSection === "Marketplace" &&
                "Browse and bid on agricultural waste listings"}
              {activeSection === "Orders" &&
                "Track your order history and status"}
              {activeSection === "Buyers" && "Connect with verified buyers"}
              {activeSection === "Analytics" &&
                "Monitor price trends and market insights"}
            </p>
          </div>
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Marketplaces;
