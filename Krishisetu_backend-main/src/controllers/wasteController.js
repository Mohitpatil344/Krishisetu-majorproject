const Waste = require('../db/models/Waste');
const User = require('../db/models/User');

// Add new waste (farmer only)
const addWaste = async (req, res) => {
  try {
    const {
      cropType,
      wasteType,
      quantity,
      unit,
      price,
      availableFrom,
      location,
      images,
      description
    } = req.body;

    if (req.user.role !== 'farmer') {
      return res.status(403).json({ success: false, message: 'Only farmers can add waste' });
    }

    const ownerId = req.user.id;
    const waste = await Waste.create({
      owner: ownerId,
      cropType,
      wasteType,
      quantity,
      unit,
      price,
      availableFrom,
      location,
      images,
      description
    });

    // Push waste into farmer's myWastes array
    await User.findByIdAndUpdate(ownerId, { $push: { myWastes: waste._id } });

    res.status(201).json({ success: true, data: { waste } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Edit existing waste (owner only)
const editWaste = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const waste = await Waste.findById(id);
    if (!waste) return res.status(404).json({ success: false, message: 'Waste not found' });

    if (waste.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this waste' });
    }

    const allowedFields = ['cropType', 'wasteType', 'quantity', 'unit', 'price', 'availableFrom', 'location', 'images', 'description', 'status'];
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        waste[key] = updates[key];
      }
    }
    await waste.save();

    res.status(200).json({ success: true, data: { waste } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Mark waste as sold (owner only)
const markWasteSold = async (req, res) => {
  try {
    const { id } = req.params;
    const waste = await Waste.findById(id);
    if (!waste) return res.status(404).json({ success: false, message: 'Waste not found' });

    if (waste.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this waste' });
    }

    waste.status = 'sold';
    await waste.save();

    res.status(200).json({ success: true, data: { waste } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all waste listings (public - for marketplace)
const getAllWastes = async (req, res) => {
  try {
    const { status, cropType, wasteType, district, state, minPrice, maxPrice } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (cropType) {
      filter.cropType = new RegExp(cropType, 'i'); // Case-insensitive search
    }
    
    if (wasteType) {
      filter.wasteType = wasteType;
    }
    
    if (district) {
      filter['location.district'] = new RegExp(district, 'i');
    }
    
    if (state) {
      filter['location.state'] = new RegExp(state, 'i');
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Fetch wastes with owner details populated
    const wastes = await Waste.find(filter)
      .populate('owner', 'name email phone farmDetails')
      .sort({ createdAt: -1 }); // Most recent first
    
    res.status(200).json({
      success: true,
      data: {
        count: wastes.length,
        wastes
      }
    });
  } catch (error) {
    console.error('Error fetching all wastes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch waste listings',
      error: error.message
    });
  }
};

// Get waste by ID (public - for viewing details)
const getWasteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const waste = await Waste.findById(id)
      .populate('owner', 'name email phone farmDetails');
    
    if (!waste) {
      return res.status(404).json({ 
        success: false, 
        message: 'Waste listing not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: { waste }
    });
  } catch (error) {
    console.error('Error fetching waste by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch waste listing',
      error: error.message
    });
  }
};

// List wastes belonging to the authenticated farmer
const getMyWastes = async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ success: false, message: 'Only farmers can view their wastes' });
    }
    const wastes = await Waste.find({ owner: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: { wastes } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addWaste,
  editWaste,
  markWasteSold,
  getMyWastes,
  getAllWastes,
  getWasteById
};