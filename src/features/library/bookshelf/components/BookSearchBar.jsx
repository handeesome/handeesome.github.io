import { useState } from "react";
import Modal from "../../../../components/ui/Modal";
import books from "../../../../static/books/books.json";

const BookSearchBar = ({ isOpen, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Filter books based on search query
  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      (book.title2 && book.title2.toLowerCase().includes(query)) ||
      book.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const handleSelectBook = (book) => {
    const bookData = {
      title: book.title,
      title2: book.title2 || "",
      author: book.author,
      pages: book["num pages"],
      rating: book["avg rating"],
      coverId: book.id,
    };
    onSelect(bookData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search Books" size="lg">
      <div className="modal-body">
        <input
          type="text"
          placeholder="Search for books..."
          className="form-control mb-3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {filteredBooks.length === 0 ? (
            <p className="text-muted text-center">No books found</p>
          ) : (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                className="border-bottom p-3 hover-bg-light"
                style={{ cursor: "pointer" }}
                onClick={() => handleSelectBook(book)}>
                <h6 className="mb-1">{book.title}</h6>
                {book.title2 && (
                  <p className="text-muted small mb-1">{book.title2}</p>
                )}
                <p className="mb-1 small">by {book.author}</p>
                <div className="d-flex gap-2">
                  {book.tags?.map((tag, idx) => (
                    <span key={idx} className="badge bg-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BookSearchBar;
