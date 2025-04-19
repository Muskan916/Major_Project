const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    faceDescriptor: { type: [Number], required: true },
    attendance: [
      {
        date: { type: String, required: true },
        markedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Students", studentSchema);
