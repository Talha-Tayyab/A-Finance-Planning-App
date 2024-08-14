// const express = require("express");
// const session = require("express-session"); // Add this line
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const bcrypt = require("bcryptjs");
// const mongoose = require("mongoose");
// const app = express();
// const port = 3000;
// const budgetRoutes = require("./routes/budget");
// const bodyParser = require("body-parser");
// const userRoutes = require("./routes/user"); // Import the user routes
// const authMiddleware = require("./middleware/authMiddleware"); // Import the auth middleware
// const userRouter = require("./routes/user"); // Import the user router
// const flash = require("connect-flash");

// app.use((req, res, next) => {
//   res.locals.error = req.flash("error");
//   next();
// });

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));

// // Configure sessions
// app.use(
//   session({
//     secret: "my secret key",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Set to true if using HTTPS
//   })
// );

// // Set the view engine to ejs
// app.set("view engine", "ejs");

// // Middleware to parse URL-encoded bodies
// app.use(express.urlencoded({ extended: true }));

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/my_budget_tracker_db", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Initialize Passport and sessions
// app.use(passport.initialize());
// app.use(passport.session());

// // Use flash messages
// app.use(flash());

// // Configure Passport's LocalStrategy
// passport.use(
//   new LocalStrategy((username, password, done) => {
//     User.findOne({ username: username }, (err, user) => {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false, { message: "Incorrect username." });
//       }
//       if (!bcrypt.compareSync(password, user.password)) {
//         return done(null, false, { message: "Incorrect password." });
//       }
//       return done(null, user);
//     });
//   })
// );

// // Serialize user information into session
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // Deserialize user information from session
// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("Connected to MongoDB");
// });

// // Protect routes with authentication middleware
// const { isLoggedIn } = require("./middleware/authMiddleware");

// // Protect routes with authentication middleware
// app.get("/dashboard", isLoggedIn, (req, res) => {
//   // Render dashboard or user-specific data
//   res.render("dashboard");
// });

// app.post("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.redirect("/dashboard");
//     }
//     res.redirect("/login");
//   });
// });

// // Define routes
// app.use(budgetRoutes);

// // Use the user routes
// app.use("/", userRoutes);

// // Dashboard route
// app.get("/dashboard", authMiddleware.isLoggedIn, (req, res) => {
//   res.render("dashboard");
// });

// // Use the user router
// app.use("/user", userRouter);

// // Logout route
// app.post("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.redirect("/dashboard");
//     }
//     res.redirect("/login");
//   });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const User = require("./models/user"); // Ensure this path is correct
const budgetRoutes = require("./routes/budget");
const userRoutes = require("./routes/user");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const port = 3000;

// Middleware to handle form data
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

// Use flash messages
app.use(flash());

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

// Initialize Passport and sessions
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log("Authenticating user:", username);
      const user = await User.findOne({ username: username });
      if (!user) {
        console.log("Incorrect username.");
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.validPassword(password)) {
        console.log("Incorrect password.");
        return done(null, false, { message: "Incorrect password." });
      }
      console.log("Authentication successful for user:", username);
      return done(null, user);
    } catch (err) {
      console.log("Error during authentication:", err);
      return done(err);
    }
  })
);

// Serialize user information into session
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user.id);
  done(null, user.id);
});

// Deserialize user information from session
passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing user:", id);
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.log("Error during deserialization:", err);
    done(err, null);
  }
});

// Protect routes with authentication middleware
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("User is authenticated, rendering dashboard.");
    res.render("dashboard");
  } else {
    console.log("User is not authenticated, redirecting to login.");
    res.redirect("/login");
  }
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
app.use("/", userRoutes);
app.use(budgetRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
