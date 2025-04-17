import React, { useState } from "react";
import LogoutButton from "../components/LogoutButton";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";


const TeacherDashboard = ({setUser}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      {isSidebarOpen && (
        <aside className="fixed top-0 left-0 z-50 w-64 h-full bg-blue-700 text-white shadow-lg flex flex-col">
          <div className="p-6 text-center bg-blue-800">
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              &times;
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-6">
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 text-lg hover:bg-blue-600 p-2 rounded-md"
                >
                  <i className="fas fa-home"></i>
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 text-lg hover:bg-blue-600 p-2 rounded-md"
                >
                  <i className="fas fa-user-graduate"></i>
                  <span>Students</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 text-lg hover:bg-blue-600 p-2 rounded-md"
                >
                  <i className="fas fa-calendar-alt"></i>
                  <span>Calendar</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 text-lg hover:bg-blue-600 p-2 rounded-md"
                >
                  <i className="fas fa-chart-line"></i>
                  <span>Reports</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-md py-4 px-6 flex items-center">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-blue-700 text-2xl mr-4"
          >
            <i className="fas fa-bars"></i>
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome to the Teacher Dashboard
          </h2>
        </header>

        {/* Calendar Section */}
        <div className="p-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Calendar
            </h3>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek,dayGridDay",
              }}
              events={[
                { title: "Math Exam", start: "2025-03-10" },
                { title: "Parent Meeting", start: "2025-03-15" },
              ]}
            />
          </div>
        </div>
      </main>
            <LogoutButton setUser={setUser} />

    </div>
  );
};

export default TeacherDashboard;
