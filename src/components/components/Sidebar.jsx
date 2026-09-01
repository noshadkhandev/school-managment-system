import {
  LayoutDashboard,
  Users,
  UserRound,
  BookOpen,
  GraduationCap,
  Wallet,
  School,
  CalendarCheck,
  Clock3,
  FileText,
  ClipboardList,
  Bell,
  CalendarOff,
  UserRoundCheck,
  Library,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Activity,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");

    navigate("/login", {
      replace: true,
    });
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: Users,
    },
    {
      name: "Teachers",
      path: "/admin/teachers",
      icon: UserRound,
    },
    {
      name: "Courses",
      path: "/admin/courses",
      icon: BookOpen,
    },
    {
      name: "Classes",
      path: "/admin/classes",
      icon: School,
    },
    {
      name: "Attendance",
      path: "/admin/attendance",
      icon: CalendarCheck,
    },
    {
      name: "Timetable",
      path: "/admin/timetable",
      icon: Clock3,
    },
    {
      name: "Exams",
      path: "/admin/exams",
      icon: FileText,
    },
    {
      name: "Results",
      path: "/admin/results",
      icon: GraduationCap,
    },
    {
      name: "Fees",
      path: "/admin/fees",
      icon: Wallet,
    },
    {
      name: "Assignments",
      path: "/admin/assignments",
      icon: ClipboardList,
    },
    {
      name: "Notices",
      path: "/admin/notices",
      icon: Bell,
    },
    {
      name: "Leave Requests",
      path: "/admin/leave-requests",
      icon: CalendarOff,
    },
    {
      name: "Parents",
      path: "/admin/parents",
      icon: UserRoundCheck,
    },
    {
      name: "Library",
      path: "/admin/library",
      icon: Library,
    },
    {
      name: "Messages",
      path: "/admin/messages",
      icon: MessageSquare,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: BarChart3,
    },
    {
      name: "Users & Roles",
      path: "/admin/users-roles",
      icon: ShieldCheck,
    },
    {
      name: "Activity Logs",
      path: "/admin/activity-logs",
      icon: Activity,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <span className="sidebar-label">
          MAIN MENU
        </span>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              data-tooltip={item.name}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            A
          </div>

          <div className="sidebar-user-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
        </div>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;