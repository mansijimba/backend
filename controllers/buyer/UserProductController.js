
const Category = require('../../models/category');
const Product = require('../../models/Product');

exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 }) // newest first
      .limit(20); // optional

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch new arrivals" });
  }
};

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
      .populate("sellerId", "firstName");

    console.log("✅ Products found:", products.length);

    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("🔥 getProductsByCategory error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};