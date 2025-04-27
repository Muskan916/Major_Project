const scheduleService = require('../service/scheduleService');

const createSchedule = async (req, res) => {
  try {
    console.log('Received payload:', req.body); // Log the incoming payload
    const schedule = await scheduleService.createSchedule(req.body);
    res.status(201).json({ message: 'Schedule saved successfully', schedule });
  } catch (error) {
    console.error('Error in createSchedule:', error);
    res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
};

const getSchedule = async (req, res) => {
  try {
    const schedule = await scheduleService.getSchedule();
    res.status(200).json(schedule);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
module.exports = {
  createSchedule,
  getSchedule
};