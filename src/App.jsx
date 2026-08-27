import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import TeacherLayout from "./pages/teacher/TeacherLayout";
import TeacherDashboard from "./pages/teacher/Teacherdashboard";
import Students from "./pages/teacher/Students";
import Assignments from "./pages/teacher/Assignments";
import Attendance from "./pages/teacher/Attendance";
import Grades from "./pages/teacher/Grades";
import Timetable from "./pages/teacher/Timetable";
import Notices from "./pages/teacher/Notices";
import Exam from "./pages/teacher/Exam";
import Profile from "./pages/teacher/Profile";
import AssignmentSubmissions from "./pages/teacher/AssignmentSubmissions";


 

function App() {
  return (
 <BrowserRouter>
  <Routes>

    <Route
      path="/"
      element={<Navigate to="/teacher" replace />}
    />

    <Route path="/teacher" element={<TeacherLayout />}>
      
      <Route index element={<TeacherDashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="students" element={<Students />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="assignments" element={<Assignments />} />
      <Route
  path="assignments/submissions/:assignmentId"
  element={<AssignmentSubmissions />}
/>
      <Route path="grades" element={<Grades />} />
      <Route path="timetable" element={<Timetable />} />
      <Route path="notices" element={<Notices />} />
      <Route path="exam" element={<Exam />} />
      
  
    </Route>

  </Routes>
</BrowserRouter>
  );
}

export default App;