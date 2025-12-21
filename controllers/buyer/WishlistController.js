const Wishlist = require('../../models/wishlist');
const Product = require('../../models/Product');
const mongoose = require('mongoose');

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Valid productId is required' });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    if (wishlist.products.includes(productId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Product already in wishlist' });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    return res
      .status(200)
      .json({ success: true, message: 'Added to wishlist' });
  } catch (err) {
    console.error('Add Wishlist Error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Valid productId is required' });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    return res
      .status(200)
      .json({ success: true, message: 'Removed from wishlist' });
  } catch (err) {
    console.error('Remove Wishlist Error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error' });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find wishlist for the user and populate product details
    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: 'products',
      populate: [
        { path: 'categoryId', select: 'name' },
        { path: 'sellerId', select: 'firstName' }
      ]
    });

    if (!wishlist || wishlist.products.length === 0) {
      return res.status(200).json({ success: true, products: [] });
    }

    return res.status(200).json({ success: true, products: wishlist.products });
  } catch (err) {
    console.error('Get Wishlist Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};