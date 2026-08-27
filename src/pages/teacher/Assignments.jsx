import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

function Assignments() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);

  const [assignments, setAssignments] = useState(() => {
    const savedAssignments = localStorage.getItem("assignments");

    try {
      return savedAssignments ? JSON.parse(savedAssignments) : [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [editingId, setEditingId] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        underline: false,
      }),
      Underline,
    ],
    content: description,

    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    localStorage.setItem(
      "assignments",
      JSON.stringify(assignments)
    );
  }, [assignments]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const openNewAssignment = () => {
    setEditingId(null);

    setTitle("");
    setDescription("");
    setLink("");
    setImage("");
    setDueDate("");

    editor?.commands.clearContent();

    setShowForm(true);
  };

  const editAssignment = (assignment) => {
    setEditingId(assignment.id);

    setTitle(assignment.title);
    setDescription(assignment.description || "");
    setLink(assignment.link || "");
    setImage(assignment.image || "");
    setDueDate(assignment.dueDate);

    if (editor) {
      editor.commands.setContent(
        assignment.description || ""
      );
    }

    setShowForm(true);
  };

  const addAssignment = (e) => {
    e.preventDefault();

    if (!title || !description || description === "<p></p>" || !dueDate) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingId) {
      const updatedAssignments = assignments.map(
        (assignment) =>
          assignment.id === editingId
            ? {
                ...assignment,
                title,
                description,
                link,
                image,
                dueDate,
              }
            : assignment
      );

      setAssignments(updatedAssignments);

      alert("Assignment updated successfully!");

      setEditingId(null);
      setTitle("");
      setDescription("");
      setLink("");
      setImage("");
      setDueDate("");

      editor?.commands.clearContent();

      setShowForm(false);

      return;
    }

    const newAssignment = {
      id: Date.now(),
      title,
      description,
      link,
      image,
      dueDate,
      createdAt: new Date().toLocaleString(),
    };

    setAssignments((previousAssignments) => [
      ...previousAssignments,
      newAssignment,
    ]);

    setTitle("");
    setDescription("");
    setLink("");
    setImage("");
    setDueDate("");
    setEditingId(null);

    editor?.commands.clearContent();

    setShowForm(false);

    navigate(
      `/teacher/assignments/submissions/${newAssignment.id}`
    );
  };

  const deleteAssignment = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmDelete) return;

    setAssignments((previousAssignments) =>
      previousAssignments.filter(
        (assignment) => assignment.id !== id
      )
    );
  };

  const cancelForm = () => {
    setShowForm(false);

    setEditingId(null);

    setTitle("");
    setDescription("");
    setLink("");
    setImage("");
    setDueDate("");

    editor?.commands.clearContent();
  };

  return (
    <div className="assignments-page">

      <div className="assignments-header">

        <div>
          <h1>Assignments</h1>

          <p>
            Create and manage student assignments
          </p>
        </div>

        <button
          className="new-assignment-btn"
          onClick={openNewAssignment}
        >
          + New Assignment
        </button>

      </div>


      <div className="assignments-list">

        <h2>All Assignments</h2>

        {assignments.length === 0 ? (

          <p>No assignments available.</p>

        ) : (

          assignments.map((assignment) => (

            <div
              className="assignment-card"
              key={assignment.id}
            >

              <div className="assignment-info">

                <h3>
                  {assignment.title}
                </h3>

                <div
                  dangerouslySetInnerHTML={{
                    __html: assignment.description,
                  }}
                />

                <p>
                  <strong>Due Date:</strong>{" "}
                  {assignment.dueDate}
                </p>

                {assignment.link && (

                  <p>
                    <strong>Reference:</strong>{" "}

                    <a
                      href={assignment.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Link
                    </a>
                  </p>

                )}

              </div>


              <div className="assignment-actions">

                <button
                  onClick={() =>
                    navigate(
                      `/teacher/assignments/submissions/${assignment.id}`
                    )
                  }
                >
                  👁️ View
                </button>


                <button
                  onClick={() =>
                    editAssignment(assignment)
                  }
                >
                  ✏️ Edit
                </button>


                <button
                  className="delete-assignment-btn"
                  onClick={() =>
                    deleteAssignment(assignment.id)
                  }
                >
                  🗑️ Delete
                </button>

              </div>

            </div>

          ))

        )}

      </div>


      {showForm && (

        <div className="assignment-modal-overlay">

          <div className="assignment-modal">


            <div className="assignment-modal-header">

              <div>

                <h2>
                  {editingId
                    ? "Edit Assignment"
                    : "Create New Assignment"}
                </h2>

                <p>
                  {editingId
                    ? "Update assignment details"
                    : "Create a new assignment for students"}
                </p>

              </div>

              <button
                className="close-modal-btn"
                onClick={cancelForm}
              >
                ×
              </button>

            </div>


            <form onSubmit={addAssignment}>


              <div className="form-group">

                <label>
                  Title <span>*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter assignment title"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                />

              </div>


              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description <span>*</span>
                </label>

                <div className="rich-text-editor">

                  <div className="editor-toolbar">

                    <button
                      type="button"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleBold()
                          .run()
                      }
                    >
                      <b>B</b>
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleItalic()
                          .run()
                      }
                    >
                      <i>I</i>
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleUnderline()
                          .run()
                      }
                    >
                      <u>U</u>
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({
                            level: 1,
                          })
                          .run()
                      }
                    >
                      H1
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({
                            level: 2,
                          })
                          .run()
                      }
                    >
                      H2
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleBulletList()
                          .run()
                      }
                    >
                      • List
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleOrderedList()
                          .run()
                      }
                    >
                      1. List
                    </button>

                  </div>


                  <EditorContent
                    editor={editor}
                  />

                </div>

              </div>


              <div className="form-group">

                <label>
                  Reference Links
                </label>

                <input
                  type="url"
                  placeholder="https://example.com"
                  value={link}
                  onChange={(e) =>
                    setLink(e.target.value)
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Reference Images
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />


                {image && (

                  <div className="image-preview-container">

                    <img
                      src={image}
                      alt="Assignment preview"
                      className="assignment-image-preview"
                    />

                  </div>

                )}

              </div>


              <div className="form-group">

                <label>
                  Due Date <span>*</span>
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(e.target.value)
                  }
                />

              </div>


              <div className="assignment-modal-footer">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={cancelForm}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="create-assignment-btn"
                >
                  {editingId
                    ? "Update Assignment"
                    : "Create Assignment"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Assignments;