import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const Attendance = () => {
  const webcamRef = useRef(null);
  const [message, setMessage] = useState("");

  const captureAndSubmit = async () => {
    setMessage(""); // Clear previous messages
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage("Unable to capture image.");
      return;
    }

    try {
      const blob = await fetch(imageSrc).then(res => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "face.jpg");

      const response = await axios.post("http://localhost:5000/upload", formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-md" />
      <button
        onClick={captureAndSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Mark Attendance
      </button>
      {message && <p className="mt-4 text-center text-lg">{message}</p>}
    </div>
  );
};

export default Attendance;
