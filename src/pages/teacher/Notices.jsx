import { useState, useEffect } from "react";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [type, setType] = useState("General");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [editId, setEditId] = useState(null);
  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    const saved = localStorage.getItem("notices");
    if (saved) {
      setNotices(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);


  useEffect(() => {
    if (loaded) {
      localStorage.setItem("notices", JSON.stringify(notices));
    }
  }, [notices, loaded]);

  const resetForm = () => {
    setType("General");
    setTitle("");
    setDescription("");
    setDate("");
    setPriority("Normal");
    setEditId(null);
  };

  const handleAddNotice = () => {
    if (!title || !description || !date) {
      alert("Please fill in all fields");
      return;
    }

    if (editId !== null) {
      const updatedNotices = notices.map((notice) =>
        notice.id === editId
          ? { ...notice, type, title, description, date, priority }
          : notice
      );
      setNotices(updatedNotices);
    } else {
      // Add new notice
      const newNotice = {
        id: Date.now(),
        type,
        title,
        description,
        date,
        priority,
      };
      setNotices([...notices, newNotice]);
    }

    resetForm();
  };

  const handleEdit = (notice) => {
    setEditId(notice.id);
    setType(notice.type);
    setTitle(notice.title);
    setDescription(notice.description);
    setDate(notice.date);
    setPriority(notice.priority);
  };

  const handleDelete = (id) => {
    const updatedNotices = notices.filter((notice) => notice.id !== id);
    setNotices(updatedNotices);
    if (editId === id) {
      resetForm();
    }
  };

  return (
    <div className="notices-page">
      <div className="notices-header">
        <h1>Notices</h1>
        <p>View and manage school announcements</p>
      </div>

      <div className="notice-form">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Holiday">Holiday</option>
          <option value="Test">Test</option>
          <option value="Parent-Teacher Meeting">
            Parent-Teacher Meeting
          </option>
          <option value="General">General</option>
        </select>

        <input
          type="text"
          placeholder="Notice Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Date (e.g. 25 Aug 2026)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Normal">Normal</option>
          <option value="Important">Important</option>
        </select>

        <button onClick={handleAddNotice}>
          {editId !== null ? "Update Notice" : "Add Notice"}
        </button>
      </div>

      <div className="notices-list">
        {notices.map((notice) => (
          <div className="notice-card" key={notice.id}>
            <div className="notice-content">
              <h2>{notice.title}</h2>
              <p>{notice.description}</p>
              <small>{notice.date}</small>
            </div>

            <span
              className={
                notice.priority === "Important"
                  ? "notice-important"
                  : "notice-normal"
              }
            >
              {notice.priority}
            </span>

            <div className="notice-actions">
              <button onClick={() => handleEdit(notice)}>Edit</button>
              <button onClick={() => handleDelete(notice.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notices;