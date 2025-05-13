import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const Sidebar = ({ activePath }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { path: '/teacher-dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '#', icon: 'fas fa-calendar', label: 'Calendar' },
    { path: '/schedule', icon: 'fas fa-clock', label: 'Schedule' },
    { path: '/view-schedule', icon: 'fas fa-eye', label: 'View Schedule' },
    { path: '/attendance', icon: 'fas fa-check-circle', label: 'Attendance' },
    { path: '/add-syllabus', icon: 'fas fa-plus', label: 'Add Syllabus' },
    { path: '/view-syllabus', icon: 'fas fa-book', label: 'View Syllabus' },

  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activePath === link.path ? 'bg-blue-500' : 'hover:bg-blue-700'
            }`}
            onClick={() => setSidebarOpen(false)} // Close sidebar on link click (mobile)
          >
            <i className={link.icon}></i>
            <span>{link.label}</span>
          </Link>
        ))}
        <div className="p-3">
          <LogoutButton />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;