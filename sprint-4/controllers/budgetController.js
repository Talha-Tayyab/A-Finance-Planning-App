const Budget = require("../models/budget");

exports.renderAddBudgetForm = (req, res) => {
  console.log("GET /add route accessed");
  res.render("addBudget", (err, html) => {
    if (err) {
      console.error("Error rendering addBudget view:", err);
      return res.status(500).send("Something broke!");
    }
    res.send(html);
  });
};

exports.addBudget = async (req, res) => {
  console.log("POST /add route accessed");
  const { name, amount } = req.body;

  const newBudget = new Budget({
    name,
    amount,
  });

  try {
    await newBudget.save();
    res.redirect("/budgets"); // Redirect to a success page or the home page
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getAllBudgets = async (req, res) => {
  console.log("GET / route accessed");
  try {
    const budgets = await Budget.find({});
    res.render("budgets", { budgets });
  } catch (err) {
    console.error("Error fetching budgets:", err);
    res.status(500).send("Something broke!");
  }
};
