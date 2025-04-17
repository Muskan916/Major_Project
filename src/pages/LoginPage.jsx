import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Dummy credentials
  const credentials = {
    teacher: { username: "teacher", password: "teacher", role: "teacher" },
    student: { username: "student", password: "student", role: "student" },
    parent: { username: "parent", password: "parent", role: "parent" },
    admin: { username: "admin", password: "admin", role: "admin" },
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = Object.values(credentials).find(
      (cred) => cred.username === username && cred.password === password
    );

    if (user) {
      setUser(user); // Set the user state in App
      navigate(`/${user.role}`); // Redirect to the appropriate dashboard
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter username"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
