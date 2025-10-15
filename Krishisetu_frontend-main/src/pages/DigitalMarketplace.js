import React, { useState } from 'react';
import { Package, TrendingUp, MessageSquare, FileText, MapPin, Calendar, Eye, Heart, Search, Building2, CheckCircle, Clock, Truck, XCircle, Bell, Menu, X } from 'lucide-react';

const mockWasteListings = [
  {
    id: 1,
    farmerId: 'F001',
    farmerName: 'Rajesh Kumar',
    wasteType: 'Rice Straw',
    category: 'Crop Residue',
    quantity: 500,
    unit: 'kg',
    qualityGrade: 'A',
    location: 'Bangalore Rural, Karnataka',
    address: '123 Farm Road',
    pincode: '562157',
    availableFrom: '2024-03-20',
    wasteAge: '2 weeks',
    storageType: 'Covered Shed',
    storageCondition: 'Dry, Protected from rain',
    price: 2000,
    pricePerKg: 4,
    description: 'High-quality rice straw available for bulk purchase. Ideal for biomass energy production.',
    images: ['https://via.placeholder.com/400x300?text=Rice+Straw'],
    status: 'available',
    postedDate: '2024-03-15',
    views: 45,
    favorites: 8
  },
  {
    id: 2,
    farmerId: 'F002',
    farmerName: 'Priya Sharma',
    wasteType: 'Wheat Husk',
    category: 'Husk',
    quantity: 1000,
    unit: 'kg',
    qualityGrade: 'B+',
    location: 'Mysore, Karnataka',
    address: '456 Village Road',
    pincode: '571101',
    availableFrom: '2024-03-25',
    wasteAge: '1 week',
    storageType: 'Open Yard',
    storageCondition: 'Partially covered',
    price: 1500,
    pricePerKg: 1.5,
    description: 'Fresh wheat husk, suitable for composting and animal bedding.',
    images: ['https://via.placeholder.com/400x300?text=Wheat+Husk'],
    status: 'available',
    postedDate: '2024-03-18',
    views: 32,
    favorites: 5
  },
  {
    id: 3,
    farmerId: 'F003',
    farmerName: 'Amit Patel',
    wasteType: 'Corn Stover',
    category: 'Crop Residue',
    quantity: 750,
    unit: 'kg',
    qualityGrade: 'A-',
    location: 'Hubli, Karnataka',
    address: '789 Agricultural Zone',
    pincode: '580020',
    availableFrom: '2024-03-22',
    wasteAge: '10 days',
    storageType: 'Warehouse',
    storageCondition: 'Climate controlled',
    price: 2100,
    pricePerKg: 2.8,
    description: 'Premium corn stover for industrial composting and biofuel production.',
    images: ['https://via.placeholder.com/400x300?text=Corn+Stover'],
    status: 'available',
    postedDate: '2024-03-16',
    views: 28,
    favorites: 6
  }
];

const mockBuyers = [
  {
    id: 'B001',
    companyName: 'Green Energy Biofuels Pvt Ltd',
    type: 'Biofuel Plant',
    wasteTypesNeeded: ['Rice Straw', 'Wheat Husk', 'Corn Stover'],
    minOrderQty: 500,
    maxCapacity: 10000,
    processingCapabilities: ['Biofuel Production', 'Pellet Manufacturing'],
    location: 'Bangalore, Karnataka',
    certifications: ['ISO 9001', 'ISO 14001'],
    rating: 4.5,
    totalOrders: 45
  },
  {
    id: 'B002',
    companyName: 'EcoCompost Industries',
    type: 'Composting Facility',
    wasteTypesNeeded: ['Wheat Husk', 'Rice Straw', 'Organic Waste'],
    minOrderQty: 300,
    maxCapacity: 5000,
    processingCapabilities: ['Organic Composting', 'Vermicomposting'],
    location: 'Mysore, Karnataka',
    certifications: ['ISO 9001', 'Organic Certified'],
    rating: 4.3,
    totalOrders: 32
  }
];

const mockOrders = [
  {
    id: 'ORD001',
    listingId: 1,
    buyerId: 'B001',
    buyerName: 'Green Energy Biofuels',
    wasteType: 'Rice Straw',
    quantity: 500,
    price: 2000,
    status: 'in_transit',
    orderDate: '2024-03-20',
    estimatedDelivery: '2024-03-25',
    paymentTerms: 'Net 30',
    contractGenerated: true
  },
  {
    id: 'ORD002',
    listingId: 2,
    buyerId: 'B002',
    buyerName: 'EcoCompost Industries',
    wasteType: 'Wheat Husk',
    quantity: 300,
    price: 450,
    status: 'confirmed',
    orderDate: '2024-03-21',
    estimatedDelivery: '2024-03-27',
    paymentTerms: 'On Delivery',
    contractGenerated: true
  }
];

