const bcrypt = require('bcrypt');
const StudentDb = require('../database/Student');
const TeacherDb = require('../database/Teacher');
const ParentDb = require('../database/Parent');
const AdminDb = require('../database/Admin');

const userService = {
  createUser: async ({ email, password, accountType }) => {
    // Map accountType to Model
    const models = {
      student: StudentDb,
      teacher: TeacherDb,
      parent: ParentDb,
      admin: AdminDb,
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

  loginUser: async ({ email, password }) => {
    // List of models to check
    const models = {
      student: StudentDb,
      teacher: TeacherDb,
      parent: ParentDb,
      admin: AdminDb,
    };

    // Check each model for the user
    for (const [accountType, Model] of Object.entries(models)) {
      const user = await Model.findOne({ email });
      if (user && await bcrypt.compare(password, user.password)) {
        return { email: user.email, accountType: user.accountType };
      }
    }

    throw new Error('Invalid email or password');
  },
};

module.exports = userService;