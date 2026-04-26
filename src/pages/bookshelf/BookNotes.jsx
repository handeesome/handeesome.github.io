import Board from "../../features/profile/components/Board";
import bookQuotes from "../../static/books/book-quotes.json";
import BookQuote from "../../features/bookshelf/components/BookQuote";
import bookDescription from "../../static/books/introductions.json";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BookInfoHeader from "../../features/bookshelf/components/BookInfoHeader";
import books from "../../static/books/books.json";
import { useState, useEffect, useRef } from "react";
import ScrollToRef from "../../components/ScrollToRef";

const BookNotes = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const boardRef = useRef(null);

  const quotesEntry = bookQuotes[bookId];
  const bookTitle = quotesEntry
    ? quotesEntry[0]
    : book?.title || "Unknown Book";
  const quotes = quotesEntry ? quotesEntry[1] : [];

  const description = bookDescription[bookId] || "No description available.";

  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    // If your content includes images/fonts, you can also wrap in requestAnimationFrame
    const needsToggle = el.scrollHeight > el.clientHeight + 10;
    setShowToggle(needsToggle);
  }, [description, book]);

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

  useEffect(() => {
    if (!book || !location.hash) return;

    const timeoutId = window.setTimeout(() => {
      const target = document.getElementById(
        decodeURIComponent(location.hash.slice(1)),
      );
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [book, location.hash]);

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
      <div className="card mb-4 description-card">
        <div className="card-body p-4">
          <h5
            className="card-title"
            style={{ borderLeft: "3px solid #007bff", paddingLeft: "10px" }}
          >
            Book Description
          </h5>
          <div
            className={`card-text ${!expanded ? "line-clamp-content" : ""}`}
            style={{ whiteSpace: "pre-line" }}
            ref={textRef}
          >
            {description}
          </div>
          {showToggle && (
            <div className="text-end mb-3">
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="btn btn-outline-secondary btn-sm mt-2 show-more-btn"
              >
                {expanded ? "▲ Show Less" : "▼ Show More"}
              </button>
            </div>
          )}
        </div>
      </div>
      {quotes.length > 0 ? (
        quotes.map((note, index) => (
          <div
            id={`quote-${index}`}
            key={index}
            className="d-flex mb-3 align-items-center"
            style={{ scrollMarginTop: "2rem" }}>
            <div
              className="d-flex justify-content-center align-items-center bg-primary text-white fw-bold me-3"
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "0.25rem",
                flexShrink: 0,
              }}
            >
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
