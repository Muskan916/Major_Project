const bcrypt = require("bcrypt");
const StudentDb = require("../database/Student");
const TeacherDb = require("../database/Teacher");
const ParentDb = require("../database/Parent");
const AdminDb = require("../database/Admin");
const AttendanceDb = require("../database/Attendance");
// Placeholder for face recognition library
// const generateFaceDescriptor = require("../utils/faceRecognition");

const userService = {
  createUser: async ({ email, password, accountType, photoPath, faceDescriptor }) => {
    try {
      console.log("userService - Creating user:", { email, accountType, photoPath });
      const models = {
        student: StudentDb,
        teacher: TeacherDb,
        parent: ParentDb,
        admin: AdminDb,
      };

      const Model = models[accountType];
      if (!Model) {
        throw new Error(`Invalid account type: ${accountType}`);
      }

      console.log("userService - Checking for existing user:", email);
      const existingUser = await Model.findOne({ email });
      if (existingUser) {
        console.log("userService - Email already exists:", email);
        throw new Error("Email already registered");
      }

      console.log("userService - Hashing password");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userData = { email, password: hashedPassword, accountType };
      if (accountType === "student") {
        if (photoPath) userData.photoPath = photoPath;
        if (faceDescriptor) userData.faceDescriptor = faceDescriptor;
      }

      console.log("userService - Saving user:", userData);
      const user = new Model(userData);
      await user.save().catch((err) => {
        console.error("userService - MongoDB save error:", err);
        if (err.code === 11000) {
          throw new Error("Email already registered (duplicate key)");
        }
        throw err;
      });
      console.log("userService - User saved successfully");

      return { message: "User created successfully", user: { email, accountType } };
    } catch (error) {
      console.error("userService - Create user error:", error.stack);
      throw error;
    }
  },

  loginUser: async ({ email, password }) => {
    try {
      const models = {
        student: StudentDb,
        teacher: TeacherDb,
        parent: ParentDb,
        admin: AdminDb,
      };

      for (const [accountType, Model] of Object.entries(models)) {
        const user = await Model.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
          return { email: user.email, accountType: user.accountType };
        }
      }

      throw new Error("Invalid email or password");
    } catch (error) {
      console.error("userService - Login error:", error.stack);
      throw error;
    }
  },

  markAttendance: async ({ studentId, status = "present" }) => {
    try {
      const student = await StudentDb.findById(studentId);
      if (!student) {
        throw new Error("Student not found");
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingAttendance = await AttendanceDb.findOne({
        studentId,
        date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      });

      if (existingAttendance) {
        throw new Error("Attendance already marked for today");
      }

      const attendance = new AttendanceDb({ studentId, date: new Date(), status });
      await attendance.save();
      return { message: "Attendance marked successfully", studentId };
    } catch (error) {
      console.error("userService - Mark attendance error:", error.stack);
      throw error;
    }
  },

  getStudents: async () => {
    try {
      const students = await StudentDb.find({}, "email photoPath faceDescriptor");
      return students;
    } catch (error) {
      console.error("userService - Get students error:", error.stack);
      throw error;
    }
  },
};

module.exports = userService;