const priceHistory = {
  'Rice Straw': [
    { date: '2024-01', price: 3.5 },
    { date: '2024-02', price: 3.8 },
    { date: '2024-03', price: 4.0 }
  ],
  'Wheat Husk': [
    { date: '2024-01', price: 1.2 },
    { date: '2024-02', price: 1.4 },
    { date: '2024-03', price: 1.5 }
  ]
};

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [userType, setUserType] = useState('farmer');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);

  const [newListing, setNewListing] = useState({
    wasteType: '',
    category: 'Crop Residue',
    quantity: '',
    unit: 'kg',
    qualityGrade: 'A',
    wasteAge: '',
    storageType: 'Covered Shed',
    storageCondition: '',
    price: '',
    description: ''
  });

  const [bidData, setBidData] = useState({
    quantity: '',
    bidPrice: '',
    paymentTerms: 'Net 30',
    deliveryDate: '',
    notes: ''
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800'
  };

  const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    in_transit: Truck,
    delivered: Package
  };

  const filteredListings = mockWasteListings.filter(listing => {
    const matchesSearch = listing.wasteType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || listing.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (listingId) => {
    setFavorites(prev =>
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const handleCreateListing = () => {
    setShowCreateListing(false);
  };

  const handleSubmitBid = () => {
    setShowBidModal(false);
    setSelectedListing(null);
  };

  const ListingCard = ({ listing }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-200">
        <img src={listing.images[0]} alt={listing.wasteType} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-medium text-green-700">
          ₹{listing.pricePerKg}/kg
        </div>
        <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          {listing.qualityGrade} Grade
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{listing.wasteType}</h3>
          <button
            onClick={() => toggleFavorite(listing.id)}
            className={`transition-colors ${favorites.includes(listing.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Heart className={`w-5 h-5 ${favorites.includes(listing.id) ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="text-sm text-gray-600 mb-3 space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-green-600" />
            <span>{listing.quantity} {listing.unit}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-600" />
            <span>Available from {listing.availableFrom}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {listing.views} views
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {listing.favorites} favorites
          </div>
        </div>

        <div className="border-t pt-3 mt-3">
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{listing.description}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedListing(listing)}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              View Details
            </button>
            {userType === 'buyer' && (
              <button
                onClick={() => {
                  setSelectedListing(listing);
                  setShowBidModal(true);
                }}
                className="flex-1 border border-green-600 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
              >
                Place Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const OrderCard = ({ order }) => {
    const StatusIcon = statusIcons[order.status];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-sm text-gray-500">Order #{order.id}</div>
            <h3 className="text-lg font-semibold text-gray-800">{order.wasteType}</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
            <div className="flex items-center gap-1">
              <StatusIcon className="w-3 h-3" />
              {order.status.replace('_', ' ').toUpperCase()}
            </div>
          </span>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Buyer:</span>
            <span className="font-medium">{order.buyerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-medium">{order.quantity} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Price:</span>
            <span className="font-medium text-green-600">₹{order.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order Date:</span>
            <span className="font-medium">{order.orderDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Est. Delivery:</span>
            <span className="font-medium">{order.estimatedDelivery}</span>
          </div>
        </div>

        <div className="border-t pt-3 flex gap-2">
          <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            View Details
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <MessageSquare className="w-4 h-4" />
          </button>
          {order.contractGenerated && (
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
          

            <div className="flex items-center gap-3">
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="farmer">Farmer View</option>
                <option value="buyer">Buyer View</option>
              </select>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'marketplace'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'orders'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('buyers')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'buyers'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Buyers
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Price Analytics
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
{activeTab === 'marketplace' && (
  <>
    {/* Search & Filters */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by waste type or location..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter & Create Listing */}
        <div className="flex flex-wrap gap-2">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Crop Residue">Crop Residue</option>
            <option value="Husk">Husk</option>
            <option value="Straw">Straw</option>
          </select>

          {userType === 'farmer' && (
            <button
              onClick={() => setShowCreateListing(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              + Create Listing
            </button>
          )}
        </div>
      </div>
    </div>

    {/* Create Listing Form */}
    {showCreateListing && (
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Create Waste Listing</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Waste Type', type: 'text', placeholder: 'e.g., Rice Straw', field: 'wasteType' },
            { label: 'Quantity', type: 'number', placeholder: '500', field: 'quantity' },
            { label: 'Price per kg', type: 'number', placeholder: '4', field: 'price' },
          ].map((input) => (
            <div key={input.field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{input.label}</label>
              <input
                type={input.type}
                placeholder={input.placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                value={newListing[input.field]}
                onChange={(e) =>
                  setNewListing({ ...newListing, [input.field]: e.target.value })
                }
              />
            </div>
          ))}

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              value={newListing.category}
              onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
            >
              <option>Crop Residue</option>
              <option>Husk</option>
              <option>Straw</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows="3"
              placeholder="Provide details..."
              value={newListing.description}
              onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
            />
          </div>

          {/* Optional: Total Price Preview */}
          {newListing.quantity && newListing.price && (
            <div className="md:col-span-2 text-right text-gray-700 font-medium">
              Total Price: ₹{newListing.quantity * newListing.price}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCreateListing}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
          >
            Create Listing
          </button>
          <button
            onClick={() => setShowCreateListing(false)}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    )}

    {/* Listings Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredListings.length ? (
        filteredListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)
      ) : (
        <p className="text-center text-gray-500 col-span-full">No listings found.</p>
      )}
    </div>
  </>
)}


        {activeTab === 'orders' && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Management</h2>
              <p className="text-gray-600">Track and manage your orders</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </>
        )}

        {activeTab === 'buyers' && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Registered Buyers</h2>
              <p className="text-gray-600">Connect with verified buyers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockBuyers.map(buyer => (
                <div key={buyer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{buyer.companyName}</h3>
                      <div className="text-sm text-gray-600 mb-2">{buyer.type}</div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(Math.floor(buyer.rating))}
                        </div>
                        <span className="text-sm text-gray-600">({buyer.totalOrders} orders)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <span className="ml-2 font-medium">{buyer.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Min Order:</span>
                      <span className="ml-2 font-medium">{buyer.minOrderQty} kg</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">Waste Types Needed:</div>
                    <div className="flex flex-wrap gap-2">
                      {buyer.wasteTypesNeeded.map((type, index) => (
                        <span key={index} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Price Analytics</h2>
              <p className="text-gray-600">Track market rates and price trends</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.keys(priceHistory).map(wasteType => (
                <div key={wasteType} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Price Trend - {wasteType}</h3>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>

                  <div className="space-y-2">
                    {priceHistory[wasteType].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.date}</span>
                        <span className="text-sm font-medium text-green-600">₹{item.price}/kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {selectedListing && !showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">{selectedListing.wasteType}</h2>
              <button onClick={() => setSelectedListing(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedListing.images[0]}
                    alt={selectedListing.wasteType}
                    className="w-full h-64 object-cover rounded-lg"
                  />

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Total Quantity</div>
                      <div className="text-2xl font-bold text-gray-800">{selectedListing.quantity} {selectedListing.unit}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Price per kg</div>
                      <div className="text-2xl font-bold text-green-600">₹{selectedListing.pricePerKg}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Listing Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Farmer:</span>
                        <span className="font-medium">{selectedListing.farmerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{selectedListing.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quality Grade:</span>
                        <span className="font-medium">{selectedListing.qualityGrade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Waste Age:</span>
                        <span className="font-medium">{selectedListing.wasteAge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Storage Type:</span>
                        <span className="font-medium">{selectedListing.storageType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available From:</span>
                        <span className="font-medium">{selectedListing.availableFrom}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">{selectedListing.address}</p>
                      <p className="text-gray-700">{selectedListing.location}</p>
                      <p className="text-gray-700">PIN: {selectedListing.pincode}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedListing.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Storage Condition</h3>
                    <p className="text-gray-700">{selectedListing.storageCondition}</p>
                  </div>

                  {userType === 'buyer' && (
                    <div className="pt-4 border-t">
                      <button
                        onClick={() => setShowBidModal(true)}
                        className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
                      >
                        Place Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBidModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Place Order</h2>
              <button onClick={() => setShowBidModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{selectedListing.wasteType}</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available: {selectedListing.quantity} kg</span>
                  <span className="text-green-600 font-medium">₹{selectedListing.pricePerKg}/kg</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Quantity (kg)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Enter quantity"
                    value={bidData.quantity}
                    onChange={(e) => setBidData({...bidData, quantity: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bid Price per kg (₹)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your bid"
                    value={bidData.bidPrice}
                    onChange={(e) => setBidData({...bidData, bidPrice: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    value={bidData.paymentTerms}
                    onChange={(e) => setBidData({...bidData, paymentTerms: e.target.value})}
                  >
                    <option value="Net 30">Net 30</option>
                    <option value="Net 15">Net 15</option>
                    <option value="On Delivery">On Delivery</option>
                    <option value="Advance Payment">Advance Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Delivery Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    value={bidData.deliveryDate}
                    onChange={(e) => setBidData({...bidData, deliveryDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="Any special requirements or notes..."
                    value={bidData.notes}
                    onChange={(e) => setBidData({...bidData, notes: e.target.value})}
                  />
                </div>

                {bidData.quantity && bidData.bidPrice && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Estimated Total:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{(parseFloat(bidData.quantity) * parseFloat(bidData.bidPrice)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmitBid}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
                >
                  Submit Order
                </button>
                <button
                  onClick={() => setShowBidModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
