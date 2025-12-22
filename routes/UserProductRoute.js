const express = require('express');
const router = express.Router();
const { getProductsByCategory, getNewArrivals , getProductsBySeller} = require('../controllers/buyer/UserProductController');
const { searchProducts } = require('../controllers/buyer/UserSearchController');


// GET /api/products?categoryName=tops
router.get('/products', getProductsByCategory);
router.get('/products/search', searchProducts);
router.get("/new-arrivals", getNewArrivals);
router.get('/products-by-seller/:sellerId', getProductsBySeller);


module.exports = router;


