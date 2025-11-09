const mongoose = require('mongoose');

const stockAlertSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  notified: {
    type: Boolean,
    default: false
  },
  notifiedAt: Date
}, {
  timestamps: true
});

// Index for quick lookup
stockAlertSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('StockAlert', stockAlertSchema);
