const express = require("express");
const router = express.Router();

const {
  addProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/seller/ProductManagementController");

const upload = require("../middlewares/fileupload");
const authenticateUser = require("../middlewares/authenticateUser");

// Get products of logged-in seller (must be ABOVE "/:id")
router.get("/seller/products", authenticateUser, getSellerProducts);

// Add product (seller only)
router.post("/add", authenticateUser, upload.single("image"), addProduct);

// Get all products
router.get("/", getAllProducts);

// Get single product by ID
router.get("/:id", getProductById);

// Update product
router.put("/:id", authenticateUser, upload.single("image"), updateProduct);

// Delete product
router.delete("/:id", authenticateUser, deleteProduct);

module.exports = router;
