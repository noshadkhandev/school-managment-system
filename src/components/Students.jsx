import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  GraduationCap,
  UserCheck,
  UserX,
  Clock,
  X,
  Edit3,
  Trash2,
  Eye,
  Mail,
  Save,
} from "lucide-react";

const initialStudents = [];

const emptyForm = {
  name: "",
  email: "",
  course: "",
  semester: "",
  status: "Active",
};

const Students = () => {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem("students");
      return saved ? JSON.parse(saved) : initialStudents;
    } catch {
      return initialStudents;
    }
  });


  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));

    window.dispatchEvent(new Event("studentsUpdated"));
  }, [students]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [openMenu, setOpenMenu] = useState(null);

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [studentToDelete, setStudentToDelete] =
    useState(null);

  const [editingStudent, setEditingStudent] =
    useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  const [form, setForm] = useState(emptyForm);

  const filteredStudents = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return students.filter((student) => {
      const matchesSearch =
        String(student.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(student.email || "")
          .toLowerCase()
          .includes(searchText) ||
        String(student.course || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All Status" ||
        student.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);


  const totalPages = Math.ceil(
    filteredStudents.length / studentsPerPage
  );

  const startIndex =
    (currentPage - 1) * studentsPerPage;

  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );


  const totalStudents = students.length;

  const activeStudents = students.filter(
    (student) => student.status === "Active"
  ).length;

  const pendingStudents = students.filter(
    (student) => student.status === "Pending"
  ).length;

  const inactiveStudents = students.filter(
    (student) => student.status === "Inactive"
  ).length;


  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.course.trim() ||
      !form.semester.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      course: form.course.trim(),
      semester: form.semester.trim(),
      status: form.status,
    };

    setStudents((prev) => [
      newStudent,
      ...prev,
    ]);

    resetForm();
    setShowAddModal(false);
    setCurrentPage(1);
  };


  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setOpenMenu(null);
  };

  const handleEditOpen = (student) => {
    setEditingStudent(student);

    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
      semester: student.semester,
      status: student.status,
    });

    setOpenMenu(null);
    setShowEditModal(true);
  };

  const handleUpdateStudent = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.course.trim() ||
      !form.semester.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    setStudents((prev) =>
      prev.map((student) =>
        student.id === editingStudent.id
          ? {
              ...student,
              name: form.name.trim(),
              email: form.email.trim(),
              course: form.course.trim(),
              semester: form.semester.trim(),
              status: form.status,
            }
          : student
      )
    );

    setShowEditModal(false);
    setEditingStudent(null);
    resetForm();
  };

  const handleDeleteOpen = (student) => {
    setStudentToDelete(student);
    setOpenMenu(null);
    setShowDeleteModal(true);
  };

  const handleDeleteStudent = () => {
    if (!studentToDelete) return;

    const deletedId = studentToDelete.id;

    setStudents((prev) =>
      prev.filter(
        (student) => student.id !== deletedId
      )
    );

    try {
      const savedAttendance =
        localStorage.getItem("attendance");

      if (savedAttendance) {
        const attendanceData =
          JSON.parse(savedAttendance);

        Object.keys(attendanceData).forEach(
          (date) => {
            if (
              attendanceData[date] &&
              attendanceData[date][deletedId]
            ) {
              delete attendanceData[date][deletedId];
            }
          }
        );

        localStorage.setItem(
          "attendance",
          JSON.stringify(attendanceData)
        );
      }
    } catch (error) {
      console.error(
        "Error removing attendance:",
        error
      );
    }

    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  return (
    <div className="students-page">

      <div className="students-header">

        <div>
          <span className="page-label">
            ADMINISTRATION
          </span>

          <h1>Students</h1>

          <p>
            Manage student accounts, courses and
            academic information.
          </p>
        </div>

        <button
          className="add-student-btn"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <UserPlus size={18} />
          Add Student
        </button>

      </div>

      <div className="student-stats">

        <div className="student-stat-card">
          <div className="stat-icon blue">
            <Users size={22} />
          </div>

          <div>
            <span>Total Students</span>
            <h2>{totalStudents}</h2>
            <small>All registered students</small>
          </div>
        </div>

        <div className="student-stat-card">
          <div className="stat-icon green">
            <UserCheck size={22} />
          </div>

          <div>
            <span>Active Students</span>
            <h2>{activeStudents}</h2>
            <small>Currently active</small>
          </div>
        </div>

        <div className="student-stat-card">
          <div className="stat-icon orange">
            <Clock size={22} />
          </div>

          <div>
            <span>Pending</span>
            <h2>{pendingStudents}</h2>
            <small>Awaiting approval</small>
          </div>
        </div>

        <div className="student-stat-card">
          <div className="stat-icon red">
            <UserX size={22} />
          </div>

          <div>
            <span>Inactive</span>
            <h2>{inactiveStudents}</h2>
            <small>Inactive accounts</small>
          </div>
        </div>

      </div>

      <div className="students-card">

        <div className="students-card-header">

          <div>
            <h2>All Students</h2>
            <p>
              View and manage registered students.
            </p>
          </div>

          <div className="student-actions">

            <div className="student-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />

            </div>

            <select
              className="student-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Inactive</option>
            </select>

          </div>

        </div>

        <div className="table-wrapper">

          <table className="students-table">

            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {currentStudents.length > 0 ? (
                currentStudents.map((student) => (

                  <tr key={student.id}>

                    <td>
                      <div className="student-info">

                        <div className="student-avatar">
                          {student.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {student.name}
                          </strong>

                          <span>
                            {student.email}
                          </span>
                        </div>

                      </div>
                    </td>

                    <td>
                      <div className="course-info">
                        <GraduationCap size={17} />
                        {student.course}
                      </div>
                    </td>

                    <td>
                      {student.semester}
                    </td>

                    <td>
                      <span
                        className={`status ${String(
                          student.status
                        ).toLowerCase()}`}
                      >
                        <span className="status-dot" />
                        {student.status}
                      </span>
                    </td>

                    <td>

                      <div className="action-wrapper">

                        <button
                          className="more-btn"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === student.id
                                ? null
                                : student.id
                            )
                          }
                        >
                          <MoreVertical size={19} />
                        </button>

                        {openMenu === student.id && (

                          <div className="student-action-menu">

                            <button
                              onClick={() =>
                                handleViewStudent(
                                  student
                                )
                              }
                            >
                              <Eye size={15} />
                              View
                            </button>

                            <button
                              onClick={() =>
                                handleEditOpen(
                                  student
                                )
                              }
                            >
                              <Edit3 size={15} />
                              Edit
                            </button>

                            <button
                              className="delete-action"
                              onClick={() =>
                                handleDeleteOpen(
                                  student
                                )
                              }
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>

                          </div>

                        )}

                      </div>

                    </td>

                  </tr>

                ))
              ) : (

                <tr>
                  <td
                    colSpan="5"
                    className="empty-state"
                  >
                    <Search size={30} />

                    <strong>
                      No students found
                    </strong>

                    <span>
                      Try changing your search or
                      filter.
                    </span>
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>


        <div className="table-footer">

          <span>
            Showing{" "}
            {filteredStudents.length === 0
              ? 0
              : startIndex + 1}
            –
            {Math.min(
              startIndex + studentsPerPage,
              filteredStudents.length
            )}{" "}
            of {filteredStudents.length} students
          </span>

          <div className="pagination">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                goToPage(currentPage - 1)
              }
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (

              <button
                key={page}
                className={
                  currentPage === page
                    ? "active-page"
                    : ""
                }
                onClick={() =>
                  goToPage(page)
                }
              >
                {page}
              </button>

            ))}

            <button
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() =>
                goToPage(currentPage + 1)
              }
            >
              Next
            </button>

          </div>

        </div>

      </div>

      {showAddModal && (

        <div
          className="student-modal-overlay"
          onClick={() =>
            setShowAddModal(false)
          }
        >

          <div
            className="student-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="student-modal-close"
              onClick={() =>
                setShowAddModal(false)
              }
            >
              <X size={19} />
            </button>

            <div className="modal-heading">

              <div className="modal-icon blue">
                <UserPlus size={20} />
              </div>

              <div>
                <h2>Add Student</h2>
                <p>
                  Create a new student account.
                </p>
              </div>

            </div>

            <form onSubmit={handleAddStudent}>

              <div className="form-group">
                <label>Student Name</label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Enter student name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Course</label>

                  <input
                    name="course"
                    value={form.course}
                    onChange={handleFormChange}
                    placeholder="e.g. Computer Science"
                  />
                </div>

                <div className="form-group">
                  <label>Semester</label>

                  <input
                    name="semester"
                    value={form.semester}
                    onChange={handleFormChange}
                    placeholder="e.g. 4th Semester"
                  />
                </div>

              </div>

              <div className="form-group">

                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                >
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>

              </div>

              <div className="modal-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  <Save size={16} />
                  Add Student
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {showEditModal && (

        <div
          className="student-modal-overlay"
          onClick={() =>
            setShowEditModal(false)
          }
        >

          <div
            className="student-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="student-modal-close"
              onClick={() =>
                setShowEditModal(false)
              }
            >
              <X size={19} />
            </button>

            <div className="modal-heading">

              <div className="modal-icon purple">
                <Edit3 size={20} />
              </div>

              <div>
                <h2>Edit Student</h2>
                <p>
                  Update student information.
                </p>
              </div>

            </div>

            <form onSubmit={handleUpdateStudent}>

              <div className="form-group">
                <label>Student Name</label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Course</label>

                  <input
                    name="course"
                    value={form.course}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label>Semester</label>

                  <input
                    name="semester"
                    value={form.semester}
                    onChange={handleFormChange}
                  />
                </div>

              </div>

              <div className="form-group">

                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                >
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>

              </div>

              <div className="modal-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowEditModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  <Save size={16} />
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {selectedStudent && (

        <div
          className="student-modal-overlay"
          onClick={() =>
            setSelectedStudent(null)
          }
        >

          <div
            className="student-modal view-student-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="student-modal-close"
              onClick={() =>
                setSelectedStudent(null)
              }
            >
              <X size={19} />
            </button>

            <div className="student-profile">

              <div className="large-student-avatar">
                {selectedStudent.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <h2>
                {selectedStudent.name}
              </h2>

              <span
                className={`status ${String(
                  selectedStudent.status
                ).toLowerCase()}`}
              >
                <span className="status-dot" />
                {selectedStudent.status}
              </span>

            </div>

            <div className="student-details">

              <div className="detail-item">
                <span>Email</span>

                <strong>
                  <Mail size={15} />
                  {selectedStudent.email}
                </strong>
              </div>

              <div className="detail-item">
                <span>Course</span>

                <strong>
                  <GraduationCap size={15} />
                  {selectedStudent.course}
                </strong>
              </div>

              <div className="detail-item">
                <span>Semester</span>

                <strong>
                  {selectedStudent.semester}
                </strong>
              </div>

              <div className="detail-item">
                <span>Student ID</span>

                <strong>
                  STU-{selectedStudent.id}
                </strong>
              </div>

            </div>

          </div>

        </div>

      )}

      {showDeleteModal &&
        studentToDelete && (

          <div
            className="student-modal-overlay"
            onClick={() =>
              setShowDeleteModal(false)
            }
          >

            <div
              className="student-modal delete-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="delete-icon">
                <Trash2 size={24} />
              </div>

              <h2>Delete Student?</h2>

              <p>
                Are you sure you want to delete{" "}
                <strong>
                  {studentToDelete.name}
                </strong>
                ? This action cannot be undone.
              </p>

              <div className="modal-buttons">

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="delete-btn"
                  onClick={handleDeleteStudent}
                >
                  <Trash2 size={16} />
                  Delete Student
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
};

export default Students;