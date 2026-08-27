import { useState } from "react";

function Attendance() {
     const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");

    return savedStudents ? JSON.parse(savedStudents) : [];
  });
  
 
  const [date, setDate] = useState("");

  const markAttendance = (id, status) => {
    setStudents((previousStudents) =>
      previousStudents.map((student) =>
        student.id === id
          ? { ...student, status: status }
          : student
      )
    );
  };

  const presentCount = students.filter(
    (student) => student.status === "Present"
  ).length;

  const absentCount = students.filter(
    (student) => student.status === "Absent"
  ).length;

  const markedCount = students.filter(
    (student) => student.status !== ""
  ).length;

  const saveAttendance = () => {
    if (!date) {
      alert("Please select attendance date.");
      return;
    }

    if (markedCount !== students.length) {
      alert("Please mark attendance for all students.");
      return;
    }

    console.log("Attendance Date:", date);
    console.log("Attendance Data:", students);

    alert("Attendance marked successfully!");
  };

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <h1>Attendance</h1>
        <p>Mark student attendance</p>
      </div>

      <div className="attendance-date">
        <label>Select Date</label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="attendance-summary">
        <div className="attendance-count present-count">
          <h3>Present</h3>
          <strong>{presentCount}</strong>
        </div>

        <div className="attendance-count absent-count">
          <h3>Absent</h3>
          <strong>{absentCount}</strong>
        </div>

        <div className="attendance-count total-count">
          <h3>Marked</h3>
          <strong>
            {markedCount}/{students.length}
          </strong>
        </div>
      </div>

      <div className="attendance-table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Class</th>
              <th>Status</th>
              <th>Mark Attendance</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.rollNumber}</td>
                <td>{student.className}</td>

                <td>
                  {student.status === "" ? (
                    <span className="attendance-unmarked">
                      Not Marked
                    </span>
                  ) : (
                    <span
                      className={
                        student.status === "Present"
                          ? "attendance-present"
                          : "attendance-absent"
                      }
                    >
                      {student.status}
                    </span>
                  )}
                </td>

                <td>
                  <button
                    className="present-btn"
                    onClick={() =>
                      markAttendance(student.id, "Present")
                    }
                  >
                    Present
                  </button>

                  <button
                    className="absent-btn"
                    onClick={() =>
                      markAttendance(student.id, "Absent")
                    }
                  >
                    Absent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="save-attendance-btn"
          onClick={saveAttendance}
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
}

export default Attendance;