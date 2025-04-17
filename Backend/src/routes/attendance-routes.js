const express = require("express");
const router = express.Router();
const AttendanceController = require("../controller/attendanceController");

router.post("/attendance/mark", AttendanceController.markAttendance);

module.exports = router;
