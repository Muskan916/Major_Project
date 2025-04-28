import React, { useState } from 'react';
import LogoutButton from '../components/LogoutButton';

const TeacherDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
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
            href="/dashboard"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-calendar"></i>
            <span>Calendar</span>
          </a>
          <a
            href="/schedule"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-clock"></i>
            <span>Schedule</span>
          </a>
          <a
            href="/view-schedule"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-eye"></i>
            <span>View Schedule</span>
          </a>
          <a
            href="/add-syllabus"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-eye"></i>
            <span>Add Syllabus</span>
          </a>
          <a
            href="/view-syllabus"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-eye"></i>
            <span>View Syllabus</span>
          </a>
          <a
            href="/attendance"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-check-circle"></i>
            <span>Attendance</span>
          </a>
          <div className="p-3">
            <LogoutButton />
          </div>
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