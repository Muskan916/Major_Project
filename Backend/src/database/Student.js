const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: { type: String, required: true, default: "student" },
  photoPath: { type: String },
  faceDescriptor: { type: [Number] }, // Array of 128 numbers
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Student", studentSchema);