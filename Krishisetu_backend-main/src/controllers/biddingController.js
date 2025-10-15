

// src/controllers/biddingController.js
const { v4: uuidv4 } = require('uuid');

// In-memory storage
const auctions = new Map();
const bids = new Map();

// Create a new auction
const createAuction = (req, res) => {
    try {
        const { title, description, startingPrice, endTime, category } = req.body;

        if (!title || !startingPrice || !endTime) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: title, startingPrice, endTime'
            });
        }

        const auctionId = uuidv4();
        const auction = {
            id: auctionId,
            title,
            description: description || '',
            startingPrice: parseFloat(startingPrice),
            currentPrice: parseFloat(startingPrice),
            endTime: new Date(endTime),
            category: category || 'general',
            status: 'active',
            createdAt: new Date(),
            totalBids: 0,
            highestBidder: null
        };

        auctions.set(auctionId, auction);
        bids.set(auctionId, []);

        res.status(201).json({
            status: 'success',
            message: 'Auction created successfully',
            data: auction
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get all auctions
const getAuctions = (req, res) => {
    try {
        const allAuctions = Array.from(auctions.values());
        const activeAuctions = allAuctions.filter(a => a.status === 'active');
        const endedAuctions = allAuctions.filter(a => a.status === 'ended');

        res.status(200).json({
            status: 'success',
            data: {
                total: allAuctions.length,
                active: activeAuctions.length,
                ended: endedAuctions.length,
                auctions: allAuctions.map(auction => ({
                    ...auction,
                    timeRemaining: auction.endTime > new Date() ?
                        Math.ceil((auction.endTime - new Date()) / 1000) : 0
                }))
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get specific auction
const getAuctionById = (req, res) => {
    try {
        const { auctionId } = req.params;
        const auction = auctions.get(auctionId);

        if (!auction) {
            return res.status(404).json({
                status: 'error',
                message: 'Auction not found'
            });
        }

        const auctionBids = bids.get(auctionId) || [];

        res.status(200).json({
            status: 'success',
            data: {
                ...auction,
                timeRemaining: auction.endTime > new Date() ?
                    Math.ceil((auction.endTime - new Date()) / 1000) : 0,
                totalBids: auctionBids.length,
                bidsDetails: auctionBids.slice(-5) // Last 5 bids
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Place a bid
const placeBid = (req, res) => {
    try {
        const { auctionId } = req.params;
        const { bidderId, bidderName, bidAmount } = req.body;

        if (!bidAmount || !bidderId || !bidderName) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: bidderId, bidderName, bidAmount'
            });
        }

        const auction = auctions.get(auctionId);

        if (!auction) {
            return res.status(404).json({
                status: 'error',
                message: 'Auction not found'
            });
        }

        if (auction.status === 'ended') {
            return res.status(400).json({
                status: 'error',
                message: 'Auction has ended'
            });
        }

        if (new Date() > auction.endTime) {
            auction.status = 'ended';
            return res.status(400).json({
                status: 'error',
                message: 'Auction time has expired'
            });
        }

        const bidAmountNum = parseFloat(bidAmount);

        if (bidAmountNum <= auction.currentPrice) {
            return res.status(400).json({
                status: 'error',
                message: `Bid amount must be greater than current price: ${auction.currentPrice}`,
                currentPrice: auction.currentPrice
            });
        }

        const bid = {
            id: uuidv4(),
            auctionId,
            bidderId,
            bidderName,
            bidAmount: bidAmountNum,
            timestamp: new Date(),
            isWinning: true
        };

        const auctionBids = bids.get(auctionId) || [];
        auctionBids.push(bid);
        bids.set(auctionId, auctionBids);

        // Update auction
        auction.currentPrice = bidAmountNum;
        auction.highestBidder = {
            id: bidderId,
            name: bidderName
        };
        auction.totalBids = auctionBids.length;

        res.status(201).json({
            status: 'success',
            message: 'Bid placed successfully',
            data: {
                bid,
                auctionUpdate: {
                    currentPrice: auction.currentPrice,
                    highestBidder: auction.highestBidder,
                    totalBids: auction.totalBids
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get all bids for an auction
const getAuctionBids = (req, res) => {
    try {
        const { auctionId } = req.params;
        const auction = auctions.get(auctionId);

        if (!auction) {
            return res.status(404).json({
                status: 'error',
                message: 'Auction not found'
            });
        }

        const auctionBids = bids.get(auctionId) || [];
        const sortedBids = auctionBids.sort((a, b) => b.bidAmount - a.bidAmount);

        res.status(200).json({
            status: 'success',
            data: {
                auctionId,
                totalBids: sortedBids.length,
                highestBid: sortedBids[0] || null,
                allBids: sortedBids
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get winning bid
const getWinningBid = (req, res) => {
    try {
        const { auctionId } = req.params;
        const auction = auctions.get(auctionId);

        if (!auction) {
            return res.status(404).json({
                status: 'error',
                message: 'Auction not found'
            });
        }

        const auctionBids = bids.get(auctionId) || [];
        const winningBid = auctionBids.reduce((max, bid) =>
            bid.bidAmount > (max?.bidAmount || 0) ? bid : max, null
        );

        res.status(200).json({
            status: 'success',
            data: {
                auctionId,
                auctionTitle: auction.title,
                auctionStatus: auction.status,
                winningBid: winningBid ? {
                    ...winningBid,
                    bidderDetails: {
                        id: winningBid.bidderId,
                        name: winningBid.bidderName
                    }
                } : null,
                auctionDetails: {
                    startingPrice: auction.startingPrice,
                    finalPrice: auction.currentPrice,
                    totalBids: auctionBids.length
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// End auction manually
const endAuction = (req, res) => {
    try {
        const { auctionId } = req.params;
        const auction = auctions.get(auctionId);

        if (!auction) {
            return res.status(404).json({
                status: 'error',
                message: 'Auction not found'
            });
        }

        auction.status = 'ended';
        const winningBid = bids.get(auctionId)?.reduce((max, bid) =>
            bid.bidAmount > (max?.bidAmount || 0) ? bid : max, null
        );

        res.status(200).json({
            status: 'success',
            message: 'Auction ended successfully',
            data: {
                auctionId,
                status: auction.status,
                winningBid,
                finalPrice: auction.currentPrice
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = {
    createAuction,
    getAuctions,
    getAuctionById,
    placeBid,
    getAuctionBids,
    endAuction,
    getWinningBid
};