const bcrypt = require('bcrypt');
const StudentDb = require('../database/Student');
const TeacherDb = require('../database/Teacher');
const ParentDb = require('../database/Parent');
const AdminDb = require('../database/Admin');
const AttendanceDb = require('../database/Attendance');

const userService = {
  createUser: async ({ email, password, accountType, photoPath }) => {
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

    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = { email, password: hashedPassword, accountType };
    if (accountType === 'student' && photoPath) {
      userData.photoPath = photoPath;
    }

    const user = new Model(userData);
    await user.save();
    return { message: 'User created successfully', user: { email, accountType } };
  },

  loginUser: async ({ email, password }) => {
    const models = {
      student: StudentDb,
      teacher: TeacherDb,
      parent: ParentDb,
      admin: AdminDb,
    };

    for (const [accountType, Model] of Object.entries(models)) {
      const user = await Model.findOne({ email });
      if (user && await bcrypt.compare(password, user.password)) {
        return { email: user.email, accountType: user.accountType };
      }
    }

    throw new Error('Invalid email or password');
  },

  markAttendance: async ({ studentId }) => {
    const student = await StudentDb.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await AttendanceDb.findOne({
      studentId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    });

    if (existingAttendance) {
      throw new Error('Attendance already marked for today');
    }

    const attendance = new AttendanceDb({ studentId, date: new Date(), status: 'present' });
    await attendance.save();
    return { message: 'Attendance marked successfully', studentId };
  },

  getStudents: async () => {
    const students = await StudentDb.find({}, 'email photoPath');
    return students;
  },
};

module.exports = userService;