const express = require('express');
const { authenticateToken, checkRole } = require('../middleware/auth');
const wasteController = require('../controllers/wasteController');

const router = express.Router();

// Core waste routes for farmers
router.post('/add', authenticateToken, checkRole(['farmer']), wasteController.addWaste);
router.put('/:id', authenticateToken, checkRole(['farmer']), wasteController.editWaste);
router.patch('/:id/sold', authenticateToken, checkRole(['farmer']), wasteController.markWasteSold);
router.get('/mine', authenticateToken, checkRole(['farmer']), wasteController.getMyWastes);

module.exports = router;
