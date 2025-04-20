const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: Date, default: Date.now, required: true },
  status: { type: String, enum: ['present', 'absent'], default: 'present' },
});

module.exports = mongoose.model('Attendance', attendanceSchema);