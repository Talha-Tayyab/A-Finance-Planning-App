const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user"); // Ensure this path is correct
const router = express.Router();

// Serve the login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle user login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.userId = user._id;
      req.session.username = user.username; // Set the username in the session
      res.redirect("/dashboard");
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    res.redirect("/login");
  }
});

// Serve the registration page
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle user registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    req.session.userId = newUser._id;
    res.redirect("/dashboard");
  } catch (err) {
    res.redirect("/register");
  }
});

module.exports = router;
