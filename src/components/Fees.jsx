import { useMemo, useState } from "react";
import {
  Wallet,
  Plus,
  Search,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const FEES_STORAGE_KEY = "schoolFees";

const SCHOOL_FEE_TYPES = [
  "Monthly Tuition Fee",
  "Admission Fee",
  "Annual Fee",
  "Examination Fee",
  "Transport Fee",
  "Books & Stationery",
  "Uniform Fee",
  "Computer / Lab Fee",
  "Activity Fee",
  "Other Fee",
];

const getStoredFees = () => {
  try {
    const storedFees = localStorage.getItem(FEES_STORAGE_KEY);

    if (!storedFees) {
      return [];
    }

    const parsedFees = JSON.parse(storedFees);

    return Array.isArray(parsedFees) ? parsedFees : [];
  } catch (error) {
    console.error("Error loading fee records:", error);
    return [];
  }
};

const Fees = () => {
  const [fees, setFees] = useState(getStoredFees);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All Status");

  const [openMenu, setOpenMenu] = useState(null);

  const [selectedFee, setSelectedFee] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  const [form, setForm] = useState({
    student: "",
    rollNo: "",
    feeType: "Monthly Tuition Fee",
    amount: "",
    status: "Pending",
  });

  // -----------------------------------------
  // SAVE FEES TO LOCAL STORAGE
  // -----------------------------------------

  const saveFees = (updatedFees) => {
    setFees(updatedFees);

    localStorage.setItem(
      FEES_STORAGE_KEY,
      JSON.stringify(updatedFees)
    );
  };

  // -----------------------------------------
  // GET TODAY'S DATE
  // -----------------------------------------

  const getTodayDate = () => {
    return new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // -----------------------------------------
  // SEARCH + FILTER
  // -----------------------------------------

  const filteredFees = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return fees.filter((fee) => {
      const matchesSearch =
        fee.student.toLowerCase().includes(searchText) ||
        fee.rollNo.toLowerCase().includes(searchText) ||
        fee.feeType.toLowerCase().includes(searchText);

      const matchesFilter =
        filter === "All Status" ||
        fee.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [fees, search, filter]);

  // -----------------------------------------
  // PAGINATION
  // -----------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredFees.length / ITEMS_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const paginatedFees = filteredFees.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  // -----------------------------------------
  // FORM CHANGE
  // -----------------------------------------

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------------------
  // RESET FORM
  // -----------------------------------------

  const resetForm = () => {
    setForm({
      student: "",
      rollNo: "",
      feeType: "Monthly Tuition Fee",
      amount: "",
      status: "Pending",
    });
  };

  // -----------------------------------------
  // OPEN ADD PAYMENT
  // -----------------------------------------

  const handleOpenAdd = () => {
    resetForm();

    setSelectedFee(null);

    setShowDetails(false);

    setShowAddModal(true);

    setOpenMenu(null);
  };

  // -----------------------------------------
  // ADD PAYMENT
  // -----------------------------------------

  const handleAddPayment = (e) => {
    e.preventDefault();

    const student = form.student.trim();

    const rollNo = form.rollNo.trim();

    const amount = Number(form.amount);

    if (!student || !rollNo || !amount || amount <= 0) {
      alert(
        "Please enter student name, roll number and a valid amount."
      );

      return;
    }

    const newFee = {
      id: Date.now(),

      student,

      rollNo,

      feeType: form.feeType,

      amount: `Rs. ${amount.toLocaleString()}`,

      date:
        form.status === "Paid"
          ? getTodayDate()
          : "-",

      status: form.status,
    };

    const updatedFees = [
      newFee,
      ...fees,
    ];

    saveFees(updatedFees);

    setCurrentPage(1);

    setShowAddModal(false);

    resetForm();
  };

  // -----------------------------------------
  // MARK AS PAID
  // -----------------------------------------

  const handleMarkPaid = (fee) => {
    const updatedFees = fees.map((item) => {
      if (item.id !== fee.id) {
        return item;
      }

      return {
        ...item,
        status: "Paid",
        date: getTodayDate(),
      };
    });

    saveFees(updatedFees);

    setOpenMenu(null);
  };

  // -----------------------------------------
  // DELETE PAYMENT
  // -----------------------------------------

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmed) {
      return;
    }

    const updatedFees = fees.filter(
      (fee) => fee.id !== id
    );

    saveFees(updatedFees);

    setOpenMenu(null);

    if (selectedFee?.id === id) {
      setSelectedFee(null);

      setShowDetails(false);
    }

    const newTotalPages = Math.max(
      1,
      Math.ceil(
        updatedFees.filter((fee) => {
          const searchText =
            search.trim().toLowerCase();

          const matchesSearch =
            fee.student
              .toLowerCase()
              .includes(searchText) ||
            fee.rollNo
              .toLowerCase()
              .includes(searchText) ||
            fee.feeType
              .toLowerCase()
              .includes(searchText);

          const matchesFilter =
            filter === "All Status" ||
            fee.status === filter;

          return matchesSearch && matchesFilter;
        }).length / ITEMS_PER_PAGE
      )
    );

    setCurrentPage((page) =>
      Math.min(page, newTotalPages)
    );
  };

  // -----------------------------------------
  // VIEW DETAILS
  // -----------------------------------------

  const handleView = (fee) => {
    setSelectedFee(fee);

    setShowDetails(true);

    setOpenMenu(null);
  };

  // -----------------------------------------
  // EDIT PAYMENT
  // -----------------------------------------

  const handleEdit = (fee) => {
    setSelectedFee(fee);

    setForm({
      student: fee.student,

      rollNo: fee.rollNo,

      feeType: fee.feeType,

      amount: fee.amount.replace(
        /[^\d]/g,
        ""
      ),

      status: fee.status,
    });

    setShowAddModal(false);

    setShowDetails(false);

    setOpenMenu(null);
  };

  // -----------------------------------------
  // UPDATE PAYMENT
  // -----------------------------------------

  const handleUpdate = (e) => {
    e.preventDefault();

    const student = form.student.trim();

    const rollNo = form.rollNo.trim();

    const amount = Number(form.amount);

    if (!student || !rollNo || !amount || amount <= 0) {
      alert(
        "Please enter student name, roll number and a valid amount."
      );

      return;
    }

    const updatedFees = fees.map((fee) => {
      if (fee.id !== selectedFee.id) {
        return fee;
      }

      return {
        ...fee,

        student,

        rollNo,

        feeType: form.feeType,

        amount: `Rs. ${amount.toLocaleString()}`,

        status: form.status,

        date:
          form.status === "Paid"
            ? fee.date !== "-"
              ? fee.date
              : getTodayDate()
            : "-",
      };
    });

    saveFees(updatedFees);

    setSelectedFee(null);

    setShowAddModal(false);

    resetForm();
  };

  // -----------------------------------------
  // CLOSE MODAL
  // -----------------------------------------

  const closeModal = () => {
    setShowAddModal(false);

    setShowDetails(false);

    setSelectedFee(null);

    setOpenMenu(null);

    resetForm();
  };

  // -----------------------------------------
  // SEARCH CHANGE
  // -----------------------------------------

  const handleSearchChange = (e) => {
    setSearch(e.target.value);

    setCurrentPage(1);
  };

  // -----------------------------------------
  // FILTER CHANGE
  // -----------------------------------------

  const handleFilterChange = (e) => {
    setFilter(e.target.value);

    setCurrentPage(1);
  };

  // -----------------------------------------
  // STATISTICS
  // -----------------------------------------

  const paidCount = fees.filter(
    (fee) => fee.status === "Paid"
  ).length;

  const pendingCount = fees.filter(
    (fee) => fee.status === "Pending"
  ).length;

  const overdueCount = fees.filter(
    (fee) => fee.status === "Overdue"
  ).length;

  return (
    <div className="fees-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="fees-header">

        <div>

          <span className="page-label">
            SCHOOL FINANCE MANAGEMENT
          </span>

          <h1>
            Fees
          </h1>

          <p>
            Manage student fees and payment records.
          </p>

        </div>

        <button
          className="add-fee-btn"
          onClick={handleOpenAdd}
        >
          <Plus size={18} />

          Add Payment
        </button>

      </div>

      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="fee-stats">

        {/* TOTAL */}

        <div className="fee-stat-card">

          <div className="fee-stat-icon blue">
            <Wallet size={22} />
          </div>

          <div>

            <span>
              Total Payments
            </span>

            <h2>
              {fees.length}
            </h2>

            <small>
              All payment records
            </small>

          </div>

        </div>

        {/* PAID */}

        <div className="fee-stat-card">

          <div className="fee-stat-icon green">
            <CheckCircle size={22} />
          </div>

          <div>

            <span>
              Paid
            </span>

            <h2>
              {paidCount}
            </h2>

            <small>
              Completed payments
            </small>

          </div>

        </div>

        {/* PENDING */}

        <div className="fee-stat-card">

          <div className="fee-stat-icon orange">
            <Clock size={22} />
          </div>

          <div>

            <span>
              Pending
            </span>

            <h2>
              {pendingCount}
            </h2>

            <small>
              Awaiting payment
            </small>

          </div>

        </div>

        {/* OVERDUE */}

        <div className="fee-stat-card">

          <div className="fee-stat-icon red">
            <AlertCircle size={22} />
          </div>

          <div>

            <span>
              Overdue
            </span>

            <h2>
              {overdueCount}
            </h2>

            <small>
              Payment overdue
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          PAYMENT RECORDS
      ====================================== */}

      <div className="fees-card">

        <div className="fees-card-header">

          <div>

            <h2>
              Payment Records
            </h2>

            <p>
              View and manage student fee payments.
            </p>

          </div>

          <div className="fee-actions">

            {/* SEARCH */}

            <div className="fee-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={handleSearchChange}
              />

            </div>

            {/* FILTER */}

            <select
              className="fee-filter"
              value={filter}
              onChange={handleFilterChange}
            >

              <option>
                All Status
              </option>

              <option>
                Paid
              </option>

              <option>
                Pending
              </option>

              <option>
                Overdue
              </option>

            </select>

          </div>

        </div>

        {/* =====================================
            TABLE
        ====================================== */}

        <div className="table-wrapper">

          <table className="fees-table">

            <thead>

              <tr>

                <th>
                  Student
                </th>

                <th>
                  Fee Type
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Payment Date
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

              {paginatedFees.length > 0 ? (

                paginatedFees.map((fee) => (

                  <tr key={fee.id}>

                    {/* STUDENT */}

                    <td>

                      <div className="fee-student">

                        <div className="fee-avatar">

                          {fee.student
                            .charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <strong>
                            {fee.student}
                          </strong>

                          <span>
                            {fee.rollNo}
                          </span>

                        </div>

                      </div>

                    </td>

                    {/* FEE TYPE */}

                    <td>
                      {fee.feeType}
                    </td>

                    {/* AMOUNT */}

                    <td>

                      <strong className="fee-amount">
                        {fee.amount}
                      </strong>

                    </td>

                    {/* DATE */}

                    <td>
                      {fee.date}
                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={`fee-status ${fee.status.toLowerCase()}`}
                      >

                        <span></span>

                        {fee.status}

                      </span>

                    </td>

                    {/* ACTION */}

                    <td>

                      <div className="fee-action-wrapper">

                        <button
                          className="fee-more"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === fee.id
                                ? null
                                : fee.id
                            )
                          }
                        >
                          <MoreVertical size={19} />
                        </button>

                        {openMenu === fee.id && (

                          <div className="fee-dropdown">

                            {/* VIEW */}

                            <button
                              onClick={() =>
                                handleView(fee)
                              }
                            >
                              <Eye size={15} />

                              View Details
                            </button>

                            {/* EDIT */}

                            <button
                              onClick={() =>
                                handleEdit(fee)
                              }
                            >
                              <Pencil size={15} />

                              Edit Payment
                            </button>

                            {/* MARK PAID */}

                            {fee.status !== "Paid" && (

                              <button
                                onClick={() =>
                                  handleMarkPaid(fee)
                                }
                              >
                                <CheckCircle size={15} />

                                Mark as Paid
                              </button>

                            )}

                            {/* DELETE */}

                            <button
                              className="delete-action"
                              onClick={() =>
                                handleDelete(fee.id)
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
                    colSpan="6"
                    className="empty-fees"
                  >
                    No payment records found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* =====================================
            FOOTER + PAGINATION
        ====================================== */}

        <div className="fees-footer">

          <span>

            Showing{" "}

            {filteredFees.length === 0
              ? 0
              : startIndex + 1}

            {" "}to{" "}

            {Math.min(
              startIndex + ITEMS_PER_PAGE,
              filteredFees.length
            )}

            {" "}of{" "}

            {filteredFees.length}

            {" "}payments

          </span>

          <div className="fee-pagination">

            <button
              disabled={safeCurrentPage === 1}
              onClick={() =>
                handlePageChange(
                  safeCurrentPage - 1
                )
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
                  safeCurrentPage === page
                    ? "active-page"
                    : ""
                }
                onClick={() =>
                  handlePageChange(page)
                }
              >
                {page}
              </button>

            ))}

            <button
              disabled={
                safeCurrentPage === totalPages
              }
              onClick={() =>
                handlePageChange(
                  safeCurrentPage + 1
                )
              }
            >
              Next
            </button>

          </div>

        </div>

      </div>

      {/* =====================================
          ADD / EDIT MODAL
      ====================================== */}

      {(showAddModal || selectedFee) &&
        !showDetails && (

          <div
            className="fee-modal-overlay"
            onClick={closeModal}
          >

            <div
              className="fee-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div className="fee-modal-header">

                <div>

                  <h2>
                    {selectedFee
                      ? "Edit Payment"
                      : "Add Payment"}
                  </h2>

                  <p>
                    {selectedFee
                      ? "Update student payment information."
                      : "Add a new school fee payment record."}
                  </p>

                </div>

                <button
                  className="fee-modal-close"
                  onClick={closeModal}
                >
                  <X size={20} />
                </button>

              </div>

              {/* FORM */}

              <form
                className="fee-form"
                onSubmit={
                  selectedFee
                    ? handleUpdate
                    : handleAddPayment
                }
              >

                {/* STUDENT + ROLL NUMBER */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Student Name
                    </label>

                    <input
                      name="student"
                      value={form.student}
                      onChange={handleFormChange}
                      placeholder="Enter student name"
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Roll Number
                    </label>

                    <input
                      name="rollNo"
                      value={form.rollNo}
                      onChange={handleFormChange}
                      placeholder="ST-1005"
                      required
                    />

                  </div>

                </div>

                {/* FEE TYPE + AMOUNT */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Fee Type
                    </label>

                    <select
                      name="feeType"
                      value={form.feeType}
                      onChange={handleFormChange}
                    >

                      {SCHOOL_FEE_TYPES.map(
                        (feeType) => (

                          <option
                            key={feeType}
                            value={feeType}
                          >
                            {feeType}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Amount (Rs.)
                    </label>

                    <input
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={handleFormChange}
                      placeholder="15000"
                      min="1"
                      step="1"
                      required
                    />

                  </div>

                </div>

                {/* STATUS */}

                <div className="form-group">

                  <label>
                    Payment Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >

                    <option>
                      Paid
                    </option>

                    <option>
                      Pending
                    </option>

                    <option>
                      Overdue
                    </option>

                  </select>

                </div>

                {/* ACTIONS */}

                <div className="fee-form-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-fee-btn"
                  >
                    {selectedFee
                      ? "Update Payment"
                      : "Save Payment"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      {/* =====================================
          PAYMENT DETAILS MODAL
      ====================================== */}

      {showDetails && selectedFee && (

        <div
          className="fee-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="fee-modal details-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="fee-modal-header">

              <div>

                <h2>
                  Payment Details
                </h2>

                <p>
                  Complete student payment information.
                </p>

              </div>

              <button
                className="fee-modal-close"
                onClick={closeModal}
              >
                <X size={20} />
              </button>

            </div>

            {/* STUDENT */}

            <div className="payment-detail-profile">

              <div className="fee-avatar large">

                {selectedFee.student
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div>

                <h3>
                  {selectedFee.student}
                </h3>

                <span>
                  {selectedFee.rollNo}
                </span>

              </div>

            </div>

            {/* DETAILS */}

            <div className="payment-details-grid">

              <div>

                <span>
                  Fee Type
                </span>

                <strong>
                  {selectedFee.feeType}
                </strong>

              </div>

              <div>

                <span>
                  Amount
                </span>

                <strong>
                  {selectedFee.amount}
                </strong>

              </div>

              <div>

                <span>
                  Payment Date
                </span>

                <strong>
                  {selectedFee.date}
                </strong>

              </div>

              <div>

                <span>
                  Status
                </span>

                <strong>
                  {selectedFee.status}
                </strong>

              </div>

            </div>

            {/* DONE */}

            <button
              className="save-fee-btn full-btn"
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

export default Fees;