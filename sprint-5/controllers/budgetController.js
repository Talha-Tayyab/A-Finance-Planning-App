const Budget = require("../models/budget");

// Render the add budget form
exports.renderAddBudgetForm = (req, res) => {
  res.render("addBudget");
};

// Add a new budget
exports.addBudget = (req, res, next) => {
  Budget.create(req.body)
    .then((budget) => {
      res.locals.redirect = "/";
      res.locals.budget = budget;
      next();
    })
    .catch((err) => {
      res.status(500).send("Server Error");
    });
};

// Get all budgets
exports.getAllBudgets = (req, res, next) => {
  console.log("GET / route accessed");
  Budget.find({})
    .then((budgets) => {
      res.render("budgets", { budgets });
    })
    .catch((err) => {
      console.error("Error fetching budgets:", err);
      res.status(500).send("Something broke!");
    });
};

// Redirect view
exports.redirectView = (req, res, next) => {
  const redirectPath = res.locals.redirect;
  if (redirectPath) res.redirect(redirectPath);
  else next();
};
