import { useEffect, useMemo, useState } from "react";
import {
  Users,
  CalendarCheck,
  Wallet,
  GraduationCap,
  UserRound,
  Eye,
  Download,
  X,
  Plus,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

const STORAGE_KEY = "school_reports";

const reportConfig = [
  {
    id: "students",
    title: "Student Report",
    description: "Complete student information and statistics.",
    icon: Users,
    headers: ["Student Name", "Roll No", "Class", "Status"],
    fields: [
      { name: "name", label: "Student Name", type: "text", placeholder: "Enter student name" },
      { name: "rollNo", label: "Roll No", type: "text", placeholder: "Enter roll number" },
      { name: "className", label: "Class", type: "text", placeholder: "Enter class" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
    ],
  },
  {
    id: "attendance",
    title: "Attendance Report",
    description: "Daily, weekly and monthly attendance.",
    icon: CalendarCheck,
    headers: ["Student Name", "Attendance", "Status"],
    fields: [
      { name: "name", label: "Student Name", type: "text", placeholder: "Enter student name" },
      { name: "attendance", label: "Attendance", type: "text", placeholder: "e.g. 90%" },
      { name: "status", label: "Status", type: "select", options: ["Present", "Absent", "Late"] },
    ],
  },
  {
    id: "fees",
    title: "Fees Report",
    description: "Paid, unpaid and pending fees.",
    icon: Wallet,
    headers: ["Student Name", "Amount", "Fee Status"],
    fields: [
      { name: "name", label: "Student Name", type: "text", placeholder: "Enter student name" },
      { name: "amount", label: "Amount", type: "text", placeholder: "Enter amount" },
      { name: "feeStatus", label: "Fee Status", type: "select", options: ["Paid", "Pending", "Unpaid"] },
    ],
  },
  {
    id: "results",
    title: "Results Report",
    description: "Student marks and examination results.",
    icon: GraduationCap,
    headers: ["Student Name", "Subject", "Marks", "Grade"],
    fields: [
      { name: "name", label: "Student Name", type: "text", placeholder: "Enter student name" },
      { name: "subject", label: "Subject", type: "text", placeholder: "Enter subject" },
      { name: "marks", label: "Marks", type: "text", placeholder: "Enter marks" },
      { name: "grade", label: "Grade", type: "text", placeholder: "Enter grade" },
    ],
  },
  {
    id: "teachers",
    title: "Teacher Report",
    description: "Teacher information and performance.",
    icon: UserRound,
    headers: ["Teacher Name", "Subject", "Department"],
    fields: [
      { name: "name", label: "Teacher Name", type: "text", placeholder: "Enter teacher name" },
      { name: "subject", label: "Subject", type: "text", placeholder: "Enter subject" },
      { name: "department", label: "Department", type: "text", placeholder: "Enter department" },
    ],
  },
];

const emptyData = {
  students: [],
  attendance: [],
  fees: [],
  results: [],
  teachers: [],
};

const Reports = () => {
  const [reportData, setReportData] = useState(emptyData);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed && typeof parsed === "object") {
          setReportData({
            students: Array.isArray(parsed.students) ? parsed.students : [],
            attendance: Array.isArray(parsed.attendance) ? parsed.attendance : [],
            fees: Array.isArray(parsed.fees) ? parsed.fees : [],
            results: Array.isArray(parsed.results) ? parsed.results : [],
            teachers: Array.isArray(parsed.teachers) ? parsed.teachers : [],
          });
        }
      }
    } catch (error) {
      console.error("Error loading reports:", error);
      setReportData(emptyData);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reportData));
    } catch (error) {
      console.error("Error saving reports:", error);
    }
  }, [reportData]);

  const getInitialFormData = (report) => {
    const data = {};

    report.fields.forEach((field) => {
      data[field.name] =
        field.type === "select"
          ? field.options[0]
          : "";
    });

    return data;
  };

  const getReport = (id) => {
    return reportConfig.find((report) => report.id === id);
  };

  const openAddForm = (report) => {
    setSelectedReport(report);
    setEditingRecord(null);
    setFormData(getInitialFormData(report));
    setIsFormOpen(true);
  };

  const openEditForm = (report, record) => {
    setSelectedReport(report);
    setEditingRecord(record);
    setFormData({ ...record });
    setIsFormOpen(true);
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

    const report = selectedReport;

    if (!report) return;

    const hasEmptyField = report.fields.some(
      (field) => !String(formData[field.name] || "").trim()
    );

    if (hasEmptyField) {
      alert("Please fill all fields.");
      return;
    }

    if (editingRecord) {
      setReportData((prev) => ({
        ...prev,
        [report.id]: prev[report.id].map((record) =>
          record.id === editingRecord.id
            ? {
                ...record,
                ...formData,
              }
            : record
        ),
      }));

      alert("Record updated successfully.");
    } else {
      const newRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        ...formData,
        createdAt: new Date().toISOString(),
      };

      setReportData((prev) => ({
        ...prev,
        [report.id]: [...prev[report.id], newRecord],
      }));

      alert("Record added successfully.");
    }

    closeForm();
  };

  const deleteRecord = (reportId, id) => {
    const report = getReport(reportId);

    if (!report) return;

    const record = reportData[reportId].find(
      (item) => item.id === id
    );

    if (!record) return;

    const firstField = report.fields[0]?.name;
    const recordName = record[firstField] || "this record";

    const confirmed = window.confirm(
      `Are you sure you want to delete "${recordName}"?`
    );

    if (!confirmed) return;

    setReportData((prev) => ({
      ...prev,
      [reportId]: prev[reportId].filter(
        (item) => item.id !== id
      ),
    }));

    if (selectedReport?.id === reportId) {
      setSelectedReport((prev) => ({
        ...prev,
      }));
    }

    alert("Record deleted successfully.");
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
    setFormData({});
  };

  const closeReport = () => {
    setSelectedReport(null);
    setIsFormOpen(false);
    setEditingRecord(null);
    setFormData({});
    setSearch("");
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsFormOpen(false);
    setSearch("");
  };

  const handleExport = (report) => {
    const records = reportData[report.id] || [];

    if (records.length === 0) {
      alert("There are no records to export.");
      return;
    }

    const escapeCsv = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    const csvRows = [
      report.headers.map(escapeCsv).join(","),
      ...records.map((record) =>
        report.fields
          .map((field) => escapeCsv(record[field.name]))
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${report.title.replace(/\s+/g, "_")}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const filteredRecords = useMemo(() => {
    if (!selectedReport) return [];

    const records = reportData[selectedReport.id] || [];
    const searchText = search.toLowerCase().trim();

    if (!searchText) return records;

    return records.filter((record) =>
      selectedReport.fields.some((field) =>
        String(record[field.name] || "")
          .toLowerCase()
          .includes(searchText)
      )
    );
  }, [selectedReport, reportData, search]);

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports</h1>
          <p className="reports-subtitle">
            Generate and manage portal reports.
          </p>
        </div>
      </div>

      <div className="reports-grid">
        {reportConfig.map((report) => {
          const Icon = report.icon;
          const count = reportData[report.id]?.length || 0;

          return (
            <div className="report-card" key={report.id}>
              <div className="report-icon">
                <Icon size={22} />
              </div>

              <h3>{report.title}</h3>

              <p>{report.description}</p>

              <div className="report-record-count">
                {count} {count === 1 ? "Record" : "Records"}
              </div>

              <div className="report-actions">
                <button
                  className="view-report-btn"
                  onClick={() => handleViewReport(report)}
                >
                  <Eye size={17} />
                  View Report
                </button>

                <button
                  className="add-report-btn"
                  onClick={() => openAddForm(report)}
                >
                  <Plus size={17} />
                  Add
                </button>

                <button
                  className="export-report-btn"
                  onClick={() => handleExport(report)}
                >
                  <Download size={17} />
                  Export
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedReport && !isFormOpen && (
        <div
          className="report-modal-overlay"
          onClick={closeReport}
        >
          <div
            className="report-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="report-modal-header">
              <div>
                <h2>{selectedReport.title}</h2>
                <p>{selectedReport.description}</p>
              </div>

              <button
                className="close-report-btn"
                onClick={closeReport}
                type="button"
              >
                <X size={22} />
              </button>
            </div>

            <div className="report-summary">
              <div className="summary-item">
                <span>Total Records</span>
                <strong>
                  {reportData[selectedReport.id]?.length || 0}
                </strong>
              </div>

              <div className="summary-item">
                <span>Report Type</span>
                <strong>{selectedReport.title}</strong>
              </div>
            </div>

            <div className="report-toolbar">
              <div className="report-search">
                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search records..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                className="add-report-btn"
                onClick={() => openAddForm(selectedReport)}
              >
                <Plus size={17} />
                Add Record
              </button>
            </div>

            <div className="report-table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    {selectedReport.headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <tr key={record.id}>
                        {selectedReport.fields.map((field) => (
                          <td key={field.name}>
                            {record[field.name]}
                          </td>
                        ))}

                        <td>
                          <div className="report-record-actions">
                            <button
                              className="report-edit-btn"
                              onClick={() =>
                                openEditForm(
                                  selectedReport,
                                  record
                                )
                              }
                            >
                              <Pencil size={15} />
                              Edit
                            </button>

                            <button
                              className="report-delete-btn"
                              onClick={() =>
                                deleteRecord(
                                  selectedReport.id,
                                  record.id
                                )
                              }
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={
                          selectedReport.headers.length + 1
                        }
                        className="no-report-records"
                      >
                        {reportData[selectedReport.id]?.length === 0
                          ? "No records added yet. Click Add Record to add data."
                          : "No records found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="modal-actions">
              <button
                className="view-report-btn"
                onClick={() => handleExport(selectedReport)}
              >
                <Download size={17} />
                Export Report
              </button>

              <button
                className="export-report-btn"
                onClick={closeReport}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && selectedReport && (
        <div
          className="report-modal-overlay"
          onClick={closeForm}
        >
          <div
            className="report-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="report-modal-header">
              <div>
                <h2>
                  {editingRecord
                    ? `Edit ${selectedReport.title}`
                    : `Add ${selectedReport.title}`}
                </h2>

                <p>
                  {editingRecord
                    ? "Update report information."
                    : "Enter report information."}
                </p>
              </div>

              <button
                className="close-report-btn"
                onClick={closeForm}
                type="button"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="report-form-grid">
                {selectedReport.fields.map((field) => (
                  <div
                    className="report-form-group"
                    key={field.name}
                  >
                    <label>{field.label}</label>

                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        required
                      >
                        {field.options.map((option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="export-report-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="view-report-btn"
                >
                  {editingRecord
                    ? "Update Record"
                    : "Add Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;