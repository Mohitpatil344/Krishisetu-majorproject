// routes/equipmentRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, checkRole } = require('../middleware/auth');
const equipmentController = require('../controllers/equipmentController');

// PUBLIC ROUTES
router.get('/', equipmentController.getAllEquipment);

// PROTECTED ROUTES (Business only) - MUST come BEFORE /:id
router.get('/my-equipment', authenticateToken, checkRole(['business']), equipmentController.getMyEquipment);
router.get('/stats', authenticateToken, checkRole(['business', 'admin']), equipmentController.getEquipmentStats);

// WRITE OPERATIONS
router.post('/', authenticateToken, checkRole(['business']), equipmentController.addEquipment);
router.put('/:id', authenticateToken, checkRole(['business']), equipmentController.updateEquipment);
router.delete('/:id', authenticateToken, checkRole(['business']), equipmentController.deleteEquipment);

// SINGLE EQUIPMENT - MUST come LAST
router.get('/:id', equipmentController.getEquipmentById);

module.exports = router;