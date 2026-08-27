import { useState } from "react";

function RecentAssignments() {
const [assignments, setAssignments] = useState(() => {
  const savedAssignments = localStorage.getItem("assignments");

  return savedAssignments ? JSON.parse(savedAssignments) : [];
});

const getAssignmentStatus = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  if (due < today) {
    return "Overdue";
  }

  if (due.getTime() === today.getTime()) {
    return "Due Today";
  }

  return "Pending";
};

  return (
    <div className="assignments-section">
      <h2>Recent Assignments</h2>

<div className="assignments-table-wrapper">
  <table className="assignments-table">
    <thead>
      <tr>
        <th>Assignment</th>
        <th>Due Date</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {assignments.map((assignment) => (
        <tr key={assignment.id}>
          <td>
            <div className="assignment-title">
              {assignment.title}
            </div>
          </td>

          <td>
            <span className="due-date">
              {assignment.dueDate}
            </span>
          </td>

          <td>
            <span
              className={`status ${getAssignmentStatus(
                assignment.dueDate
              )}`}
            >
              {getAssignmentStatus(assignment.dueDate)}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
}

export default RecentAssignments;