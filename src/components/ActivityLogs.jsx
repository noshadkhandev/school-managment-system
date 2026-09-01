import { useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Trash2,
  Filter,
  X,
  Plus,
  Pencil,
} from "lucide-react";

const STORAGE_KEY = "activity_logs";

const ActivityLogs = () => {
  // IMPORTANT:
  // localStorage se data load hoga.
  // Pehli dafa bilkul empty rahega.
  const [logs, setLogs] = useState(() => {
    try {
      const savedLogs = localStorage.getItem(STORAGE_KEY);

      if (!savedLogs) {
        return [];
      }

      const parsedLogs = JSON.parse(savedLogs);

      return Array.isArray(parsedLogs) ? parsedLogs : [];
    } catch (error) {
      console.error("Failed to load activity logs:", error);
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState("All");

  const [selectedLog, setSelectedLog] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  const [formData, setFormData] = useState({
    user: "",
    action: "",
    date: "",
  });

  // Save logs to localStorage whenever logs change
  const saveLogs = (newLogs) => {
    setLogs(newLogs);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(newLogs)
      );
    } catch (error) {
      console.error("Failed to save activity logs:", error);
    }
  };

  // Users for filter
  const users = useMemo(() => {
    return [
      "All",
      ...new Set(logs.map((log) => log.user)),
    ];
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return logs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchText) ||
        log.action.toLowerCase().includes(searchText) ||
        log.date.toLowerCase().includes(searchText);

      const matchesUser =
        selectedUser === "All" ||
        log.user === selectedUser;

      return matchesSearch && matchesUser;
    });
  }, [logs, search, selectedUser]);

  // Get current date/time
  const getCurrentDateTime = () => {
    const now = new Date();

    return now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Open new activity modal
  const handleNewActivity = () => {
    setEditingLog(null);

    setFormData({
      user: "",
      action: "",
      date: getCurrentDateTime(),
    });

    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (log) => {
    setEditingLog(log);

    setFormData({
      user: log.user,
      action: log.action,
      date: log.date,
    });

    setShowModal(true);
  };

  // Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add / Update activity
  const handleSubmit = (e) => {
    e.preventDefault();

    const user = formData.user.trim();
    const action = formData.action.trim();
    const date = formData.date.trim();

    if (!user || !action || !date) {
      alert("Please fill all fields.");
      return;
    }

    // EDIT
    if (editingLog) {
      const updatedLogs = logs.map((log) =>
        log.id === editingLog.id
          ? {
              ...log,
              user,
              action,
              date,
            }
          : log
      );

      saveLogs(updatedLogs);
    }

    // ADD
    else {
      const newLog = {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,
        user,
        action,
        date,
      };

      saveLogs([newLog, ...logs]);
    }

    setShowModal(false);
    setEditingLog(null);

    setFormData({
      user: "",
      action: "",
      date: "",
    });
  };

  // Delete activity
  const handleDelete = (id) => {
    const log = logs.find((item) => item.id === id);

    if (!log) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${log.action}"?`
    );

    if (!confirmed) return;

    const updatedLogs = logs.filter(
      (item) => item.id !== id
    );

    saveLogs(updatedLogs);

    // Close view modal if deleted item was open
    if (selectedLog?.id === id) {
      setSelectedLog(null);
    }
  };

  // Clear filters only
  const handleClearFilters = () => {
    setSearch("");
    setSelectedUser("All");
  };

  // Refresh button
  // IMPORTANT:
  // Refresh does NOT reset/delete logs.
  // It only reloads saved localStorage data and clears filters.
  const handleRefresh = () => {
    setSearch("");
    setSelectedUser("All");

    try {
      const savedLogs = localStorage.getItem(STORAGE_KEY);

      if (savedLogs) {
        const parsedLogs = JSON.parse(savedLogs);

        if (Array.isArray(parsedLogs)) {
          setLogs(parsedLogs);
        }
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error("Failed to refresh logs:", error);
    }
  };

  // Close form modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLog(null);

    setFormData({
      user: "",
      action: "",
      date: "",
    });
  };

  return (
    <div className="activity-logs-page">

      {/* HEADER */}
      <div className="activity-logs-header">
        <div>
          <h1>Activity Logs</h1>

          <p>
            Track important activities performed in
            the admin portal.
          </p>
        </div>

        <div className="activity-header-actions">

          <button
            className="activity-refresh-btn"
            onClick={handleRefresh}
            type="button"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>

          <button
            className="activity-new-btn"
            onClick={handleNewActivity}
            type="button"
          >
            <Plus size={18} />
            <span>New Activity</span>
          </button>

        </div>
      </div>

      {/* TOOLBAR */}
      <div className="activity-logs-toolbar">

        {/* SEARCH */}
        <div className="activity-search-box">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              className="activity-search-clear"
              onClick={() => setSearch("")}
              type="button"
              title="Clear Search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* FILTER */}
        <div className="activity-filter-box">
          <Filter size={18} />

          <select
            value={selectedUser}
            onChange={(e) =>
              setSelectedUser(e.target.value)
            }
          >
            {users.map((user) => (
              <option key={user} value={user}>
                {user === "All"
                  ? "All Users"
                  : user}
              </option>
            ))}
          </select>
        </div>

        {/* CLEAR FILTER */}
        {(search || selectedUser !== "All") && (
          <button
            className="activity-clear-btn"
            onClick={handleClearFilters}
            type="button"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="activity-logs-table-wrapper">

        <table className="activity-logs-table">

          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Date & Time</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredLogs.length > 0 ? (

              filteredLogs.map((log) => (

                <tr key={log.id}>

                  <td>
                    <span className="activity-user-name">
                      {log.user}
                    </span>
                  </td>

                  <td>
                    <span className="activity-action-text">
                      {log.action}
                    </span>
                  </td>

                  <td>
                    <span className="activity-date-text">
                      {log.date}
                    </span>
                  </td>

                  <td>
                    <div className="activity-actions">

                      {/* VIEW */}
                      <button
                        className="activity-view-btn"
                        onClick={() =>
                          setSelectedLog(log)
                        }
                        title="View Details"
                        type="button"
                      >
                        <Eye size={18} />
                      </button>

                      {/* EDIT */}
                      <button
                        className="activity-edit-btn"
                        onClick={() =>
                          handleEdit(log)
                        }
                        title="Edit Activity"
                        type="button"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* DELETE */}
                      <button
                        className="activity-delete-btn"
                        onClick={() =>
                          handleDelete(log.id)
                        }
                        title="Delete Activity"
                        type="button"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td
                  colSpan="4"
                  className="activity-logs-empty"
                >
                  <div className="activity-empty-content">
                    <div className="activity-empty-icon">
                      <Filter size={24} />
                    </div>

                    <strong>
                      No activity logs found
                    </strong>

                    <span>
                      Add a new activity to see it here.
                    </span>
                  </div>
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* COUNT */}
      <div className="activity-logs-count">
        Showing{" "}
        <strong>{filteredLogs.length}</strong>{" "}
        of{" "}
        <strong>{logs.length}</strong>{" "}
        activities
      </div>

      {/* VIEW MODAL */}
      {selectedLog && (

        <div
          className="activity-modal-overlay"
          onClick={() => setSelectedLog(null)}
        >

          <div
            className="activity-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="activity-modal-close"
              onClick={() =>
                setSelectedLog(null)
              }
              type="button"
              title="Close"
            >
              <X size={20} />
            </button>

            <div className="activity-modal-icon">
              <Eye size={22} />
            </div>

            <h2>Activity Details</h2>

            <p className="activity-modal-subtitle">
              Complete information about this activity.
            </p>

            <div className="activity-detail">
              <span>User</span>
              <strong>{selectedLog.user}</strong>
            </div>

            <div className="activity-detail">
              <span>Action</span>
              <strong>{selectedLog.action}</strong>
            </div>

            <div className="activity-detail">
              <span>Date & Time</span>
              <strong>{selectedLog.date}</strong>
            </div>

            <div className="activity-view-modal-actions">

              <button
                className="activity-modal-edit-btn"
                onClick={() => {
                  setSelectedLog(null);
                  handleEdit(selectedLog);
                }}
                type="button"
              >
                <Pencil size={17} />
                Edit
              </button>

              <button
                className="activity-modal-delete-btn"
                onClick={() =>
                  handleDelete(selectedLog.id)
                }
                type="button"
              >
                <Trash2 size={17} />
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (

        <div
          className="activity-modal-overlay"
          onClick={handleCloseModal}
        >

          <div
            className="activity-form-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="activity-modal-close"
              onClick={handleCloseModal}
              type="button"
            >
              <X size={20} />
            </button>

            <div className="activity-modal-icon">
              {editingLog ? (
                <Pencil size={22} />
              ) : (
                <Plus size={22} />
              )}
            </div>

            <h2>
              {editingLog
                ? "Edit Activity"
                : "New Activity"}
            </h2>

            <p className="activity-modal-subtitle">
              {editingLog
                ? "Update activity information."
                : "Enter the activity details below."}
            </p>

            <form onSubmit={handleSubmit}>

              <div className="activity-form-group">
                <label>User</label>

                <input
                  type="text"
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  placeholder="Enter user name"
                  autoFocus
                />
              </div>

              <div className="activity-form-group">
                <label>Action</label>

                <input
                  type="text"
                  name="action"
                  value={formData.action}
                  onChange={handleInputChange}
                  placeholder="e.g. Added new student"
                />
              </div>

              <div className="activity-form-group">
                <label>Date & Time</label>

                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="Enter date and time"
                />
              </div>

              <div className="activity-form-buttons">

                <button
                  type="button"
                  className="activity-form-cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="activity-form-save-btn"
                >
                  {editingLog
                    ? "Update Activity"
                    : "Add Activity"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default ActivityLogs;