const express = require("express");
const session = require("express-session"); // Add this line
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const budgetRoutes = require("./routes/budget");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user"); // Import the user routes
const authMiddleware = require("./middleware/authMiddleware"); // Import the auth middleware

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Configure sessions
app.use(
  session({
    secret: "my secret key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Set the view engine to ejs
app.set("view engine", "ejs");

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/my_budget_tracker_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Protect routes with authentication middleware
const { isLoggedIn } = require("./middleware/authMiddleware");

// Protect routes with authentication middleware
app.get("/dashboard", isLoggedIn, (req, res) => {
  // Render dashboard or user-specific data
  res.render("dashboard");
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/dashboard");
    }
    res.redirect("/login");
  });
});

// Define routes
app.use(budgetRoutes);

// Use the user routes
app.use("/", userRoutes);

// Dashboard route
app.get("/dashboard", authMiddleware.isLoggedIn, (req, res) => {
  res.render("dashboard");
});

// Logout route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/dashboard");
    }
    res.redirect("/login");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
