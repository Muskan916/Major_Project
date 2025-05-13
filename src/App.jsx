import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './pages/LoginPage'; // Replace with your actual login component
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ScheduleManagement from './pages/ScheduleManagement';
import ViewSchedule from './pages/ViewSchedule';
import AddSyllabus from './pages/Syllabus';
import ViewSyllabus from './pages/ViewSyllabus';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import Attendance from './pages/Attendance.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/schedule" element={<ScheduleManagement />} />
        <Route path="/view-schedule" element={<ViewSchedule />} />
        <Route path="/add-syllabus" element={<AddSyllabus />} />
        <Route path="/view-syllabus" element={<ViewSyllabus />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/attendance" element={<Attendance />} />

      </Routes>
    </Router>
  );
}

export default App;