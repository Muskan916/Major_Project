import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Signup from "./Signup";

const App = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    // Dummy credentials
    const credentials = {
      student: { username: "student", password: "student", role: "student" },
      parent: { username: "parent", password: "parent", role: "parent" },
      teacher: { username: "teacher", password: "teacher", role: "teacher" },
      admin: { username: "admin", password: "admin", role: "admin" },
    };

    // Validate credentials
    const loggedInUser = Object.values(credentials).find(
      (cred) => cred.username === username && cred.password === password
    );

    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      alert("Invalid username or password.");
    }
  };

  // Handle user authentication and routing
  if (user) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={`/${user.role}`} />} />
          <Route
            path="/admin"
            element={
              user.role === "admin" ? (
                <AdminDashboard setUser={setUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/parent"
            element={
              user.role === "parent" ? (
                <ParentDashboard setUser={setUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/student"
            element={
              user.role === "student" ? (
                <StudentDashboard setUser={setUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/teacher"
            element={
              user.role === "teacher" ? (
                <TeacherDashboard setUser={setUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex min-h-screen bg-gray-100">
              {/* Sidebar */}
              <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <div className="flex items-center justify-between p-4 border-b border-blue-700">
                  <h2 className="text-xl font-bold">Navigation</h2>
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
                    <i className="fas fa-info-circle"></i>
                    <span>About</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <i className="fas fa-book"></i>
                    <span>Courses</span>
                  </a>
                  <a
                    href="/"
                    className="flex items-center space-x-3 p-3 rounded-lg bg-blue-500 text-white transition-colors"
                  >
                    <i className="fas fa-sign-in-alt"></i>
                    <span>Login</span>
                  </a>
                  <a
                    href="/signup"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <i className="fas fa-user-plus"></i>
                    <span>Sign Up</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
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
                    <img src="sguicon.png" alt="SGU Logo" className="h-12 w-auto mr-4" />
                    <span className="text-3xl font-bold text-gray-800">Muskan Latkar</span>
                    <img src="sguicon.png" alt="SGU Logo" className="h-12 w-auto ml-4" />
                  </div>
                </header>

                {/* Login Form */}
                <main className="flex-1 flex items-center justify-center p-6">
                  <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Submit
                        </button>
                        <button
                          type="reset"
                          className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </form>
                    <p className="text-center mt-4 text-gray-600">
                      Don't have an account?{" "}
                      <a href="/signup" className="text-blue-600 hover:underline">
                        Sign Up
                      </a>
                    </p>
                  </div>
                </main>
              </div>
            </div>
          }
        />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;