import { useState, useEffect } from "react";

const DAYS_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

const CLASSES = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

const ROOMS = [
  "Room 1",

];

const TEACHERS = [
  "Nowshad Ahmed",

];


function formatTime(time24) {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [day, setDay] = useState("");
  const [date, setDate] = useState("");
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [editingTimetableId, setEditingTimetableId] = useState(null);
  const [error, setError] = useState("");

useEffect(() => {
  const saved = localStorage.getItem("timetable");

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      setTimetable(parsed);
    } catch (e) {
      setTimetable([]);
    }
  } else {
    setTimetable([]);
  }
}, []);

  const saveTimetableToLocalStorage = (updatedTimetable) => {
    localStorage.setItem("timetable", JSON.stringify(updatedTimetable));
  };

  const sortTimetable = (entries) => {
    return [...entries].sort((a, b) => {
      const dayDiff = DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });
  };

  const validateForm = () => {
    if (!day) return "Please select a Day.";
    if (!date) return "Please select a Date.";
    if (!subject) return "Please select a Subject.";
    if (!className) return "Please select a Class.";
    if (!startTime) return "Please select a Start Time.";
    if (!endTime) return "Please select an End Time.";
    if (endTime <= startTime)
      return "End Time must be later than Start Time.";
    if (!room.trim()) return "Please enter a Room.";
    if (!teacherName.trim()) return "Please enter a Teacher Name.";
    return "";
  };

  const resetForm = () => {
    setDay("");
    setDate("");
    setSubject("");
    setClassName("");
    setStartTime("");
    setEndTime("");
    setRoom("");
    setTeacherName("");
    setEditingTimetableId(null);
    setError("");
  };

  const addTimetable = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const newEntry = {
      id: Date.now(),
      day: day,
      date: date,
      subject: subject,
      className: className,
      startTime: startTime,
      endTime: endTime,
      room: room.trim(),
      teacherName: teacherName.trim(),
    };

    const updatedTimetable = sortTimetable([...timetable, newEntry]);
    setTimetable(updatedTimetable);
    saveTimetableToLocalStorage(updatedTimetable);
    resetForm();
  };

  const updateTimetable = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const updatedTimetable = timetable.map((item) => {
      if (item.id === editingTimetableId) {
        return {
          ...item,
          day: day,
          date: date,
          subject: subject,
          className: className,
          startTime: startTime,
          endTime: endTime,
          room: room.trim(),
          teacherName: teacherName.trim(),
        };
      }
      return item;
    });

    const sortedTimetable = sortTimetable(updatedTimetable);
    setTimetable(sortedTimetable);
    saveTimetableToLocalStorage(sortedTimetable);
    resetForm();
  };

  const editTimetable = (item) => {
    setDay(item.day);
    setDate(item.date);
    setSubject(item.subject);
    setClassName(item.className);
    setStartTime(item.startTime);
    setEndTime(item.endTime);
    setRoom(item.room);
    setTeacherName(item.teacherName);
    setEditingTimetableId(item.id);
    setError("");
  };

  const deleteTimetable = (id) => {
    const updatedTimetable = sortTimetable(
      timetable.filter((item) => item.id !== id)
    );
    setTimetable(updatedTimetable);
    saveTimetableToLocalStorage(updatedTimetable);

    if (editingTimetableId === id) {
      resetForm();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTimetableId !== null) {
      updateTimetable();
    } else {
      addTimetable();
    }
  };

  const sortedTimetable = sortTimetable(timetable);

  return (
    <div className="timetable-page">
      <div className="timetable-header">
        <h1>Timetable</h1>
        <p>View and manage your weekly teaching schedule</p>
      </div>

      <div className="tt-form-container">
        <h3 className="tt-form-title">
          {editingTimetableId !== null
            ? "Edit Timetable Entry"
            : "Add New Timetable Entry"}
        </h3>

        {error && <div className="tt-error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="tt-form-grid">

            <div className="tt-form-group">
              <label className="tt-form-label">Day</label>
              <select
                className="tt-form-select"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="">-- Select Day --</option>
                {DAYS_ORDER.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="tt-form-group">
              <label className="tt-form-label">Date</label>
              <input
                type="date"
                className="tt-form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>


            <div className="tt-form-group">
              <label className="tt-form-label">Subject</label>
              <select
                className="tt-form-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">-- Select Subject --</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="tt-form-group">
              <label className="tt-form-label">Class</label>
              <select
                className="tt-form-select"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              >
                <option value="">-- Select Class --</option>
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>


            <div className="tt-form-group">
              <label className="tt-form-label">Start Time</label>
              <input
                type="time"
                className="tt-form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="tt-form-group">
              <label className="tt-form-label">End Time</label>
              <input
                type="time"
                className="tt-form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="tt-form-group">
              <label className="tt-form-label">Room</label>
              <input
                type="text"
                className="tt-form-input"
                list="room-options"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Enter or select room"
              />
              <datalist id="room-options">
                {ROOMS.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>

            <div className="tt-form-group">
              <label className="tt-form-label">Teacher Name</label>
              <input
                type="text"
                className="tt-form-input"
                list="teacher-options"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Enter or select teacher"
              />
              <datalist id="teacher-options">
                {TEACHERS.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="tt-form-actions">
            {editingTimetableId !== null ? (
              <>
                <button type="submit" className="tt-btn tt-btn-primary">
                  Update Timetable
                </button>
                <button
                  type="button"
                  className="tt-btn tt-btn-secondary"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              </>
            ) : (
              <button type="submit" className="tt-btn tt-btn-primary">
                Add Timetable
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="timetable-table-wrapper">
        <table className="timetable-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Subject</th>
              <th>Class</th>
              <th>Time</th>
              <th>Room</th>
              <th>Teacher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTimetable.length === 0 ? (
              <tr>
                <td colSpan="8" className="tt-empty-row">
                  No timetable entries found. Add one above.
                </td>
              </tr>
            ) : (
              sortedTimetable.map((item) => (
                <tr key={item.id}>
                  <td>{item.day}</td>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.subject}</td>
                  <td>{item.className}</td>
                  <td>
                    {formatTime(item.startTime)} - {formatTime(item.endTime)}
                  </td>
                  <td>{item.room}</td>
                  <td>{item.teacherName}</td>
                  <td className="tt-actions-cell">
                    <button
                      className="tt-btn tt-btn-edit"
                      onClick={() => editTimetable(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="tt-btn tt-btn-delete"
                      onClick={() => deleteTimetable(item.id)}
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

export default Timetable;