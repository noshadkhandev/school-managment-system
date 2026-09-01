import { useMemo, useState } from "react";
import {
  CalendarDays,
  BookOpen,
  Building2,
  Plus,
  Search,
  MoreVertical,
  ClipboardList,
  CheckCircle2,
  Clock3,
  Pencil,
  Trash2,
  Eye,
  X,
} from "lucide-react";

const Exams = () => {
  const [exams, setExams] = useState([
    {
      id: 1,
      name: "Mid Term Examination",
      subject: "Mathematics",
      date: "2026-09-10",
      class: "Grade 8",
      section: "A",
      type: "Mid Term",
      status: "Upcoming",
      description:
        "Mid term mathematics examination for Grade 8 students.",
    },
    {
      id: 2,
      name: "English Assessment",
      subject: "English",
      date: "2026-09-15",
      class: "Grade 6",
      section: "B",
      type: "Assessment",
      status: "Upcoming",
      description:
        "English reading, writing and grammar assessment.",
    },
    {
      id: 3,
      name: "Science Final Exam",
      subject: "Science",
      date: "2026-12-15",
      class: "Grade 10",
      section: "A",
      type: "Final",
      status: "Upcoming",
      description:
        "Final science examination for Grade 10 students.",
    },
    {
      id: 4,
      name: "Computer Test",
      subject: "Computer",
      date: "2026-10-20",
      class: "Grade 9",
      section: "A",
      type: "Class Test",
      status: "Completed",
      description:
        "Computer science class test covering the current syllabus.",
    },
  ]);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [editingExam, setEditingExam] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    date: "",
    class: "",
    section: "",
    type: "Mid Term",
    status: "Upcoming",
    description: "",
  });

  const classes = [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
  ];

  const sections = ["A", "B", "C", "D"];

  const subjects = [
    "English",
    "Mathematics",
    "Science",
    "Computer",
    "Urdu",
    "Islamiyat",
    "Social Studies",
    "General Knowledge",
  ];

  const examTypes = [
    "Class Test",
    "Assessment",
    "Mid Term",
    "Final",
    "Monthly Test",
  ];

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        exam.name.toLowerCase().includes(searchText) ||
        exam.subject.toLowerCase().includes(searchText) ||
        exam.class.toLowerCase().includes(searchText) ||
        exam.section.toLowerCase().includes(searchText);

      const matchesClass =
        classFilter === "All" || exam.class === classFilter;

      const matchesSubject =
        subjectFilter === "All" ||
        exam.subject === subjectFilter;

      const matchesStatus =
        statusFilter === "All" ||
        exam.status === statusFilter;

      return (
        matchesSearch &&
        matchesClass &&
        matchesSubject &&
        matchesStatus
      );
    });
  }, [
    exams,
    search,
    classFilter,
    subjectFilter,
    statusFilter,
  ]);

  const upcomingCount = exams.filter(
    (exam) => exam.status === "Upcoming"
  ).length;

  const completedCount = exams.filter(
    (exam) => exam.status === "Completed"
  ).length;

  const today = new Date().toISOString().split("T")[0];

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      date: "",
      class: "",
      section: "",
      type: "Mid Term",
      status: "Upcoming",
      description: "",
    });
  };

  const openAddModal = () => {
    setEditingExam(null);
    resetForm();
    setOpenMenu(null);
    setIsModalOpen(true);
  };

  const openEditModal = (exam) => {
    setEditingExam(exam);
    setSelectedExam(null);
    setOpenMenu(null);

    setFormData({
      name: exam.name,
      subject: exam.subject,
      date: exam.date,
      class: exam.class,
      section: exam.section,
      type: exam.type,
      status: exam.status,
      description: exam.description,
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExam(null);
    resetForm();
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
      alert("Please enter exam name.");
      return;
    }

    if (!formData.subject) {
      alert("Please select subject.");
      return;
    }

    if (!formData.class) {
      alert("Please select grade.");
      return;
    }

    if (!formData.section) {
      alert("Please select section.");
      return;
    }

    if (!formData.date) {
      alert("Please select exam date.");
      return;
    }

    if (formData.date < today && formData.status === "Upcoming") {
      alert("Please select a current or future date.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter exam details.");
      return;
    }

    const examData = {
      name: formData.name.trim(),
      subject: formData.subject,
      date: formData.date,
      class: formData.class,
      section: formData.section,
      type: formData.type,
      status: formData.status,
      description: formData.description.trim(),
    };

    if (editingExam) {
      setExams((prev) =>
        prev.map((exam) =>
          exam.id === editingExam.id
            ? {
                ...exam,
                ...examData,
              }
            : exam
        )
      );
    } else {
      setExams((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...examData,
        },
      ]);
    }

    closeModal();
  };

  const deleteExam = (id) => {
    const exam = exams.find((item) => item.id === id);

    if (!exam) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${exam.name}"?`
    );

    if (!confirmed) return;

    setExams((prev) =>
      prev.filter((item) => item.id !== id)
    );

    setOpenMenu(null);

    if (selectedExam?.id === id) {
      setSelectedExam(null);
    }
  };

  const toggleStatus = (id) => {
    setExams((prev) =>
      prev.map((exam) =>
        exam.id === id
          ? {
              ...exam,
              status:
                exam.status === "Upcoming"
                  ? "Completed"
                  : "Upcoming",
            }
          : exam
      )
    );

    setOpenMenu(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleView = (exam) => {
    setSelectedExam(exam);
    setOpenMenu(null);
  };

  return (
    <div
      className="exams-page"
      onClick={() => setOpenMenu(null)}
    >
      <div className="exam-stats">
        <div className="exam-stat-card blue">
          <div className="stat-icon">
            <ClipboardList size={25} />
          </div>

          <div>
            <h2>{exams.length}</h2>
            <p>Total Exams</p>
          </div>
        </div>

        <div className="exam-stat-card green">
          <div className="stat-icon">
            <Clock3 size={25} />
          </div>

          <div>
            <h2>{upcomingCount}</h2>
            <p>Upcoming Exams</p>
          </div>
        </div>

        <div className="exam-stat-card red">
          <div className="stat-icon">
            <CheckCircle2 size={25} />
          </div>

          <div>
            <h2>{completedCount}</h2>
            <p>Completed Exams</p>
          </div>
        </div>
      </div>

      <div className="exams-card">
        <div className="exams-header">
          <div>
            <h2>School Examinations</h2>
            <p>Create and manage school examinations.</p>
          </div>

          <div className="exam-header-actions">
            <div
              className="exam-search"
              onClick={(e) => e.stopPropagation()}
            >
              <Search size={19} />

              <input
                type="text"
                placeholder="Search exams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className="add-exam-btn"
              onClick={openAddModal}
            >
              <Plus size={19} />
              Add Exam
            </button>
          </div>
        </div>

        <div
          className="exam-filters"
          onClick={(e) => e.stopPropagation()}
        >
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="All">All Grades</option>

            {classes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="All">All Subjects</option>

            {subjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="exam-table-wrapper">
          <table className="exam-table">
            <thead>
              <tr>
                <th>EXAM</th>
                <th>SUBJECT</th>
                <th>DATE</th>
                <th>GRADE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredExams.map((exam) => (
                <tr key={exam.id}>
                  <td>
                    <div className="exam-name">
                      <div className="exam-row-icon">
                        <CalendarDays size={21} />
                      </div>

                      <div>
                        <strong>{exam.name}</strong>
                        <span>{exam.type}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="subject-cell">
                      <BookOpen size={17} />
                      {exam.subject}
                    </div>
                  </td>

                  <td>
                    <div className="date-badge">
                      <CalendarDays size={16} />
                      {formatDate(exam.date)}
                    </div>
                  </td>

                  <td>
                    <div className="class-cell">
                      <Building2 size={17} />
                      {exam.class} - {exam.section}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`exam-status ${
                        exam.status === "Completed"
                          ? "completed"
                          : "upcoming"
                      }`}
                    >
                      <span></span>
                      {exam.status}
                    </span>
                  </td>

                  <td>
                    <div
                      className="exam-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="exam-action-btn"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === exam.id
                              ? null
                              : exam.id
                          )
                        }
                        aria-label="Exam actions"
                      >
                        <MoreVertical
                          size={20}
                          strokeWidth={2}
                        />
                      </button>

                      {openMenu === exam.id && (
                        <div className="exam-action-menu">
                          <button
                            type="button"
                            onClick={() => handleView(exam)}
                          >
                            <Eye
                              size={16}
                              strokeWidth={2}
                            />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(exam)
                            }
                          >
                            <Pencil
                              size={16}
                              strokeWidth={2}
                            />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleStatus(exam.id)
                            }
                          >
                            <CheckCircle2
                              size={16}
                              strokeWidth={2}
                            />
                            <span>
                              {exam.status === "Upcoming"
                                ? "Mark Completed"
                                : "Mark Upcoming"}
                            </span>
                          </button>

                          <button
                            type="button"
                            className="delete-action"
                            onClick={() =>
                              deleteExam(exam.id)
                            }
                          >
                            <Trash2
                              size={16}
                              strokeWidth={2}
                            />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredExams.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-exams">
                    No exams found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="exam-footer">
          <p>
            Showing <strong>{filteredExams.length}</strong>{" "}
            of <strong>{exams.length}</strong> exams
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="exam-modal-overlay">
          <div
            className="exam-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="exam-modal-header">
              <div>
                <h2>
                  {editingExam
                    ? "Edit Exam"
                    : "Add New Exam"}
                </h2>

                <p>
                  {editingExam
                    ? "Update examination information."
                    : "Create a new school examination."}
                </p>
              </div>

              <button
                type="button"
                className="exam-close-btn"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="exam-form-group">
                <label>Exam Name *</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter exam name"
                />
              </div>

              <div className="exam-form-grid">
                <div className="exam-form-group">
                  <label>Subject *</label>

                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Subject
                    </option>

                    {subjects.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="exam-form-group">
                  <label>Exam Type *</label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    {examTypes.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="exam-form-grid">
                <div className="exam-form-group">
                  <label>Grade *</label>

                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Grade
                    </option>

                    {classes.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="exam-form-group">
                  <label>Section *</label>

                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Section
                    </option>

                    {sections.map((item) => (
                      <option key={item} value={item}>
                        Section {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="exam-form-grid">
                <div className="exam-form-group">
                  <label>Exam Date *</label>

                  <input
                    type="date"
                    name="date"
                    min={
                      formData.status === "Upcoming"
                        ? today
                        : undefined
                    }
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>

                <div className="exam-form-group">
                  <label>Status *</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Upcoming">
                      Upcoming
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>
              </div>

              <div className="exam-form-group">
                <label>Exam Details *</label>

                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter exam details..."
                />
              </div>

              <div className="exam-modal-actions">
                <button
                  type="button"
                  className="exam-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="exam-save-btn"
                >
                  {editingExam
                    ? "Update Exam"
                    : "Create Exam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedExam && (
        <div className="exam-modal-overlay">
          <div
            className="exam-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="exam-modal-header">
              <div>
                <h2>{selectedExam.name}</h2>
                <p>{selectedExam.type}</p>
              </div>

              <button
                type="button"
                className="exam-close-btn"
                onClick={() =>
                  setSelectedExam(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="exam-view-grid">
              <div>
                <span>Subject</span>
                <strong>
                  {selectedExam.subject}
                </strong>
              </div>

              <div>
                <span>Grade</span>
                <strong>
                  {selectedExam.class} -{" "}
                  {selectedExam.section}
                </strong>
              </div>

              <div>
                <span>Exam Date</span>
                <strong>
                  {formatDate(selectedExam.date)}
                </strong>
              </div>

              <div>
                <span>Status</span>

                <span
                  className={`exam-status ${
                    selectedExam.status ===
                    "Completed"
                      ? "completed"
                      : "upcoming"
                  }`}
                >
                  <span></span>
                  {selectedExam.status}
                </span>
              </div>
            </div>

            <div className="exam-view-description">
              <h3>Exam Details</h3>

              <p>{selectedExam.description}</p>
            </div>

            <div className="exam-view-actions">
              <button
                type="button"
                className="edit-view-btn"
                onClick={() =>
                  openEditModal(selectedExam)
                }
              >
                <Pencil
                  size={16}
                  strokeWidth={2}
                />
                Edit
              </button>

              <button
                type="button"
                className="delete-view-btn"
                onClick={() =>
                  deleteExam(selectedExam.id)
                }
              >
                <Trash2
                  size={16}
                  strokeWidth={2}
                />
                Delete
              </button>

              <button
                type="button"
                className="exam-cancel-btn"
                onClick={() =>
                  setSelectedExam(null)
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

export default Exams;