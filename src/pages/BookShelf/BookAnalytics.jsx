import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Board from "../../components/Board";
import BookTimeAnalytics from "../../components/bookShelf/BookTimeAnalytics"; // Updated import
import books from "../../data/books/books.json";

const BookAnalytics = () => {
  const { bookId } = useParams(); // Get book ID from URL
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    // Find the book by ID
    const foundBook = books.find((b) => b.id === bookId);
    if (foundBook) {
      setBook(foundBook);
    } else {
      // If book not found, redirect back to bookshelf
      navigate("/book-shelf");
    }
  }, [bookId, navigate]);

  if (!book) {
    return (
      <Board title="Loading Analytics...">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Board>
    );
  }

  return (
    <Board title={`Time Analytics - ${book.title}`}>
      {/* Book Info Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-2">
                  <img
                    src={`/covers/${book.id}.jpg`}
                    alt={book.title}
                    className="img-fluid rounded"
                    style={{ maxHeight: "150px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-10">
                  <h4 className="card-title">{book.title}</h4>
                  {book.title2 && <h5 className="text-muted">{book.title2}</h5>}
                  <p className="card-text">
                    <strong>Author:</strong> {book.author}
                    <br />
                    <strong>Pages:</strong> {book["num pages"]}
                    <br />
                    <strong>Reading Status:</strong> {book.shelves}
                  </p>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/book-shelf")}>
                    ← Back to Book Shelf
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="row mb-4">
        <div className="col-12">
          <BookTimeAnalytics
            bookTitle={book.title}
            bookTitle2={book.title2}
            bookId={bookId}
          />
        </div>
      </div>
    </Board>
  );
};

export default BookAnalytics;
