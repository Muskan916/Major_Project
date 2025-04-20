const userService = require('../service/userService');

const signup = async (req, res) => {
  try {
    const { email, password, accountType } = req.body;

    if (!email || !password || !accountType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await userService.createUser({ email, password, accountType });
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

module.exports = { signup, login };