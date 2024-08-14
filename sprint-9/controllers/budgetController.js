const Budget = require("../models/budget");

// // Render the add budget form
// exports.renderAddBudgetForm = (req, res) => {
//   res.render("addBudget");
// };

// // Add a new budget
// exports.addBudget = (req, res, next) => {
//   const { name, amount, userId } = req.body;
//   Budget.create({ name, amount, user: userId })
//     .then((budget) => {
//       return User.findByIdAndUpdate(userId, { $push: { budgets: budget._id } });
//     })
//     .then(() => {
//       res.locals.redirect = "/";
//       next();
//     })
//     .catch((err) => {
//       res.status(500).send("Server Error");
//     });
// };

// // Get all budgets
// exports.getAllBudgets = (req, res, next) => {
//   console.log("GET / route accessed");
//   Budget.find({})
//     .then((budgets) => {
//       res.render("budgets", { budgets });
//     })
//     .catch((err) => {
//       console.error("Error fetching budgets:", err);
//       res.status(500).send("Something broke!");
//     });
// };

// // Redirect view
// exports.redirectView = (req, res, next) => {
//   const redirectPath = res.locals.redirect;
//   if (redirectPath) res.redirect(redirectPath);
//   else next();
// };

// Create a new Budget
exports.createBudget = (req, res, next) => {
  const budgetData = req.body;
  Budget.create(budgetData)
    .then((budget) => res.redirect(`/budgets/${budget._id}`))
    .catch((err) => next(err));
};

// Read a specific Budget
exports.getBudget = (req, res, next) => {
  Budget.findById(req.params.id)
    .then((budget) => {
      if (!budget) {
        return res.status(404).send("Budget not found");
      }
      res.render("budgets/detail", { budget });
    })
    .catch((err) => res.status(404).send("Budget not found"));
};

// Update a specific Budget
exports.updateBudget = (req, res, next) => {
  Budget.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((budget) => res.redirect(`/budgets/${budget._id}`))
    .catch((err) => next(err));
};

// Delete a specific Budget
exports.deleteBudget = (req, res, next) => {
  Budget.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("/budgets/new"))
    .catch((err) => next(err));
};

// Render form to create a new Budget
exports.newForm = (req, res) => {
  res.render("budgets/new");
};

// Render form to edit an existing Budget
exports.editForm = (req, res, next) => {
  Budget.findById(req.params.id)
    .then((budget) => {
      if (!budget) {
        return res.status(404).send("Budget not found");
      }
      res.render("budgets/edit", { budget });
    })
    .catch((err) => next(err));
};
