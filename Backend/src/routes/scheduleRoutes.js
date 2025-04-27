const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/scheduleController');

router.post('/createSchedule', scheduleController.createSchedule);
router.get('/getSchedule', scheduleController.getSchedule);

module.exports = router;