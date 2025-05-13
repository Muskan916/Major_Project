import React, { useState } from 'react';
import LogoutButton from '../components/LogoutButton';
import Sidebar from '../components/Sidebar';

const TeacherDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activePath="/teacher-dashboard" />


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
          <div className="flex items-center justify-center flex-1">
            <span className="text-3xl font-bold text-gray-800">Teacher Dashboard</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome, Teacher!</h2>
            <p className="text-gray-600">This is your teacher dashboard. Use the sidebar to navigate to different sections like Calendar, Schedule, and Attendance.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard; 