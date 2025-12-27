const Deal = require('../../models/deals');
const Product = require('../../models/Product');

// 🔹 Create a new deal (Seller only)
exports.createDeal = async (req, res) => {
  try {
    const { productId, discountPercentage, startDate, endDate } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Only the seller can create deal for their product
    if (product.sellerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    const deal = await Deal.create({
      product: productId,
      seller: req.user._id,
      discountPercentage,
      startDate,
      endDate,
      isActive: true,
    });

    res.status(201).json({ deal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get all active deals for buyers
exports.getActiveDeals = async (req, res) => {
  try {
    const now = new Date();
    const deals = await Deal.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).populate('product');

    res.json({ deals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get all deals of the logged-in seller
exports.getSellerDeals = async (req, res) => {
  try {
    const deals = await Deal.find({ seller: req.user._id }).populate('product');
    res.json({ deals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

