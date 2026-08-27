import { useState, useEffect } from "react";

const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

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

function Exam() {
  const [exams, setExams] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [examName, setExamName] = useState("");
  const [className, setClassName] = useState("Class 1");
  const [subject, setSubject] = useState("Mathematics");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [room, setRoom] = useState("");
  const [editId, setEditId] = useState(null);


  useEffect(() => {
    const saved = localStorage.getItem("exams");
    if (saved) {
      setExams(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("exams", JSON.stringify(exams));
    }
  }, [exams, loaded]);

  const resetForm = () => {
    setExamName("");
    setClassName("Class 1");
    setSubject("Mathematics");
    setDate("");
    setStartTime("");
    setEndTime("");
    setTotalMarks("");
    setRoom("");
    setEditId(null);
  };

  const handleAddExam = () => {
    if (
      !examName ||
      !className ||
      !subject ||
      !date ||
      !startTime ||
      !endTime ||
      !totalMarks ||
      !room
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (endTime <= startTime) {
      alert("End time must be later than start time");
      return;
    }

    if (editId !== null) {
   
      const updatedExams = exams.map((exam) =>
        exam.id === editId
          ? {
              ...exam,
              examName,
              className,
              subject,
              date,
              startTime,
              endTime,
              totalMarks,
              room,
            }
          : exam
      );
      setExams(updatedExams);
    } else {
   
      const newExam = {
        id: Date.now(),
        examName,
        className,
        subject,
        date,
        startTime,
        endTime,
        totalMarks,
        room,
      };
      setExams([...exams, newExam]);
    }

    resetForm();
  };

  const handleEdit = (exam) => {
    setEditId(exam.id);
    setExamName(exam.examName);
    setClassName(exam.className);
    setSubject(exam.subject);
    setDate(exam.date);
    setStartTime(exam.startTime);
    setEndTime(exam.endTime);
    setTotalMarks(exam.totalMarks);
    setRoom(exam.room);
  };

  const handleDelete = (id) => {
    const updatedExams = exams.filter((exam) => exam.id !== id);
    setExams(updatedExams);
    if (editId === id) {
      resetForm();
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  return (
    <div className="exams-page">
      <div className="exams-header">
        <h1>Exam</h1>
        <p>Create and manage exam schedules</p>
      </div>

      <div className="exam-form">
        <input
          type="text"
          placeholder="Exam Name"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
        />

        <select value={className} onChange={(e) => setClassName(e.target.value)}>
          {CLASSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <input
          type="number"
          placeholder="Total Marks"
          value={totalMarks}
          onChange={(e) => setTotalMarks(e.target.value)}
        />

        <input
          type="text"
          placeholder="Room (e.g. Room 5)"
          list="room-options"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <datalist id="room-options">
          <option value="Room 1" />
          <option value="Room 2" />
          <option value="Room 3" />
          <option value="Room 4" />
          <option value="Room 5" />
          <option value="Hall" />
        </datalist>

        <div className="exam-form-buttons">
          <button onClick={handleAddExam}>
            {editId !== null ? "Update Exam" : "Add Exam"}
          </button>
          {editId !== null && (
            <button className="cancel-btn" onClick={handleCancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <div className="exams-table-wrapper">
        <table className="exams-table">
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Time</th>
              <th>Total Marks</th>
              <th>Room</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-exams">
                  No exams added yet.
                </td>
              </tr>
            ) : (
              exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.examName}</td>
                  <td>{exam.className}</td>
                  <td>{exam.subject}</td>
                  <td>{exam.date}</td>
                  <td>
                    {exam.startTime} - {exam.endTime}
                  </td>
                  <td>{exam.totalMarks}</td>
                  <td>{exam.room}</td>
                  <td className="exam-actions">
                    <button onClick={() => handleEdit(exam)}>Edit</button>
                    <button onClick={() => handleDelete(exam.id)}>
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

export default Exam;