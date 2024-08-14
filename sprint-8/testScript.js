const mongoose = require("mongoose");
const User = require("./models/user");
const Budget = require("./models/budget");

mongoose.connect("mongodb://127.0.0.1/my_budget_tracker_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a user and associated budgets
const newUser = new User({
  username: "john_doe_3",
  email: "joh3n@example.com",
  password: "securepassword123",
});

newUser
  .save()
  .then((user) => {
    console.log("User saved:", user);

    const newBudget = new Budget({
      name: "Marketing",
      amount: 5000,
      user: user._id,
    });

    return newBudget.save();
  })
  .then((budget) => {
    console.log("Budget saved:", budget);

    // Optional: Populate and retrieve the user with associated budgets
    return User.findById(budget.user).populate("budgets").exec();
  })
  .then((userWithBudgets) => {
    console.log("User with budgets:", userWithBudgets);
  })
  .catch((err) => {
    console.error("Error:", err);
  })
  .finally(() => mongoose.connection.close());
