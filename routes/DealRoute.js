const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authenticateUser');
const dealController = require('../controllers/seller/DealsManagementController');

// Seller creates a deal
router.post('/create', authMiddleware, dealController.createDeal);

// Get all active deals for buyers
router.get('/active', dealController.getActiveDeals);
router.get('/seller', authMiddleware, dealController.getSellerDeals);

module.exports = router;
