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

module.exports = {
  addWaste,
  editWaste,
  markWasteSold,
  // List wastes belonging to the authenticated farmer
  getMyWastes: async (req, res) => {
    try {
      if (req.user.role !== 'farmer') {
        return res.status(403).json({ success: false, message: 'Only farmers can view their wastes' });
      }
      const wastes = await Waste.find({ owner: req.user.id }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: { wastes } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};