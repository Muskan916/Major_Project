import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const TeacherCalendar = () => {
  const events = [
    { title: "Math Class", start: "2025-02-07T10:00:00", end: "2025-02-07T12:00:00" },
    { title: "Science Class", start: "2025-02-08T14:00:00", end: "2025-02-08T16:00:00" },
    { title: "Parent Meeting", start: "2025-02-09T09:00:00", end: "2025-02-09T10:30:00" },
  ];

  return (
    <div className="p-4 flex-1">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
      />
    </div>
  );
};

export default TeacherCalendar;
