const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  topics: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Syllabus', syllabusSchema);