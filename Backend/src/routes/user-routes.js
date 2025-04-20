const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;