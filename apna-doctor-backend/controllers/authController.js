const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const { generateAccessToken, generateRefreshToken} = require("../utils/generateTokens");


// Logout user
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token required"
      });
    }

    const user = await User.findOne({ refreshToken });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.json({
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Handle refresh token
exports.refreshTokenHandler = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Token expired or invalid" });
  }
};



// Register a new user
exports.register = async (req, res) => {
  try {

    const { error } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }
 
    
    const { name, email, password, role, phone, gender } = req.body;
    console.log("Body inside authController/register=====", req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists===============");
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashing done=========");

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      gender: gender || "male"
    });
    
    const { password: _, ...safeUser } = user.toObject();
    console.log("User created successfully========================")
    res.status(201).json({ message: "User registered successfully", safeUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
     const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      // Generate access and refresh tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Save refresh token in DB
      user.refreshToken = refreshToken;
      await user.save();

      res.json({
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          gender: user.gender
        }
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};