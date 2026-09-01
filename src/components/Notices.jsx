import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "schoolNotices";

const Notices = () => {
  const [notices, setNotices] = useState(() => {
    try {
      const savedNotices = localStorage.getItem(STORAGE_KEY);

      return savedNotices ? JSON.parse(savedNotices) : [];
    } catch (error) {
      console.error("Failed to load notices:", error);
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);

  const [search, setSearch] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    title: "",
    audience: "All Students",
    date: getToday(),
    status: "Published",
    description: "",
  });

  const audiences = [
    "All Students",
    "Students",
    "Teachers",
    "Parents",
  ];

  // Save notices whenever notices change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(notices)
    );
  }, [notices]);

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        notice.title.toLowerCase().includes(searchText) ||
        notice.description.toLowerCase().includes(searchText) ||
        notice.audience.toLowerCase().includes(searchText);

      const matchesAudience =
        audienceFilter === "All" ||
        notice.audience === audienceFilter;

      const matchesStatus =
        statusFilter === "All" ||
        notice.status === statusFilter;

      return (
        matchesSearch &&
        matchesAudience &&
        matchesStatus
      );
    });
  }, [
    notices,
    search,
    audienceFilter,
    statusFilter,
  ]);

  const publishedCount = notices.filter(
    (notice) => notice.status === "Published"
  ).length;

  const draftCount = notices.filter(
    (notice) => notice.status === "Draft"
  ).length;

  const studentNotices = notices.filter(
    (notice) =>
      notice.audience === "Students" ||
      notice.audience === "All Students"
  ).length;

  const openCreateModal = () => {
    setEditingNotice(null);

    setFormData({
      title: "",
      audience: "All Students",
      date: getToday(),
      status: "Published",
      description: "",
    });

    setIsModalOpen(true);
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);

    setFormData({
      title: notice.title,
      audience: notice.audience,
      date: notice.date,
      status: notice.status,
      description: notice.description,
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

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title) {
      alert("Please enter notice title.");
      return;
    }

    if (!description) {
      alert("Please enter notice description.");
      return;
    }

    if (!formData.date) {
      alert("Please select notice date.");
      return;
    }

    // EDIT NOTICE
    if (editingNotice) {
      setNotices((prevNotices) =>
        prevNotices.map((notice) =>
          notice.id === editingNotice.id
            ? {
                ...notice,
                title,
                audience: formData.audience,
                date: formData.date,
                status: formData.status,
                description,
              }
            : notice
        )
      );
    }

    // CREATE NOTICE
    else {
      const newNotice = {
        id: Date.now(),
        title,
        audience: formData.audience,
        date: formData.date,
        status: formData.status,
        description,
      };

      setNotices((prevNotices) => [
        newNotice,
        ...prevNotices,
      ]);
    }

    closeModal();
  };

  const deleteNotice = (id) => {
    const notice = notices.find(
      (item) => item.id === id
    );

    if (!notice) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${notice.title}"?`
    );

    if (!confirmed) return;

    setNotices((prevNotices) =>
      prevNotices.filter(
        (notice) => notice.id !== id
      )
    );

    if (selectedNotice?.id === id) {
      setSelectedNotice(null);
    }
  };

  const toggleStatus = (id) => {
    setNotices((prevNotices) =>
      prevNotices.map((notice) =>
        notice.id === id
          ? {
              ...notice,
              status:
                notice.status === "Published"
                  ? "Draft"
                  : "Published",
            }
          : notice
      )
    );

    if (selectedNotice?.id === id) {
      setSelectedNotice((prev) => ({
        ...prev,
        status:
          prev.status === "Published"
            ? "Draft"
            : "Published",
      }));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNotice(null);

    setFormData({
      title: "",
      audience: "All Students",
      date: getToday(),
      status: "Published",
      description: "",
    });
  };

  const closeViewModal = () => {
    setSelectedNotice(null);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date + "T00:00:00").toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  return (
    <div className="notices-page">

      {/* Header */}
      <div className="notices-header">
        <div>
          <h1>School Notices & Announcements</h1>

          <p>
            Publish and manage important school announcements.
          </p>
        </div>

        <button
          className="create-notice-btn"
          onClick={openCreateModal}
        >
          + Create Notice
        </button>
      </div>

      {/* Stats */}
      <div className="notice-stats">

        <div className="notice-stat-card">
          <span>Total Notices</span>
          <strong>{notices.length}</strong>
        </div>

        <div className="notice-stat-card published">
          <span>Published</span>
          <strong>{publishedCount}</strong>
        </div>

        <div className="notice-stat-card draft">
          <span>Drafts</span>
          <strong>{draftCount}</strong>
        </div>

        <div className="notice-stat-card students">
          <span>Student Notices</span>
          <strong>{studentNotices}</strong>
        </div>

      </div>

      {/* Toolbar */}
      <div className="notices-toolbar">

        <div className="notice-search">
          <input
            type="text"
            placeholder="Search school notices..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={audienceFilter}
          onChange={(e) =>
            setAudienceFilter(e.target.value)
          }
        >
          <option value="All">
            All Audiences
          </option>

          {audiences.map((audience) => (
            <option
              key={audience}
              value={audience}
            >
              {audience}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Published">
            Published
          </option>

          <option value="Draft">
            Draft
          </option>
        </select>

      </div>

      {/* Notices Table */}
      <div className="notices-table-card">

        <table className="notices-table">

          <thead>
            <tr>
              <th>Notice</th>
              <th>Audience</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (

                <tr key={notice.id}>

                  <td>
                    <div className="notice-title-cell">

                      <strong>
                        {notice.title}
                      </strong>

                      <small>
                        {notice.description}
                      </small>

                    </div>
                  </td>

                  <td>
                    <span className="audience-badge">
                      {notice.audience}
                    </span>
                  </td>

                  <td>
                    {formatDate(notice.date)}
                  </td>

                  <td>

                    <span
                      className={`notice-status ${notice.status.toLowerCase()}`}
                    >
                      {notice.status}
                    </span>

                  </td>

                  <td>

                    <div className="notice-actions">

                      <button
                        className="view-notice-btn"
                        onClick={() =>
                          setSelectedNotice(notice)
                        }
                      >
                        View
                      </button>

                      <button
                        className="edit-notice-btn"
                        onClick={() =>
                          openEditModal(notice)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="status-notice-btn"
                        onClick={() =>
                          toggleStatus(notice.id)
                        }
                      >
                        {notice.status === "Published"
                          ? "Draft"
                          : "Publish"}
                      </button>

                      <button
                        className="delete-notice-btn"
                        onClick={() =>
                          deleteNotice(notice.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))
            ) : (

              <tr>

                <td
                  colSpan="5"
                  className="no-notices"
                >
                  No school notices found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (

        <div
          className="notice-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="notice-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="notice-modal-header">

              <div>

                <h2>
                  {editingNotice
                    ? "Edit School Notice"
                    : "Create School Notice"}
                </h2>

                <p>
                  {editingNotice
                    ? "Update school announcement information."
                    : "Create a new school announcement."}
                </p>

              </div>

              <button
                type="button"
                className="notice-close-btn"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="notice-form-group">

                <label>
                  Notice Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter school notice title"
                  required
                />

              </div>

              <div className="notice-form-grid">

                <div className="notice-form-group">

                  <label>
                    Audience *
                  </label>

                  <select
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                  >

                    {audiences.map(
                      (audience) => (
                        <option
                          key={audience}
                          value={audience}
                        >
                          {audience}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div className="notice-form-group">

                  <label>
                    Date *
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="notice-form-group">

                <label>
                  Status *
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="Published">
                    Published
                  </option>

                  <option value="Draft">
                    Draft
                  </option>

                </select>

              </div>

              <div className="notice-form-group">

                <label>
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write school notice details..."
                  rows="5"
                  required
                />

              </div>

              <div className="notice-modal-actions">

                <button
                  type="button"
                  className="notice-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="notice-save-btn"
                >
                  {editingNotice
                    ? "Update Notice"
                    : "Create Notice"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* View Modal */}
      {selectedNotice && (

        <div
          className="notice-modal-overlay"
          onClick={closeViewModal}
        >

          <div
            className="notice-view-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="notice-modal-header">

              <div>

                <h2>
                  {selectedNotice.title}
                </h2>

                <p>
                  {formatDate(
                    selectedNotice.date
                  )}
                </p>

              </div>

              <button
                className="notice-close-btn"
                onClick={closeViewModal}
              >
                ×
              </button>

            </div>

            <div className="notice-view-info">

              <div>

                <span>
                  Audience
                </span>

                <strong>
                  {selectedNotice.audience}
                </strong>

              </div>

              <div>

                <span>
                  Status
                </span>

                <span
                  className={`notice-status ${selectedNotice.status.toLowerCase()}`}
                >
                  {selectedNotice.status}
                </span>

              </div>

            </div>

            <div className="notice-description">

              <h3>
                School Announcement
              </h3>

              <p>
                {selectedNotice.description}
              </p>

            </div>

            <div className="notice-view-actions">

              <button
                className="edit-notice-btn"
                onClick={() => {
                  const noticeToEdit =
                    selectedNotice;

                  setSelectedNotice(null);
                  openEditModal(noticeToEdit);
                }}
              >
                Edit Notice
              </button>

              <button
                className="notice-cancel-btn"
                onClick={closeViewModal}
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

export default Notices;