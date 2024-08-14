const mongoose = require("mongoose");
const { Schema } = mongoose;

const budgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v >= 0 && v <= 100000; // Validation to ensure amount is between 0 and 100000
      },
      message: (props) => `${props.value} is not a valid budget amount!`,
    },
  },
  user: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to the user that the budget belongs to
});

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
