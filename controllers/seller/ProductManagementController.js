const Product = require("../../models/Product");

exports.addProduct = async (req, res) => {
  try {
    const { name, price, categoryId, description, stock } = req.body;

    // uploaded image
    const image = req.file ? req.file.filename : "";

    const product = await Product.create({
      name,
      price,
      categoryId,
      description,
      stock,
      image,
      sellerId: req.user._id, // seller comes from auth middleware
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId sellerId");
 
    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error("Get All Products Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId sellerId"
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    console.error("Get Product By ID Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user._id });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error("Get Seller Products Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    let product = await Product.findOne({
      _id: productId,
      sellerId: req.user._id,
    });

    if (!product) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this product",
      });
    }

    const { name, price, categoryId, description, stock } = req.body;

    if (req.file) {
      product.image = req.file.filename;
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.categoryId = categoryId ?? product.categoryId;
    product.description = description ?? product.description;
    product.stock = stock ?? product.stock;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.user._id,
    });

    if (!product) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this product",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
