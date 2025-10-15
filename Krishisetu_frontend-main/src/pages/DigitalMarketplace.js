import React, { useState, useEffect } from 'react';
import { Clock, Gavel, TrendingUp, User, DollarSign, Trophy } from 'lucide-react';

export default function BiddingSystem() {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/api/bids';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    endTime: '',
    category: 'agricultural-waste'
  });

  const [bidData, setBidData] = useState({
    bidderId: '',
    bidderName: '',
    bidAmount: ''
  });

  useEffect(() => {
    fetchAuctions();
    const interval = setInterval(fetchAuctions, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await fetch(`${API_URL}/auctions`);
      if (!response.ok) throw new Error('Failed to fetch auctions');
      const data = await response.json();
      if (data.status === 'success') {
        // Handle both array and object responses
        const auctionData = Array.isArray(data.data) ? data.data : (data.data?.auctions || []);
        setAuctions(auctionData);
        setError('');
      }
    } catch (err) {
      console.error('Error fetching auctions:', err);
      setError('Failed to load auctions. Make sure backend is running on port 5000.');
    }
  };

  const fetchAuctionDetails = async (auctionId) => {
    try {
      const response = await fetch(`${API_URL}/auctions/${auctionId}`);
      if (!response.ok) throw new Error('Failed to fetch auction details');
      const data = await response.json();
      if (data.status === 'success') {
        setSelectedAuction(data.data);
      }

      const bidsResponse = await fetch(`${API_URL}/auctions/${auctionId}/bids`);
      if (bidsResponse.ok) {
        const bidsData = await bidsResponse.json();
        if (bidsData.status === 'success') {
          // Handle both array and object with allBids property
          const bidList = Array.isArray(bidsData.data) ? bidsData.data : (bidsData.data?.allBids || []);
          setBidHistory(bidList);
        }
      }
    } catch (err) {
      console.error('Error fetching auction details:', err);
      setError('Failed to load auction details.');
    }
  };

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.startingPrice || !formData.endTime) {
      setError('Please fill all required fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/auctions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          startingPrice: parseFloat(formData.startingPrice),
          endTime: new Date(formData.endTime).toISOString(),
          category: formData.category
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setFormData({
          title: '',
          description: '',
          startingPrice: '',
          endTime: '',
          category: 'agricultural-waste'
        });
        setShowCreateForm(false);
        fetchAuctions();
        setError('');
      } else {
        setError(data.message || 'Error creating auction');
      }
    } catch (err) {
      setError('Error creating auction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!selectedAuction || !bidData.bidderId || !bidData.bidderName || !bidData.bidAmount) {
      setError('Please fill all fields');
      return;
    }

    const bidAmount = parseFloat(bidData.bidAmount);
    if (bidAmount <= selectedAuction.currentPrice) {
      setError(`Bid must be greater than ₹${selectedAuction.currentPrice}`);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/auctions/${selectedAuction.id}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bidderId: bidData.bidderId,
          bidderName: bidData.bidderName,
          bidAmount: bidAmount
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setBidData({ bidderId: '', bidderName: '', bidAmount: '' });
        fetchAuctionDetails(selectedAuction.id);
        fetchAuctions();
        setError('');
      } else {
        setError(`Error: ${data.message}`);
      }
    } catch (err) {
      setError('Error placing bid: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEndAuction = async () => {
    if (!selectedAuction) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/auctions/${selectedAuction.id}/end`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchAuctionDetails(selectedAuction.id);
        fetchAuctions();
        setError('');
      } else {
        setError(data.message || 'Error ending auction');
      }
    } catch (err) {
      setError('Error ending auction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = Math.max(0, Math.ceil((end - now) / 1000));

    if (diff === 0) return 'Ended';
    const hours = Math.floor(diff / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    const secs = diff % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 mt-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Gavel className="w-10 h-10 text-green-600" />
              <h1 className="text-4xl font-bold text-gray-900">Agricultural Auction Marketplace</h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              + Create Auction
            </button>
          </div>
          <p className="text-gray-600">Real-time bidding for agricultural waste and equipment</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Create Auction Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Create New Auction</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Auction title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Description"
                    rows="2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.startingPrice}
                      onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                    <input
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCreateAuction}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Auctions List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                <h2 className="text-2xl font-bold text-gray-900">Active Auctions</h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {auctions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No auctions available</div>
                ) : (
                  auctions.map((auction) => (
                    <div
                      key={auction.id}
                      onClick={() => {
                        setSelectedAuction(auction);
                        fetchAuctionDetails(auction.id);
                      }}
                      className={`p-6 cursor-pointer transition hover:bg-green-50 border-l-4 ${selectedAuction?.id === auction.id ? 'border-green-500 bg-green-50' : 'border-transparent'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{auction.title}</h3>
                          <p className="text-sm text-gray-600">{auction.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${auction.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {auction.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-xs text-gray-600">Current</p>
                            <p className="font-bold text-gray-900">₹{auction.currentPrice.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-600">Bids</p>
                            <p className="font-bold text-gray-900">{auction.totalBids}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="text-xs text-gray-600">Time</p>
                            <p className="font-bold text-gray-900 text-sm">{getTimeRemaining(auction.endTime)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Auction Details & Bid Form */}
          <div className="lg:col-span-1 space-y-6">
            {selectedAuction ? (
              <>
                {/* Auction Summary */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Auction Details</h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Current Price</p>
                      <p className="text-3xl font-bold text-green-600">₹{selectedAuction.currentPrice.toFixed(2)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Starting</p>
                        <p className="font-bold text-gray-900">₹{selectedAuction.startingPrice.toFixed(2)}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Total Bids</p>
                        <p className="font-bold text-gray-900">{selectedAuction.totalBids}</p>
                      </div>
                    </div>
                    {selectedAuction.highestBidder && (
                      <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600">Leading Bidder</p>
                          <p className="font-bold text-gray-900">{selectedAuction.highestBidder.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bid Form */}
                {selectedAuction.status === 'active' && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Place a Bid</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                        <input
                          type="text"
                          value={bidData.bidderName}
                          onChange={(e) => setBidData({ ...bidData, bidderName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bidder ID *</label>
                        <input
                          type="text"
                          value={bidData.bidderId}
                          onChange={(e) => setBidData({ ...bidData, bidderId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                          placeholder="Your ID"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bid Amount (₹) *</label>
                        <input
                          type="number"
                          step="0.01"
                          min={selectedAuction.currentPrice + 0.01}
                          value={bidData.bidAmount}
                          onChange={(e) => setBidData({ ...bidData, bidAmount: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                          placeholder={`Min: ₹${(selectedAuction.currentPrice + 0.01).toFixed(2)}`}
                        />
                        <p className="text-xs text-gray-600 mt-1">Must be greater than ₹{selectedAuction.currentPrice.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={handlePlaceBid}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Gavel className="w-5 h-5" />
                        {loading ? 'Placing Bid...' : 'Place Bid'}
                      </button>
                    </div>
                  </div>
                )}

                {/* End Auction Button */}
                {selectedAuction.status === 'active' && (
                  <button
                    onClick={handleEndAuction}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    End Auction
                  </button>
                )}

                {/* Winner Card */}
                {selectedAuction.status === 'ended' && bidHistory.length > 0 && (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-yellow-300">
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                      <h3 className="text-lg font-bold text-gray-900">Auction Won!</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Winner: {bidHistory[bidHistory.length - 1]?.bidderName}</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        ₹{bidHistory[bidHistory.length - 1]?.bidAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
                <Gavel className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Select an auction to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Bid History */}
        {selectedAuction && bidHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <h2 className="text-2xl font-bold text-gray-900">Bid History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Bidder</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Bid Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[...bidHistory].reverse().map((bid, idx) => (
                    <tr key={bid.id} className={idx === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{bid.bidderName}</td>
                      <td className="px-6 py-4 text-sm font-bold text-green-600">₹{bid.bidAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(bid.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}