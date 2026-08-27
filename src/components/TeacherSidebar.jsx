import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { PiStudentFill } from "react-icons/pi";
import { FaClipboardCheck } from "react-icons/fa";
import { MdAssignmentAdd } from "react-icons/md";
import { MdOutlineGrade } from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu";
import { MdNotificationsActive } from "react-icons/md";
 import { IoIosNotifications } from "react-icons/io";
 import { PiChalkboardTeacherLight } from "react-icons/pi";
function TeacherSidebar() {
  return (
    <aside className="teacher-sidebar">
      <div className="sidebar-logo">
        <h2> The <span>𝓓𝓐𝓦𝓝 𝓡𝓐𝓨𝓢</span></h2>
        <p>Teacher Dashboard</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/teacher" end>
   <RxDashboard />Dashboard
        </NavLink>



        <NavLink to="/teacher/profile">
           <PiChalkboardTeacherLight />Teacher Profile
        </NavLink>

        <NavLink to="/teacher/students">
          <PiStudentFill /> Students
        </NavLink>

        <NavLink to="/teacher/attendance">
            <FaClipboardCheck />Attendance
        </NavLink>

        <NavLink to="/teacher/assignments">
           <MdAssignmentAdd /> Assignments
        </NavLink>

        <NavLink to="/teacher/grades">
             <MdOutlineGrade />Grades
        </NavLink>

        <NavLink to="/teacher/timetable">
            <LuCalendarDays />Timetable
        </NavLink>

        <NavLink to="/teacher/notices">
         <MdNotificationsActive /> Notices
        </NavLink>
          <NavLink to="/teacher/exam">
        <IoIosNotifications /> Exams
        </NavLink>
      </nav>
    </aside>
  );
}

export default TeacherSidebar;