import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const AttendancePage = () => {
  const webcamRef = useRef(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const captureAndSubmit = async () => {
    setMessage("");
    if (!webcamRef.current) {
      setMessage("Webcam is not accessible.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage("Failed to capture image.");
      return;
    }

    try {
      setLoading(true);
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "face.jpg");

      const response = await axios.post(
        "http://localhost:5000/attendance/mark",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(response.data.message || "Attendance marked successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error occurred while marking attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded shadow-md w-72 h-72"
      />
      <button
        onClick={captureAndSubmit}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Submitting..." : "Mark Attendance"}
      </button>
      {message && (
        <p className={`mt-4 text-center ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AttendancePage;
