import { useEffect, useMemo, useState } from "react";
import {
  GraduationCap,
  Search,
  MoreVertical,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Eye,
  Edit3,
  Trash2,
  X,
  Save,
} from "lucide-react";

const STORAGE_KEY = "student-results";

const initialResults = [
  {
    id: 1,
    student: "Hammad Qadeer",
    rollNo: "ST-1001",
    course: "Computer Science",
    semester: "6th",
    marks: 88,
    grade: "A",
    status: "Published",
  },
  {
    id: 2,
    student: "Shams-u-din",
    rollNo: "ST-1002",
    course: "Software Engineering",
    semester: "4th",
    marks: 92,
    grade: "A+",
    status: "Published",
  },
  {
    id: 3,
    student: "Hammad Qadeer",
    rollNo: "ST-1003",
    course: "Information Technology",
    semester: "3rd",
    marks: 76,
    grade: "B+",
    status: "Pending",
  },
  {
    id: 4,
    student: "Abdul Qadeer",
    rollNo: "ST-1004",
    course: "Computer Science",
    semester: "5th",
    marks: 81,
    grade: "A-",
    status: "Published",
  },
];

const getGrade = (marks) => {
  const value = Number(marks);

  if (value >= 90) return "A+";
  if (value >= 85) return "A";
  if (value >= 80) return "A-";
  if (value >= 75) return "B+";
  if (value >= 70) return "B";
  if (value >= 65) return "B-";
  if (value >= 60) return "C";
  if (value >= 50) return "D";

  return "F";
};

