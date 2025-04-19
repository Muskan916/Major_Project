const userService = require('../service/userService');

const userController = {
  signup: async (req, res) => {
    try {
      const { email, password, accountType } = req.body;
      const result = await userService.createUser({ email, password, accountType });
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = userController;