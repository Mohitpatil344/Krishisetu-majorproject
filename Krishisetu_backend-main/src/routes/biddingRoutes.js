
// src/routes/biddingRoutes.js
const express = require('express');
const router = express.Router();
const {
    createAuction,
    getAuctions,
    getAuctionById,
    placeBid,
    getAuctionBids,
    endAuction,
    getWinningBid
} = require('../controllers/biddingController');

// Auction management
router.post('/auctions', createAuction);
router.get('/auctions', getAuctions);
router.get('/auctions/:auctionId', getAuctionById);
router.patch('/auctions/:auctionId/end', endAuction);

// Bidding
router.post('/auctions/:auctionId/bids', placeBid);
router.get('/auctions/:auctionId/bids', getAuctionBids);
router.get('/auctions/:auctionId/winner', getWinningBid);

module.exports = router;