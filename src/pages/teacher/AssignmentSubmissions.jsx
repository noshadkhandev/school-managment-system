import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AssignmentSubmissions() {
  const { assignmentId } = useParams();


  const assignments = (() => {
    try {
      const saved = localStorage.getItem("assignments");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const assignment = assignments.find(
    (item) => String(item.id) === String(assignmentId)
  );

  const storageKey = `submissions_${assignmentId}`;

const [students, setStudents] = useState(() => {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
});


  const [selectedStudent, setSelectedStudent] = useState(null);


  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify(students)
    );
  }, [students, storageKey]);

  const updateStudent = (updatedStudent) => {
    setStudents((previousStudents) =>
      previousStudents.map((student) =>
        student.id === updatedStudent.id
          ? updatedStudent
          : student
      )
    );

    setSelectedStudent(updatedStudent);
  };

  const viewSubmission = (student) => {
    const updatedStudent = {
      ...student,
      seen: true,
    };

    updateStudent(updatedStudent);
  };

  const approveStudent = () => {
    if (!selectedStudent) return;

    const updatedStudent = {
      ...selectedStudent,
      status: "Approved",
      seen: true,
    };

    updateStudent(updatedStudent);
  };

  const rejectStudent = () => {
    if (!selectedStudent) return;

    const updatedStudent = {
      ...selectedStudent,
      status: "Rejected",
      seen: true,
    };

    updateStudent(updatedStudent);
  };

  const handleFeedback = (e) => {
    if (!selectedStudent) return;

    const updatedStudent = {
      ...selectedStudent,
      feedback: e.target.value,
    };

    updateStudent(updatedStudent);
  };

  const deleteSubmission = () => {
    if (!selectedStudent) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this submission?"
    );

    if (!confirmDelete) return;

    const updatedStudents = students.filter(
      (student) => student.id !== selectedStudent.id
    );

    setStudents(updatedStudents);

    setSelectedStudent(
      updatedStudents.length > 0
        ? updatedStudents[0]
        : null
    );
  };

  const filteredStudents = students.filter((student) => {
    const value = search.toLowerCase();

    return (
      (student.name || "")
        .toLowerCase()
        .includes(value) ||
      (student.rollNo || "")
        .toLowerCase()
        .includes(value) ||
      (student.email || "")
        .toLowerCase()
        .includes(value)
    );
  });

  const totalSubmissions = students.length;

  const approved = students.filter(
    (student) => student.status === "Approved"
  ).length;

  const rejected = students.filter(
    (student) => student.status === "Rejected"
  ).length;

  const unreviewed = students.filter(
    (student) => !student.seen
  ).length;

  if (!assignment) {
    return (
      <div className="submission-page">
        <h2>Assignment not found</h2>
      </div>
    );
  }

  return (
    <div className="submission-page">


      <div className="submission-header">
        <div>
          <h1>Assignment Submissions</h1>
          <p>{assignment.title}</p>
        </div>
      </div>

      <div className="submission-stats">

        <div className="stat-card">
          <h2>{totalSubmissions}</h2>
          <p>Submissions</p>
        </div>

        <div className="stat-card">
          <h2>{approved}</h2>
          <p>Approved</p>
        </div>

        <div className="stat-card">
          <h2>{rejected}</h2>
          <p>Rejected</p>
        </div>

        <div className="stat-card">
          <h2>{unreviewed}</h2>
          <p>Unreviewed</p>
        </div>

      </div>


      <div className="submission-container">


        <div className="students-panel">

          <div className="students-panel-header">

            <h2>Submissions</h2>

            <input
              type="text"
              placeholder="Search by name, roll no."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="students-list">


            {students.length === 0 ? (

              <div className="no-students">

                <h3>No submissions yet</h3>

                <p>
                  Students who submit this assignment
                  will appear here.
                </p>

              </div>

            ) : filteredStudents.length === 0 ? (

              <p className="no-students">
                No student found.
              </p>

            ) : (

              filteredStudents.map((student) => (

                <div
                  key={student.id}
                  className={`student-item ${
                    selectedStudent?.id === student.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedStudent(student);
                    viewSubmission(student);
                  }}
                >

                  <div className="student-info">

                    <strong>
                      {student.name}
                    </strong>

                    <small>
                      {student.rollNo}
                    </small>

                  </div>

                  <div className="student-status-area">

                    <span
                      className={`status ${
                        (
                          student.status ||
                          "Submitted"
                        ).toLowerCase()
                      }`}
                    >
                      {student.status ||
                        "Submitted"}
                    </span>

                    <button
                      className="view-btn"
                      title="View submission"
                      onClick={(e) => {
                        e.stopPropagation();

                        setSelectedStudent(student);

                        viewSubmission(student);
                      }}
                    >
                      👁️
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>


        <div className="student-details">

          {!selectedStudent ? (

            <div className="empty-details">

              <h2>
                No submission selected
              </h2>

              <p>
                {students.length === 0
                  ? "No student has submitted this assignment yet."
                  : "Select a student from the left side."}
              </p>

            </div>

          ) : (

            <>


              <div className="student-details-header">

                <div>

                  <h1>
                    {selectedStudent.name}
                  </h1>

                  <p>
                    {selectedStudent.email}
                  </p>

                  <small>
                    Submitted:{" "}
                    {selectedStudent.submittedAt ||
                      "Not available"}
                  </small>

                </div>

                <div className="header-actions">

                  <span className="submitted-badge">
                    {selectedStudent.status ||
                      "Submitted"}
                  </span>

                  <button
                    className="view-large-btn"
                    onClick={() =>
                      viewSubmission(
                        selectedStudent
                      )
                    }
                  >
                    👁️
                  </button>

                </div>

              </div>


              <div className="details-content">


                <div className="detail-section">

                  <h3>
                    Assignment
                  </h3>

                  <h4>
                    {assignment.title}
                  </h4>

                  <div
                    className="assignment-description"
                    dangerouslySetInnerHTML={{
                      __html:
                        assignment.description ||
                        "<p>No description available.</p>",
                    }}
                  />

                  {assignment.dueDate && (
                    <p>
                      <strong>
                        Due Date:
                      </strong>{" "}
                      {assignment.dueDate}
                    </p>
                  )}

                  {assignment.link && (
                    <p>
                      <strong>
                        Reference:
                      </strong>{" "}
                      <a
                        href={assignment.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open Reference Link
                      </a>
                    </p>
                  )}

                  {assignment.image && (
                    <img
                      src={assignment.image}
                      alt={assignment.title}
                      className="assignment-detail-image"
                    />
                  )}

                </div>


                <div className="detail-section">

                  <h3>
                    Link
                  </h3>

                  {selectedStudent.link ? (

                    <a
                      href={selectedStudent.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      🔗 {selectedStudent.link}
                    </a>

                  ) : (

                    <p>
                      No link submitted.
                    </p>

                  )}

                </div>

                <div className="detail-section">

                  <h3>
                    Description
                  </h3>

                  <div className="description-box">
                    {selectedStudent.description ||
                      "No description submitted."}
                  </div>

                </div>


                <div className="detail-section">

                  <h3>
                    Files
                  </h3>

                  <div className="no-files">
                    No files found for this submission.
                  </div>

                </div>

                <div className="feedback-section">

                  <label>
                    Feedback (optional)
                  </label>

                  <textarea
                    placeholder="Provide feedback for the submission"
                    value={
                      selectedStudent.feedback || ""
                    }
                    onChange={handleFeedback}
                  />

                </div>


                <div className="submission-actions">

                  <button
                    className="delete-submission-btn"
                    onClick={deleteSubmission}
                    title="Delete submission"
                  >
                    🗑️
                  </button>

                  <div className="review-actions">

                    <button
                      className="reject-btn"
                      onClick={rejectStudent}
                    >
                      ✕ Reject
                    </button>

                    <button
                      className="approve-btn"
                      onClick={approveStudent}
                    >
                      ✓ Approve
                    </button>

                  </div>

                </div>

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
}

export default AssignmentSubmissions;