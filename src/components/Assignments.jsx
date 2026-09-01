import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  X,
  Calendar,
  Clock,
  BookOpen,
  Users,
  CheckCircle,
} from "lucide-react";

const ASSIGNMENTS_STORAGE_KEY = "schoolAssignments";

const SUBJECTS = [
  "English",
  "Mathematics",
  "Science",
  "Computer Science",
  "Urdu",
  "Islamiyat",
  "Social Studies",
  "Physics",
  "Chemistry",
  "Biology",
  "Other",
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
];

const getStoredAssignments = () => {
  try {
    const stored = localStorage.getItem(
      ASSIGNMENTS_STORAGE_KEY
    );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(
      "Error loading assignments:",
      error
    );

    return [];
  }
};

const Assignments = () => {
  const [assignments, setAssignments] = useState(
    getStoredAssignments
  );

  const [search, setSearch] = useState("");

  const [filterStatus, setFilterStatus] =
    useState("All Status");

  const [filterClass, setFilterClass] =
    useState("All Classes");

  const [openMenu, setOpenMenu] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [showDetails, setShowDetails] =
    useState(false);

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    className: "",
    description: "",
    dueDate: "",
    dueTime: "",
    status: "Active",
  });


  const saveAssignments = (updatedAssignments) => {
    setAssignments(updatedAssignments);

    localStorage.setItem(
      ASSIGNMENTS_STORAGE_KEY,
      JSON.stringify(updatedAssignments)
    );
  };


  const resetForm = () => {
    setForm({
      title: "",
      subject: "",
      className: "",
      description: "",
      dueDate: "",
      dueTime: "",
      status: "Active",
    });
  };

  const handleAdd = () => {
    resetForm();

    setSelectedAssignment(null);

    setShowDetails(false);

    setShowModal(true);

    setOpenMenu(null);
  };

  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // ADD ASSIGNMENT
  // =========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.subject ||
      !form.className ||
      !form.dueDate ||
      !form.dueTime
    ) {
      alert(
        "Please fill all required fields."
      );

      return;
    }

    const newAssignment = {
      id: Date.now(),

      title: form.title.trim(),

      subject: form.subject,

      className: form.className,

      description:
        form.description.trim(),

      dueDate: form.dueDate,

      dueTime: form.dueTime,

      status: form.status,

      createdAt: new Date().toISOString(),
    };

    const updatedAssignments = [
      newAssignment,
      ...assignments,
    ];

    saveAssignments(updatedAssignments);

    setShowModal(false);

    resetForm();
  };

  // =========================================
  // EDIT
  // =========================================

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);

    setForm({
      title: assignment.title,

      subject: assignment.subject,

      className: assignment.className,

      description:
        assignment.description || "",

      dueDate: assignment.dueDate,

      dueTime: assignment.dueTime,

      status: assignment.status,
    });

    setShowModal(true);

    setShowDetails(false);

    setOpenMenu(null);
  };

  // =========================================
  // UPDATE
  // =========================================

  const handleUpdate = (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.subject ||
      !form.className ||
      !form.dueDate ||
      !form.dueTime
    ) {
      alert(
        "Please fill all required fields."
      );

      return;
    }

    const updatedAssignments =
      assignments.map((assignment) => {
        if (
          assignment.id !==
          selectedAssignment.id
        ) {
          return assignment;
        }

        return {
          ...assignment,

          title: form.title.trim(),

          subject: form.subject,

          className: form.className,

          description:
            form.description.trim(),

          dueDate: form.dueDate,

          dueTime: form.dueTime,

          status: form.status,
        };
      });

    saveAssignments(updatedAssignments);

    setShowModal(false);

    setSelectedAssignment(null);

    resetForm();
  };

  // =========================================
  // DELETE
  // =========================================

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) {
      return;
    }

    const updatedAssignments =
      assignments.filter(
        (assignment) =>
          assignment.id !== id
      );

    saveAssignments(updatedAssignments);

    setOpenMenu(null);

    if (
      selectedAssignment?.id === id
    ) {
      setSelectedAssignment(null);

      setShowDetails(false);
    }
  };

  // =========================================
  // VIEW DETAILS
  // =========================================

  const handleView = (assignment) => {
    setSelectedAssignment(assignment);

    setShowDetails(true);

    setShowModal(false);

    setOpenMenu(null);
  };

  // =========================================
  // CLOSE MODAL
  // =========================================

  const closeModal = () => {
    setShowModal(false);

    setShowDetails(false);

    setSelectedAssignment(null);

    setOpenMenu(null);

    resetForm();
  };

  // =========================================
  // SEARCH + FILTER
  // =========================================

  const filteredAssignments = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return assignments.filter(
      (assignment) => {
        const matchesSearch =
          assignment.title
            .toLowerCase()
            .includes(searchText) ||
          assignment.subject
            .toLowerCase()
            .includes(searchText) ||
          assignment.className
            .toLowerCase()
            .includes(searchText);

        const matchesStatus =
          filterStatus === "All Status" ||
          assignment.status ===
            filterStatus;

        const matchesClass =
          filterClass === "All Classes" ||
          assignment.className ===
            filterClass;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesClass
        );
      }
    );
  }, [
    assignments,
    search,
    filterStatus,
    filterClass,
  ]);

  // =========================================
  // DATE + TIME FORMAT
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes)
    );

    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // =========================================
  // CHECK OVERDUE
  // =========================================

  const isOverdue = (assignment) => {
    if (
      assignment.status !== "Active" ||
      !assignment.dueDate ||
      !assignment.dueTime
    ) {
      return false;
    }

    const dueDateTime = new Date(
      `${assignment.dueDate}T${assignment.dueTime}`
    );

    return dueDateTime < new Date();
  };

  // =========================================
  // STATISTICS
  // =========================================

  const totalAssignments =
    assignments.length;

  const activeAssignments =
    assignments.filter(
      (item) =>
        item.status === "Active"
    ).length;

  const completedAssignments =
    assignments.filter(
      (item) =>
        item.status === "Completed"
    ).length;

  const overdueAssignments =
    assignments.filter((item) =>
      isOverdue(item)
    ).length;

  return (
    <div className="assignments-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="assignments-header">

        <div>

          <span className="page-label">
            ACADEMIC MANAGEMENT
          </span>

          <h1>
            Assignments
          </h1>

          <p>
            Create and manage student
            assignments and deadlines.
          </p>

        </div>

        <button
          className="add-assignment-btn"
          onClick={handleAdd}
        >
          <Plus size={18} />

          Add Assignment
        </button>

      </div>

      {/* =====================================
          STATS
      ====================================== */}

      <div className="assignment-stats">

        <div className="assignment-stat-card">

          <div className="assignment-stat-icon blue">
            <BookOpen size={22} />
          </div>

          <div>

            <span>
              Total Assignments
            </span>

            <h2>
              {totalAssignments}
            </h2>

            <small>
              All assignments
            </small>

          </div>

        </div>

        <div className="assignment-stat-card">

          <div className="assignment-stat-icon green">
            <CheckCircle size={22} />
          </div>

          <div>

            <span>
              Active
            </span>

            <h2>
              {activeAssignments}
            </h2>

            <small>
              Currently active
            </small>

          </div>

        </div>

        <div className="assignment-stat-card">

          <div className="assignment-stat-icon purple">
            <Users size={22} />
          </div>

          <div>

            <span>
              Completed
            </span>

            <h2>
              {completedAssignments}
            </h2>

            <small>
              Completed assignments
            </small>

          </div>

        </div>

        <div className="assignment-stat-card">

          <div className="assignment-stat-icon red">
            <Clock size={22} />
          </div>

          <div>

            <span>
              Overdue
            </span>

            <h2>
              {overdueAssignments}
            </h2>

            <small>
              Past deadline
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          MAIN CARD
      ====================================== */}

      <div className="assignments-card">

        <div className="assignments-card-header">

          <div>

            <h2>
              Assignment Records
            </h2>

            <p>
              View and manage school assignments.
            </p>

          </div>

          <div className="assignment-actions">

            {/* SEARCH */}

            <div className="assignment-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search assignment..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            {/* STATUS */}

            <select
              className="assignment-filter"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value
                )
              }
            >

              <option>
                All Status
              </option>

              <option>
                Active
              </option>

              <option>
                Completed
              </option>

            </select>

            {/* CLASS */}

            <select
              className="assignment-filter"
              value={filterClass}
              onChange={(e) =>
                setFilterClass(
                  e.target.value
                )
              }
            >

              <option>
                All Classes
              </option>

              {CLASSES.map(
                (className) => (
                  <option
                    key={className}
                    value={className}
                  >
                    {className}
                  </option>
                )
              )}

            </select>

          </div>

        </div>

        {/* =====================================
            TABLE
        ====================================== */}

        <div className="table-wrapper">

          <table className="assignments-table">

            <thead>

              <tr>

                <th>
                  Assignment
                </th>

                <th>
                  Subject
                </th>

                <th>
                  Class
                </th>

                <th>
                  Due Date
                </th>

                <th>
                  Time
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredAssignments.length >
              0 ? (

                filteredAssignments.map(
                  (assignment) => {

                    const overdue =
                      isOverdue(
                        assignment
                      );

                    return (
                      <tr
                        key={
                          assignment.id
                        }
                      >

                        {/* ASSIGNMENT */}

                        <td>

                          <div className="assignment-title">

                            <div className="assignment-icon">
                              <BookOpen
                                size={17}
                              />
                            </div>

                            <div>

                              <strong>
                                {
                                  assignment.title
                                }
                              </strong>

                              {assignment.description && (
                                <span>
                                  {
                                    assignment.description
                                  }
                                </span>
                              )}

                            </div>

                          </div>

                        </td>

                        {/* SUBJECT */}

                        <td>
                          {
                            assignment.subject
                          }
                        </td>

                        {/* CLASS */}

                        <td>
                          {
                            assignment.className
                          }
                        </td>

                        {/* DATE */}

                        <td>

                          <div className="assignment-date">

                            <Calendar
                              size={15}
                            />

                            {
                              formatDate(
                                assignment.dueDate
                              )
                            }

                          </div>

                        </td>

                        {/* TIME */}

                        <td>

                          <div className="assignment-time">

                            <Clock
                              size={15}
                            />

                            {
                              formatTime(
                                assignment.dueTime
                              )
                            }

                          </div>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`assignment-status ${
                              overdue
                                ? "overdue"
                                : assignment.status.toLowerCase()
                            }`}
                          >

                            <span></span>

                            {overdue
                              ? "Overdue"
                              : assignment.status}

                          </span>

                        </td>

                        {/* ACTION */}

                        <td>

                          <div className="assignment-action-wrapper">

                            <button
                              className="assignment-more"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu ===
                                    assignment.id
                                    ? null
                                    : assignment.id
                                )
                              }
                            >
                              <MoreVertical
                                size={19}
                              />
                            </button>

                            {openMenu ===
                              assignment.id && (

                              <div className="assignment-dropdown">

                                <button
                                  onClick={() =>
                                    handleView(
                                      assignment
                                    )
                                  }
                                >
                                  <Eye
                                    size={15}
                                  />

                                  View Details
                                </button>

                                <button
                                  onClick={() =>
                                    handleEdit(
                                      assignment
                                    )
                                  }
                                >
                                  <Pencil
                                    size={15}
                                  />

                                  Edit Assignment
                                </button>

                                {assignment.status !==
                                  "Completed" && (

                                  <button
                                    onClick={() => {
                                      const updated =
                                        assignments.map(
                                          (item) =>
                                            item.id ===
                                            assignment.id
                                              ? {
                                                  ...item,
                                                  status:
                                                    "Completed",
                                                }
                                              : item
                                        );

                                      saveAssignments(
                                        updated
                                      );

                                      setOpenMenu(
                                        null
                                      );
                                    }}
                                  >
                                    <CheckCircle
                                      size={15}
                                    />

                                    Mark Completed
                                  </button>

                                )}

                                <button
                                  className="delete-action"
                                  onClick={() =>
                                    handleDelete(
                                      assignment.id
                                    )
                                  }
                                >
                                  <Trash2
                                    size={15}
                                  />

                                  Delete
                                </button>

                              </div>

                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="empty-assignments"
                  >
                    No assignments found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div className="assignments-footer">

          Showing{" "}
          {filteredAssignments.length}{" "}
          of{" "}
          {assignments.length} assignments

        </div>

      </div>

      {/* =====================================
          ADD / EDIT MODAL
      ====================================== */}

      {showModal && (

        <div
          className="assignment-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="assignment-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="assignment-modal-header">

              <div>

                <h2>
                  {selectedAssignment
                    ? "Edit Assignment"
                    : "Add Assignment"}
                </h2>

                <p>
                  {selectedAssignment
                    ? "Update assignment information."
                    : "Create a new student assignment."}
                </p>

              </div>

              <button
                className="assignment-modal-close"
                onClick={closeModal}
              >
                <X size={20} />
              </button>

            </div>

            <form
              className="assignment-form"
              onSubmit={
                selectedAssignment
                  ? handleUpdate
                  : handleSubmit
              }
            >

              {/* TITLE */}

              <div className="form-group">

                <label>
                  Assignment Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Mathematics Chapter 3"
                  required
                />

              </div>

              {/* SUBJECT + CLASS */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Subject *
                  </label>

                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Subject
                    </option>

                    {SUBJECTS.map(
                      (subject) => (
                        <option
                          key={subject}
                          value={subject}
                        >
                          {subject}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Class *
                  </label>

                  <select
                    name="className"
                    value={form.className}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Class
                    </option>

                    {CLASSES.map(
                      (className) => (
                        <option
                          key={className}
                          value={className}
                        >
                          {className}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

              {/* DATE + TIME */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Due Date *
                  </label>

                  <div className="input-with-icon">

                    <Calendar
                      size={17}
                    />

                    <input
                      type="date"
                      name="dueDate"
                      value={form.dueDate}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

                <div className="form-group">

                  <label>
                    Due Time *
                  </label>

                  <div className="input-with-icon">

                    <Clock
                      size={17}
                    />

                    <input
                      type="time"
                      name="dueTime"
                      value={form.dueTime}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

              </div>

              {/* STATUS */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >

                  <option>
                    Active
                  </option>

                  <option>
                    Completed
                  </option>

                </select>

              </div>

              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter assignment instructions..."
                  rows="4"
                />

              </div>

              {/* ACTIONS */}

              <div className="assignment-form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-assignment-btn"
                >
                  {selectedAssignment
                    ? "Update Assignment"
                    : "Save Assignment"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =====================================
          DETAILS MODAL
      ====================================== */}

      {showDetails &&
        selectedAssignment && (

          <div
            className="assignment-modal-overlay"
            onClick={closeModal}
          >

            <div
              className="assignment-modal details-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="assignment-modal-header">

                <div>

                  <h2>
                    Assignment Details
                  </h2>

                  <p>
                    Complete assignment information.
                  </p>

                </div>

                <button
                  className="assignment-modal-close"
                  onClick={closeModal}
                >
                  <X size={20} />
                </button>

              </div>

              {/* TITLE */}

              <div className="assignment-details-title">

                <div className="assignment-details-icon">
                  <BookOpen size={22} />
                </div>

                <div>

                  <h3>
                    {
                      selectedAssignment.title
                    }
                  </h3>

                  <span>
                    {
                      selectedAssignment.subject
                    }
                  </span>

                </div>

              </div>

              {/* DETAILS GRID */}

              <div className="assignment-details-grid">

                <div>

                  <span>
                    Subject
                  </span>

                  <strong>
                    {
                      selectedAssignment.subject
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Class
                  </span>

                  <strong>
                    {
                      selectedAssignment.className
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Due Date
                  </span>

                  <strong>
                    {formatDate(
                      selectedAssignment.dueDate
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Due Time
                  </span>

                  <strong>
                    {formatTime(
                      selectedAssignment.dueTime
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Status
                  </span>

                  <strong>
                    {isOverdue(
                      selectedAssignment
                    )
                      ? "Overdue"
                      : selectedAssignment.status}
                  </strong>

                </div>

              </div>

              {/* DESCRIPTION */}

              {selectedAssignment.description && (

                <div className="assignment-description-box">

                  <span>
                    Instructions
                  </span>

                  <p>
                    {
                      selectedAssignment.description
                    }
                  </p>

                </div>

              )}

              <button
                className="save-assignment-btn full-btn"
                onClick={closeModal}
              >
                Done
              </button>

            </div>

          </div>

        )}

    </div>
  );
};

export default Assignments;
