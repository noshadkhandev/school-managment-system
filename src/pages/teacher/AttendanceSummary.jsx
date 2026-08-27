function AttendanceSummary() {
  const attendance = [
    {
      id: 1,
      className: "Class 8",
      totalStudents: 30,
      present: 27,
      absent: 3,
    },
    {
      id: 2,
      className: "Class 7",
      totalStudents: 28,
      present: 25,
      absent: 3,
    },
    {
      id: 3,
      className: "Class 9",
      totalStudents: 32,
      present: 30,
      absent: 2,
    },
  ];

  return (
    <div className="attendance-section">
      <h2>Attendance Summary</h2>

      <div className="attendance-grid">
        {attendance.map((item) => {
          const percentage = Math.round(
            (item.present / item.totalStudents) * 100
          );

          return (
            <div className="attendance-card" key={item.id}>
              <h3>{item.className}</h3>

              <div className="attendance-percentage">
                {percentage}%
              </div>

              <p>Total Students: {item.totalStudents}</p>
              <p>Present: {item.present}</p>
              <p>Absent: {item.absent}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AttendanceSummary;