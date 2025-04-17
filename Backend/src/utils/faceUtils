const faceapi = require("face-api.js");
const { Canvas, Image, ImageData } = require("canvas");
const path = require("path");

// Bind the face-api.js to Node.js canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Load Face Detection Models
const faceDetectionNet = async () => {
  const modelPath = path.join(__dirname, "../models");
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath); // Face detection
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath); // Landmarks
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath); // Recognition
};

module.exports = { canvas: { Canvas, Image }, faceDetectionNet };
