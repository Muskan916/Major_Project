const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: { type: String, required: true, default: "parent" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Parent", parentSchema);