const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

// // GET request to render the add budget form
// router.get("/add", budgetController.renderAddBudgetForm);

// // Route to handle form submission
// router.post("/add", budgetController.addBudget, budgetController.redirectView);

// // Route to display all budgets
// router.get("/", budgetController.getAllBudgets);

router.get("/budgets/new", budgetController.newForm);
router.post("/budgets/create", budgetController.createBudget);
router.get("/budgets/:id", budgetController.getBudget);
router.get("/budgets/:id/edit", budgetController.editForm);
router.post("/budgets/:id/update", budgetController.updateBudget);
router.post("/budgets/:id/delete", budgetController.deleteBudget);

module.exports = router;
