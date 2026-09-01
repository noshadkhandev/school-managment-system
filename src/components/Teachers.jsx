import { useEffect, useMemo, useState } from "react";

import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  X,
  Eye,
  Edit3,
  Trash2,
  Save,
  BookOpen,
} from "lucide-react";

const initialTeachers = [];

const emptyForm = {
  name: "",
  email: "",
  subject: "",
  phone: "",
  status: "Active",
};

const Teachers = () => {


  const [teachers, setTeachers] = useState(() => {
    try {

      const savedTeachers =
        localStorage.getItem("teachers");

      return savedTeachers
        ? JSON.parse(savedTeachers)
        : initialTeachers;

    } catch (error) {

      console.error(
        "Error loading teachers:",
        error
      );

      return initialTeachers;
    }
  });

  useEffect(() => {

    localStorage.setItem(
      "teachers",
      JSON.stringify(teachers)
    );

    window.dispatchEvent(
      new Event("teachersUpdated")
    );

  }, [teachers]);

  const [search, setSearch] = useState("");

  const [openMenu, setOpenMenu] =
    useState(null);

  const [selectedTeacher, setSelectedTeacher] =
    useState(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [teacherToDelete, setTeacherToDelete] =
    useState(null);

  const [editingTeacher, setEditingTeacher] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm);


  const filteredTeachers = useMemo(() => {

    const searchText =
      search.toLowerCase().trim();

    if (!searchText) {
      return teachers;
    }

    return teachers.filter((teacher) => {

      return (
        String(teacher.name || "")
          .toLowerCase()
          .includes(searchText) ||

        String(teacher.email || "")
          .toLowerCase()
          .includes(searchText) ||

        String(teacher.subject || "")
          .toLowerCase()
          .includes(searchText) ||

        String(teacher.phone || "")
          .toLowerCase()
          .includes(searchText)
      );

    });

  }, [teachers, search]);


  const totalTeachers = teachers.length;

  const activeTeachers = teachers.filter(
    (teacher) =>
      teacher.status === "Active"
  ).length;

  const pendingTeachers = teachers.filter(
    (teacher) =>
      teacher.status === "Pending"
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


  const handleAddTeacher = (e) => {

    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.phone.trim()
    ) {

      alert("Please fill all fields.");
      return;
    }

    const newTeacher = {

      id: Date.now(),

      name: form.name.trim(),

      email: form.email.trim(),

      subject: form.subject.trim(),

      phone: form.phone.trim(),

      status: form.status,

    };

    setTeachers((prev) => [
      ...prev,
      newTeacher,
    ]);

    resetForm();
    setShowAddModal(false);

  };


  const handleViewTeacher = (teacher) => {

    setSelectedTeacher(teacher);
    setOpenMenu(null);

  };

  const handleEditTeacher = (teacher) => {

    setEditingTeacher(teacher);

    setForm({
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      phone: teacher.phone,
      status: teacher.status,
    });

    setOpenMenu(null);
    setShowEditModal(true);

  };

  const handleUpdateTeacher = (e) => {

    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.phone.trim()
    ) {

      alert("Please fill all fields.");
      return;
    }

    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === editingTeacher.id
          ? {
              ...teacher,

              name: form.name.trim(),

              email: form.email.trim(),

              subject: form.subject.trim(),

              phone: form.phone.trim(),

              status: form.status,
            }
          : teacher
      )
    );

    setShowEditModal(false);
    setEditingTeacher(null);
    resetForm();

  };

  const handleDeleteOpen = (teacher) => {

    setTeacherToDelete(teacher);

    setOpenMenu(null);

    setShowDeleteModal(true);

  };

  const handleDeleteTeacher = () => {

    if (!teacherToDelete) return;

    setTeachers((prev) =>
      prev.filter(
        (teacher) =>
          teacher.id !==
          teacherToDelete.id
      )
    );

    setShowDeleteModal(false);

    setTeacherToDelete(null);

  };

  return (

    <div className="teachers-page">


      <div className="teachers-header">

        <div>

          <span className="page-label">
            ADMINISTRATION
          </span>

          <h1>Teachers</h1>

          <p>
            Manage teachers and their academic
            information.
          </p>

        </div>

        <button
          className="add-teacher-btn"
          onClick={() => {

            resetForm();

            setShowAddModal(true);

          }}
        >

          <UserPlus size={18} />

          Add Teacher

        </button>

      </div>


      <div className="teacher-stats">

        <div className="teacher-stat">

          <div className="teacher-stat-icon blue">
            <Users size={22} />
          </div>

          <div>

            <span>Total Teachers</span>

            <h2>
              {totalTeachers}
            </h2>

            <small>
              All registered teachers
            </small>

          </div>

        </div>

        <div className="teacher-stat">

          <div className="teacher-stat-icon green">
            <Users size={22} />
          </div>

          <div>

            <span>Active</span>

            <h2>
              {activeTeachers}
            </h2>

            <small>
              Currently active
            </small>

          </div>

        </div>

        <div className="teacher-stat">

          <div className="teacher-stat-icon orange">
            <Users size={22} />
          </div>

          <div>

            <span>Pending</span>

            <h2>
              {pendingTeachers}
            </h2>

            <small>
              Awaiting approval
            </small>

          </div>

        </div>

      </div>

      <div className="teachers-card">

        <div className="teachers-card-header">

          <div>

            <h2>
              All Teachers
            </h2>

            <p>
              View and manage registered teachers.
            </p>

          </div>

          <div className="teacher-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search teachers..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (

              <button
                className="clear-search"
                onClick={() =>
                  setSearch("")
                }
              >
                <X size={14} />
              </button>

            )}

          </div>

        </div>

        <div className="table-wrapper">

          <table className="teachers-table">

            <thead>

              <tr>
                <th>Teacher</th>
                <th>Subject</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredTeachers.length > 0 ? (

                filteredTeachers.map(
                  (teacher) => (

                    <tr key={teacher.id}>

                      <td>

                        <div className="teacher-info">

                          <div className="teacher-avatar">
                            {teacher.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {teacher.name}
                            </strong>

                            <span>
                              {teacher.email}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>

                        <div className="teacher-subject">

                          <BookOpen size={15} />

                          {teacher.subject}

                        </div>

                      </td>

                      <td>

                        <div className="contact-info">

                          <span>
                            <Mail size={14} />
                            {teacher.email}
                          </span>

                          <span>
                            <Phone size={14} />
                            {teacher.phone}
                          </span>

                        </div>

                      </td>

                      <td>

                        <span
                          className={`teacher-status ${String(
                            teacher.status
                          ).toLowerCase()}`}
                        >

                          <span className="teacher-status-dot" />

                          {teacher.status}

                        </span>

                      </td>

                      <td>

                        <div className="teacher-action-wrapper">

                          <button
                            className="teacher-more"
                            onClick={() =>
                              setOpenMenu(
                                openMenu ===
                                  teacher.id
                                  ? null
                                  : teacher.id
                              )
                            }
                          >
                            <MoreVertical
                              size={19}
                            />
                          </button>

                          {openMenu ===
                            teacher.id && (

                            <div className="teacher-action-menu">

                              <button
                                onClick={() =>
                                  handleViewTeacher(
                                    teacher
                                  )
                                }
                              >
                                <Eye size={15} />
                                View
                              </button>

                              <button
                                onClick={() =>
                                  handleEditTeacher(
                                    teacher
                                  )
                                }
                              >
                                <Edit3 size={15} />
                                Edit
                              </button>

                              <button
                                className="teacher-delete-action"
                                onClick={() =>
                                  handleDeleteOpen(
                                    teacher
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

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="teacher-empty-state"
                  >

                    <Search size={30} />

                    <strong>
                      No teachers found
                    </strong>

                    <span>
                      {search
                        ? "Try a different search term."
                        : "Add your first teacher."}
                    </span>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="teachers-table-footer">

          Showing{" "}

          <strong>
            {filteredTeachers.length}
          </strong>{" "}

          teacher
          {filteredTeachers.length !== 1
            ? "s"
            : ""}

        </div>

      </div>

      {showAddModal && (

        <div
          className="teacher-modal-overlay"
          onClick={() =>
            setShowAddModal(false)
          }
        >

          <div
            className="teacher-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="teacher-modal-close"
              onClick={() =>
                setShowAddModal(false)
              }
            >
              <X size={19} />
            </button>

            <div className="teacher-modal-heading">

              <div className="teacher-modal-icon blue">
                <UserPlus size={20} />
              </div>

              <div>

                <h2>
                  Add Teacher
                </h2>

                <p>
                  Create a new teacher account.
                </p>

              </div>

            </div>

            <form onSubmit={handleAddTeacher}>

              <div className="teacher-form-group">

                <label>
                  Teacher Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Enter teacher name"
                />

              </div>

              <div className="teacher-form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="teacher@example.com"
                />

              </div>

              <div className="teacher-form-row">

                <div className="teacher-form-group">

                  <label>
                    Subject
                  </label>

                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleFormChange}
                    placeholder="e.g. Computer Science"
                  />

                </div>

                <div className="teacher-form-group">

                  <label>
                    Phone
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    placeholder="+92 300 1234567"
                  />

                </div>

              </div>

              <div className="teacher-form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                >
                  <option>
                    Active
                  </option>

                  <option>
                    Pending
                  </option>
                </select>

              </div>

              <div className="teacher-modal-buttons">

                <button
                  type="button"
                  className="teacher-cancel-btn"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="teacher-save-btn"
                >
                  <Save size={16} />
                  Add Teacher
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {showEditModal && (

        <div
          className="teacher-modal-overlay"
          onClick={() =>
            setShowEditModal(false)
          }
        >

          <div
            className="teacher-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="teacher-modal-close"
              onClick={() =>
                setShowEditModal(false)
              }
            >
              <X size={19} />
            </button>

            <div className="teacher-modal-heading">

              <div className="teacher-modal-icon purple">
                <Edit3 size={20} />
              </div>

              <div>

                <h2>
                  Edit Teacher
                </h2>

                <p>
                  Update teacher information.
                </p>

              </div>

            </div>

            <form
              onSubmit={handleUpdateTeacher}
            >

              <div className="teacher-form-group">

                <label>
                  Teacher Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                />

              </div>

              <div className="teacher-form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                />

              </div>

              <div className="teacher-form-row">

                <div className="teacher-form-group">

                  <label>
                    Subject
                  </label>

                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleFormChange}
                  />

                </div>

                <div className="teacher-form-group">

                  <label>
                    Phone
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                  />

                </div>

              </div>

              <div className="teacher-form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                >

                  <option>
                    Active
                  </option>

                  <option>
                    Pending
                  </option>

                </select>

              </div>

              <div className="teacher-modal-buttons">

                <button
                  type="button"
                  className="teacher-cancel-btn"
                  onClick={() =>
                    setShowEditModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="teacher-save-btn"
                >
                  <Save size={16} />
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {selectedTeacher && (

        <div
          className="teacher-modal-overlay"
          onClick={() =>
            setSelectedTeacher(null)
          }
        >

          <div
            className="teacher-modal teacher-view-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="teacher-modal-close"
              onClick={() =>
                setSelectedTeacher(null)
              }
            >
              <X size={19} />
            </button>

            <div className="teacher-profile">

              <div className="large-teacher-avatar">
                {selectedTeacher.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <h2>
                {selectedTeacher.name}
              </h2>

              <span
                className={`teacher-status ${String(
                  selectedTeacher.status
                ).toLowerCase()}`}
              >
                <span className="teacher-status-dot" />

                {selectedTeacher.status}

              </span>

            </div>

            <div className="teacher-details">

              <div className="teacher-detail-item">

                <span>Email</span>

                <strong>
                  <Mail size={15} />
                  {selectedTeacher.email}
                </strong>

              </div>

              <div className="teacher-detail-item">

                <span>Phone</span>

                <strong>
                  <Phone size={15} />
                  {selectedTeacher.phone}
                </strong>

              </div>

              <div className="teacher-detail-item">

                <span>Subject</span>

                <strong>
                  <BookOpen size={15} />
                  {selectedTeacher.subject}
                </strong>

              </div>

              <div className="teacher-detail-item">

                <span>Teacher ID</span>

                <strong>
                  TCH-{selectedTeacher.id}
                </strong>

              </div>

            </div>

          </div>

        </div>

      )}

  

      {showDeleteModal &&
        teacherToDelete && (

          <div
            className="teacher-modal-overlay"
            onClick={() =>
              setShowDeleteModal(false)
            }
          >

            <div
              className="teacher-modal teacher-delete-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="teacher-delete-icon">
                <Trash2 size={24} />
              </div>

              <h2>
                Delete Teacher?
              </h2>

              <p>
                Are you sure you want to delete{" "}
                <strong>
                  {teacherToDelete.name}
                </strong>
                ? This action cannot be undone.
              </p>

              <div className="teacher-modal-buttons">

                <button
                  className="teacher-cancel-btn"
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="teacher-delete-btn"
                  onClick={handleDeleteTeacher}
                >
                  <Trash2 size={16} />
                  Delete Teacher
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
};

export default Teachers;