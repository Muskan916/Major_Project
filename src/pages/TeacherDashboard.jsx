import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [manualAttendance, setManualAttendance] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://192.168.15.47:5000/api/V1/users/students');
        const data = await response.json();
        if (response.ok) {
          setStudents(data);
        } else {
          setError(data.message || 'Failed to fetch students');
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to fetch students');
      }
    };
    fetchStudents();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Failed to access webcam');
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  };

  const recognizeFace = async () => {
    if (!videoRef.current || !students.length) {
      setError('Cannot recognize face: No students or webcam not started');
      return;
    }

    setIsRecognizing(true);
    const imageDataUrl = captureImage();
    if (!imageDataUrl) {
      setError('Failed to capture image from webcam');
      setIsRecognizing(false);
      return;
    }

    try {
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('image', blob, 'webcam.jpg');

      const recognitionResponse = await fetch('http://192.168.15.47:5000/recognize', {
        method: 'POST',
        body: formData,
      });

      const recognitionData = await recognitionResponse.json();
      console.log('Recognition response:', recognitionData);

      if (recognitionResponse.ok && recognitionData.studentId) {
        const student = students.find((s) => s._id === recognitionData.studentId);
        await markAttendance(recognitionData.studentId);
        alert(`Attendance marked for ${student.email} (Distance: ${recognitionData.distance.toFixed(2)})`);
      } else {
        setError(recognitionData.error || 'No student recognized. Try again or mark manually.');
      }
    } catch (err) {
      console.error('Error recognizing face:', err);
      setError('Failed to recognize face');
    } finally {
      setIsRecognizing(false);
    }
  };

  const markAttendance = async (studentId) => {
    try {
      const response = await fetch('http://192.168.15.47:5000/api/V1/users/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark attendance');
      }
      return data;
    } catch (err) {
      console.error('Error marking attendance:', err);
      throw err;
    }
  };

  const handleManualAttendance = async () => {
    if (!manualAttendance) return;
    try {
      await markAttendance(manualAttendance);
      alert('Attendance marked manually');
      setManualAttendance(null);
    } catch (err) {
      setError('Failed to mark attendance manually');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white">
        <div className="p-4 border-b border-blue-700">
          <h2 className="text-xl font-bold">Teacher Dashboard</h2>
        </div>
        <nav className="p-4 space-y-2">
          <a href="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700">
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700">
            <i className="fas fa-calendar"></i>
            <span>Calendar</span>
          </a>
          <a href="/schedule" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700">
            <i className="fas fa-clock"></i>
            <span>Schedule</span>
          </a>
          <a href="/view-schedule" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700">
            <i className="fas fa-eye"></i>
            <span>View Schedule</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-500">
            <i className="fas fa-check-circle"></i>
            <span>Attendance</span>
          </a>
          <button
            onClick={() => navigate('/signup')}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 w-full text-left"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4">
          <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Mark Attendance via Face Recognition</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <video ref={videoRef} autoPlay className="w-full max-w-md rounded-lg" />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <button
                onClick={startVideo}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start Webcam
              </button>
              <button
                onClick={recognizeFace}
                disabled={isRecognizing}
                className={`mt-2 ml-2 px-4 py-2 ${isRecognizing ? 'bg-gray-400' : 'bg-green-600'} text-white rounded-lg hover:bg-green-700`}
              >
                {isRecognizing ? 'Recognizing...' : 'Recognize Face'}
              </button>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Manual Attendance</h3>
              <select
                value={manualAttendance || ''}
                onChange={(e) => setManualAttendance(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.email}
                  </option>
                ))}
              </select>
              <button
                onClick={handleManualAttendance}
                disabled={!manualAttendance}
                className={`mt-2 px-4 py-2 ${!manualAttendance ? 'bg-gray-400' : 'bg-blue-600'} text-white rounded-lg hover:bg-blue-700`}
              >
                Mark Manually
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;