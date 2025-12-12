const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// -------------------- GET PROFILE --------------------
exports.getProfile = async (req, res) => {
  try {
    const { password, ...userWithoutPassword } = req.user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------------------- REGISTER USER --------------------
exports.registerUser = async (req, res) => {
  const { fullName, phone, address, email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      phone,
      address,
      email,
      password: hashedPassword,
      role: role || "buyer",  // default to buyer
    });

    return res.status(201).json({
      success: true,
      message: "User registered",
      user: { id: newUser._id, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------------------- LOGIN USER --------------------
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const getUser = await User.findOne({ email });
    if (!getUser)
      return res.status(403).json({ success: false, message: "User not found" });

    const passwordCheck = await bcrypt.compare(password, getUser.password);
    if (!passwordCheck)
      return res.status(403).json({ success: false, message: "Invalid credentials" });

    const payload = {
      _id: getUser._id,
      email: getUser.email,
      role: getUser.role,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "7d" });

    const { password: pwd, ...userWithoutPassword } = getUser.toObject();

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: userWithoutPassword,
      token,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------------------- UPDATE PROFILE --------------------
exports.updateProfile = async (req, res) => {
  try {
    const user = req.user;

    const { fullName, phone, email, address, password } = req.body;

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists)
        return res.status(400).json({ message: "Email already in use" });

      user.email = email;
    }

    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    const { password: pwd, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
