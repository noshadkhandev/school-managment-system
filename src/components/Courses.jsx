import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  MoreVertical,
  Users,
  UserRound,
  X,
  Eye,
  Edit3,
  Trash2,
  Save,
  CheckCircle2,
} from "lucide-react";

const initialCourses = [
  {
    id: 1,
    name: "Web Development",
    code: "WD-101",
    instructor: "Jawad Ali",
    students: 120,
    category: "Computer Science",
    status: "Active",
  },
  {
    id: 2,
    name: "Software Engineering",
    code: "SE-202",
    instructor: "Jawad Ali",
    students: 95,
    category: "Engineering",
    status: "Active",
  },
  {
    id: 3,
    name: "Database Systems",
    code: "DB-301",
    instructor: "Noshad Khan",
    students: 75,
    category: "Computer Science",
    status: "Active",
  },
  {
    id: 4,
    name: "Information Technology",
    code: "IT-404",
    instructor: "Afnan Wazir",
    students: 60,
    category: "IT",
    status: "Inactive",
  },
];

const categories = [
  "Computer Science",
  "Engineering",
  "IT",
  "Mathematics",
  "Science",
  "English",
];

const Courses = () => {
  // ==============================
  // COURSES + LOCAL STORAGE
  // ==============================

  const [courses, setCourses] = useState(() => {
    try {
      const savedCourses = localStorage.getItem("courses");

      return savedCourses
        ? JSON.parse(savedCourses)
        : initialCourses;
    } catch {
      return initialCourses;
    }
  });

  // Save courses automatically
  // whenever courses change
  useEffect(() => {
    localStorage.setItem(
      "courses",
      JSON.stringify(courses)
    );
  }, [courses]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [openMenu, setOpenMenu] = useState(null);

  const [selectedCourse, setSelectedCourse] =
    useState(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [courseToDelete, setCourseToDelete] =
    useState(null);

  const [editingCourse, setEditingCourse] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    instructor: "",
    students: 0,
    category: "Computer Science",
    status: "Active",
  });

  // ==============================
  // ESCAPE KEY
  // ==============================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;

      setOpenMenu(null);
      setSelectedCourse(null);
      setShowAddModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // ==============================
  // SEARCH + FILTER
  // ==============================

  const filteredCourses = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    return courses.filter((course) => {
      const matchesSearch =
        !searchText ||
        course.name
          .toLowerCase()
          .includes(searchText) ||
        course.code
          .toLowerCase()
          .includes(searchText) ||
        course.instructor
          .toLowerCase()
          .includes(searchText) ||
        course.category
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        categoryFilter === "All Categories" ||
        course.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        course.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    courses,
    search,
    categoryFilter,
    statusFilter,
  ]);

  // ==============================
  // STATISTICS
  // ==============================

  const totalCourses = courses.length;

  const activeCourses = courses.filter(
    (course) => course.status === "Active"
  ).length;

  const inactiveCourses = courses.filter(
    (course) => course.status === "Inactive"
  ).length;

  const totalStudents = courses.reduce(
    (total, course) =>
      total + Number(course.students || 0),
    0
  );

  // ==============================
  // FORM
  // ==============================

  const resetForm = () => {
    setForm({
      name: "",
      code: "",
      instructor: "",
      students: 0,
      category: "Computer Science",
      status: "Active",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "students"
          ? Math.max(0, Number(value))
          : value,
    }));
  };

  // ==============================
  // ADD COURSE
  // ==============================

  const openAddModal = () => {
    setOpenMenu(null);
    setEditingCourse(null);
    resetForm();
    setShowAddModal(true);
  };

  const handleAddCourse = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter course name.");
      return;
    }

    if (!form.code.trim()) {
      alert("Please enter course code.");
      return;
    }

    if (!form.instructor.trim()) {
      alert("Please enter instructor name.");
      return;
    }

    const normalizedCode = form.code
      .trim()
      .toUpperCase();

    const duplicate = courses.some(
      (course) =>
        course.code.toUpperCase() ===
        normalizedCode
    );

    if (duplicate) {
      alert("This course code already exists.");
      return;
    }

    const newCourse = {
      id: Date.now(),
      name: form.name.trim(),
      code: normalizedCode,
      instructor: form.instructor.trim(),
      students: Number(form.students) || 0,
      category: form.category,
      status: form.status,
    };

    setCourses((prev) => [
      ...prev,
      newCourse,
    ]);

    setShowAddModal(false);
    resetForm();
  };

  // ==============================
  // EDIT COURSE
  // ==============================

  const openEditModal = (course) => {
    setOpenMenu(null);
    setEditingCourse(course);

    setForm({
      name: course.name,
      code: course.code,
      instructor: course.instructor,
      students: course.students,
      category: course.category,
      status: course.status,
    });

    setShowEditModal(true);
  };

  const handleUpdateCourse = (e) => {
    e.preventDefault();

    if (!editingCourse) return;

    if (!form.name.trim()) {
      alert("Please enter course name.");
      return;
    }

    if (!form.code.trim()) {
      alert("Please enter course code.");
      return;
    }

    if (!form.instructor.trim()) {
      alert("Please enter instructor name.");
      return;
    }

    const normalizedCode = form.code
      .trim()
      .toUpperCase();

    const duplicate = courses.some(
      (course) =>
        course.code.toUpperCase() ===
          normalizedCode &&
        course.id !== editingCourse.id
    );

    if (duplicate) {
      alert("This course code already exists.");
      return;
    }

    const updatedCourse = {
      ...editingCourse,
      name: form.name.trim(),
      code: normalizedCode,
      instructor: form.instructor.trim(),
      students: Number(form.students) || 0,
      category: form.category,
      status: form.status,
    };

    setCourses((prev) =>
      prev.map((course) =>
        course.id === editingCourse.id
          ? updatedCourse
          : course
      )
    );

    if (
      selectedCourse?.id ===
      editingCourse.id
    ) {
      setSelectedCourse(updatedCourse);
    }

    setShowEditModal(false);
    setEditingCourse(null);
    resetForm();
  };

  // ==============================
  // VIEW
  // ==============================

  const handleViewCourse = (course) => {
    setOpenMenu(null);
    setSelectedCourse(course);
  };

  // ==============================
  // DELETE
  // ==============================

  const openDeleteModal = (course) => {
    setOpenMenu(null);
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleDeleteCourse = () => {
    if (!courseToDelete) return;

    setCourses((prev) =>
      prev.filter(
        (course) =>
          course.id !== courseToDelete.id
      )
    );

    if (
      selectedCourse?.id ===
      courseToDelete.id
    ) {
      setSelectedCourse(null);
    }

    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  // ==============================
  // STATUS
  // ==============================

  const toggleStatus = (course) => {
    const newStatus =
      course.status === "Active"
        ? "Inactive"
        : "Active";

    setCourses((prev) =>
      prev.map((item) =>
        item.id === course.id
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );

    setOpenMenu(null);

    if (
      selectedCourse?.id ===
      course.id
    ) {
      setSelectedCourse((prev) => ({
        ...prev,
        status: newStatus,
      }));
    }
  };

  // ==============================
  // CLOSE MODALS
  // ==============================

  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCourse(null);
    setEditingCourse(null);
    setCourseToDelete(null);
  };

  // ==============================
  // UI
  // ==============================

  return (
    <div className="courses-page">

      <div className="courses-header">
        <div>
          <span className="page-label">
            ACADEMIC MANAGEMENT
          </span>

          <h1>Courses</h1>

          <p>
            Create, manage and monitor all
            academic courses.
          </p>
        </div>

        <button
          className="add-course-btn"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Course
        </button>
      </div>

      {/* STATS */}

      <div className="course-stats">

        <div className="course-stat-card">
          <div className="course-stat-icon blue">
            <BookOpen size={22} />
          </div>

          <div>
            <span>Total Courses</span>
            <h2>{totalCourses}</h2>
            <small>All courses</small>
          </div>
        </div>

        <div className="course-stat-card">
          <div className="course-stat-icon green">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <span>Active Courses</span>
            <h2>{activeCourses}</h2>
            <small>
              Currently available
            </small>
          </div>
        </div>

        <div className="course-stat-card">
          <div className="course-stat-icon purple">
            <Users size={22} />
          </div>

          <div>
            <span>Enrolled Students</span>
            <h2>{totalStudents}</h2>
            <small>
              Across all courses
            </small>
          </div>
        </div>

        <div className="course-stat-card">
          <div className="course-stat-icon orange">
            <BookOpen size={22} />
          </div>

          <div>
            <span>Inactive Courses</span>
            <h2>{inactiveCourses}</h2>
            <small>
              Currently unavailable
            </small>
          </div>
        </div>

      </div>

      {/* COURSES */}

      <div className="courses-card">

        <div className="courses-card-header">

          <div>
            <h2>All Courses</h2>

            <p>
              View and manage available
              courses.
            </p>
          </div>

          <div className="course-actions">

            <div className="course-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  className="course-clear-search"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <X size={14} />
                </button>
              )}

            </div>

            <select
              className="course-filter"
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
            >
              <option>
                All Categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>

            <select
              className="course-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option>
                All Status
              </option>
              <option>Active</option>
              <option>Inactive</option>
            </select>

          </div>
        </div>

        <div className="table-wrapper">

          <table className="courses-table">

            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Students</th>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredCourses.length > 0 ? (

                filteredCourses.map(
                  (course) => (
                    <tr key={course.id}>

                      <td>
                        <div className="course-name">

                          <div className="course-icon">
                            <BookOpen size={19} />
                          </div>

                          <div>
                            <strong>
                              {course.name}
                            </strong>

                            <span>
                              Course Code:{" "}
                              {course.code}
                            </span>
                          </div>

                        </div>
                      </td>

                      <td>
                        <div className="course-instructor">
                          <UserRound size={16} />
                          {course.instructor}
                        </div>
                      </td>

                      <td>
                        <div className="course-students">
                          <Users size={16} />
                          {course.students}
                        </div>
                      </td>

                      <td>
                        <span className="category-badge">
                          {course.category}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`course-status ${course.status.toLowerCase()}`}
                        >
                          <span />
                          {course.status}
                        </span>
                      </td>

                      <td>

                        <div className="course-action-wrapper">

                          <button
                            type="button"
                            className="course-more"
                            onClick={() =>
                              setOpenMenu(
                                openMenu ===
                                  course.id
                                  ? null
                                  : course.id
                              )
                            }
                          >
                            <MoreVertical
                              size={19}
                            />
                          </button>

                          {openMenu ===
                            course.id && (

                            <div className="course-action-menu">

                              <button
                                type="button"
                                onClick={() =>
                                  handleViewCourse(
                                    course
                                  )
                                }
                              >
                                <Eye size={15} />
                                View
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    course
                                  )
                                }
                              >
                                <Edit3 size={15} />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleStatus(
                                    course
                                  )
                                }
                              >
                                <CheckCircle2
                                  size={15}
                                />

                                {course.status ===
                                "Active"
                                  ? "Set Inactive"
                                  : "Set Active"}
                              </button>

                              <button
                                type="button"
                                className="course-delete-action"
                                onClick={() =>
                                  openDeleteModal(
                                    course
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
                  )
                )

              ) : (

                <tr>
                  <td
                    colSpan="6"
                    className="course-empty-state"
                  >
                    <BookOpen size={32} />

                    <strong>
                      No courses found
                    </strong>

                    <span>
                      Try changing your
                      search or filters.
                    </span>
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="courses-footer">

          <span>
            Showing{" "}
            <strong>
              {filteredCourses.length}
            </strong>{" "}
            of{" "}
            <strong>
              {totalCourses}
            </strong>{" "}
            courses
          </span>

        </div>

      </div>

      {/* ADD / EDIT MODAL */}

      {(showAddModal ||
        showEditModal) && (

        <div
          className="course-modal-overlay"
          onClick={closeAllModals}
        >

          <div
            className="course-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="course-modal-close"
              onClick={closeAllModals}
            >
              <X size={19} />
            </button>

            <div className="course-modal-heading">

              <div
                className={`course-modal-icon ${
                  showEditModal
                    ? "purple"
                    : "blue"
                }`}
              >
                {showEditModal ? (
                  <Edit3 size={20} />
                ) : (
                  <Plus size={20} />
                )}
              </div>

              <div>

                <h2>
                  {showEditModal
                    ? "Edit Course"
                    : "Add Course"}
                </h2>

                <p>
                  {showEditModal
                    ? "Update course information."
                    : "Create a new academic course."}
                </p>

              </div>

            </div>

            <CourseForm
              form={form}
              handleFormChange={
                handleFormChange
              }
              onSubmit={
                showEditModal
                  ? handleUpdateCourse
                  : handleAddCourse
              }
              onCancel={closeAllModals}
              submitText={
                showEditModal
                  ? "Save Changes"
                  : "Add Course"
              }
            />

          </div>

        </div>
      )}

      {/* VIEW MODAL */}

      {selectedCourse && (

        <div
          className="course-modal-overlay"
          onClick={() =>
            setSelectedCourse(null)
          }
        >

          <div
            className="course-modal course-view-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="course-modal-close"
              onClick={() =>
                setSelectedCourse(null)
              }
            >
              <X size={19} />
            </button>

            <div className="course-profile">

              <div className="large-course-icon">
                <BookOpen size={28} />
              </div>

              <h2>
                {selectedCourse.name}
              </h2>

              <span>
                {selectedCourse.code}
              </span>

              <span
                className={`course-status ${selectedCourse.status.toLowerCase()}`}
              >
                <span />
                {selectedCourse.status}
              </span>

            </div>

            <div className="course-details">

              <div className="course-detail-item">
                <span>Instructor</span>

                <strong>
                  <UserRound size={15} />
                  {selectedCourse.instructor}
                </strong>
              </div>

              <div className="course-detail-item">
                <span>Students</span>

                <strong>
                  <Users size={15} />
                  {selectedCourse.students}
                </strong>
              </div>

              <div className="course-detail-item">
                <span>Category</span>

                <strong>
                  {selectedCourse.category}
                </strong>
              </div>

              <div className="course-detail-item">
                <span>Course Code</span>

                <strong>
                  {selectedCourse.code}
                </strong>
              </div>

            </div>

            <div className="course-modal-buttons">

              <button
                type="button"
                className="course-cancel-btn"
                onClick={() =>
                  setSelectedCourse(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="course-save-btn"
                onClick={() => {
                  const course =
                    selectedCourse;

                  setSelectedCourse(null);

                  openEditModal(course);
                }}
              >
                <Edit3 size={16} />
                Edit Course
              </button>

              <button
                type="button"
                className="course-delete-btn"
                onClick={() =>
                  openDeleteModal(
                    selectedCourse
                  )
                }
              >
                <Trash2 size={16} />
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

      {/* DELETE MODAL */}

      {showDeleteModal &&
        courseToDelete && (

        <div
          className="course-modal-overlay"
          onClick={() =>
            setShowDeleteModal(false)
          }
        >

          <div
            className="course-modal course-delete-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="course-delete-icon">
              <Trash2 size={24} />
            </div>

            <h2>
              Delete Course?
            </h2>

            <p>
              Are you sure you want to
              delete{" "}
              <strong>
                {courseToDelete.name}
              </strong>
              ?
            </p>

            <div className="course-modal-buttons">

              <button
                type="button"
                className="course-cancel-btn"
                onClick={() =>
                  setShowDeleteModal(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="course-delete-btn"
                onClick={
                  handleDeleteCourse
                }
              >
                <Trash2 size={16} />
                Delete Course
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

// ==============================
// COURSE FORM
// ==============================

const CourseForm = ({
  form,
  handleFormChange,
  onSubmit,
  onCancel,
  submitText,
}) => {

  return (
    <form onSubmit={onSubmit}>

      <div className="course-form-group">

        <label>
          Course Name *
        </label>

        <input
          name="name"
          value={form.name}
          onChange={handleFormChange}
          placeholder="e.g. Web Development"
          required
        />

      </div>

      <div className="course-form-row">

        <div className="course-form-group">

          <label>
            Course Code *
          </label>

          <input
            name="code"
            value={form.code}
            onChange={handleFormChange}
            placeholder="e.g. WD-101"
            required
          />

        </div>

        <div className="course-form-group">

          <label>
            Students
          </label>

          <input
            type="number"
            min="0"
            name="students"
            value={form.students}
            onChange={handleFormChange}
          />

        </div>

      </div>

      <div className="course-form-group">

        <label>
          Instructor *
        </label>

        <input
          name="instructor"
          value={form.instructor}
          onChange={handleFormChange}
          placeholder="e.g. Ahmed Khan"
          required
        />

      </div>

      <div className="course-form-row">

        <div className="course-form-group">

          <label>
            Category
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleFormChange}
          >

            {categories.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}

          </select>

        </div>

        <div className="course-form-group">

          <label>
            Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleFormChange}
          >

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

        </div>

      </div>

      <div className="course-modal-buttons">

        <button
          type="button"
          className="course-cancel-btn"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="course-save-btn"
        >
          <Save size={16} />
          {submitText}
        </button>

      </div>

    </form>
  );
};

export default Courses;