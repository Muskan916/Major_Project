import React from "react";
import Sidebar from "../pages/";
import LogoutButton from "./LogoutButton";

const DashboardLayout = ({ user, setUser, children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user.username}</span>
            <LogoutButton setUser={setUser} />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;