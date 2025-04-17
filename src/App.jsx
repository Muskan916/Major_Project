import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

const App = () => {
  const [user, setUser] = useState(null); // Manage the logged-in user state

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
      setUser(loggedInUser); // Set the logged-in user state
    } else {
      alert("Invalid username or password.");
    }
  };

  // Handle user authentication and routing
  if (user) {
    return (
      <Router>
        <Routes>
          {/* Redirect user to their respective dashboard */}
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
    <div>
      {/* Title Section */}
      <div className="title-container">
        <img src="sguicon.png" alt="SGU Logo" className="title-logo left" />
        <span>Muskan Latkar</span>
        <img src="sguicon.png" alt="SGU Logo" className="title-logo right" />
      </div>

      {/* Sidebar Navigation */}
      <div className="sidebar">
        <h2>Navigation</h2>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Courses</a></li>
          <li><a href="#">Login</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <div className="login-box">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
              </div>

              <div className="buttons">
                <button type="submit" className="btn">Submit</button>
                <button type="reset" className="btn">Clear</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
