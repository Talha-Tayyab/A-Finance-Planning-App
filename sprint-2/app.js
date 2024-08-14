const express = require("express");
const app = express();
const port = 3000;

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
  res.send("Welcome to the Personal Budget Tracker!");
});

// Listen on the defined port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
