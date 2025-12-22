const mongoose = require('mongoose');
const Category = require('../../models/category');
const Product = require('../../models/Product');

// Get latest products (New Arrivals)
exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 }) // newest first
      .limit(20); // optional limit

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("🔥 getNewArrivals error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch new arrivals" });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryNameRaw = req.query.categoryName;

    if (!categoryNameRaw) {
      return res.status(400).json({ success: false, message: "categoryName query parameter is required" });
    }

    const categoryName = categoryNameRaw.trim();
    console.log("🔍 Looking for category:", categoryName);

    const category = await Category.findOne({
      name: { $regex: `^${categoryName}$`, $options: 'i' }
    });

    if (!category) {
      console.log("❌ Category not found");
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    console.log("✅ Found category:", category);

    const products = await Product.find({ categoryId: category._id })
      .populate("categoryId", "name")
      .populate("sellerId", "firstName fullName");

    console.log("✅ Products found:", products.length);

    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("🔥 getProductsByCategory error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get products by seller
exports.getProductsBySeller = async (req, res) => {
  const { sellerId } = req.params;

  // Validate sellerId
  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    return res.status(400).json({ success: false, message: "Invalid sellerId" });
  }

  try {
    const products = await Product.find({ sellerId })
      .populate('sellerId', 'fullName');

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found for this seller" });
    }

    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("🔥 getProductsBySeller error:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};
