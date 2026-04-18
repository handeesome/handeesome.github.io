import Board from "../../components/Board";
import bookQuotes from "../../data/books/book-quotes.json";
import BookQuote from "../../features/bookshelf/components/BookQuote";
import { useParams, useNavigate } from "react-router-dom";
import BookInfoHeader from "../../features/bookshelf/components/BookInfoHeader";
import books from "../../data/books/books.json";
import { useState, useEffect, useRef } from "react";
import ScrollToRef from "../../components/ScrollToRef";

const BookNotes = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const boardRef = useRef(null);

  const quotesEntry = bookQuotes[bookId];
  const bookTitle = quotesEntry
    ? quotesEntry[0]
    : book?.title || "Unknown Book";
  const quotes = quotesEntry ? quotesEntry[1] : [];

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
      <Board title="Loading Notes..." ref={boardRef}>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <ScrollToRef scrollRef={boardRef} />
      </Board>
    );
  }
  const handleReadSessionsClick = () => {
    navigate(`/book-shelf/book/${bookId}/analytics`);
  };
  return (
    <Board title={`NOTES FROM ${bookTitle}`} ref={boardRef}>
      <BookInfoHeader book={book} />
      {quotes.length > 0 ? (
        quotes.map((note, index) => (
          <div key={index} className="d-flex mb-3 align-items-center">
            <div
              className="d-flex justify-content-center align-items-center bg-primary text-white fw-bold me-3"
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "0.25rem",
                flexShrink: 0,
              }}>
              {index + 1}
            </div>
            <BookQuote>{note}</BookQuote>
          </div>
        ))
      ) : (
        <div style={{ width: "100%", minHeight: 400 }}>
          <div className="alert alert-info text-center">
            <h4>📊 No NOTES Found</h4>
            <p>
              No NOTES found for{" "}
              <strong>
                {book.title} {book.title2}
              </strong>
              .{" "}
            </p>
            <p className="mb-0">
              Reading the book was so effortless that no notes were taken.{" "}
            </p>
            <div className="btn btn-warning" onClick={handleReadSessionsClick}>
              Check out Reading Sessions
            </div>
          </div>
        </div>
      )}
      <ScrollToRef scrollRef={boardRef} />
    </Board>
  );
};

export default BookNotes;
