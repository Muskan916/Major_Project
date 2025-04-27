const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file) return cb(null, true);
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

const handleMulterError = (err, req, res, next) => {
  console.error("Multer error:", err.message, err.stack);
  res.status(400).json({ message: `Multer error: ${err.message}` });
};

const captureRawBody = (req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    let rawBody = "";
    req.on("data", (chunk) => {
      rawBody += chunk.toString("binary").slice(0, 2000);
    });
    req.on("end", () => {
      console.log("Raw multipart body (first 2000 chars):", rawBody);
      next();
    });
  } else {
    next();
  }
};

router.post(
  "/signup",
  captureRawBody,
  express.urlencoded({ extended: true }),
  express.json(),
  (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    const accountType = req.body.accountType || req.query.accountType || "";
    console.log("Signup route - Content-Type:", contentType);
    console.log("Signup route - Headers:", req.headers);
    console.log("Signup route - Raw body:", req.body);
    console.log("Signup route - Detected accountType:", accountType);

    if (accountType === "student") {
      console.log("Multer - Processing student upload (temporary bypass)");
      upload.single("photo")(req, res, async (err) => {
        console.log("Multer upload.single - Result:", {
          body: req.body,
          file: req.file,
          err: err ? err.message : null
        });
        if (err) {
          console.warn("Multer error ignored for testing:", err.message);
        }
        if (!req.file) {
          console.log("No file uploaded, using placeholder");
          req.file = { path: "uploads/placeholder.jpg" }; // Placeholder
        }
        req.faceDescriptor = null;
        next();
      });
    } else {
      console.log("Skipping Multer for non-student");
      next();
    }
  },
  (req, res, next) => {
    console.log("Signup route - Parsed body:", req.body);
    console.log("Signup route - Uploaded file:", req.file);
    console.log("Signup route - Face descriptor:", req.faceDescriptor);
    next();
  },
  userController.signup
);
router.post("/recognize", async (req, res) => {
  try {
    const image = req.files.image; // Assuming you're using express-fileupload
    const studentId = await faceRecognitionService.recognizeFace(image.data); // Implement this function
    res.json({ studentId });
  } catch (error) {
    console.error("Face recognition error:", error);
    res.status(500).json({ error: "Face recognition failed" });
  }
});
router.post("/login", userController.login);
router.post("/attendance", userController.markAttendance);
router.get("/students", userController.getStudents);

module.exports = router;