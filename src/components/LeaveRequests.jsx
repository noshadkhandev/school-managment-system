import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "schoolLeaveRequests";

const LeaveRequests = () => {
  // Load saved leave requests from localStorage
  const [requests, setRequests] = useState(() => {
    try {
      const savedRequests =
        localStorage.getItem(STORAGE_KEY);

      return savedRequests
        ? JSON.parse(savedRequests)
        : [];
    } catch (error) {
      console.error(
        "Failed to load leave requests:",
        error
      );

      return [];
    }
  });

  // Search & Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [typeFilter, setTypeFilter] =
    useState("All");

  // View Modal/
  const [selectedRequest, setSelectedRequest] =
    useState(null);

  // Add Leave Modal///
  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  // New Leave Request//
  const [newRequest, setNewRequest] = useState({
    name: "",
    type: "Student",
    reason: "",
    date: new Date()
      .toISOString()
      .split("T")[0],
    details: "",
  });

  // Save requests whenever they change///
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(requests)
      );
    } catch (error) {
      console.error(
        "Failed to save leave requests:",
        error
      );
    }
  }, [requests]);

  // Update Status
  const updateStatus = (id, status) => {
    setRequests((prevRequests) =>
      prevRequests.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
      )
    );

    // Update currently opened request//
    if (selectedRequest?.id === id) {
      setSelectedRequest((prev) => ({
        ...prev,
        status,
      }));
    }
  };

  // Delete Request/
  const deleteRequest = (id) => {
    const request = requests.find(
      (item) => item.id === id
    );

    if (!request) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete the leave request of ${request.name}?`
    );

    if (!confirmed) return;

    setRequests((prevRequests) =>
      prevRequests.filter(
        (item) => item.id !== id
      )
    );

    if (selectedRequest?.id === id) {
      setSelectedRequest(null);
    }
  };

  // Add Leave Request
  const handleAddLeaveRequest = (e) => {
    e.preventDefault();

    const name = newRequest.name.trim();
    const reason = newRequest.reason.trim();
    const details = newRequest.details.trim();

    if (
      !name ||
      !reason ||
      !newRequest.date ||
      !details
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const request = {
      id: Date.now(),
      name,
      type: newRequest.type,
      reason,
      date: newRequest.date,
      status: "Pending",
      details,
    };

    // Add new request
    setRequests((prevRequests) => [
      request,
      ...prevRequests,
    ]);

    // Reset Form
    setNewRequest({
      name: "",
      type: "Student",
      reason: "",
      date: new Date()
        .toISOString()
        .split("T")[0],
      details: "",
    });

    // Close Modal
    setIsAddModalOpen(false);
  };

  // Filter Requests
  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(searchText) ||
        item.reason
          .toLowerCase()
          .includes(searchText) ||
        item.details
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        item.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    requests,
    search,
    statusFilter,
    typeFilter,
  ]);

  // Statistics
  const pendingCount = requests.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedCount = requests.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = requests.filter(
    (item) => item.status === "Rejected"
  ).length;

  // Format Date
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      date + "T00:00:00"
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Close Add Modal
  const closeAddModal = () => {
    setIsAddModalOpen(false);

    setNewRequest({
      name: "",
      type: "Student",
      reason: "",
      date: new Date()
        .toISOString()
        .split("T")[0],
      details: "",
    });
  };

  // Close View Modal
  const closeViewModal = () => {
    setSelectedRequest(null);
  };

  return (
    <div className="leave-page">

      {/* === HEADER = */ }
      <div className="leave-header">

        <div>
          <h1>Leave Requests</h1>

          <p>
            Manage student and teacher leave requests.
          </p>
        </div>

        <button
          className="add-leave-btn"
          onClick={() =>
            setIsAddModalOpen(true)
          }
        >
          + Add Leave Request
        </button>

      </div>

      {/* //  =======// STATS ===//// */}
      <div className="leave-stats">

        <div className="leave-stat-card">
          <span>Total Requests</span>
          <strong>
            {requests.length}
          </strong>
        </div>

        <div className="leave-stat-card pending">
          <span>Pending</span>
          <strong>
            {pendingCount}
          </strong>
        </div>

        <div className="leave-stat-card approved">
          <span>Approved</span>
          <strong>
            {approvedCount}
          </strong>
        </div>

        <div className="leave-stat-card rejected">
          <span>Rejected</span>
          <strong>
            {rejectedCount}
          </strong>
        </div>

      </div>

      {/* /* ====///== TOOLBAR ===////= */}

      <div className="leave-toolbar">

        <div className="leave-search">

          <input
            type="text"
            placeholder="Search by name or reason..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >

          <option value="All">
            All Status
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Approved">
            Approved
          </option>

          <option value="Rejected">
            Rejected
          </option>

        </select>

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
        >

          <option value="All">
            All Types
          </option>

          <option value="Student">
            Student
          </option>

          <option value="Teacher">
            Teacher
          </option>

        </select>

      </div>

      {/* /* ====TABLE ===* */}

      <div className="leave-table-card">

        <table className="leave-table">

          <thead>

            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredRequests.length > 0 ? (

              filteredRequests.map((item) => (

                <tr key={item.id}>

                  <td>
                    <strong>
                      {item.name}
                    </strong>
                  </td>

                  <td>

                    <span
                      className={`leave-type ${item.type.toLowerCase()}`}
                    >
                      {item.type}
                    </span>

                  </td>

                  <td>
                    {item.reason}
                  </td>

                  <td>
                    {formatDate(item.date)}
                  </td>

                  <td>

                    <span
                      className={`leave-status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>

                  </td>

                  <td>

                    <div className="leave-actions">

                      {/* /* View * */}
                      <button
                        className="view-leave-btn"
                        onClick={() =>
                          setSelectedRequest(item)
                        }
                      >
                        View
                      </button>

                      {/* /* Approve * */}
                      <button
                        className="approve-btn"
                        onClick={() =>
                          updateStatus(
                            item.id,
                            "Approved"
                          )
                        }
                        disabled={
                          item.status ===
                          "Approved"
                        }
                      >
                        Approve
                      </button>

                      {/* /* Reject * */}
                      <button
                        className="reject-btn"
                        onClick={() =>
                          updateStatus(
                            item.id,
                            "Rejected"
                          )
                        }
                        disabled={
                          item.status ===
                          "Rejected"
                        }
                      >
                        Reject
                      </button>

                      {/* /* Delete * */}
                      <button
                        className="delete-leave-btn"
                        onClick={() =>
                          deleteRequest(item.id)
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
                  colSpan="6"
                  className="no-leave"
                >
                  No leave requests found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {isAddModalOpen && (

        <div
          className="leave-modal-overlay"
          onClick={closeAddModal}
        >

          <div
            className="leave-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* /* Modal Header */}
            <div className="leave-modal-header">

              <div>

                <h2>
                  Add Leave Request
                </h2>

                <p>
                  Create a new student or teacher leave request.
                </p>

              </div>

              <button
                type="button"
                className="leave-close-btn"
                onClick={closeAddModal}
              >
                ×
              </button>

            </div>

            {/* /* Form * */}
            <form
              onSubmit={handleAddLeaveRequest}
            >

              {/* /* Name  */}
              <div className="leave-form-group">

                <label>
                  Name *
                </label>

                <input
                  type="text"
                  placeholder="Enter student or teacher name"
                  value={newRequest.name}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      name: e.target.value,
                    })
                  }
                  required
                />

              </div>

              {/* /* Type // Date * */}
              <div className="leave-form-grid">

                <div className="leave-form-group">

                  <label>
                    Type *
                  </label>

                  <select
                    value={newRequest.type}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        type: e.target.value,
                      })
                    }
                  >

                    <option value="Student">
                      Student
                    </option>

                    <option value="Teacher">
                      Teacher
                    </option>

                  </select>

                </div>

                <div className="leave-form-group">

                  <label>
                    Leave Date *
                  </label>

                  <input
                    type="date"
                    value={newRequest.date}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        date: e.target.value,
                      })
                    }
                    required
                  />

                </div>

              </div>

              {/* /* Reason * */}
              <div className="leave-form-group">

                <label>
                  Reason *
                </label>

                <input
                  type="text"
                  placeholder="e.g. Medical Leave"
                  value={newRequest.reason}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      reason: e.target.value,
                    })
                  }
                  required
                />

              </div>

              {/* /* Details * */}
              <div className="leave-form-group">

                <label>
                  Details *
                </label>

                <textarea
                  rows="4"
                  placeholder="Write leave request details..."
                  value={newRequest.details}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      details: e.target.value,
                    })
                  }
                  required
                />

              </div>

              {/* /* Actions  */}
              <div className="leave-modal-actions">

                <button
                  type="button"
                  className="leave-cancel-btn"
                  onClick={closeAddModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="approve-btn"
                >
                  Submit Leave Request
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {selectedRequest && (

        <div
          className="leave-modal-overlay"
          onClick={closeViewModal}
        >

          <div
            className="leave-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="leave-modal-header">

              <div>

                <h2>
                  Leave Request Details
                </h2>

                <p>
                  Complete information about this request.
                </p>

              </div>

              <button
                className="leave-close-btn"
                onClick={closeViewModal}
              >
                ×
              </button>

            </div>

            {/* Details */}
            <div className="leave-details">

              <div className="leave-detail-item">

                <span>
                  Name
                </span>

                <strong>
                  {selectedRequest.name}
                </strong>

              </div>

              <div className="leave-detail-item">

                <span>
                  Type
                </span>

                <strong>
                  {selectedRequest.type}
                </strong>

              </div>

              <div className="leave-detail-item">

                <span>
                  Reason
                </span>

                <strong>
                  {selectedRequest.reason}
                </strong>

              </div>

              <div className="leave-detail-item">

                <span>
                  Date
                </span>

                <strong>
                  {formatDate(
                    selectedRequest.date
                  )}
                </strong>

              </div>

              <div className="leave-detail-item">

                <span>
                  Status
                </span>

                <span
                  className={`leave-status ${selectedRequest.status.toLowerCase()}`}
                >
                  {selectedRequest.status}
                </span>

              </div>

              <div className="leave-detail-item full">

                <span>
                  Details
                </span>

                <p>
                  {selectedRequest.details ||
                    "No additional details provided."}
                </p>

              </div>

            </div>

            {/* Modal Actions */}
            <div className="leave-modal-actions">

              <button
                className="approve-btn"
                onClick={() =>
                  updateStatus(
                    selectedRequest.id,
                    "Approved"
                  )
                }
                disabled={
                  selectedRequest.status ===
                  "Approved"
                }
              >
                Approve
              </button>

              <button
                className="reject-btn"
                onClick={() =>
                  updateStatus(
                    selectedRequest.id,
                    "Rejected"
                  )
                }
                disabled={
                  selectedRequest.status ===
                  "Rejected"
                }
              >
                Reject
              </button>

              <button
                className="leave-cancel-btn"
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

export default LeaveRequests;