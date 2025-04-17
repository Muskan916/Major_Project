const faceapi = require("face-api.js");
const { canvas, faceDetectionNet } = require("../utils/faceUtils");
const Student = require("../database/StudentDb");

const recognizeFace = async (uploadedImage) => {
  await faceDetectionNet();

  const image = await canvas.loadImage(uploadedImage.path);
  const detections = await faceapi
    .detectAllFaces(image)
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (!detections.length) throw new Error("No faces detected in the image.");

  const students = await Student.find();
  const faceMatcher = new faceapi.FaceMatcher(
    students.map((s) => new faceapi.LabeledFaceDescriptors(s.name, s.faceDescriptor)),
    0.6
  );

  return detections.map((d) => faceMatcher.findBestMatch(d.descriptor).label);
};

module.exports = { recognizeFace };
