import { useNavigate } from "react-router-dom";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      name: "Mark Attendance",
      path: "/teacher/Attendance",
    },
    {
      name: "Add Assignment",
      path: "/teacher/Assignments",
    },
    {
      name: "Enter Grades",
      path: "/teacher/Grades",
    },
    {
      name: "View Students",
      path: "/teacher/Students",
    },
      {
      name: "View Time Table",
      path: "/teacher/TimeTable",
    },
      {
      name: "View Notice",
      path: "/teacher/Notices",
    },
        {
      name: "View Exams",
      path: "/teacher/Exam",
    },
  ];

  return (
    <div className="quick-actions">
      <h2>Quick Actions</h2>

      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            className="action-btn"
            key={index}
            onClick={() => navigate(action.path)}
          >
            {action.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;