import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  X,
  Users,
  GraduationCap,
  UserRound,
  BookOpen,
} from "lucide-react";

const STORAGE_KEY = "school_classes";

const emptyForm = {
  name: "",
  section: "",
  semester: "",
  teacher: "",
  students: "",
};

const Classes = () => {
  const [classes, setClasses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const semesters = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
  ];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  }, [classes]);

  const filteredClasses = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return classes.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchText) ||
        item.section.toLowerCase().includes(searchText) ||
        item.semester.toLowerCase().includes(searchText) ||
        item.teacher.toLowerCase().includes(searchText);

      const matchesSemester =
        semesterFilter === "All" ||
        item.semester === semesterFilter;

      return matchesSearch && matchesSemester;
    });
  }, [classes, search, semesterFilter]);

  const totalStudents = classes.reduce(
    (total, item) => total + Number(item.students || 0),
    0
  );

  const teachers = new Set(
    classes.map((item) => item.teacher)
  ).size;

  const subjects = new Set(
    classes.map((item) => item.name)
  ).size;

  const openAddModal = () => {
    setEditingClass(null);
    setSelectedClass(null);
    setFormData({ ...emptyForm });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingClass(item);
    setSelectedClass(null);

    setFormData({
      name: item.name,
      section: item.section,
      semester: item.semester,
      teacher: item.teacher,
      students: item.students,
    });

    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter class name.");
      return;
    }

    if (!formData.section.trim()) {
      alert("Please enter section.");
      return;
    }

    if (!formData.semester) {
      alert("Please select semester.");
      return;
    }

    if (!formData.teacher.trim()) {
      alert("Please enter class teacher.");
      return;
    }

    if (
      formData.students === "" ||
      Number.isNaN(Number(formData.students)) ||
      Number(formData.students) < 0
    ) {
      alert("Please enter valid student count.");
      return;
    }

    const classData = {
      name: formData.name.trim(),
      section: formData.section.trim(),
      semester: formData.semester,
      teacher: formData.teacher.trim(),
      students: Number(formData.students),
    };

    if (editingClass) {
      setClasses((prev) =>
        prev.map((item) =>
          item.id === editingClass.id
            ? { ...item, ...classData }
            : item
        )
      );
    } else {
      setClasses((prev) => [
        ...prev,
        {
          id:
            typeof crypto !== "undefined" &&
            crypto.randomUUID
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random()}`,
          ...classData,
        },
      ]);
    }

    closeModal();
  };

  const deleteClass = (id) => {
    const item = classes.find(
      (classItem) => classItem.id === id
    );

    if (!item) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}" Section ${item.section}?`
    );

    if (!confirmed) return;

    setClasses((prev) =>
      prev.filter((classItem) => classItem.id !== id)
    );

    setSelectedClass(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
    setFormData({ ...emptyForm });
  };

  return (
    <div className="classes-page">
      <div className="classes-top">
        <div>
          <h1>Classes</h1>
          <p>
            Manage classes, sections, teachers and students.
          </p>
        </div>

        <button
          className="add-class-btn"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Class
        </button>
      </div>

      <div className="class-stats">
        <div className="class-stat-card blue">
          <div className="class-stat-icon">
            <GraduationCap size={24} />
          </div>

          <div>
            <h2>{classes.length}</h2>
            <p>Total Classes</p>
          </div>
        </div>

        <div className="class-stat-card green">
          <div className="class-stat-icon">
            <Users size={24} />
          </div>

          <div>
            <h2>{totalStudents}</h2>
            <p>Total Students</p>
          </div>
        </div>

        <div className="class-stat-card purple">
          <div className="class-stat-icon">
            <UserRound size={24} />
          </div>

          <div>
            <h2>{teachers}</h2>
            <p>Class Teachers</p>
          </div>
        </div>

        <div className="class-stat-card orange">
          <div className="class-stat-icon">
            <BookOpen size={24} />
          </div>

          <div>
            <h2>{subjects}</h2>
            <p>Subjects / Courses</p>
          </div>
        </div>
      </div>

      <div className="classes-card">
        <div className="classes-header">
          <div>
            <h2>All Classes</h2>
            <p>
              View and manage all school classes.
            </p>
          </div>

          <div className="classes-filters">
            <div className="class-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search classes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearch("")}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <select
              value={semesterFilter}
              onChange={(e) =>
                setSemesterFilter(e.target.value)
              }
            >
              <option value="All">
                All Semesters
              </option>

              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester} Semester
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="classes-table-wrapper">
          <table className="classes-table">
            <thead>
              <tr>
                <th>CLASS</th>
                <th>SECTION</th>
                <th>SEMESTER</th>
                <th>CLASS TEACHER</th>
                <th>STUDENTS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredClasses.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="class-name-cell">
                      <div className="class-icon">
                        <BookOpen size={18} />
                      </div>

                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          Class ID: #
                          {String(item.id).slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="section-badge">
                      {item.section}
                    </span>
                  </td>

                  <td>
                    <span className="semester-badge">
                      {item.semester}
                    </span>
                  </td>

                  <td>
                    <div className="teacher-cell">
                      <div className="teacher-avatar">
                        {item.teacher.charAt(0).toUpperCase()}
                      </div>

                      {item.teacher}
                    </div>
                  </td>

                  <td>
                    <div className="student-count">
                      <Users size={16} />
                      {item.students}
                    </div>
                  </td>

                  <td>
                    <div className="class-actions">
                      <button
                        className="class-action-btn"
                        onClick={() =>
                          setSelectedClass(
                            selectedClass?.id === item.id
                              ? null
                              : item
                          )
                        }
                        title="Actions"
                      >
                        <MoreVertical size={19} />
                      </button>

                      {selectedClass?.id === item.id && (
                        <div className="class-action-menu">
                          <button
                            onClick={() =>
                              setSelectedClass(item)
                            }
                          >
                            <Eye size={15} />
                            View
                          </button>

                          <button
                            onClick={() =>
                              openEditModal(item)
                            }
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            className="delete-action"
                            onClick={() =>
                              deleteClass(item.id)
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
              ))}

              {filteredClasses.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="no-classes"
                  >
                    {classes.length === 0
                      ? "No classes added yet. Click “Add Class” to create your first class."
                      : "No classes found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="classes-footer">
          Showing{" "}
          <strong>{filteredClasses.length}</strong> of{" "}
          <strong>{classes.length}</strong> classes
        </div>
      </div>

      {isModalOpen && (
        <div
          className="class-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="class-modal">
            <div className="class-modal-header">
              <div>
                <h2>
                  {editingClass
                    ? "Edit Class"
                    : "Add New Class"}
                </h2>

                <p>
                  {editingClass
                    ? "Update class information."
                    : "Create a new school class."}
                </p>
              </div>

              <button
                className="class-close-btn"
                onClick={closeModal}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="class-form-group">
                <label>Class Name *</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Web Development"
                  autoFocus
                />
              </div>

              <div className="class-form-grid">
                <div className="class-form-group">
                  <label>Section *</label>

                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    placeholder="e.g. A"
                  />
                </div>

                <div className="class-form-group">
                  <label>Semester *</label>

                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Semester
                    </option>

                    {semesters.map((semester) => (
                      <option
                        key={semester}
                        value={semester}
                      >
                        {semester}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="class-form-group">
                <label>Class Teacher *</label>

                <input
                  type="text"
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  placeholder="Enter teacher name"
                />
              </div>

              <div className="class-form-group">
                <label>Total Students *</label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  name="students"
                  value={formData.students}
                  onChange={handleChange}
                  placeholder="Enter number of students"
                />
              </div>

              <div className="class-modal-actions">
                <button
                  type="button"
                  className="class-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="class-save-btn"
                >
                  {editingClass
                    ? "Update Class"
                    : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedClass && !isModalOpen && (
        <div
          className="class-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedClass(null);
            }
          }}
        >
          <div className="class-view-modal">
            <div className="class-modal-header">
              <div>
                <h2>{selectedClass.name}</h2>

                <p>
                  Section {selectedClass.section}
                </p>
              </div>

              <button
                className="class-close-btn"
                onClick={() =>
                  setSelectedClass(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="class-view-grid">
              <div>
                <span>Class</span>
                <strong>
                  {selectedClass.name}
                </strong>
              </div>

              <div>
                <span>Section</span>
                <strong>
                  {selectedClass.section}
                </strong>
              </div>

              <div>
                <span>Semester</span>
                <strong>
                  {selectedClass.semester}
                </strong>
              </div>

              <div>
                <span>Class Teacher</span>
                <strong>
                  {selectedClass.teacher}
                </strong>
              </div>

              <div>
                <span>Total Students</span>
                <strong>
                  {selectedClass.students}
                </strong>
              </div>
            </div>

            <div className="class-view-actions">
              <button
                className="edit-class-btn"
                onClick={() =>
                  openEditModal(selectedClass)
                }
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                className="delete-class-btn"
                onClick={() =>
                  deleteClass(selectedClass.id)
                }
              >
                <Trash2 size={16} />
                Delete
              </button>

              <button
                className="class-cancel-btn"
                onClick={() =>
                  setSelectedClass(null)
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;