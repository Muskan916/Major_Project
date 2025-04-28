const express = require("express");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const path = require("path");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route handling
app.use("/api/V1/schedule", require("./src/routes/scheduleRoutes.js"))
app.use('/api/V1/syllabus', require("./src/routes/syllabusRoutes.js"))
app.use("/api/V1/users", require("./src/routes/user-routes.js"));
app.use('/uploads', express.static('uploads')); // Serve uploaded photos


app.get("/", (req, res) => res.send("Server is running!"));

// MongoDB connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.DB_NAME}`,
  )
  .then(() => {
    console.log("MongoDB connected successfully.");
    app.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
