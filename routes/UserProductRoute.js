const express = require('express');
const router = express.Router();
const { getProductsByCategory, getNewArrivals } = require('../controllers/buyer/UserProductController');
const { searchProducts } = require('../controllers/buyer/UserSearchController');


// GET /api/products?categoryName=tops
router.get('/products', getProductsByCategory);
router.get('/products/search', searchProducts);
router.get("/new-arrivals", getNewArrivals);


module.exports = router;


