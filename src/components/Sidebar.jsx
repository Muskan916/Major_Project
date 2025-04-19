import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const roleMenus = {
    admin: ["Dashboard", "Users", "Reports"],
    teacher: ["Dashboard", "Attendance", "Calendar"],
    student: ["Dashboard", "Grades", "Schedule"],
    parent: ["Dashboard", "Student Progress", "Notifications"],
  };

  const menuItems = roleMenus[user.role] || ["Dashboard"];

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-blue-600 p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>
      <div
        className={`fixed md:static top-0 left-0 z-40 h-full w-64 bg-blue-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 bg-blue-900 text-center">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="rounded-full mx-auto w-16 h-16 border-2 border-white"
          />
          <h2 className="mt-3 text-lg font-bold">{user.username}</h2>
          <p className="text-sm capitalize">{user.role}</p>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={`/${user.role}/${item.toLowerCase().replace(" ", "-")}`}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <i className={`fas fa-${getIcon(item)}`}></i>
                  <span>{item}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="absolute bottom-4 w-full text-center text-sm">Version: 0.20</p>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

const getIcon = (item) => {
  const icons = {
    Dashboard: "home",
    Attendance: "clipboard-list",
    Calendar: "calendar-alt",
    Users: "users",
    Reports: "chart-bar",
    Grades: "book",
    Schedule: "clock",
    "Student Progress": "chart-line",
    Notifications: "bell",
  };
  return icons[item] || "circle";
};

export default Sidebar;