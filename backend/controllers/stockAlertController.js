const StockAlert = require('../models/StockAlert');
const Product = require('../models/Product');

// @desc    Subscribe to stock alert
// @route   POST /api/stock-alerts/:productId
// @access  Private
exports.subscribeToAlert = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if already subscribed
    const existingAlert = await StockAlert.findOne({
      product: productId,
      user: req.user._id
    });

    if (existingAlert) {
      return res.status(400).json({
        success: false,
        message: 'Already subscribed to stock alerts for this product'
      });
    }

    const alert = await StockAlert.create({
      product: productId,
      user: req.user._id,
      email: req.user.email
    });

    res.json({
      success: true,
      message: 'Successfully subscribed to stock alerts',
      alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Unsubscribe from stock alert
// @route   DELETE /api/stock-alerts/:productId
// @access  Private
exports.unsubscribeFromAlert = async (req, res) => {
  try {
    const { productId } = req.params;

    const alert = await StockAlert.findOneAndDelete({
      product: productId,
      user: req.user._id
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed from stock alerts'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's stock alerts
// @route   GET /api/stock-alerts
// @access  Private
exports.getUserAlerts = async (req, res) => {
  try {
    const alerts = await StockAlert.find({ user: req.user._id })
      .populate({
        path: 'product',
        select: 'name slug price images stock'
      })
      .sort('-createdAt');

    res.json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
