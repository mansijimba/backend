const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
} = require('../controllers/buyer/CartController');

const authenticateUser = require('../middlewares/authenticateUser');

router.get('/', authenticateUser, getCart);
router.post('/add', authenticateUser, addToCart);
router.put('/quantity', authenticateUser, updateQuantity);
router.delete('/remove/:productId', authenticateUser, removeFromCart);
router.delete('/clear', authenticateUser, clearCart);

module.exports = router;