import React, { useState } from 'react';
import LogoutButton from '../components/LogoutButton';

const Contact = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
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
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-info-circle"></i>
            <span>About</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-book"></i>
            <span>Courses</span>
          </a>
          <a href="/login" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-sign-in-alt"></i>
            <span>Login</span>
          </a>
          <a href="/signup" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-500 text-white transition-colors">
            <i className="fas fa-user-plus"></i>
            <span>Sign Up</span>
          </a>
          <a href="/contact" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-envelope"></i>
            <span>Contact</span>
          </a>
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
            <span className="text-3xl font-bold text-gray-800">Contact Us</span>
          </div>
        </header>

        {/* Contact Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-yellow-400 mr-3"></i>
                    <p>123 Anywhere St, Any City, ST 12345</p>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-phone-alt text-yellow-400 mr-3"></i>
                    <p>123-456-7890</p>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-yellow-400 mr-3"></i>
                    <p>hello@reallygreatsite.com</p>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-globe text-yellow-400 mr-3"></i>
                    <p>www.reallygreatsite.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Contact;