const Results = () => {
  const [results, setResults] = useState(() => {
    try {
      const savedResults = localStorage.getItem(STORAGE_KEY);

      if (savedResults) {
        return JSON.parse(savedResults);
      }

      return initialResults;
    } catch {
      return initialResults;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openMenu, setOpenMenu] = useState(null);

  const [selectedResult, setSelectedResult] = useState(null);
  const [editingResult, setEditingResult] = useState(null);
  const [deletingResult, setDeletingResult] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const [form, setForm] = useState({
    student: "",
    rollNo: "",
    course: "Computer Science",
    semester: "1st",
    marks: "",
    status: "Pending",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  }, [results]);

  const filteredResults = useMemo(() => {
    const value = search.toLowerCase().trim();

    return results.filter((result) => {
      const matchesSearch =
        !value ||
        result.student.toLowerCase().includes(value) ||
        result.rollNo.toLowerCase().includes(value) ||
        result.course.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "All Status" ||
        result.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [results, search, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredResults.length / resultsPerPage)
  );

  const currentResults = useMemo(() => {
    const startIndex =
      (currentPage - 1) * resultsPerPage;

    return filteredResults.slice(
      startIndex,
      startIndex + resultsPerPage
    );
  }, [
    filteredResults,
    currentPage,
    resultsPerPage,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const totalResults = results.length;

  const publishedResults = results.filter(
    (result) => result.status === "Published"
  ).length;

  const pendingResults = results.filter(
    (result) => result.status === "Pending"
  ).length;

  const averageResult = results.length
    ? Math.round(
        results.reduce(
          (total, result) =>
            total + Number(result.marks),
          0
        ) / results.length
      )
    : 0;

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      student: "",
      rollNo: "",
      course: "Computer Science",
      semester: "1st",
      marks: "",
      status: "Pending",
    });
  };

  const publishResults = () => {
    if (pendingResults === 0) return;

    const confirmPublish = window.confirm(
      "Publish all pending results?"
    );

    if (!confirmPublish) return;

    setResults((prev) =>
      prev.map((result) => ({
        ...result,
        status: "Published",
      }))
    );

    setOpenMenu(null);
  };

  const addResult = (e) => {
    e.preventDefault();

    if (
      !form.student.trim() ||
      !form.rollNo.trim() ||
      form.marks === ""
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const marks = Number(form.marks);

    if (marks < 0 || marks > 100) {
      alert("Marks must be between 0 and 100.");
      return;
    }

    const rollNo = form.rollNo
      .trim()
      .toUpperCase();

    const rollExists = results.some(
      (result) =>
        result.rollNo.toLowerCase() ===
        rollNo.toLowerCase()
    );

    if (rollExists) {
      alert(
        "This Roll Number already exists."
      );
      return;
    }

    const newResult = {
      id: Date.now(),
      student: form.student.trim(),
      rollNo,
      course: form.course,
      semester: form.semester,
      marks,
      grade: getGrade(marks),
      status: form.status,
    };

    setResults((prev) => [
      ...prev,
      newResult,
    ]);

    setShowAddModal(false);
    resetForm();
  };

  const openEdit = (result) => {
    setEditingResult(result);

    setForm({
      student: result.student,
      rollNo: result.rollNo,
      course: result.course,
      semester: result.semester,
      marks: result.marks,
      status: result.status,
    });

    setOpenMenu(null);
  };

  const updateResult = (e) => {
    e.preventDefault();

    if (
      !form.student.trim() ||
      !form.rollNo.trim() ||
      form.marks === ""
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const marks = Number(form.marks);

    if (marks < 0 || marks > 100) {
      alert("Marks must be between 0 and 100.");
      return;
    }

    const rollNo = form.rollNo
      .trim()
      .toUpperCase();

    const rollExists = results.some(
      (result) =>
        result.id !== editingResult.id &&
        result.rollNo.toLowerCase() ===
          rollNo.toLowerCase()
    );

    if (rollExists) {
      alert(
        "This Roll Number already exists."
      );
      return;
    }

    setResults((prev) =>
      prev.map((result) =>
        result.id === editingResult.id
          ? {
              ...result,
              student: form.student.trim(),
              rollNo,
              course: form.course,
              semester: form.semester,
              marks,
              grade: getGrade(marks),
              status: form.status,
            }
          : result
      )
    );

    setEditingResult(null);
    resetForm();
  };

  const deleteResult = () => {
    if (!deletingResult) return;

    setResults((prev) =>
      prev.filter(
        (result) =>
          result.id !== deletingResult.id
      )
    );

    setDeletingResult(null);
  };

  const publishSingleResult = (result) => {
    setResults((prev) =>
      prev.map((item) =>
        item.id === result.id
          ? {
              ...item,
              status: "Published",
            }
          : item
      )
    );

    setOpenMenu(null);
  };

  const goToPage = (page) => {
    if (
      page >= 1 &&
      page <= totalPages
    ) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="results-page">
      <div className="results-header">
        <div>
          <span className="page-label">
            ACADEMIC MANAGEMENT
          </span>

          <h1>Results</h1>

          <p>
            Manage student marks, grades and
            academic results.
          </p>
        </div>

        <div className="results-header-actions">
          <button
            className="add-result-btn"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <Plus size={18} />
            Add Result
          </button>

          <button
            className="publish-btn"
            onClick={publishResults}
            disabled={pendingResults === 0}
          >
            <CheckCircle size={18} />
            Publish Results
          </button>
        </div>
      </div>

      <div className="result-stats">
        <div className="result-stat-card">
          <div className="result-stat-icon blue">
            <FileText size={22} />
          </div>

          <div>
            <span>Total Results</span>
            <h2>{totalResults}</h2>
            <small>
              All academic results
            </small>
          </div>
        </div>

        <div className="result-stat-card">
          <div className="result-stat-icon green">
            <CheckCircle size={22} />
          </div>

          <div>
            <span>Published</span>
            <h2>{publishedResults}</h2>
            <small>
              Published results
            </small>
          </div>
        </div>

        <div className="result-stat-card">
          <div className="result-stat-icon orange">
            <Clock size={22} />
          </div>

          <div>
            <span>Pending</span>
            <h2>{pendingResults}</h2>
            <small>
              Awaiting publication
            </small>
          </div>
        </div>

        <div className="result-stat-card">
          <div className="result-stat-icon purple">
            <GraduationCap size={22} />
          </div>

          <div>
            <span>Average Result</span>
            <h2>{averageResult}%</h2>
            <small>
              Overall average
            </small>
          </div>
        </div>
      </div>

      <div className="results-card">
        <div className="results-card-header">
          <div>
            <h2>Student Results</h2>

            <p>
              View and manage academic
              results.
            </p>
          </div>

          <div className="result-actions">
            <div className="result-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  className="clear-result-search"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <select
              className="result-filter"
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

              <option>
                Published
              </option>

              <option>
                Pending
              </option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentResults.length > 0 ? (
                currentResults.map((result) => (
                  <tr key={result.id}>
                    <td>
                      <div className="result-student">
                        <div className="result-avatar">
                          {result.student.charAt(0)}
                        </div>

                        <div>
                          <strong>
                            {result.student}
                          </strong>

                          <span>
                            {result.rollNo}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      {result.course}
                    </td>

                    <td>
                      {result.semester}
                    </td>

                    <td>
                      <strong className="marks">
                        {result.marks}%
                      </strong>
                    </td>

                    <td>
                      <span className="grade">
                        {result.grade}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`result-status ${result.status.toLowerCase()}`}
                      >
                        <span />
                        {result.status}
                      </span>
                    </td>

                    <td>
                      <div className="result-action-wrapper">
                        <button
                          className="result-more"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === result.id
                                ? null
                                : result.id
                            )
                          }
                        >
                          <MoreVertical size={19} />
                        </button>

                        {openMenu ===
                          result.id && (
                          <div className="result-action-menu">
                            <button
                              onClick={() => {
                                setSelectedResult(
                                  result
                                );
                                setOpenMenu(
                                  null
                                );
                              }}
                            >
                              <Eye size={15} />
                              View
                            </button>

                            <button
                              onClick={() =>
                                openEdit(result)
                              }
                            >
                              <Edit3 size={15} />
                              Edit
                            </button>

                            {result.status ===
                              "Pending" && (
                              <button
                                onClick={() =>
                                  publishSingleResult(
                                    result
                                  )
                                }
                              >
                                <CheckCircle
                                  size={15}
                                />
                                Publish
                              </button>
                            )}

                            <button
                              className="delete-result-action"
                              onClick={() => {
                                setDeletingResult(
                                  result
                                );
                                setOpenMenu(
                                  null
                                );
                              }}
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
                    colSpan="7"
                    className="result-empty"
                  >
                    <FileText size={34} />

                    <strong>
                      No results found
                    </strong>

                    <span>
                      Try changing your
                      search or filter.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="results-footer">
          <span>
            Showing{" "}
            {filteredResults.length === 0
              ? 0
              : (currentPage - 1) *
                  resultsPerPage +
                1}
            -
            {Math.min(
              currentPage * resultsPerPage,
              filteredResults.length
            )}{" "}
            of {filteredResults.length} results
          </span>

          {totalPages > 1 && (
            <div className="result-pagination">
              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  goToPage(
                    currentPage - 1
                  )
                }
              >
                Previous
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) => (
                  <button
                    key={index + 1}
                    className={
                      currentPage ===
                      index + 1
                        ? "active-page"
                        : ""
                    }
                    onClick={() =>
                      goToPage(
                        index + 1
                      )
                    }
                  >
                    {index + 1}
                  </button>
                )
              )}

              <button
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  goToPage(
                    currentPage + 1
                  )
                }
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div
          className="result-modal-overlay"
          onClick={() =>
            setShowAddModal(false)
          }
        >
          <div
            className="result-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="result-modal-close"
              onClick={() =>
                setShowAddModal(false)
              }
            >
              <X size={19} />
            </button>

            <div className="result-modal-heading">
              <div className="result-modal-icon blue">
                <Plus size={20} />
              </div>

              <div>
                <h2>Add Result</h2>
                <p>
                  Create a new academic
                  result.
                </p>
              </div>
            </div>

            <ResultForm
              form={form}
              handleChange={handleFormChange}
              onSubmit={addResult}
              onCancel={() =>
                setShowAddModal(false)
              }
              submitText="Add Result"
            />
          </div>
        </div>
      )}

      {editingResult && (
        <div
          className="result-modal-overlay"
          onClick={() => {
            setEditingResult(null);
            resetForm();
          }}
        >
          <div
            className="result-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="result-modal-close"
              onClick={() => {
                setEditingResult(null);
                resetForm();
              }}
            >
              <X size={19} />
            </button>

            <div className="result-modal-heading">
              <div className="result-modal-icon purple">
                <Edit3 size={20} />
              </div>

              <div>
                <h2>Edit Result</h2>
                <p>
                  Update student academic
                  result.
                </p>
              </div>
            </div>

            <ResultForm
              form={form}
              handleChange={handleFormChange}
              onSubmit={updateResult}
              onCancel={() => {
                setEditingResult(null);
                resetForm();
              }}
              submitText="Save Changes"
            />
          </div>
        </div>
      )}

      {selectedResult && (
        <div
          className="result-modal-overlay"
          onClick={() =>
            setSelectedResult(null)
          }
        >
          <div
            className="result-modal result-view-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="result-modal-close"
              onClick={() =>
                setSelectedResult(null)
              }
            >
              <X size={19} />
            </button>

            <div className="result-profile">
              <div className="result-large-avatar">
                {selectedResult.student.charAt(0)}
              </div>

              <h2>
                {selectedResult.student}
              </h2>

              <span>
                {selectedResult.rollNo}
              </span>

              <span
                className={`result-status ${selectedResult.status.toLowerCase()}`}
              >
                <span />
                {selectedResult.status}
              </span>
            </div>

            <div className="result-details">
              <div>
                <span>Course</span>
                <strong>
                  {selectedResult.course}
                </strong>
              </div>

              <div>
                <span>Semester</span>
                <strong>
                  {selectedResult.semester}
                </strong>
              </div>

              <div>
                <span>Marks</span>
                <strong>
                  {selectedResult.marks}%
                </strong>
              </div>

              <div>
                <span>Grade</span>
                <strong>
                  {selectedResult.grade}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {deletingResult && (
        <div
          className="result-modal-overlay"
          onClick={() =>
            setDeletingResult(null)
          }
        >
          <div
            className="result-modal result-delete-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="result-delete-icon">
              <Trash2 size={24} />
            </div>

            <h2>Delete Result?</h2>

            <p>
              Are you sure you want to
              delete the result of{" "}
              <strong>
                {
                  deletingResult.student
                }
              </strong>
              ?
            </p>

            <div className="result-modal-buttons">
              <button
                className="result-cancel-btn"
                onClick={() =>
                  setDeletingResult(null)
                }
              >
                Cancel
              </button>

              <button
                className="result-delete-btn"
                onClick={deleteResult}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResultForm = ({
  form,
  handleChange,
  onSubmit,
  onCancel,
  submitText,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="result-form-group">
        <label>
          Student Name *
        </label>

        <input
          name="student"
          value={form.student}
          onChange={handleChange}
          placeholder="Enter student name"
        />
      </div>

      <div className="result-form-row">
        <div className="result-form-group">
          <label>
            Roll Number *
          </label>

          <input
            name="rollNo"
            value={form.rollNo}
            onChange={handleChange}
            placeholder="ST-1001"
          />
        </div>

        <div className="result-form-group">
          <label>
            Marks *
          </label>

          <input
            type="number"
            name="marks"
            min="0"
            max="100"
            value={form.marks}
            onChange={handleChange}
            placeholder="85"
          />
        </div>
      </div>

      <div className="result-form-group">
        <label>Course</label>

        <select
          name="course"
          value={form.course}
          onChange={handleChange}
        >
          <option>
            Computer Science
          </option>

          <option>
            Software Engineering
          </option>

          <option>
            Information Technology
          </option>

          <option>
            Digital Marketing
          </option>
        </select>
      </div>

      <div className="result-form-row">
        <div className="result-form-group">
          <label>Semester</label>

          <select
            name="semester"
            value={form.semester}
            onChange={handleChange}
          >
            <option>1st</option>
            <option>2nd</option>
            <option>3rd</option>
            <option>4th</option>
            <option>5th</option>
            <option>6th</option>
            <option>7th</option>
            <option>8th</option>
          </select>
        </div>

        <div className="result-form-group">
          <label>Status</label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option>
              Pending
            </option>

            <option>
              Published
            </option>
          </select>
        </div>
      </div>

      <div className="result-modal-buttons">
        <button
          type="button"
          className="result-cancel-btn"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="result-save-btn"
        >
          <Save size={16} />
          {submitText}
        </button>
      </div>
    </form>
  );
};

export default Results;