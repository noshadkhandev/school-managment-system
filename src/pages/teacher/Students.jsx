import { useEffect, useState } from "react";

function Students() {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");

    return savedStudents ? JSON.parse(savedStudents) : [];
  });

  const [showForm, setShowForm] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: "",
    rollNumber: "",
    className: "",
    attendance: "",
    status: "",
  });

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleChange = (e) => {
    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value,
    });
  };

  const addStudent = (e) => {
    e.preventDefault();

    const student = {
      id: Date.now(),
      ...newStudent,
    };

    setStudents((previousStudents) => [
      ...previousStudents,
      student,
    ]);

    setNewStudent({
      name: "",
      rollNumber: "",
      className: "",
      attendance: "",
      status: "",
    });

    setShowForm(false);
  };

  const removeStudent = (id) => {
    setStudents((previousStudents) =>
      previousStudents.filter(
        (student) => student.id !== id
      )
    );
  };

  return (
    <div className="students-page">

      <div className="students-header">
        <div>
          <h1>Students</h1>
          <p>View and manage your students</p>
        </div>

        <button
          className="add-student-btn"
          onClick={() => setShowForm(!showForm)}
        >
          Add New Student
        </button>
      </div>

      {showForm && (
        <form className="student-form" onSubmit={addStudent}>

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={newStudent.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="rollNumber"
            placeholder="Roll Number"
            value={newStudent.rollNumber}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="className"
            placeholder="Class"
            value={newStudent.className}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="attendance"
            placeholder="Attendance e.g. 90%"
            value={newStudent.attendance}
            onChange={handleChange}
            required
          />

          <select
            name="status"
            value={newStudent.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button type="submit">
            Add Student
          </button>

        </form>
      )}

      <div className="students-table-wrapper">

        <table className="students-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Class</th>
              <th>Attendance</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>

                <td>{student.name}</td>

                <td>{student.rollNumber}</td>

                <td>{student.className}</td>

                <td>{student.attendance}</td>

                <td>
                  <span
                    className={
                      student.status === "Active"
                        ? "student-active"
                        : "student-inactive"
                    }
                  >
                    {student.status}
                  </span>
                </td>

                <td>
                  <button
                    className="remove-student-btn"
                    onClick={() =>
                      removeStudent(student.id)
                    }
                  >
                    Remove
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Students;