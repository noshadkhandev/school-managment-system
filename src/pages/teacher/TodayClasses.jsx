import { useEffect, useState } from "react";

function TodayClass() {
  const [classes, setClasses] = useState([]);

  const loadTodayClasses = () => {
    const saved = localStorage.getItem("timetable");

    if (!saved) {
      setClasses([]);
      return;
    }

    try {
      const timetable = JSON.parse(saved);

      const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
      });

      const todayClasses = timetable.filter(
        (item) => item.day = today
      );

      setClasses(todayClasses);
    } catch (error) {
      console.error("Error loading timetable:", error);
      setClasses([]);
    }
  };

  useEffect(() => {
    loadTodayClasses();
  }, []);

  return (
    <div className="today-classes">
      <h2>Today's Classes</h2>

      <div className="classes-grid">
        {classes.length === 0 ? (
          <p>No classes today.</p>
        ) : (
          classes.map((item) => (
            <div className="class-card" key={item.id}>
              <h3>{item.subject}</h3>

              <p>
                <strong>Day:</strong> {item.day}
              </p>

              <p>
                <strong>Date:</strong> {formatDate(item.date)}
              </p>

              <p>
                <strong>Class:</strong> {item.className}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {formatTime(item.startTime)} -{" "}
                {formatTime(item.endTime)}
              </p>

              <p>
                <strong>Room:</strong> {item.room}
              </p>

              <p>
                <strong>Teacher:</strong> {item.teacherName}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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

export default TodayClass;