const Product = require('../db/models/Product');
const User = require('../db/models/User');

// Get all products (Both farmer & business can view)
const getAllProducts = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .populate('farmerId', 'name location phone email');

    res.status(200).json({
      success: true,
      count: products.length,
      data: { products }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get farmer's own products
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: { products }
    });

  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmerId', 'name email phone location');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { product }
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Add product (Farmer only)
const addProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      quantity,
      unit,
      pricePerUnit,
      description,
      images,
      availableFrom
    } = req.body;

    // Validation
    if (!productName || !category || !quantity || !unit || !pricePerUnit) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const farmer = await User.findById(req.user.id);

    const product = new Product({
      farmerId: req.user.id,
      farmerName: farmer.name,
      farmerLocation: farmer.location,
      farmerPhone: farmer.phone,
      productName,
      category,
      quantity,
      unit,
      pricePerUnit,
      description,
      images,
      availableFrom
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: { product }
    });

  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update product (Farmer only - Own products)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.farmerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own products'
      });
    }

    const {
      productName,
      category,
      quantity,
      unit,
      pricePerUnit,
      description,
      images,
      availableFrom,
      status
    } = req.body;

    // Update fields
    if (productName !== undefined) product.productName = productName;
    if (category !== undefined) product.category = category;
    if (quantity !== undefined) product.quantity = quantity;
    if (unit !== undefined) product.unit = unit;
    if (pricePerUnit !== undefined) product.pricePerUnit = pricePerUnit;
    if (description !== undefined) product.description = description;
    if (images !== undefined) product.images = images;
    if (availableFrom !== undefined) product.availableFrom = availableFrom;
    if (status !== undefined) product.status = status;

    product.updatedAt = Date.now();

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete product (Farmer only - Own products)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.farmerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own products'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role === 'farmer') {
      const totalProducts = await Product.countDocuments({ farmerId: req.user.id });
      const availableProducts = await Product.countDocuments({
        farmerId: req.user.id,
        status: 'available'
      });
      const soldProducts = await Product.countDocuments({
        farmerId: req.user.id,
        status: 'sold'
      });

      res.status(200).json({
        success: true,
        data: {
          totalProducts,
          availableProducts,
          soldProducts
        }
      });
    } else if (req.user.role === 'business') {
      const totalProducts = await Product.countDocuments({ status: 'available' });
      const categories = await Product.distinct('category', { status: 'available' });

      res.status(200).json({
        success: true,
        data: {
          totalAvailableProducts: totalProducts,
          categoriesCount: categories.length,
          categories
        }
      });
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllProducts,
  getMyProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats
};