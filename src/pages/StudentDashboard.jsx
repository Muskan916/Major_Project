import React from "react";
import LogoutButton from "../components/LogoutButton";

const StudentDashboard = ({setUser}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-700">Student Dashboard</h1>
      <p className="mt-4 text-lg text-gray-600">Welcome to the Student Dashboard!</p>
      <LogoutButton setUser={setUser} />
    </div>
  );
};

export default StudentDashboard;
