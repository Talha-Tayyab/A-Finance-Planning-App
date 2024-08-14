// const express = require("express");
// const bcrypt = require("bcrypt");
// const User = require("../models/user"); // Ensure this path is correct
// const router = express.Router();

// // Serve the login page
// router.get("/login", (req, res) => {
//   res.render("login");
// });

// // Handle user login
// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.redirect("/login");
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (isMatch) {
//       req.session.userId = user._id;
//       req.session.username = user.username; // Set the username in the session
//       res.redirect("/dashboard");
//     } else {
//       res.redirect("/login");
//     }
//   } catch (err) {
//     res.redirect("/login");
//   }
// });

// // Serve the registration page
// router.get("/register", (req, res) => {
//   res.render("register");
// });

// router.post("/register", (req, res) => {
//   const { username, email, password } = req.body;
//   const hashedPassword = bcrypt.hashSync(password, 10);
//   const newUser = new User({ username, email, password: hashedPassword });

//   newUser
//     .save()
//     .then((user) => {
//       req.login(user, (err) => {
//         if (err) return next(err);
//         return res.redirect("/dashboard");
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//       res.redirect("/register");
//     });
// });

// module.exports = router;

const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user"); // Ensure this path is correct
const router = express.Router();

// Serve the login page
router.get("/login", (req, res) => {
  res.render("login", { message: req.flash("error") });
});

// Handle user login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      req.flash("error", "Incorrect username.");
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.flash("error", "Incorrect password.");
      return res.redirect("/login");
    }

    req.login(user, (err) => {
      if (err) {
        req.flash("error", "Login failed.");
        return res.redirect("/login");
      }
      return res.redirect("/dashboard");
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred.");
    res.redirect("/login");
  }
});

// Serve the registration page
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  newUser
    .save()
    .then((user) => {
      req.login(user, (err) => {
        if (err) return next(err);
        return res.redirect("/dashboard");
      });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/register");
    });
});

module.exports = router;
