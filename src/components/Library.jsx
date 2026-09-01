import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "school_library_books";

const emptyForm = {
  title: "",
  author: "",
  category: "",
  quantity: 1,
};

const getSavedBooks = () => {
  try {
    const savedBooks = localStorage.getItem(STORAGE_KEY);

    if (!savedBooks) {
      return [];
    }

    const parsedBooks = JSON.parse(savedBooks);

    if (!Array.isArray(parsedBooks)) {
      return [];
    }

    return parsedBooks.map((book) => ({
      ...book,
      id: book.id || `${Date.now()}-${Math.random()}`,
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      quantity: Number(book.quantity) || 0,
      available:
        typeof book.available === "number"
          ? book.available
          : Number(book.quantity) || 0,
    }));
  } catch (error) {
    console.error("Error loading books:", error);
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

const Library = () => {
  const [books, setBooks] = useState(getSavedBooks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [formData, setFormData] = useState({
    ...emptyForm,
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(books)
      );
    } catch (error) {
      console.error("Error saving books:", error);
    }
  }, [books]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        books
          .map((book) => book.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [books]);

  const totalBooks = books.reduce(
    (total, book) =>
      total + Number(book.quantity || 0),
    0
  );

  const availableBooks = books.reduce(
    (total, book) =>
      total + Number(book.available || 0),
    0
  );

  const issuedBooks = totalBooks - availableBooks;

  const filteredBooks = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return books.filter((book) => {
      const title = String(
        book.title || ""
      ).toLowerCase();

      const author = String(
        book.author || ""
      ).toLowerCase();

      const category = String(
        book.category || ""
      ).toLowerCase();

      const matchesSearch =
        title.includes(searchText) ||
        author.includes(searchText) ||
        category.includes(searchText);

      const matchesCategory =
        categoryFilter === "All" ||
        book.category === categoryFilter;

      return (
        matchesSearch && matchesCategory
      );
    });
  }, [books, search, categoryFilter]);

  const openAddModal = () => {
    setEditingBook(null);

    setFormData({
      ...emptyForm,
    });

    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);

    setFormData({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      quantity: book.quantity || 1,
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

    const title = formData.title.trim();
    const author = formData.author.trim();
    const category = formData.category.trim();
    const quantity = Number(formData.quantity);

    if (!title || !author || !category) {
      alert(
        "Please fill Book Title, Author and Category."
      );
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    if (editingBook) {
      const issuedCount =
        Number(editingBook.quantity) -
        Number(editingBook.available);

      if (quantity < issuedCount) {
        alert(
          `Quantity cannot be less than ${issuedCount} because ${issuedCount} book(s) are currently issued.`
        );
        return;
      }

      const updatedBooks = books.map((book) => {
        if (book.id !== editingBook.id) {
          return book;
        }

        return {
          ...book,
          title,
          author,
          category,
          quantity,
          available: quantity - issuedCount,
          updatedAt: new Date().toISOString(),
        };
      });

      setBooks(updatedBooks);

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedBooks)
        );
      } catch (error) {
        console.error(
          "Error updating book:",
          error
        );
      }

      alert("Book updated successfully.");
    } else {
      const newBook = {
        id: generateId(),
        title,
        author,
        category,
        quantity,
        available: quantity,
        createdAt: new Date().toISOString(),
      };

      const updatedBooks = [
        ...books,
        newBook,
      ];

      setBooks(updatedBooks);

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedBooks)
        );
      } catch (error) {
        console.error(
          "Error adding book:",
          error
        );
      }

      alert("Book added successfully.");
    }

    closeModal();
  };

  const deleteBook = (id) => {
    const book = books.find(
      (item) => item.id === id
    );

    if (!book) {
      return;
    }

    if (book.available < book.quantity) {
      alert(
        "This book cannot be deleted because some copies are currently issued. Please return all issued copies first."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"?`
    );

    if (!confirmed) {
      return;
    }

    const updatedBooks = books.filter(
      (item) => item.id !== id
    );

    setBooks(updatedBooks);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedBooks)
      );
    } catch (error) {
      console.error(
        "Error deleting book:",
        error
      );
    }

    alert("Book deleted successfully.");
  };

  const issueBook = (id) => {
    const book = books.find(
      (item) => item.id === id
    );

    if (!book) {
      return;
    }

    if (book.available <= 0) {
      alert(
        "No copy of this book is available."
      );
      return;
    }

    const updatedBooks = books.map((item) =>
      item.id === id
        ? {
            ...item,
            available: item.available - 1,
            updatedAt: new Date().toISOString(),
          }
        : item
    );

    setBooks(updatedBooks);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedBooks)
      );
    } catch (error) {
      console.error(
        "Error issuing book:",
        error
      );
    }
  };

  const returnBook = (id) => {
    const book = books.find(
      (item) => item.id === id
    );

    if (!book) {
      return;
    }

    if (book.available >= book.quantity) {
      alert(
        "All copies are already available."
      );
      return;
    }

    const updatedBooks = books.map((item) =>
      item.id === id
        ? {
            ...item,
            available: item.available + 1,
            updatedAt: new Date().toISOString(),
          }
        : item
    );

    setBooks(updatedBooks);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedBooks)
      );
    } catch (error) {
      console.error(
        "Error returning book:",
        error
      );
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);

    setFormData({
      ...emptyForm,
    });
  };

  return (
    <div className="library-page">
      <div className="library-header">
        <div>
          <h1>Library</h1>
          <p>
            Manage books, issue and return records.
          </p>
        </div>

        <button
          type="button"
          className="add-book-btn"
          onClick={openAddModal}
        >
          + Add Book
        </button>
      </div>

      <div className="library-stats">
        <div className="library-stat-card">
          <span>Total Books</span>
          <strong>{totalBooks}</strong>
        </div>

        <div className="library-stat-card available-card">
          <span>Available</span>
          <strong>{availableBooks}</strong>
        </div>

        <div className="library-stat-card issued-card">
          <span>Issued</span>
          <strong>{issuedBooks}</strong>
        </div>

        <div className="library-stat-card">
          <span>Book Titles</span>
          <strong>{books.length}</strong>
        </div>
      </div>

      <div className="library-toolbar">
        <div className="library-search">
          <input
            type="text"
            placeholder="Search by title, author or category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="library-filter">
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="library-table-card">
        <table className="library-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Author</th>
              <th>Category</th>
              <th>Total</th>
              <th>Available</th>
              <th>Issued</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => {
                const issued =
                  Number(book.quantity) -
                  Number(book.available);

                const isAvailable =
                  Number(book.available) > 0;

                return (
                  <tr key={book.id}>
                    <td>
                      <strong>
                        {book.title}
                      </strong>
                    </td>

                    <td>{book.author}</td>

                    <td>
                      <span className="category-badge">
                        {book.category}
                      </span>
                    </td>

                    <td>
                      {book.quantity}
                    </td>

                    <td>
                      <span className="available-count">
                        {book.available}
                      </span>
                    </td>

                    <td>{issued}</td>

                    <td>
                      <span
                        className={
                          isAvailable
                            ? "book-status available"
                            : "book-status unavailable"
                        }
                      >
                        {isAvailable
                          ? "Available"
                          : "Out of Stock"}
                      </span>
                    </td>

                    <td>
                      <div className="book-actions">
                        <button
                          type="button"
                          className="issue-btn"
                          onClick={() =>
                            issueBook(book.id)
                          }
                          disabled={
                            book.available <= 0
                          }
                        >
                          Issue
                        </button>

                        <button
                          type="button"
                          className="return-btn"
                          onClick={() =>
                            returnBook(book.id)
                          }
                          disabled={
                            book.available >=
                            book.quantity
                          }
                        >
                          Return
                        </button>

                        <button
                          type="button"
                          className="edit-book-btn"
                          onClick={() =>
                            openEditModal(book)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-book-btn"
                          onClick={() =>
                            deleteBook(book.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="no-books"
                >
                  {books.length === 0
                    ? "No books added yet. Click '+ Add Book' to add a book."
                    : "No books found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div
          className="library-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="library-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="library-modal-header">
              <div>
                <h2>
                  {editingBook
                    ? "Edit Book"
                    : "Add New Book"}
                </h2>

                <p>
                  {editingBook
                    ? "Update book information."
                    : "Enter the book details below."}
                </p>
              </div>

              <button
                type="button"
                className="library-close-btn"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="library-form-group">
                <label>Book Title</label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div className="library-form-group">
                <label>Author</label>

                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  required
                />
              </div>

              <div className="library-form-group">
                <label>Category</label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Programming"
                  required
                />
              </div>

              <div className="library-form-group">
                <label>Total Quantity</label>

                <input
                  type="number"
                  name="quantity"
                  min="1"
                  step="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="library-modal-actions">
                <button
                  type="button"
                  className="library-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="library-save-btn"
                >
                  {editingBook
                    ? "Update Book"
                    : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;