const userService = require('../service/userService.js');

const signup = async (req, res) => {
  try {
    const { email, password, accountType } = req.body;
    const photoPath = req.file ? req.file.path : null;

    if (!email || !password || !accountType) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (accountType === 'student' && !photoPath) {
      return res.status(400).json({ message: 'Photo is required for students' });
    }

    const result = await userService.createUser({ email, password, accountType, photoPath });
    res.status(201).json(result);
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userService.loginUser({ email, password });
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(401).json({ message: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    const result = await userService.markAttendance({ studentId });
    res.status(200).json(result);
  } catch (error) {
    console.error('Attendance error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await userService.getStudents();
    res.status(200).json(students);
  } catch (error) {
    console.error('Get students error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { signup, login, markAttendance, getStudents };