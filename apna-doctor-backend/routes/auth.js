const express = require("express");
const router = express.Router();
const { register, login, refreshTokenHandler, logout } = require("../controllers/authController");


// POST /api/auth/register
router.post("/register", register);  // if the url has register then execute register function else login function

// POST /api/auth/login
router.post("/login", login);

router.post("/refresh", refreshTokenHandler);
router.post("/logout", logout);

module.exports = router;