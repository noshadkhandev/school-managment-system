import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "school_parents";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  student: "",
  relation: "Father",
  address: "",
  emergency: "",
};

const getSavedParents = () => {
  try {
    const savedParents = localStorage.getItem(STORAGE_KEY);

    if (!savedParents) {
      return [];
    }

    const parsedParents = JSON.parse(savedParents);

    return Array.isArray(parsedParents) ? parsedParents : [];
  } catch (error) {
    console.error("Error loading parents:", error);
    return [];
  }
};

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 10)}`;
};

const Parents = () => {
  const [parents, setParents] = useState(getSavedParents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [search, setSearch] = useState("");
  const [relationFilter, setRelationFilter] = useState("All");
  const [formData, setFormData] = useState({ ...emptyForm });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parents));
    } catch (error) {
      console.error("Error saving parents:", error);
    }
  }, [parents]);

  const relations = useMemo(() => {
    return [
      "All",
      ...new Set(
        parents
          .map((parent) => parent.relation)
          .filter(Boolean)
      ),
    ];
  }, [parents]);

  const filteredParents = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return parents.filter((parent) => {
      const name = String(parent.name || "").toLowerCase();
      const phone = String(parent.phone || "").toLowerCase();
      const email = String(parent.email || "").toLowerCase();
      const student = String(parent.student || "").toLowerCase();
      const address = String(parent.address || "").toLowerCase();

      const matchesSearch =
        name.includes(searchText) ||
        phone.includes(searchText) ||
        email.includes(searchText) ||
        student.includes(searchText) ||
        address.includes(searchText);

      const matchesRelation =
        relationFilter === "All" ||
        parent.relation === relationFilter;

      return matchesSearch && matchesRelation;
    });
  }, [parents, search, relationFilter]);

  const openAddModal = () => {
    setEditingParent(null);
    setFormData({ ...emptyForm });
    setIsModalOpen(true);
  };

  const openEditModal = (parent) => {
    setEditingParent(parent);

    setFormData({
      name: parent.name || "",
      phone: parent.phone || "",
      email: parent.email || "",
      student: parent.student || "",
      relation: parent.relation || "Father",
      address: parent.address || "",
      emergency: parent.emergency || "",
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

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const student = formData.student.trim();
    const relation = formData.relation;
    const address = formData.address.trim();
    const emergency = formData.emergency.trim();

    if (!name || !phone || !email || !student) {
      alert("Please fill Full Name, Phone, Email and Student.");
      return;
    }

    if (editingParent) {
      const updatedParents = parents.map((parent) =>
        parent.id === editingParent.id
          ? {
              ...parent,
              name,
              phone,
              email,
              student,
              relation,
              address,
              emergency,
              updatedAt: new Date().toISOString(),
            }
          : parent
      );

      setParents(updatedParents);

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedParents)
        );
      } catch (error) {
        console.error("Error updating parent:", error);
      }

      alert("Parent information updated successfully.");
    } else {
      const newParent = {
        id: createId(),
        name,
        phone,
        email,
        student,
        relation,
        address,
        emergency,
        createdAt: new Date().toISOString(),
      };

      const updatedParents = [...parents, newParent];

      setParents(updatedParents);

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedParents)
        );
      } catch (error) {
        console.error("Error adding parent:", error);
      }

      alert("Parent added successfully.");
    }

    closeModal();
  };

  const deleteParent = (id) => {
    const parent = parents.find(
      (item) => item.id === id
    );

    if (!parent) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${parent.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const updatedParents = parents.filter(
      (item) => item.id !== id
    );

    setParents(updatedParents);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedParents)
      );
    } catch (error) {
      console.error("Error deleting parent:", error);
    }

    alert("Parent deleted successfully.");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingParent(null);
    setFormData({ ...emptyForm });
  };

  const fatherCount = parents.filter(
    (parent) => parent.relation === "Father"
  ).length;

  const motherCount = parents.filter(
    (parent) => parent.relation === "Mother"
  ).length;

  const guardianCount = parents.filter(
    (parent) => parent.relation === "Guardian"
  ).length;

  return (
    <div className="parents-page">
      <div className="parents-header">
        <div>
          <h1>Parents / Guardians</h1>
          <p>Manage student parents and guardians.</p>
        </div>

        <button
          type="button"
          className="add-parent-btn"
          onClick={openAddModal}
        >
          + Add Parent
        </button>
      </div>

      <div className="parents-stats">
        <div className="parent-stat-card">
          <span>Total Parents</span>
          <strong>{parents.length}</strong>
        </div>

        <div className="parent-stat-card">
          <span>Fathers</span>
          <strong>{fatherCount}</strong>
        </div>

        <div className="parent-stat-card">
          <span>Mothers</span>
          <strong>{motherCount}</strong>
        </div>

        <div className="parent-stat-card">
          <span>Guardians</span>
          <strong>{guardianCount}</strong>
        </div>
      </div>

      <div className="parents-toolbar">
        <div className="parents-search">
          <input
            type="text"
            placeholder="Search parent, student, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="parents-filter">
          <select
            value={relationFilter}
            onChange={(e) =>
              setRelationFilter(e.target.value)
            }
          >
            {relations.map((relation) => (
              <option
                key={relation}
                value={relation}
              >
                {relation === "All"
                  ? "All Relations"
                  : relation}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="parents-table-card">
        <table className="parents-table">
          <thead>
            <tr>
              <th>Parent / Guardian</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Student</th>
              <th>Relation</th>
              <th>Emergency</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredParents.length > 0 ? (
              filteredParents.map((parent) => (
                <tr key={parent.id}>
                  <td>
                    <div className="parent-name-cell">
                      <div className="parent-avatar">
                        {String(parent.name || "")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {parent.name}
                        </strong>

                        <small>
                          {parent.address ||
                            "Address not provided"}
                        </small>
                      </div>
                    </div>
                  </td>

                  <td>{parent.phone}</td>

                  <td>{parent.email}</td>

                  <td>
                    <span className="student-badge">
                      {parent.student}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`relation-badge ${String(
                        parent.relation || "other"
                      ).toLowerCase()}`}
                    >
                      {parent.relation}
                    </span>
                  </td>

                  <td>
                    {parent.emergency ||
                      "Not provided"}
                  </td>

                  <td>
                    <div className="parent-actions">
                      <button
                        type="button"
                        className="edit-parent-btn"
                        onClick={() =>
                          openEditModal(parent)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-parent-btn"
                        onClick={() =>
                          deleteParent(parent.id)
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
                  colSpan="7"
                  className="no-parents"
                >
                  {parents.length === 0
                    ? "No parents added yet. Click '+ Add Parent' to add a parent or guardian."
                    : "No parents or guardians found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div
          className="parent-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="parent-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="parent-modal-header">
              <div>
                <h2>
                  {editingParent
                    ? "Edit Parent / Guardian"
                    : "Add Parent / Guardian"}
                </h2>

                <p>
                  {editingParent
                    ? "Update parent information."
                    : "Enter parent or guardian details."}
                </p>
              </div>

              <button
                type="button"
                className="parent-close-btn"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="parent-form-grid">
                <div className="parent-form-group">
                  <label>Full Name *</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="parent-form-group">
                  <label>Phone *</label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0300-1234567"
                    required
                  />
                </div>

                <div className="parent-form-group">
                  <label>Email *</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    required
                  />
                </div>

                <div className="parent-form-group">
                  <label>Student *</label>

                  <input
                    type="text"
                    name="student"
                    value={formData.student}
                    onChange={handleChange}
                    placeholder="Enter student name"
                    required
                  />
                </div>

                <div className="parent-form-group">
                  <label>Relation *</label>

                  <select
                    name="relation"
                    value={formData.relation}
                    onChange={handleChange}
                  >
                    <option value="Father">
                      Father
                    </option>

                    <option value="Mother">
                      Mother
                    </option>

                    <option value="Guardian">
                      Guardian
                    </option>

                    <option value="Brother">
                      Brother
                    </option>

                    <option value="Sister">
                      Sister
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="parent-form-group">
                  <label>Emergency Contact</label>

                  <input
                    type="tel"
                    name="emergency"
                    value={formData.emergency}
                    onChange={handleChange}
                    placeholder="Emergency phone"
                  />
                </div>

                <div className="parent-form-group full-width">
                  <label>Address</label>

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                  />
                </div>
              </div>

              <div className="parent-modal-actions">
                <button
                  type="button"
                  className="parent-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="parent-save-btn"
                >
                  {editingParent
                    ? "Update Parent"
                    : "Add Parent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parents;