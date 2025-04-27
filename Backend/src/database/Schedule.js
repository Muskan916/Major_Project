const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  time: { type: String, required: true },
  type: { type: String, enum: ['lecture', 'lab'], required: true },
  lecture: {
    type: {
      subject: { type: String, required: true },
      instructor: { type: String, required: true },
      class: { type: String, required: true }
    },
    required: function() { return this.type === 'lecture'; }
  },
  lab: {
    type: [{
      batch: { type: String, required: true },
      subject: { type: String, required: true },
      instructor: { type: String, required: true },
      lab: { type: String, required: true }
    }],
    required: function() { return this.type === 'lab'; }
  }
});

const scheduleSchema = new mongoose.Schema({
  monday: { type: [slotSchema], default: undefined },
  tuesday: { type: [slotSchema], default: undefined },
  wednesday: { type: [slotSchema], default: undefined },
  thursday: { type: [slotSchema], default: undefined },
  friday: { type: [slotSchema], default: undefined },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Schedule', scheduleSchema);