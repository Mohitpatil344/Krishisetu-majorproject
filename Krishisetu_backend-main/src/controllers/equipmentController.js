// controllers/equipmentController.js
const Equipment = require('../db/models/Equipment');

const equipmentController = {
  // Get all equipment (public)
  getAllEquipment: async (req, res) => {
    try {
      const { availability, location, leaseDuration, search } = req.query;
      let query = {};

      if (availability) query.availability = availability;
      if (location) query.location = new RegExp(location, 'i');
      if (leaseDuration) query.leaseDuration = leaseDuration;
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { details: new RegExp(search, 'i') },
          { brand: new RegExp(search, 'i') }
        ];
      }

      const equipment = await Equipment.find(query).sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        data: { equipment },
        count: equipment.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch equipment',
        error: error.message
      });
    }
  },

  // Get single equipment by ID (public)
  getEquipmentById: async (req, res) => {
    try {
      const equipment = await Equipment.findById(req.params.id);
      
      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: 'Equipment not found'
        });
      }

      res.status(200).json({
        success: true,
        data: { equipment }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch equipment',
        error: error.message
      });
    }
  },

  // Get business's own equipment (business only)
  getMyEquipment: async (req, res) => {
    try {
      const equipment = await Equipment.find({ 
        businessId: req.user.id 
      }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: { equipment },
        count: equipment.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch your equipment',
        error: error.message
      });
    }
  },

  // Add new equipment (business only)
  addEquipment: async (req, res) => {
    try {
      const { name, price, leaseDuration, details, brand, location, image, availability, availableFrom, availableTo } = req.body;

      // Validate required fields
      if (!name || !price || !leaseDuration) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: name, price, leaseDuration'
        });
      }

      // Validate leaseDuration enum
      const validDurations = ['Hourly', 'Daily', 'Weekly', 'Monthly'];
      if (!validDurations.includes(leaseDuration)) {
        return res.status(400).json({
          success: false,
          message: `Invalid leaseDuration. Must be one of: ${validDurations.join(', ')}`
        });
      }

      // Create new equipment
      const equipment = new Equipment({
        businessId: req.user.id,
        businessName: req.user.businessName || req.user.name,
        businessLocation: req.user.businessLocation || req.user.location,
        businessPhone: req.user.businessPhone || req.user.phone,
        name,
        price: Number(price),
        leaseDuration,
        details,
        brand,
        location,
        image: image || 'https://images.unsplash.com/photo-1581093588401-22b8d2f94d1f',
        availability: availability || 'Available',
        availableFrom: availableFrom ? new Date(availableFrom) : undefined,
        availableTo: availableTo ? new Date(availableTo) : undefined
      });

      await equipment.save();

      res.status(201).json({
        success: true,
        message: 'Equipment added successfully',
        data: { equipment }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to add equipment',
        error: error.message
      });
    }
  },

  // Update equipment (business owner only)
  updateEquipment: async (req, res) => {
    try {
      const equipment = await Equipment.findById(req.params.id);

      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: 'Equipment not found'
        });
      }

      // Check if user is the equipment owner
      if (equipment.businessId.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update this equipment'
        });
      }

      // Update allowed fields
      const allowedFields = ['name', 'price', 'leaseDuration', 'details', 'brand', 'location', 'image', 'availability', 'availableFrom', 'availableTo'];
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          if (field === 'price') {
            equipment[field] = Number(req.body[field]);
          } else if (field === 'availableFrom' || field === 'availableTo') {
            equipment[field] = req.body[field] ? new Date(req.body[field]) : undefined;
          } else {
            equipment[field] = req.body[field];
          }
        }
      });

      equipment.updatedAt = new Date();
      await equipment.save();

      res.status(200).json({
        success: true,
        message: 'Equipment updated successfully',
        data: { equipment }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to update equipment',
        error: error.message
      });
    }
  },

  // Delete equipment (business owner only)
  deleteEquipment: async (req, res) => {
    try {
      const equipment = await Equipment.findById(req.params.id);

      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: 'Equipment not found'
        });
      }

      // Check if user is the equipment owner
      if (equipment.businessId.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this equipment'
        });
      }

      await Equipment.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Equipment deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete equipment',
        error: error.message
      });
    }
  },

  // Get equipment stats (business/admin only)
  getEquipmentStats: async (req, res) => {
    try {
      let query = {};
      
      // If business user, only get their stats
      if (req.user.role === 'business') {
        query.businessId = req.user.id;
      }

      const totalEquipment = await Equipment.countDocuments(query);
      const availableEquipment = await Equipment.countDocuments({ ...query, availability: 'Available' });
      const totalValue = await Equipment.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalEquipment,
          availableEquipment,
          unavailableEquipment: totalEquipment - availableEquipment,
          totalValue: totalValue[0]?.total || 0
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  }
};

module.exports = equipmentController;
