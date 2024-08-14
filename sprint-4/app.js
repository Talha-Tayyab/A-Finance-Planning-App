const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const budgetRoutes = require("./routes/budget");
const bodyParser = require("body-parser");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

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

// Define routes
app.use("/budgets", budgetRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
