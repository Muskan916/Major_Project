const userService = require("../service/userService.js");

const signup = async (req, res) => {
  try {
    console.log("Signup controller - Request body:", req.body);
    console.log("Signup controller - Uploaded file:", req.file);
    console.log("Signup controller - Face descriptor:", req.faceDescriptor);

    const { email, password, accountType } = req.body;
    const photoPath = req.file ? req.file.path : null;
    const faceDescriptor = req.faceDescriptor || null;

    if (!email || !password || !accountType) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({ message: "Email, password, and account type are required" });
    }
    if (accountType === "student" && !photoPath) {
      console.log("Validation failed: Photo required for student");
      return res.status(400).json({ message: "Photo is required for student accounts" });
    }

    console.log("Calling userService.createUser with:", { email, password, accountType, photoPath, faceDescriptor });
    const result = await userService.createUser({
      email,
      password,
      accountType,
      photoPath,
      faceDescriptor,
    });
    console.log("Signup successful, result:", result);
    res.status(201).json(result);
  } catch (error) {
    console.error("Signup controller error:", error.message, error.stack);
    res.status(error.status || 500).json({ message: error.message || "Internal server error during signup" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await userService.loginUser({ email, password });
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(401).json({ message: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { studentId, status } = req.body;
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }
    const result = await userService.markAttendance({ studentId, status });
    res.status(200).json(result);
  } catch (error) {
    console.error("Attendance error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await userService.getStudents();
    res.status(200).json(students);
  } catch (error) {
    console.error("Get students error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { signup, login, markAttendance, getStudents };