import { useState } from "react";


const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Urdu",
  "Computer",
  "Physics",
  "Chemistry",
  "Biology",
];

function calculateGrade(marks) {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B";
  if (marks >= 60) return "C";
  if (marks >= 50) return "D";
  return "F";
}

function Grades() {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");

    if (savedStudents) {
      try {
        const parsedStudents = JSON.parse(savedStudents);

        if (parsedStudents.length > 0) {
          return parsedStudents;
        }
      } catch (error) {
        console.error("Error loading students:", error);
      }
    }

    return [];
  });

  const [grades, setGrades] = useState(() => {
    const savedGrades = localStorage.getItem("grades");

    return savedGrades ? JSON.parse(savedGrades) : [];
  });

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [marks, setMarks] = useState("");
  const [editingGradeId, setEditingGradeId] = useState(null);

  const [formError, setFormError] = useState("");

  const marksNumber = Number(marks);
  const isMarksValid =
    marks !== "" &&
    !isNaN(marksNumber) &&
    marksNumber >= 0 &&
    marksNumber <= 100;

  const previewGrade = isMarksValid ? calculateGrade(marksNumber) : "";

 const classOptions = [
  "Class 1st",
  "Class 2nd",
  "Class 3rd",
  "Class 4th",
  "Class 5th",
  "Class 6th",
  "Class 7th",
  "Class 8th",
  "Class 9th",
  "Class 10th",
  "Class Ist Year",
  "Class 2nd Year",
];


  if (selectedClass && !classOptions.includes(selectedClass)) {
    classOptions.push(selectedClass);
  }

  function saveGrades(updatedGrades) {
    setGrades(updatedGrades);
    localStorage.setItem("grades", JSON.stringify(updatedGrades));
  }

  function resetForm() {
    setSelectedStudentId("");
    setSelectedClass("");
    setSelectedSubject("");
    setMarks("");
    setEditingGradeId(null);
    setFormError("");
  }

  function handleStudentChange(event) {
    const studentId = event.target.value;

    setSelectedStudentId(studentId);
    setFormError("");

    const student = students.find((s) => String(s.id) === studentId);

    setSelectedClass(student && student.className ? student.className : "");
  }

  function handleClassChange(event) {
    setSelectedClass(event.target.value);
    setFormError("");
  }

  function handleSubjectChange(event) {
    setSelectedSubject(event.target.value);
    setFormError("");
  }

  function handleMarksChange(event) {
    setMarks(event.target.value);
    setFormError("");
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    if (selectedStudentId === "") {
      setFormError("Please select a student.");
      return;
    }

    if (selectedClass === "") {
      setFormError("Please select a class.");
      return;
    }

    if (selectedSubject === "") {
      setFormError("Please select a subject.");
      return;
    }

    if (!isMarksValid) {
      setFormError("Marks must be a number between 0 and 100.");
      return;
    }

    const student = students.find(
      (s) => String(s.id) === String(selectedStudentId)
    );

    if (!student) {
      setFormError("Selected student was not found. Please select again.");
      return;
    }

    const gradeLetter = calculateGrade(marksNumber);

    if (editingGradeId !== null) {
      const updatedGrades = grades.map((grade) =>
        grade.id === editingGradeId
          ? {
              ...grade,
              studentId: student.id,
              studentName: student.name,
              rollNumber: student.rollNumber,
              className: selectedClass,
              subject: selectedSubject,
              marks: marksNumber,
              grade: gradeLetter,
            }
          : grade
      );

      saveGrades(updatedGrades);
    } else {
      const newGrade = {
        id: Date.now(),
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        className: selectedClass,
        subject: selectedSubject,
        marks: marksNumber,
        grade: gradeLetter,
      };

      saveGrades([...grades, newGrade]);
    }

    resetForm();
  }

  function handleEditGrade(grade) {
    setEditingGradeId(grade.id);
    setSelectedStudentId(String(grade.studentId));
    setSelectedClass(grade.className);
    setSelectedSubject(grade.subject);
    setMarks(String(grade.marks));
    setFormError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    resetForm();
  }

  function handleDeleteGrade(gradeId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this grade?"
    );

    if (!confirmed) {
      return;
    }

    const updatedGrades = grades.filter((grade) => grade.id !== gradeId);

    saveGrades(updatedGrades);
    if (editingGradeId === gradeId) {
      resetForm();
    }
  }

  return (
    <div className="grades-page">
      <div className="grades-header">
        <h1>Grades</h1>
        <p>View and manage student grades</p>
      </div>

      <form className="grades-form" onSubmit={handleFormSubmit}>
        <h2 className="grades-form-title">
          {editingGradeId !== null ? "Edit Grade" : "Add New Grade"}
        </h2>

        <div className="grades-form-grid">
          <div className="grades-form-field">
            <label htmlFor="grade-student">Student</label>
            <select
              id="grade-student"
              className="grades-form-input"
              value={selectedStudentId}
              onChange={handleStudentChange}
            >
              <option value="">-- Select Student --</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.rollNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="grades-form-field">
            <label htmlFor="grade-class">Class</label>
            <select
              id="grade-class"
              className="grades-form-input"
              value={selectedClass}
              onChange={handleClassChange}
            >
              <option value="">-- Select Class --</option>
              {classOptions.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          <div className="grades-form-field">
            <label htmlFor="grade-subject">Subject</label>
            <select
              id="grade-subject"
              className="grades-form-input"
              value={selectedSubject}
              onChange={handleSubjectChange}
            >
              <option value="">-- Select Subject --</option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

         
          <div className="grades-form-field">
            <label htmlFor="grade-marks">Marks (0 - 100)</label>
            <input
              id="grade-marks"
              className="grades-form-input"
              type="number"
              min="0"
              max="100"
              value={marks}
              onChange={handleMarksChange}
              placeholder="Enter marks"
            />
          </div>

          <div className="grades-form-field">
            <label>Grade</label>
            {previewGrade !== "" ? (
              <span className="grade-badge">{previewGrade}</span>
            ) : (
              <span>--</span>
            )}
          </div>
        </div>

        {formError !== "" && <p className="grades-form-error">{formError}</p>}

        <div className="grades-form-actions">
          <button type="submit" className="grades-btn">
            {editingGradeId !== null ? "Update Grade" : "Save Grade"}
          </button>

          {editingGradeId !== null && (
            <button
              type="button"
              className="grades-btn grades-btn-secondary"
              onClick={handleCancelEdit}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="grades-table-wrapper">
        <table className="grades-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {grades.length === 0 ? (
              <tr>
                <td colSpan={7}>No grades added yet.</td>
              </tr>
            ) : (
              grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.studentName}</td>
                  <td>{grade.rollNumber}</td>
                  <td>{grade.className}</td>
                  <td>{grade.subject}</td>
                  <td>{grade.marks}</td>
                  <td>
                    <span className="grade-badge">{grade.grade}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="grades-btn"
                      onClick={() => handleEditGrade(grade)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      type="button"
                      className="grades-btn grades-btn-danger"
                      onClick={() => handleDeleteGrade(grade.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Grades;