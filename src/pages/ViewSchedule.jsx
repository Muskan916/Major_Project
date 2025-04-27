import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewSchedule = () => {
  const [schedule, setSchedule] = useState({});
  const [selectedDay, setSelectedDay] = useState('monday');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch('http://192.168.15.47:5000/api/V1/schedule/getSchedule', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch schedule');
        const data = await response.json();
        setSchedule(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const slots = schedule[selectedDay] || [];

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
          <a href="/view-schedule" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-500">
            <i className="fas fa-eye"></i>
            <span>View Schedule</span>
          </a>
          <a href="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700">
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
          <h1 className="text-2xl font-bold text-gray-800">View Schedule</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <>
                <div className="mb-4 flex space-x-2">
                  {days.map(day => (
                    <button
                      key={day}
                      className={`px-4 py-2 rounded-lg ${day === selectedDay ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </button>
                  ))}
                </div>
                {slots.length === 0 ? (
                  <p>No schedule data available for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}.</p>
                ) : (
                  slots.map((slot, index) => (
                    <div key={index} className="mb-4 p-4 bg-blue-100 rounded-lg">
                      <p className="font-semibold">{slot.time}</p>
                      {slot.type === 'lecture' && slot.lecture && (
                        <div>
                          <p>Subject: {slot.lecture.subject}</p>
                          <p>Instructor: {slot.lecture.instructor}</p>
                          <p>Class: {slot.lecture.class}</p>
                        </div>
                      )}
                      {slot.type === 'lab' && slot.lab && slot.lab.map((lab, labIndex) => (
                        <div key={labIndex} className="mt-2">
                          <p>Practical: {lab.subject}</p>
                          <p>Instructor: {lab.instructor}</p>
                          <p>Lab: {lab.lab}</p>
                          <p>Batch: {lab.batch}</p>
                        </div>
                      ))}
                      {index === 2 && (
                        <div className="mt-4 p-4 bg-yellow-300 rounded-lg text-center">
                          LUNCH BREAK (45 MIN) [12:30pm - 1:15pm]
                        </div>
                      )}
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewSchedule;