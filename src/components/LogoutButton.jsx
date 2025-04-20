import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // Redirect to the signup page
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-left"
    >
      <i className="fas fa-sign-out-alt mr-2"></i>Logout
    </button>
  );
};

export default LogoutButton;