const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  budgets: [{ type: Schema.Types.ObjectId, ref: "Budget" }], // Associating users with multiple budgets
});

module.exports = mongoose.model("User", UserSchema);
