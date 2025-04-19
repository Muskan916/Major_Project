const bcrypt = require('bcrypt');
const Student = require('../database/Student');
const Teacher = require('../database/Teacher');
const Parent = require('../database/Parent');
const Admin = require('../database/Admin');

const userService = {
  createUser: async ({ email, password, accountType }) => {
    // Map accountType to Model
    const models = {
      student: Student,
      teacher: Teacher,
      parent: Parent,
      admin: Admin,
    };

    const Model = models[accountType];
    if (!Model) {
      throw new Error('Invalid account type');
    }

    // Check if user already exists
    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new Model({
      email,
      password: hashedPassword,
      accountType,
    });

    // Save user to database
    await user.save();
    return { message: 'User created successfully', user: { email, accountType } };
  },
};

module.exports = userService;