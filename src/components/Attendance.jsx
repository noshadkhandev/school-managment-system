import { useEffect, useMemo, useState } from "react";

import {
  Search,
  CalendarDays,
  Users,
  CheckCircle2,
  XCircle,
  Clock3,
  UserRound,
  Trash2,
  Check,
  RotateCcw,
  BookOpen,
} from "lucide-react";

const Attendance = () => {
  const loadPeople = () => {
    try {
      const savedStudents =
        localStorage.getItem("students");

      const savedTeachers =
        localStorage.getItem("teachers");

      const savedAttendance =
        localStorage.getItem("attendance");

      const studentData = savedStudents
        ? JSON.parse(savedStudents)
        : [];

      const teacherData = savedTeachers
        ? JSON.parse(savedTeachers)
        : [];

      const attendanceData = savedAttendance
        ? JSON.parse(savedAttendance)
        : {};

      const students = studentData.map((student) => ({
        id: `student-${student.id}`,
        originalId: student.id,
        personType: "Student",

        name: student.name || "",
        email: student.email || "",
        course: student.course || "N/A",
        semester: student.semester || "N/A",

        subject: "",

        status:
          attendanceData[`student-${student.id}`] ||
          "Present",
      }));

      const teachers = teacherData.map((teacher) => ({
        id: `teacher-${teacher.id}`,
        originalId: teacher.id,
        personType: "Teacher",

        name: teacher.name || "",
        email: teacher.email || "",

        course: teacher.subject || "N/A",

        semester: "Teacher",

        subject: teacher.subject || "",

        status:
          attendanceData[`teacher-${teacher.id}`] ||
          "Present",
      }));

      return [...students, ...teachers];
    } catch (error) {
      console.error(
        "Error loading attendance:",
        error
      );

      return [];
    }
  };

  const [people, setPeople] = useState(() =>
    loadPeople()
  );

  const [date, setDate] = useState(() => {
    const savedDate =
      localStorage.getItem("attendanceDate");

    return (
      savedDate ||
      new Date().toISOString().split("T")[0]
    );
  });

  const [search, setSearch] = useState("");

  const [classFilter, setClassFilter] =
    useState("All");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [saved, setSaved] = useState(false);

  // Sync students and teachers
  useEffect(() => {
    const syncPeople = () => {
      setPeople(loadPeople());
    };

    syncPeople();

    window.addEventListener(
      "storage",
      syncPeople
    );

    return () => {
      window.removeEventListener(
        "storage",
        syncPeople
      );
    };
  }, []);

  // Save attendance automatically
  useEffect(() => {
    const attendanceData = {};

    people.forEach((person) => {
      attendanceData[person.id] =
        person.status;
    });

    localStorage.setItem(
      "attendance",
      JSON.stringify(attendanceData)
    );
  }, [people]);

  // Save selected date
  useEffect(() => {
    localStorage.setItem(
      "attendanceDate",
      date
    );
  }, [date]);

  const classes = useMemo(() => {
    const uniqueCourses = [
      ...new Set(
        people.map(
          (person) => person.course
        )
      ),
    ];

    return uniqueCourses.filter(
      (item) => item && item !== "N/A"
    );
  }, [people]);

  const filteredPeople = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    return people.filter((person) => {
      const matchesSearch =
        person.name
          .toLowerCase()
          .includes(searchText) ||
        person.email
          .toLowerCase()
          .includes(searchText) ||
        person.course
          .toLowerCase()
          .includes(searchText);

      const matchesClass =
        classFilter === "All" ||
        person.course === classFilter;

      const matchesType =
        typeFilter === "All" ||
        person.personType === typeFilter;

      return (
        matchesSearch &&
        matchesClass &&
        matchesType
      );
    });
  }, [
    people,
    search,
    classFilter,
    typeFilter,
  ]);

  const present = people.filter(
    (person) =>
      person.status === "Present"
  ).length;

  const absent = people.filter(
    (person) =>
      person.status === "Absent"
  ).length;

  const late = people.filter(
    (person) =>
      person.status === "Late"
  ).length;

  const leave = people.filter(
    (person) =>
      person.status === "Leave"
  ).length;

  const attendancePercentage =
    people.length > 0
      ? Math.round(
          (present / people.length) * 100
        )
      : 0;

  // Change attendance status
  const changeStatus = (
    id,
    status
  ) => {
    setPeople((prev) =>
      prev.map((person) =>
        person.id === id
          ? {
              ...person,
              status,
            }
          : person
      )
    );

    setSaved(false);
  };

  // Mark everyone
  const markAll = (status) => {
    setPeople((prev) =>
      prev.map((person) => ({
        ...person,
        status,
      }))
    );

    setSaved(false);
  };

  // DELETE STUDENT / TEACHER
  const deletePerson = (id) => {
    const person = people.find(
      (item) => item.id === id
    );

    if (!person) return;

    const confirmed = window.confirm(
      `Delete ${person.name} permanently?`
    );

    if (!confirmed) return;

    try {
      // 1. Remove from Attendance state
      setPeople((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

      // 2. Remove attendance record
      const savedAttendance =
        localStorage.getItem(
          "attendance"
        );

      const attendanceData =
        savedAttendance
          ? JSON.parse(savedAttendance)
          : {};

      delete attendanceData[id];

      localStorage.setItem(
        "attendance",
        JSON.stringify(
          attendanceData
        )
      );

      // 3. Remove student permanently
      if (
        person.personType ===
        "Student"
      ) {
        const savedStudents =
          localStorage.getItem(
            "students"
          );

        const students = savedStudents
          ? JSON.parse(savedStudents)
          : [];

        const updatedStudents =
          students.filter(
            (student) =>
              String(student.id) !==
              String(person.originalId)
          );

        localStorage.setItem(
          "students",
          JSON.stringify(
            updatedStudents
          )
        );
      }

      // 4. Remove teacher permanently
      if (
        person.personType ===
        "Teacher"
      ) {
        const savedTeachers =
          localStorage.getItem(
            "teachers"
          );

        const teachers = savedTeachers
          ? JSON.parse(savedTeachers)
          : [];

        const updatedTeachers =
          teachers.filter(
            (teacher) =>
              String(teacher.id) !==
              String(person.originalId)
          );

        localStorage.setItem(
          "teachers",
          JSON.stringify(
            updatedTeachers
          )
        );
      }

      setSaved(false);

    } catch (error) {
      console.error(
        "Delete error:",
        error
      );
    }
  };

  // Save attendance manually
  const saveAttendance = () => {
    const attendanceData = {};

    people.forEach((person) => {
      attendanceData[person.id] =
        person.status;
    });

    localStorage.setItem(
      "attendance",
      JSON.stringify(
        attendanceData
      )
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  // Reset attendance
  const resetAttendance = () => {
    const confirmed = window.confirm(
      "Reset all attendance to Present?"
    );

    if (!confirmed) return;

    setPeople((prev) =>
      prev.map((person) => ({
        ...person,
        status: "Present",
      }))
    );

    setSaved(false);
  };

  const getStatusClass = (status) => {
    if (status === "Present")
      return "present";

    if (status === "Absent")
      return "absent";

    if (status === "Late")
      return "late";

    return "leave";
  };

  return (
    <div className="attendance-page">

      {/* TOP */}
      <div className="attendance-top">

        <div>
          <h1>Attendance</h1>

          <p>
            Manage and track daily student
            and teacher attendance.
          </p>
        </div>

        <div className="attendance-date">

          <CalendarDays size={18} />

          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSaved(false);
            }}
          />

        </div>

      </div>

      {/* STATS */}
      <div className="attendance-stats">

        <div className="attendance-stat-card blue">

          <div className="attendance-stat-icon">
            <Users size={23} />
          </div>

          <div>
            <h2>{people.length}</h2>
            <p>Total People</p>
          </div>

        </div>

        <div className="attendance-stat-card green">

          <div className="attendance-stat-icon">
            <CheckCircle2 size={23} />
          </div>

          <div>
            <h2>{present}</h2>
            <p>Present</p>
          </div>

        </div>

        <div className="attendance-stat-card red">

          <div className="attendance-stat-icon">
            <XCircle size={23} />
          </div>

          <div>
            <h2>{absent}</h2>
            <p>Absent</p>
          </div>

        </div>

        <div className="attendance-stat-card orange">

          <div className="attendance-stat-icon">
            <Clock3 size={23} />
          </div>

          <div>
            <h2>{late}</h2>
            <p>Late</p>
          </div>

        </div>

        <div className="attendance-stat-card purple">

          <div className="attendance-stat-icon">
            <UserRound size={23} />
          </div>

          <div>
            <h2>
              {attendancePercentage}%
            </h2>

            <p>Attendance</p>
          </div>

        </div>

      </div>

      {/* MAIN CARD */}
      <div className="attendance-card">

        <div className="attendance-card-header">

          <div>

            <h2>
              Student & Teacher Attendance
            </h2>

            <p>
              Take attendance for the
              selected date.
            </p>

          </div>

          <div className="attendance-header-buttons">

            <button
              className="attendance-outline-btn"
              onClick={() =>
                markAll("Present")
              }
            >
              <Check size={17} />
              Mark All Present
            </button>

            <button
              className="attendance-outline-danger"
              onClick={() =>
                markAll("Absent")
              }
            >
              <XCircle size={17} />
              Mark All Absent
            </button>

          </div>

        </div>

        {/* TOOLBAR */}
        <div className="attendance-toolbar">

          <div className="attendance-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search student or teacher..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All
            </option>

            <option value="Student">
              Students
            </option>

            <option value="Teacher">
              Teachers
            </option>

          </select>

          <select
            value={classFilter}
            onChange={(e) =>
              setClassFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Courses / Subjects
            </option>

            {classes.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}

          </select>

        </div>

        {/* TABLE */}
        <div className="attendance-table-wrapper">

          <table className="attendance-table">

            <thead>

              <tr>
                <th>PERSON</th>
                <th>TYPE</th>
                <th>COURSE / SUBJECT</th>
                <th>SEMESTER</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>

            </thead>

            <tbody>

              {filteredPeople.length > 0 ? (

                filteredPeople.map(
                  (person) => (

                    <tr key={person.id}>

                      <td>

                        <div className="student-info">

                          <div className="student-avatar">
                            {person.name.charAt(0)}
                          </div>

                          <div>

                            <strong>
                              {person.name}
                            </strong>

                            <span>
                              {person.email}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>

                        <span
                          className={
                            person.personType ===
                            "Teacher"
                              ? "teacher-type"
                              : "student-type"
                          }
                        >

                          {person.personType ===
                          "Teacher" ? (
                            <BookOpen size={14} />
                          ) : (
                            <GraduationCapIcon />
                          )}

                          {person.personType}

                        </span>

                      </td>

                      <td>
                        {person.course}
                      </td>

                      <td>
                        {person.semester}
                      </td>

                      <td>

                        <span
                          className={`attendance-status ${getStatusClass(
                            person.status
                          )}`}
                        >

                          <span className="status-dot" />

                          {person.status}

                        </span>

                      </td>

                      <td>

                        <div className="attendance-actions">

                          <button
                            className={
                              person.status ===
                              "Present"
                                ? "status-btn active-present"
                                : "status-btn"
                            }
                            onClick={() =>
                              changeStatus(
                                person.id,
                                "Present"
                              )
                            }
                          >
                            Present
                          </button>

                          <button
                            className={
                              person.status ===
                              "Absent"
                                ? "status-btn active-absent"
                                : "status-btn"
                            }
                            onClick={() =>
                              changeStatus(
                                person.id,
                                "Absent"
                              )
                            }
                          >
                            Absent
                          </button>

                          <button
                            className={
                              person.status ===
                              "Late"
                                ? "status-btn active-late"
                                : "status-btn"
                            }
                            onClick={() =>
                              changeStatus(
                                person.id,
                                "Late"
                              )
                            }
                          >
                            Late
                          </button>

                          <button
                            className={
                              person.status ===
                              "Leave"
                                ? "status-btn active-leave"
                                : "status-btn"
                            }
                            onClick={() =>
                              changeStatus(
                                person.id,
                                "Leave"
                              )
                            }
                          >
                            Leave
                          </button>

                          {/* DELETE */}
                          <button
                            className="delete-student-btn"
                            onClick={() =>
                              deletePerson(
                                person.id
                              )
                            }
                            title="Delete permanently"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="no-students"
                  >

                    <Users size={30} />

                    <strong>
                      No students or teachers found
                    </strong>

                    <span>
                      Add students or teachers
                      first.
                    </span>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}
        <div className="attendance-footer">

          <div>

            <span>

              Showing{" "}

              <strong>
                {filteredPeople.length}
              </strong>{" "}

              of{" "}

              <strong>
                {people.length}
              </strong>{" "}

              people

            </span>

          </div>

          <div className="attendance-footer-actions">

            <button
              className="reset-attendance-btn"
              onClick={resetAttendance}
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              className="save-attendance-btn"
              onClick={saveAttendance}
            >
              <CheckCircle2 size={17} />

              {saved
                ? "Attendance Saved"
                : "Save Attendance"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

const GraduationCapIcon = () => (
  <span style={{ fontSize: "14px" }}>
    🎓
  </span>
);

export default Attendance;