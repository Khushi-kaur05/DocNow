const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/create-test-user", async (req, res) => {
  console.log("/create-test-user route hit");
  try {
    const user = await User.create({
      name: "Test User",
      email: "testuser@gmail.com",
      password: "123456",
      role: "patient",
      phone: "1234567890"
    });
    res.json(user);
  } catch (err) {
    res.json({ error: err.message });
  }
});

module.exports = router;