const express = require('express');
const router = express.Router();
const {
  subscribeToAlert,
  unsubscribeFromAlert,
  getUserAlerts
} = require('../controllers/stockAlertController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getUserAlerts);

router.route('/:productId')
  .post(subscribeToAlert)
  .delete(unsubscribeFromAlert);

module.exports = router;
