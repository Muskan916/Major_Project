import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScheduleManagement = () => {
  const initialSlot = {
    time: '',
    type: 'lecture', // 'lecture' or 'lab'
    lecture: { subject: '', instructor: '', class: '' },
    lab: [
      { batch: 'B1', subject: '', instructor: '', lab: '' },
      { batch: 'B2', subject: '', instructor: '', lab: '' },
      { batch: 'B3', subject: '', instructor: '', lab: '' }
    ]
  };

  const [schedule, setSchedule] = useState({
    monday: Array(5).fill().map(() => ({ ...initialSlot })),
    tuesday: Array(5).fill().map(() => ({ ...initialSlot })),
    wednesday: Array(5).fill().map(() => ({ ...initialSlot })),
    thursday: Array(5).fill().map(() => ({ ...initialSlot })),
    friday: Array(5).fill().map(() => ({ ...initialSlot }))
  });
  const [selectedDay, setSelectedDay] = useState('monday');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSlotChange = (slotIndex, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((slot, i) =>
        i === slotIndex ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const handleLectureChange = (slotIndex, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((slot, i) =>
        i === slotIndex ? { ...slot, lecture: { ...slot.lecture, [field]: value } } : slot
      )
    }));
  };

  const handleLabChange = (slotIndex, batchIndex, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((slot, i) =>
        i === slotIndex
          ? {
              ...slot,
              lab: slot.lab.map((lab, j) =>
                j === batchIndex ? { ...lab, [field]: value } : lab
              )
            }
          : slot
      )
    }));
  };

  const saveSchedule = async () => {
    try {
      // Clean the schedule data before sending
      const cleanedSchedule = {};
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
        const slots = schedule[day].filter(slot => slot.time && slot.type);
        if (slots.length > 0) {
          cleanedSchedule[day] = slots.map(slot => {
            const cleanSlot = { time: slot.time, type: slot.type };
            if (slot.type === 'lecture' && slot.lecture.subject && slot.lecture.instructor && slot.lecture.class) {
              cleanSlot.lecture = { ...slot.lecture };
              delete cleanSlot.lab; // Exclude lab when type is lecture
            } else if (slot.type === 'lab') {
              const filteredLab = slot.lab.filter(l => l.subject && l.instructor && l.lab);
              if (filteredLab.length > 0) {
                cleanSlot.lab = filteredLab;
                delete cleanSlot.lecture; // Exclude lecture when type is lab
              } else {
                return null; // Exclude lab slots with no valid lab entries
              }
            }
            return cleanSlot;
          }).filter(s => s !== null); // Remove null entries (invalid slots)
          if (cleanedSchedule[day].length === 0) {
            delete cleanedSchedule[day]; // Remove empty days
          }
        }
      });

      // If no days have data, send an empty object
      if (Object.keys(cleanedSchedule).length === 0) {
        console.log('No data to save');
        setMessage('No schedule data to save');
        return;
      }

      console.log('Sending payload:', cleanedSchedule); // Debug log

      const response = await fetch('http://192.168.15.47:5000/api/V1/schedule/getSchedule', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedSchedule)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Schedule saved successfully!');
      } else {
        throw new Error(data.message || 'Failed to save schedule');
      }
    } catch (err) {
      setMessage('Error saving schedule: ' + err.message);
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
          <a href="/schedule" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-500">
            <i className="fas fa-clock"></i>
            <span>Schedule</span>
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
          <h1 className="text-2xl font-bold text-gray-800">Schedule Management</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Add Schedule Details</h2>
            <div className="mb-4">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
              </select>
            </div>
            {message && <p className={`mb-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
            {schedule[selectedDay].map((slot, slotIndex) => (
              <div key={slotIndex} className="mb-6 border p-4 rounded-lg">
                <h4 className="text-md font-medium mb-2">Slot {slotIndex + 1}</h4>
                <input
                  type="text"
                  placeholder="Time (e.g., 08:30am - 09:30am)"
                  value={slot.time}
                  onChange={(e) => handleSlotChange(slotIndex, 'time', e.target.value)}
                  className="w-full px-4 py-2 mb-2 border rounded-lg"
                />
                <select
                  value={slot.type}
                  onChange={(e) => handleSlotChange(slotIndex, 'type', e.target.value)}
                  className="w-full px-4 py-2 mb-2 border rounded-lg"
                >
                  <option value="lecture">Lecture</option>
                  <option value="lab">Lab</option>
                </select>

                {slot.type === 'lecture' ? (
                  <div>
                    <input
                      type="text"
                      placeholder="Subject"
                      value={slot.lecture.subject}
                      onChange={(e) => handleLectureChange(slotIndex, 'subject', e.target.value)}
                      className="w-full px-4 py-2 mb-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Instructor"
                      value={slot.lecture.instructor}
                      onChange={(e) => handleLectureChange(slotIndex, 'instructor', e.target.value)}
                      className="w-full px-4 py-2 mb-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Class (e.g., A-201 B)"
                      value={slot.lecture.class}
                      onChange={(e) => handleLectureChange(slotIndex, 'class', e.target.value)}
                      className="w-full px-4 py-2 mb-2 border rounded-lg"
                    />
                  </div>
                ) : (
                  <div>
                    {slot.lab.map((lab, batchIndex) => (
                      <div key={batchIndex} className="mb-4 border p-3 rounded-lg">
                        <h5 className="text-sm font-medium mb-2">Batch {lab.batch}</h5>
                        <input
                          type="text"
                          placeholder="Subject"
                          value={lab.subject}
                          onChange={(e) => handleLabChange(slotIndex, batchIndex, 'subject', e.target.value)}
                          className="w-full px-4 py-2 mb-2 border rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Instructor"
                          value={lab.instructor}
                          onChange={(e) => handleLabChange(slotIndex, batchIndex, 'instructor', e.target.value)}
                          className="w-full px-4 py-2 mb-2 border rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Lab (e.g., ADBE Lab)"
                          value={lab.lab}
                          onChange={(e) => handleLabChange(slotIndex, batchIndex, 'lab', e.target.value)}
                          className="w-full px-4 py-2 mb-2 border rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={saveSchedule}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Schedule
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScheduleManagement;