import { useState } from "react";

import {
  Bell,
  Search,
  ChevronDown,
  Menu,
  User,
  Settings,
  LogOut,
  X,
  Table2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfile, setShowProfile] =
    useState(false);

  const notifications = [
    {
      id: 1,
      title: "New student registered",
      message: "Hammad Qadeer has registered.",
      time: "5 min ago",
    },
    {
      id: 2,
      title: "Fee payment received",
      message: "Nasir Karim paid semester fee.",
      time: "20 min ago",
    },
    {
      id: 3,
      title: "Result pending",
      message: "3 results are waiting for approval.",
      time: "1 hour ago",
    },
  ];

  // =====================================
  // SEARCH
  // =====================================

  const handleSearch = (e) => {
    e.preventDefault();

    const value = search
      .trim()
      .toLowerCase();

    if (!value) return;

    const routes = {
      dashboard: "/admin",

      students: "/admin/students",
      student: "/admin/students",

      teachers: "/admin/teachers",
      teacher: "/admin/teachers",

      courses: "/admin/courses",
      course: "/admin/courses",

      classes: "/admin/classes",
      class: "/admin/classes",

      attendance: "/admin/attendance",

      timetable: "/admin/timetable",

      exams: "/admin/exams",
      exam: "/admin/exams",

      results: "/admin/results",
      result: "/admin/results",

      fees: "/admin/fees",
      fee: "/admin/fees",

      assignments: "/admin/assignments",
      assignment: "/admin/assignments",

      notices: "/admin/notices",
      notice: "/admin/notices",

      parents: "/admin/parents",
      parent: "/admin/parents",

      library: "/admin/library",

      messages: "/admin/messages",
      message: "/admin/messages",

      reports: "/admin/reports",
      report: "/admin/reports",

      settings: "/admin/settings",

      "data table": "/admin/data-table",
      datatable: "/admin/data-table",
      table: "/admin/data-table",
    };

    const route = routes[value];

    if (route) {
      navigate(route);
      setSearch("");
    } else {
      alert(`"${value}" not found.`);
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

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

  // =====================================
  // PROFILE
  // =====================================

  const handleProfile = () => {
    setShowProfile(false);
    navigate("/admin/profile");
  };

  // =====================================
  // SETTINGS
  // =====================================

  const handleSettings = () => {
    setShowProfile(false);
    navigate("/admin/settings");
  };

  // =====================================
  // DATA TABLE
  // =====================================

  const handleDataTable = () => {
    setShowProfile(false);
    navigate("/admin/data-table");
  };

  // =====================================
  // NOTIFICATION
  // =====================================

  const handleNotification = (notification) => {
    alert(
      `${notification.title}\n\n${notification.message}`
    );

    setShowNotifications(false);
  };

  return (
    <header className="navbar">

      {/* ===============================
          LEFT
      =============================== */}

      <div className="navbar-left">

        <button
          className="navbar-menu-btn"
          onClick={() => {
            document.body.classList.toggle(
              "sidebar-collapsed"
            );
          }}
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        <form
          className="navbar-search"
          onSubmit={handleSearch}
        >
          <Search size={18} />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearch("")}
            >
              <X size={15} />
            </button>
          )}

        </form>

      </div>


      {/* ===============================
          RIGHT
      =============================== */}

      <div className="navbar-right">

        {/* NOTIFICATION */}

        <div className="navbar-notification">

          <button
            className="navbar-icon-btn"
            onClick={() => {
              setShowNotifications(
                !showNotifications
              );

              setShowProfile(false);
            }}
          >
            <Bell size={20} />

            <span className="notification-dot" />
          </button>

          {showNotifications && (
            <div className="notification-dropdown">

              <div className="notification-header">

                <div>
                  <strong>
                    Notifications
                  </strong>

                  <span>
                    3 new notifications
                  </span>
                </div>

                <button
                  onClick={() =>
                    setShowNotifications(false)
                  }
                >
                  <X size={17} />
                </button>

              </div>


              <div className="notification-list">

                {notifications.map(
                  (notification) => (

                    <button
                      key={notification.id}
                      className="notification-item"
                      onClick={() =>
                        handleNotification(
                          notification
                        )
                      }
                    >

                      <div className="notification-icon">
                        <Bell size={15} />
                      </div>

                      <div>

                        <strong>
                          {notification.title}
                        </strong>

                        <p>
                          {notification.message}
                        </p>

                        <small>
                          {notification.time}
                        </small>

                      </div>

                    </button>

                  )
                )}

              </div>

            </div>
          )}

        </div>


        <div className="navbar-divider" />


        {/* ===============================
            PROFILE
        =============================== */}

        <div className="navbar-profile-wrapper">

          <button
            className="navbar-profile"
            onClick={() => {
              setShowProfile(
                !showProfile
              );

              setShowNotifications(false);
            }}
          >

            <div className="navbar-avatar">
              A
            </div>

            <div className="navbar-user-info">

              <strong>
                Admin
              </strong>

              <span>
                Administrator
              </span>

            </div>

            <ChevronDown
              size={17}
              className={
                showProfile
                  ? "profile-arrow rotate"
                  : "profile-arrow"
              }
            />

          </button>


          {/* ===============================
              PROFILE DROPDOWN
          =============================== */}

          {showProfile && (
            <div className="profile-dropdown">

              <div className="profile-dropdown-header">

                <div className="navbar-avatar">
                  A
                </div>

                <div>

                  <strong>
                    Admin
                  </strong>

                  <span>
                    Administrator
                  </span>

                </div>

              </div>


              <div className="profile-dropdown-divider" />


              {/* MY PROFILE */}

              <button onClick={handleProfile}>

                <User size={17} />

                <span>
                  My Profile
                </span>

              </button>


              {/* DATA TABLE */}

              <button onClick={handleDataTable}>

                <Table2 size={17} />

                <span>
                  Data Table
                </span>

              </button>


              {/* SETTINGS */}

              <button onClick={handleSettings}>

                <Settings size={17} />

                <span>
                  Settings
                </span>

              </button>


              <div className="profile-dropdown-divider" />


              {/* LOGOUT */}

              <button
                className="profile-logout"
                onClick={handleLogout}
              >

                <LogOut size={17} />

                <span>
                  Logout
                </span>

              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default Navbar;