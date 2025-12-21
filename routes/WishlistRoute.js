const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authenticateUser');

const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require('../controllers/buyer/WishlistController');

router.post('/add', authenticateUser, addToWishlist);
router.delete('/remove/:productId', authenticateUser, removeFromWishlist);
router.get('/', authenticateUser, getWishlist);

module.exports = router;
