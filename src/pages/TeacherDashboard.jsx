import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const TeacherDashboard = ({ setUser }) => {
  const webcamRef = useRef(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to capture an image and submit to backend
  const captureAndSubmit = async () => {
    setMessage("");
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <h1 className="text-xl font-bold">Teacher Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-2xl text-white"
          >
            &times;
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
              activeTab === "dashboard"
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-700"
            }`}
          >
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
              activeTab === "attendance"
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-700"
            }`}
          >
            <i className="fas fa-clipboard-list"></i>
            <span>Attendance</span>
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
              activeTab === "calendar"
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-700"
            }`}
          >
            <i className="fas fa-calendar-alt"></i>
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setUser(null)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between lg:justify-start">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-blue-600 text-2xl"
          >
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">Teacher Dashboard</h2>
        </header>

        {/* Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {activeTab === "dashboard" && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Dashboard Overview
              </h3>
              <p className="text-gray-600">
                Welcome to your Teacher Dashboard! Manage attendance, view schedules, and
                more.
              </p>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Mark Attendance
              </h3>
              <div className="flex flex-col items-center">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="rounded-lg shadow-md w-full max-w-md mb-4"
                />
                <button
                  onClick={captureAndSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Calendar</h3>
              <p className="text-gray-600">
                Manage your events and view schedules here. (Add calendar component here.)
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;