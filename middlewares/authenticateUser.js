const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function authenticateUser(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.SECRET);  // <-- match your login secret
    const user = await User.findById(decoded._id);          // fetch full user info

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
