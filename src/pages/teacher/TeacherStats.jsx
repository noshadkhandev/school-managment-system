import { useState } from "react";

function TeacherStats() {
  const [students] = useState(() => {
    const savedStudents = localStorage.getItem("students");

    return savedStudents ? JSON.parse(savedStudents) : [];
  });

  const [assignments] = useState(() => {
    const savedAssignments = localStorage.getItem("assignments");

    return savedAssignments ? JSON.parse(savedAssignments) : [];
  });


  const totalStudents = students.length;


  const totalClasses = [
    ...new Set(students.map((student) => student.className)),
  ].length;



const pendingAssignments = assignments.length;

  const stats = [
    {
      id: 1,
      title: "Total Students",
      value: totalStudents,
    },
    {
      id: 2,
      title: "Total Classes",
      value: totalClasses,
    },
  {
  id: 3,
  title: "  Assignments",
  value: pendingAssignments,
}
 
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div className="stat-card" key={stat.id}>
          <h3>{stat.title}</h3>
          <h2>{stat.value}</h2>
        </div>
      ))}
    </div>
  );
}

export default TeacherStats;