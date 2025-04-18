import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const TeacherDashboard = ({ setUser }) => {
  const webcamRef = useRef(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // Track the active tab
  const [message, setMessage] = useState(""); // Display backend response messages
  const [loading, setLoading] = useState(false); // Handle loading state

  // Function to capture an image and submit to backend
  const captureAndSubmit = async () => {
    setMessage(""); // Clear any existing messages
    const imageSrc = webcamRef.current.getScreenshot(); // Capture image from webcam

    if (!imageSrc) {
      setMessage("Failed to capture image.");
      return;
    }

    try {
      setLoading(true);

      // Convert the image to a Blob and send it to the backend
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "face.jpg");

      const response = await axios.post("http://localhost:5000/attendance/mark", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message || "Attendance marked successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      {isSidebarOpen && (
        <aside className="fixed top-0 left-0 z-50 w-64 h-full bg-blue-700 text-white shadow-lg flex flex-col">
          <div className="p-6 text-center bg-blue-800">
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              &times;
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-6">
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center space-x-3 text-lg p-2 rounded-md ${
                    activeTab === "dashboard" ? "bg-blue-600" : "hover:bg-blue-600"
                  }`}
                >
                  <i className="fas fa-home"></i>
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={`flex items-center space-x-3 text-lg p-2 rounded-md ${
                    activeTab === "attendance" ? "bg-blue-600" : "hover:bg-blue-600"
                  }`}
                >
                  <i className="fas fa-clipboard-list"></i>
                  <span>Attendance</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("calendar")}
                  className={`flex items-center space-x-3 text-lg p-2 rounded-md ${
                    activeTab === "calendar" ? "bg-blue-600" : "hover:bg-blue-600"
                  }`}
                >
                  <i className="fas fa-calendar-alt"></i>
                  <span>Calendar</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-md py-4 px-6 flex items-center">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-blue-700 text-2xl mr-4"
          >
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">
            Teacher Dashboard
          </h2>
        </header>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "dashboard" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Dashboard Overview</h3>
              <p>Welcome to the dashboard!</p>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Mark Attendance</h3>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded shadow-md w-72 h-72 mb-4"
              />
              <button
                onClick={captureAndSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Capture & Submit"}
              </button>
              {message && (
                <p
                  className={`mt-4 text-center ${
                    message.includes("Error") ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Calendar</h3>
              <p>Here, you can manage your events and view schedules.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
