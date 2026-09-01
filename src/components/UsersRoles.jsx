import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Users,
} from "lucide-react";

const STORAGE_KEY = "school_users_roles";

const emptyForm = {
  name: "",
  email: "",
  role: "Student",
  status: "Active",
};

const UsersRoles = () => {
  const [users, setUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    ...emptyForm,
  });

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);

      if (savedData !== null) {
        const parsedData = JSON.parse(savedData);

        if (Array.isArray(parsedData)) {
          setUsers(parsedData);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(users)
      );
    } catch (error) {
      console.error(error);
    }
  }, [users, isLoaded]);

  const filteredUsers = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    return users.filter((user) => {
      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(searchText) ||
        user.email
          .toLowerCase()
          .includes(searchText) ||
        user.role
          .toLowerCase()
          .includes(searchText);

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const openAddModal = () => {
    setEditingUser(null);

    setFormData({
      ...emptyForm,
    });

    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "Student",
      status: user.status || "Active",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);

    setFormData({
      ...emptyForm,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name || !email) {
      alert("Please enter name and email.");
      return;
    }

    if (editingUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                name,
                email,
                role: formData.role,
                status: formData.status,
              }
            : user
        )
      );

      alert("User updated successfully.");
    } else {
      const emailAlreadyExists = users.some(
        (user) =>
          user.email.toLowerCase() ===
          email.toLowerCase()
      );

      if (emailAlreadyExists) {
        alert("This email already exists.");
        return;
      }

      const newUser = {
        id:
          Date.now().toString() +
          Math.random()
            .toString(36)
            .substring(2),

        name,
        email,
        role: formData.role,
        status: formData.status,

        createdAt:
          new Date().toISOString(),
      };

      setUsers((prevUsers) => [
        ...prevUsers,
        newUser,
      ]);

      alert("User added successfully.");
    }

    closeModal();
  };

  const changeRole = (id, role) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              role,
            }
          : user
      )
    );
  };

  const changeStatus = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : user
      )
    );
  };

  const deleteUser = (id) => {
    const user = users.find(
      (item) => item.id === id
    );

    if (!user) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name}"?`
    );

    if (!confirmed) return;

    setUsers((prevUsers) =>
      prevUsers.filter(
        (item) => item.id !== id
      )
    );

    alert("User deleted successfully.");
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("All");
    setStatusFilter("All");
  };

  return (
    <div className="users-roles-page">
      <div className="users-roles-header">
        <div>
          <h1>Users & Roles</h1>
          <p>
            Manage users and their permissions.
          </p>
        </div>

        <button
          type="button"
          className="add-user-btn"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="users-stats">
        <div className="users-stat-card">
          <Users size={22} />

          <div>
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
        </div>

        <div className="users-stat-card">
          <span className="stat-label">
            Active Users
          </span>

          <strong>{activeUsers}</strong>
        </div>

        <div className="users-stat-card">
          <span className="stat-label">
            Inactive Users
          </span>

          <strong>{inactiveUsers}</strong>
        </div>
      </div>

      <div className="users-roles-toolbar">
        <div className="users-search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value)
          }
        >
          <option value="All">
            All Roles
          </option>

          <option value="Admin">
            Admin
          </option>

          <option value="Teacher">
            Teacher
          </option>

          <option value="Student">
            Student
          </option>

          <option value="Parent">
            Parent
          </option>
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

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>
        </select>

        {(search ||
          roleFilter !== "All" ||
          statusFilter !== "All") && (
          <button
            type="button"
            className="users-clear-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="users-roles-card">
        <div className="users-table-wrapper">
          <table className="users-roles-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Change Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="user-name">
                      {user.name}
                    </td>

                    <td className="user-email">
                      {user.email}
                    </td>

                    <td>
                      <span
                        className={`role-badge ${user.role
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`user-status ${user.status.toLowerCase()}`}
                        onClick={() =>
                          changeStatus(user.id)
                        }
                      >
                        <span className="user-status-dot"></span>
                        {user.status}
                      </button>
                    </td>

                    <td>
                      <select
                        className="role-select"
                        value={user.role}
                        onChange={(e) =>
                          changeRole(
                            user.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Admin">
                          Admin
                        </option>

                        <option value="Teacher">
                          Teacher
                        </option>

                        <option value="Student">
                          Student
                        </option>

                        <option value="Parent">
                          Parent
                        </option>
                      </select>
                    </td>

                    <td>
                      <div className="user-action-buttons">
                        <button
                          type="button"
                          className="edit-user-btn"
                          onClick={() =>
                            openEditModal(user)
                          }
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          className="delete-user-btn"
                          onClick={() =>
                            deleteUser(user.id)
                          }
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="no-users"
                  >
                    {users.length === 0
                      ? "No users added yet. Click '+ Add User' to add a user."
                      : "No users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="users-count">
        Showing{" "}
        <strong>
          {filteredUsers.length}
        </strong>{" "}
        of{" "}
        <strong>{users.length}</strong>{" "}
        users
      </div>

      {showModal && (
        <div
          className="user-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="user-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              type="button"
              className="user-modal-close"
              onClick={closeModal}
            >
              <X size={20} />
            </button>

            <h2>
              {editingUser
                ? "Edit User"
                : "Add New User"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="user-form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="user-form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="user-form-group">
                <label>Role</label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="Admin">
                    Admin
                  </option>

                  <option value="Teacher">
                    Teacher
                  </option>

                  <option value="Student">
                    Student
                  </option>

                  <option value="Parent">
                    Parent
                  </option>
                </select>
              </div>

              <div className="user-form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              <div className="user-form-buttons">
                <button
                  type="button"
                  className="cancel-user-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-user-btn"
                >
                  {editingUser
                    ? "Update User"
                    : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersRoles;