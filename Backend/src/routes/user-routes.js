const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/signup', upload.single('photo'), userController.signup);
router.post('/login', userController.login);
router.post('/attendance', userController.markAttendance);
router.get('/students', userController.getStudents);

module.exports = router;