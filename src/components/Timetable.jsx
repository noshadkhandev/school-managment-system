import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Save,
} from "lucide-react";



const STORAGE_KEY = "college_timetable";

const emptyForm = {
  day: "Monday",
  startTime: "",
  endTime: "",
  subject: "",
  className: "",
};


const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];


const Timetable = () => {

  const [timetable, setTimetable] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);

      if (savedData) {
        const parsedData = JSON.parse(savedData);

        if (Array.isArray(parsedData)) {
          return parsedData;
        }
      }

      // First time: completely empty
      return [];
    } catch (error) {
      console.error(
        "Error loading timetable:",
        error
      );

      return [];
    }
  });

  // ====================================================
  // STATES
  // ====================================================

  const [showModal, setShowModal] =
    useState(false);

  const [editingLecture, setEditingLecture] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  const [search, setSearch] =
    useState("");

  const [selectedDay, setSelectedDay] =
    useState("All");

  // ====================================================
  // SAVE DATA TO LOCAL STORAGE
  // ====================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(timetable)
      );
    } catch (error) {
      console.error(
        "Error saving timetable:",
        error
      );
    }
  }, [timetable]);

  // ====================================================
  // FILTER + SEARCH + SORT
  // ====================================================

  const filteredTimetable = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    return [...timetable]
      .filter((lecture) => {
        // Day filter
        const matchesDay =
          selectedDay === "All" ||
          lecture.day === selectedDay;

        // Search
        const matchesSearch =
          lecture.subject
            .toLowerCase()
            .includes(searchText) ||
          lecture.className
            .toLowerCase()
            .includes(searchText) ||
          lecture.day
            .toLowerCase()
            .includes(searchText) ||
          lecture.startTime
            .toLowerCase()
            .includes(searchText) ||
          lecture.endTime
            .toLowerCase()
            .includes(searchText);

        return (
          matchesDay && matchesSearch
        );
      })
      .sort((a, b) => {
        // First sort by day
        const dayDifference =
          days.indexOf(a.day) -
          days.indexOf(b.day);

        if (dayDifference !== 0) {
          return dayDifference;
        }

        // Then sort by start time
        return a.startTime.localeCompare(
          b.startTime
        );
      });
  }, [
    timetable,
    search,
    selectedDay,
  ]);

  // ====================================================
  // HANDLE INPUT CHANGE
  // ====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleAddLecture = () => {
    setEditingLecture(null);

    setFormData({
      ...emptyForm,
    });

    setShowModal(true);
  };

  const handleEditLecture = (lecture) => {
    setEditingLecture(lecture);

    setFormData({
      day: lecture.day,
      startTime: lecture.startTime,
      endTime: lecture.endTime,
      subject: lecture.subject,
      className: lecture.className,
    });

    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clean text
    const cleanedData = {
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
      subject: formData.subject.trim(),
      className: formData.className.trim(),
    };


    if (
      !cleanedData.day ||
      !cleanedData.startTime ||
      !cleanedData.endTime ||
      !cleanedData.subject ||
      !cleanedData.className
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (
      cleanedData.startTime >=
      cleanedData.endTime
    ) {
      alert(
        "End time must be greater than start time."
      );
      return;
    }

    const duplicate = timetable.some(
      (lecture) => {

        if (
          editingLecture &&
          lecture.id === editingLecture.id
        ) {
          return false;
        }

        return (
          lecture.day === cleanedData.day &&
          lecture.startTime ===
            cleanedData.startTime &&
          lecture.endTime ===
            cleanedData.endTime &&
          lecture.className
            .toLowerCase()
            .trim() ===
            cleanedData.className
              .toLowerCase()
              .trim()
        );
      }
    );

    if (duplicate) {
      alert(
        "A lecture for this class already exists at this time."
      );
      return;
    }

    if (editingLecture) {
      setTimetable((previous) =>
        previous.map((lecture) => {
          if (
            lecture.id === editingLecture.id
          ) {
            return {
              ...lecture,
              ...cleanedData,
            };
          }

          return lecture;
        })
      );

      alert(
        "Lecture updated successfully."
      );
    }

    else {
      const newLecture = {
        id:
          Date.now() +
          Math.floor(
            Math.random() * 10000
          ),
        ...cleanedData,
      };

      setTimetable((previous) => [
        ...previous,
        newLecture,
      ]);

      alert(
        "Lecture added successfully."
      );
    }

    setShowModal(false);

    setEditingLecture(null);

    setFormData({
      ...emptyForm,
    });
  };


  const handleDeleteLecture = (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this lecture?"
      );

    if (!confirmDelete) {
      return;
    }

    setTimetable((previous) =>
      previous.filter(
        (lecture) => lecture.id !== id
      )
    );

    alert(
      "Lecture deleted successfully."
    );
  };


  const handleCloseModal = () => {
    setShowModal(false);

    setEditingLecture(null);

    setFormData({
      ...emptyForm,
    });
  };

  const handleClearAll = () => {
    if (timetable.length === 0) {
      alert("Timetable is already empty.");
      return;
    }

    const confirmClear =
      window.confirm(
        "Are you sure you want to delete ALL lectures? This cannot be undone."
      );

    if (!confirmClear) {
      return;
    }

    setTimetable([]);

    alert(
      "All lectures deleted successfully."
    );
  };

  return (
    <div className="timetable-page">

      <div className="timetable-header">
        <div>
          <h1>
            <CalendarDays size={30} />
            Timetable
          </h1>

          <p>
            Manage weekly class schedules.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          {/* CLEAR ALL */}
          {timetable.length > 0 && (
            <button
              type="button"
              className="delete-lecture-btn"
              onClick={handleClearAll}
              title="Delete All Lectures"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          )}

          {/* ADD LECTURE */}
          <button
            type="button"
            className="add-lecture-btn"
            onClick={handleAddLecture}
          >
            <Plus size={18} />
            Add Lecture
          </button>
        </div>
      </div>

      {/* ==================================================
          SEARCH AND FILTER
      ================================================== */}

      <div className="timetable-filters">
        {/* SEARCH */}
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search subject, class or day..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {/* CLEAR SEARCH */}
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              title="Clear Search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* DAY FILTER */}
        <select
          value={selectedDay}
          onChange={(e) =>
            setSelectedDay(e.target.value)
          }
        >
          <option value="All">
            All Days
          </option>

          {days.map((day) => (
            <option
              key={day}
              value={day}
            >
              {day}
            </option>
          ))}
        </select>
      </div>

      {/* ==================================================
          TABLE
      ================================================== */}

      <div className="timetable-table-wrapper">
        <table className="timetable-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Subject</th>
              <th>Class</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTimetable.length > 0 ? (
              filteredTimetable.map(
                (lecture) => (
                  <tr key={lecture.id}>
                    {/* DAY */}
                    <td>
                      {lecture.day}
                    </td>

                    {/* START */}
                    <td>
                      {lecture.startTime}
                    </td>

                    {/* END */}
                    <td>
                      {lecture.endTime}
                    </td>

                    {/* SUBJECT */}
                    <td>
                      {lecture.subject}
                    </td>

                    {/* CLASS */}
                    <td>
                      {lecture.className}
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="timetable-actions">
                        {/* EDIT */}
                        <button
                          type="button"
                          className="edit-lecture-btn"
                          onClick={() =>
                            handleEditLecture(
                              lecture
                            )
                          }
                          title="Edit Lecture"
                        >
                          <Edit3
                            size={17}
                          />
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          className="delete-lecture-btn"
                          onClick={() =>
                            handleDeleteLecture(
                              lecture.id
                            )
                          }
                          title="Delete Lecture"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="no-data"
                >
                  {search ||
                  selectedDay !== "All"
                    ? "No lectures found."
                    : "No lectures added yet. Click Add Lecture to create your first lecture."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==================================================
          ADD / EDIT MODAL
      ================================================== */}

      {showModal && (
        <div
          className="timetable-modal-overlay"
          onClick={(e) => {
            // Close only when clicking outside modal
            if (
              e.target ===
              e.currentTarget
            ) {
              handleCloseModal();
            }
          }}
        >
          <div className="timetable-modal">
            {/* MODAL HEADER */}
            <div className="modal-header">
              <div>
                <h2>
                  {editingLecture
                    ? "Edit Lecture"
                    : "Add New Lecture"}
                </h2>

                <p>
                  Enter the lecture schedule
                  details.
                </p>
              </div>

              <button
                type="button"
                className="close-modal-btn"
                onClick={
                  handleCloseModal
                }
                title="Close"
              >
                <X size={22} />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
            >
              <div className="timetable-form-grid">
                {/* DAY */}
                <div className="form-group">
                  <label htmlFor="day">
                    Day
                  </label>

                  <select
                    id="day"
                    name="day"
                    value={formData.day}
                    onChange={
                      handleChange
                    }
                    required
                  >
                    {days.map((day) => (
                      <option
                        key={day}
                        value={day}
                      >
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SUBJECT */}
                <div className="form-group">
                  <label htmlFor="subject">
                    Subject
                  </label>

                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    placeholder="Enter subject"
                    value={
                      formData.subject
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                {/* START TIME */}
                <div className="form-group">
                  <label htmlFor="startTime">
                    Start Time
                  </label>

                  <input
                    id="startTime"
                    type="time"
                    name="startTime"
                    value={
                      formData.startTime
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                {/* END TIME */}
                <div className="form-group">
                  <label htmlFor="endTime">
                    End Time
                  </label>

                  <input
                    id="endTime"
                    type="time"
                    name="endTime"
                    value={
                      formData.endTime
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                {/* CLASS */}
                <div className="form-group full-width">
                  <label htmlFor="className">
                    Class
                  </label>

                  <input
                    id="className"
                    type="text"
                    name="className"
                    placeholder="Example: BSCS - A"
                    value={
                      formData.className
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>
              </div>

              {/* MODAL BUTTONS */}
              <div className="timetable-modal-actions">
                {/* CANCEL */}
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    handleCloseModal
                  }
                >
                  Cancel
                </button>

                {/* SAVE / UPDATE */}
                <button
                  type="submit"
                  className="save-lecture-btn"
                >
                  <Save size={17} />

                  {editingLecture
                    ? "Update Lecture"
                    : "Save Lecture"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;