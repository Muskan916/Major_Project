import React, { useState } from "react";

const SidebarOverlay = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-blue-700 text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-white text-2xl focus:outline-none"
        >
          &times;
        </button>

        {/* Profile Section */}
        <div className="p-6 bg-blue-800 text-center">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="rounded-full mx-auto w-20 h-20 border-2 border-white"
          />
          <h2 className="mt-3 text-xl font-bold">Mr. Aryan Anil Jain</h2>
          <p className="text-sm">SF24IT105</p>
          <p className="text-sm">SEMESTER I</p>
        </div>

        {/* Menu Items */}
        <div className="mt-6">
          <ul className="space-y-4 px-4">
            {[
              "Dashboard",
              "Attendance",
              "Syllabus",
              "Schedule",
              "Fees",
              "Profile",
              "D-Wallet",
              "E-Learning",
              "Examination",
            ].map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="block p-2 rounded-md hover:bg-blue-600 text-lg"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Version */}
        <p className="mt-auto text-center text-sm absolute bottom-4 w-full">
          Version: 0.20
        </p>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "blur-sm" : "blur-none"
        }`}
      >
        <header className="bg-white shadow-md py-4 px-6 flex items-center">
          {/* Hamburger Menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-blue-700 text-2xl mr-4"
          >
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome to the Dashboard
          </h1>
        </header>

        <main className="p-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Dashboard Content
            </h3>
            <p>This is the main content of the dashboard.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarOverlay;
