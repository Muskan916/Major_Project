import React, { useState } from "react";
import LogoutButton from "../components/LogoutButton";

const AdminDashboard = () => {
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
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
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
            <i className="fas fa-users"></i>
            <span>Manage Users</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-cog"></i>
            <span>Settings</span>
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
            <img src="sguicon.png" alt="SGU Logo" className="h-12 w-auto mr-4" />
            <span className="text-3xl font-bold text-gray-800">Admin Dashboard</span>
            <img src="sguicon.png" alt="SGU Logo" className="h-12 w-auto ml-4" />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome, Admin!</h2>
            <p className="text-gray-600">This is your admin dashboard. Here you can manage users, configure settings, and oversee the system.</p>
            {/* Add more content as needed */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;