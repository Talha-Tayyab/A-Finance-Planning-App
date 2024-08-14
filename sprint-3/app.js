const express = require("express");
const app = express();
const port = 3000;

// Set the view engine to ejs
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static("public"));

app.use((req, res, next) => {
  console.log(`Request Type: ${req.method}, URL: ${req.url}`);
  next();
});

app.get("/users/:userId", (req, res) => {
  res.send(`User ID: ${req.params.userId}`);
});

// Home route
app.get("/", (req, res) => {
  res.render("index", { title: "Personal Budget Tracker" });
});

// Listen on the defined port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
