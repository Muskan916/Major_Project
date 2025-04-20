import React, { useState, useEffect, useRef } from "react";
import LogoutButton from "../components/LogoutButton";

const BASE_URL = "http://192.168.117.47:5000/api";

const TeacherDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [attendancePhoto, setAttendancePhoto] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const loadFaceApiModels = async () => {
      if (!window.faceapi) {
        setError("FaceAPI.js not loaded");
        return;
      }
      try {
        await window.faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await window.faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await window.faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        console.log('FaceAPI models loaded');
      } catch (err) {
        setError("Failed to load FaceAPI models: " + err.message);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/V1/users/students`);
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          setError("Failed to fetch students");
        }
      } catch (err) {
        setError("Error fetching students: " + err.message);
      }
    };

    loadFaceApiModels();
    fetchStudents();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraOn(false);
    }
    setAttendancePhoto(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setAttendancePhoto(file);
    }, 'image/jpeg');
  };

  const markAttendance = async () => {
    if (!attendancePhoto) {
      setError("Please capture a photo for attendance");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const faceapi = window.faceapi;
      if (!faceapi) {
        setError("FaceAPI.js not available");
        return;
      }

      const img = await faceapi.bufferToImage(attendancePhoto);
      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        setError("No face detected in the photo");
        setAttendancePhoto(null);
        return;
      }

      const inputDescriptor = detections.descriptor;

      for (const student of students) {
        if (!student.photoPath) continue;

        const studentImg = await faceapi.fetchImage(`${BASE_URL.replace('/api', '')}/${student.photoPath}`);
        const studentDetections = await faceapi
          .detectSingleFace(studentImg)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!studentDetections) continue;

        const distance = faceapi.euclideanDistance(inputDescriptor, studentDetections.descriptor);
        if (distance < 0.6) {
          try {
            const response = await fetch(`${BASE_URL}/V1/users/attendance`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ studentId: student._id }),
            });

            if (response.ok) {
              const data = await response.json();
              setSuccess(`Attendance marked for ${student.email}`);
              setAttendancePhoto(null);
              return;
            } else {
              const errorData = await response.json();
              setError(errorData.message);
              return;
            }
          } catch (err) {
            setError("Error marking attendance: " + err.message);
            return;
          }
        }
      }

      setError("No matching student found");
      setAttendancePhoto(null);
    } catch (err) {
      console.error("Face recognition error:", err);
      setError("Error processing photo: " + err.message);
      setAttendancePhoto(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <h2 className="text-xl font-bold">Teacher Dashboard</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-2xl text-white"
          >
            ×
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <a
            href="#"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-chalkboard-teacher"></i>
            <span>Classes</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-calendar"></i>
            <span>Schedule</span>
          </a>
          <div className="p-3">
            <LogoutButton />
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex items-center justify-between lg:justify-start">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-blue-600 text-2xl"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="flex items-center justify-center flex-1">
            <img src="sguicon.png" alt="SGU Logo" className="h-12 w-auto mr-4" />
            <span className="text-3xl font-bold text-gray-800">Teacher Dashboard</span>
            <img src="sguicon.png" alt="SGU Logo" className="h-12 w-auto ml-4" />
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome, Teacher!</h2>
            <p className="text-gray-600 mb-6">Mark student attendance using live photo capture.</p>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Mark Attendance</h3>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Live Photo Capture</label>
                {!isCameraOn ? (
                  <button
                    onClick={startCamera}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Camera
                  </button>
                ) : (
                  <div>
                    <video ref={videoRef} autoPlay className="w-full max-w-md rounded-lg mb-2" />
                    <div className="flex space-x-2">
                      <button
                        onClick={capturePhoto}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Capture Photo
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Stop Camera
                      </button>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <button
                onClick={markAttendance}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!attendancePhoto}
              >
                Mark Attendance
              </button>
              {error && <p className="text-red-500 mt-4">{error}</p>}
              {success && <p className="text-green-500 mt-4">{success}</p>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;