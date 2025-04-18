const { recognizeFace } = require("../service/faceRecognitionService");
const Student = require("../database/StudentDb");
const ApiResponse = require("../utils/api-response");

const markAttendance = async (req, res) => {
  try {
    const uploadedImage = req.files.image;
    const matchedStudents = await recognizeFace(uploadedImage);

    if (!matchedStudents.length) {
      return res.status(404).json(new ApiResponse(404, "No match found.", "No matching student was detected."));
    }

    await Promise.all(
      matchedStudents.map((studentName) =>
        Student.updateOne(
          { name: studentName },
          { $push: { attendance: { date: new Date().toISOString() } } }
        )
      )
    );

    res.status(200).json(new ApiResponse(200, "Attendance marked successfully!", "Students matched.", matchedStudents));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Internal Server Error", error.message));
  }
};

module.exports = { markAttendance };
