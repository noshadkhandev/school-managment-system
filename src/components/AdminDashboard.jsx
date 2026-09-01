import { useState } from "react";
import StatCard from "./components/StatCard";

import {
  Users,
  UserCheck,
  BookOpen,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  X,
  CalendarDays,
} from "lucide-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AdminDashboard = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [showOverviewMenu, setShowOverviewMenu] = useState(false);

  // Selected calendar date
  const [currentDate, setCurrentDate] = useState(new Date());

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const stats = [
    {
      title: "Total Students",
      value: "50",
      growth: "+5.5%",
      icon: Users,
      color: "blue",
      description: "Total registered students",
    },
    {
      title: "Total Teachers",
      value: "5",
      growth: "+2.2%",
      icon: UserCheck,
      color: "green",
      description: "Total registered teachers",
    },
    {
      title: "Total Courses",
      value: "6",
      growth: "+1.8%",
      icon: BookOpen,
      color: "purple",
      description: "Currently available courses",
    },
    {
      title: "Fee Collection",
      value: "$1,000",
      growth: "+1.4%",
      icon: Wallet,
      color: "orange",
      description: "Total fee collected this month",
    },
  ];

  const students = [
    {
      name: "Salal Ghulam",
      course: "Software Engineering",
      status: "Active",
      avatar: "S",
      color: "blue-avatar",
    },
    {
      name: "Nasir Karim",
      course: "Web Developer",
      status: "Active",
      avatar: "N",
      color: "purple-avatar",
    },
    {
      name: "Hammad Qadeer",
      course: "Information Technology",
      status: "Pending",
      avatar: "H",
      color: "green-avatar",
    },
    {
      name: "Luqman Wazir",
      course: "Computer Science",
      status: "Active",
      avatar: "L",
      color: "orange-avatar",
    },
  ];

  const overview = [
    {
      title: "Active Students",
      percentage: 80,
      color: "progress-blue",
    },
    {
      title: "Fee Collection",
      percentage: 68,
      color: "progress-green",
    },
    {
      title: "Course Completion",
      percentage: 55,
      color: "progress-purple",
    },
    {
      title: "Teacher Activity",
      percentage: 48,
      color: "progress-orange",
    },
  ];

  const handleCardClick = (stat) => {
    setSelectedCard(stat);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleRefresh = () => {
    setShowOverviewMenu(false);

    setCurrentDate(new Date());

    alert("Dashboard refreshed successfully!");
  };

  const handleReport = () => {
    setShowOverviewMenu(false);
    alert("Report opened!");
  };

  const handleExport = () => {
    setShowOverviewMenu(false);
    alert("Statistics exported successfully!");
  };

  return (
    <div className="admin-dashboard">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">

        <div>
          <span className="dashboard-label">
            ADMIN PANEL
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>

        {/* ================= CALENDAR ================= */}

        <DatePicker
          selected={currentDate}
          onChange={(date) => {
            if (date) {
              setCurrentDate(date);
            }
          }}
          dateFormat="MMMM d, yyyy"
          showPopperArrow={false}
          popperPlacement="bottom-end"
          customInput={
            <button
              type="button"
              className="date-btn"
              title="Select date"
            >
              <CalendarDays size={17} />

              <span>
                {formattedDate}
              </span>
            </button>
          }
        />

      </div>

      {/* ================= STATS ================= */}

      <div className="dashboard-stats">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              className="dashboard-card clickable"
              key={stat.title}
              onClick={() => handleCardClick(stat)}
            >

              <div className="dashboard-card-top">

                <div
                  className={`dashboard-icon ${stat.color}`}
                >
                  <Icon size={22} />
                </div>

                <span className="growth positive">
                  {stat.growth}
                </span>

              </div>

              <span className="card-label">
                {stat.title}
              </span>

              <h2>
                {stat.value}
              </h2>

              <p>
                <TrendingUp size={14} />
                Compared to last month
              </p>

            </div>
          );
        })}

      </div>

      {/* ================= DASHBOARD GRID ================= */}

      <div className="dashboard-grid">

        {/* ================= RECENT STUDENTS ================= */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>
                Recent Students
              </h2>

              <p>
                Recently registered students
              </p>
            </div>

            <button
              className="view-btn"
              onClick={() => setShowAllStudents(true)}
            >
              View All
              <ArrowUpRight size={16} />
            </button>

          </div>

          <div className="recent-students">

            {students.map((student) => (

              <div
                className="recent-student clickable"
                key={student.name}
                onClick={() => handleStudentClick(student)}
              >

                <div
                  className={`recent-avatar ${student.color}`}
                >
                  {student.avatar}
                </div>

                <div className="recent-info">

                  <strong>
                    {student.name}
                  </strong>

                  <span>
                    {student.course}
                  </span>

                </div>

                <span
                  className={
                    student.status === "Active"
                      ? "active-badge"
                      : "pending-badge"
                  }
                >
                  {student.status}
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* ================= QUICK OVERVIEW ================= */}

        <div className="dashboard-panel overview-panel">

          <div className="panel-header">

            <div>
              <h2>
                Quick Overview
              </h2>

              <p>
                Portal statistics
              </p>
            </div>

            <div className="overview-action">

              <button
                className="more-btn"
                onClick={() =>
                  setShowOverviewMenu(!showOverviewMenu)
                }
              >
                <MoreHorizontal size={20} />
              </button>

              {showOverviewMenu && (

                <div className="overview-menu">

                  <button onClick={handleRefresh}>
                    Refresh
                  </button>

                  <button onClick={handleReport}>
                    View Report
                  </button>

                  <button onClick={handleExport}>
                    Export Statistics
                  </button>

                </div>

              )}

            </div>

          </div>

          {overview.map((item) => (

            <div
              className="overview-item clickable"
              key={item.title}
              onClick={() =>
                alert(
                  `${item.title}: ${item.percentage}%`
                )
              }
            >

              <div className="overview-title">

                <span>
                  {item.title}
                </span>

                <strong>
                  {item.percentage}%
                </strong>

              </div>

              <div className="progress">

                <div
                  className={item.color}
                  style={{
                    width: `${item.percentage}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ================================================= */}
      {/* ================= STAT MODAL ==================== */}
      {/* ================================================= */}

      {selectedCard && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedCard(null)}
        >

          <div
            className="dashboard-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setSelectedCard(null)}
            >
              <X size={20} />
            </button>

            <div
              className={`dashboard-icon ${selectedCard.color}`}
            >
              {(() => {
                const Icon = selectedCard.icon;
                return <Icon size={28} />;
              })()}
            </div>

            <h2>
              {selectedCard.title}
            </h2>

            <div className="modal-value">
              {selectedCard.value}
            </div>

            <span className="growth positive">
              {selectedCard.growth}
            </span>

            <p className="modal-description">
              {selectedCard.description}
            </p>

            <div className="modal-info">

              <div>
                <span>
                  Current Value
                </span>

                <strong>
                  {selectedCard.value}
                </strong>
              </div>

              <div>
                <span>
                  Monthly Growth
                </span>

                <strong className="green-text">
                  {selectedCard.growth}
                </strong>
              </div>

            </div>

          </div>

        </div>

      )}

      {/* ================================================= */}
      {/* =============== STUDENT MODAL =================== */}
      {/* ================================================= */}

      {selectedStudent && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedStudent(null)}
        >

          <div
            className="dashboard-modal student-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setSelectedStudent(null)}
            >
              <X size={20} />
            </button>

            <div
              className={`student-detail-avatar ${selectedStudent.color}`}
            >
              {selectedStudent.avatar}
            </div>

            <h2>
              {selectedStudent.name}
            </h2>

            <p className="student-course">
              {selectedStudent.course}
            </p>

            <span
              className={
                selectedStudent.status === "Active"
                  ? "active-badge"
                  : "pending-badge"
              }
            >
              {selectedStudent.status}
            </span>

            <div className="modal-info">

              <div>
                <span>
                  Student Name
                </span>

                <strong>
                  {selectedStudent.name}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {selectedStudent.status}
                </strong>
              </div>

              <div>
                <span>
                  Course
                </span>

                <strong>
                  {selectedStudent.course}
                </strong>
              </div>

              <div>
                <span>
                  Student ID
                </span>

                <strong>
                  STU-
                  {Math.floor(
                    Math.random() * 9000 + 1000
                  )}
                </strong>
              </div>

            </div>

          </div>

        </div>

      )}

      {/* ================================================= */}
      {/* =============== ALL STUDENTS ==================== */}
      {/* ================================================= */}

      {showAllStudents && (

        <div
          className="modal-overlay"
          onClick={() => setShowAllStudents(false)}
        >

          <div
            className="dashboard-modal all-students-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setShowAllStudents(false)}
            >
              <X size={20} />
            </button>

            <h2>
              All Students
            </h2>

            <p>
              Recently registered students
            </p>

            <div className="all-students-list">

              {students.map((student) => (

                <div
                  className="recent-student clickable"
                  key={student.name}
                  onClick={() => {
                    setShowAllStudents(false);
                    setSelectedStudent(student);
                  }}
                >

                  <div
                    className={`recent-avatar ${student.color}`}
                  >
                    {student.avatar}
                  </div>

                  <div className="recent-info">

                    <strong>
                      {student.name}
                    </strong>

                    <span>
                      {student.course}
                    </span>

                  </div>

                  <span
                    className={
                      student.status === "Active"
                        ? "active-badge"
                        : "pending-badge"
                    }
                  >
                    {student.status}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminDashboard;