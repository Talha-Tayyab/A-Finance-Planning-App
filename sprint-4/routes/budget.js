const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

// GET request to render the add budget form
router.get("/add", budgetController.renderAddBudgetForm);

// Route to handle form submission
router.post("/add", budgetController.addBudget);

// Route to display all budgets
router.get("/", budgetController.getAllBudgets);

module.exports = router;
