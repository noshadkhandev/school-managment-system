import { useEffect, useState } from "react";

const STORAGE_KEY = "school_messages";

const emptyForm = {
  sender: "",
  role: "Teacher",
  subject: "",
  status: "Unread",
};

const getSavedMessages = () => {
  try {
    const savedMessages =
      localStorage.getItem(STORAGE_KEY);

    if (!savedMessages) {
      return [];
    }

    const parsedMessages =
      JSON.parse(savedMessages);

    if (!Array.isArray(parsedMessages)) {
      return [];
    }

    return parsedMessages;
  } catch (error) {
    console.error(
      "Error loading messages:",
      error
    );

    return [];
  }
};

const generateId = () => {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 10)}`;
};

const Messages = () => {
  const [messages, setMessages] = useState(
    getSavedMessages
  );

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingMessage, setEditingMessage] =
    useState(null);

  const [formData, setFormData] =
    useState({
      ...emptyForm,
    });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error(
        "Error saving messages:",
        error
      );
    }
  }, [messages]);

  const handleNewMessage = () => {
    setEditingMessage(null);

    setFormData({
      ...emptyForm,
    });

    setIsModalOpen(true);
  };

  const handleEdit = (message) => {
    setEditingMessage(message);

    setFormData({
      sender: message.sender || "",
      role: message.role || "Teacher",
      subject: message.subject || "",
      status: message.status || "Unread",
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

    const sender = formData.sender.trim();
    const subject = formData.subject.trim();

    if (!sender || !subject) {
      alert(
        "Please enter sender and subject."
      );
      return;
    }

    if (editingMessage) {
      const updatedMessages =
        messages.map((message) =>
          message.id === editingMessage.id
            ? {
                ...message,
                sender,
                role: formData.role,
                subject,
                status: formData.status,
                updatedAt:
                  new Date().toISOString(),
              }
            : message
        );

      setMessages(updatedMessages);

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedMessages)
        );
      } catch (error) {
        console.error(
          "Error updating message:",
          error
        );
      }

      alert("Message updated successfully.");
    } else {
      const newMessage = {
        id: generateId(),
        sender,
        role: formData.role,
        subject,
        status: formData.status,
        createdAt:
          new Date().toISOString(),
      };

      const updatedMessages = [
        ...messages,
        newMessage,
      ];

      setMessages(updatedMessages);

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedMessages)
        );
      } catch (error) {
        console.error(
          "Error adding message:",
          error
        );
      }

      alert("Message added successfully.");
    }

    handleCloseModal();
  };

  const markRead = (id) => {
    const message = messages.find(
      (item) => item.id === id
    );

    if (!message) {
      return;
    }

    if (message.status === "Read") {
      return;
    }

    const updatedMessages =
      messages.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Read",
              updatedAt:
                new Date().toISOString(),
            }
          : item
      );

    setMessages(updatedMessages);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedMessages)
      );
    } catch (error) {
      console.error(
        "Error marking message as read:",
        error
      );
    }
  };

  const handleDelete = (id) => {
    const message = messages.find(
      (item) => item.id === id
    );

    if (!message) {
      return;
    }

    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete "${message.subject}"?`
      );

    if (!confirmDelete) {
      return;
    }

    const updatedMessages =
      messages.filter(
        (item) => item.id !== id
      );

    setMessages(updatedMessages);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedMessages)
      );
    } catch (error) {
      console.error(
        "Error deleting message:",
        error
      );
    }

    alert("Message deleted successfully.");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMessage(null);

    setFormData({
      ...emptyForm,
    });
  };

  return (
    <div className="messages-page">
      <div className="messages-header">
        <div>
          <h1>Messages</h1>

          <p>
            Manage communication between
            admin, teachers and students.
          </p>
        </div>

        <button
          type="button"
          className="new-message-btn"
          onClick={handleNewMessage}
        >
          <span>+</span> New Message
        </button>
      </div>

      <div className="messages-table-card">
        <table className="messages-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Role</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {messages.length > 0 ? (
              messages.map((message) => (
                <tr key={message.id}>
                  <td>
                    {message.sender}
                  </td>

                  <td>
                    {message.role}
                  </td>

                  <td>
                    {message.subject}
                  </td>

                  <td>
                    <span
                      className={
                        message.status ===
                        "Unread"
                          ? "message-status unread"
                          : "message-status read"
                      }
                    >
                      {message.status}
                    </span>
                  </td>

                  <td>
                    <div className="message-actions">
                      <button
                        type="button"
                        className="mark-read-btn"
                        onClick={() =>
                          markRead(message.id)
                        }
                        disabled={
                          message.status ===
                          "Read"
                        }
                      >
                        {message.status ===
                        "Read"
                          ? "Read"
                          : "Mark as Read"}
                      </button>

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(message)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            message.id
                          )
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
                  className="no-messages"
                >
                  No messages added yet. Click
                  "+ New Message" to add a message.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div
          className="message-modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="message-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="message-modal-header">
              <h2>
                {editingMessage
                  ? "Edit Message"
                  : "New Message"}
              </h2>

              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Sender</label>

                <input
                  type="text"
                  name="sender"
                  value={formData.sender}
                  onChange={handleChange}
                  placeholder="Enter sender name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Teacher">
                    Teacher
                  </option>

                  <option value="Student">
                    Student
                  </option>

                  <option value="Admin">
                    Admin
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Subject</label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter message subject"
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Unread">
                    Unread
                  </option>

                  <option value="Read">
                    Read
                  </option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingMessage
                    ? "Update Message"
                    : "Add Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;