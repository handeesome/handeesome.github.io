import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import parse from "html-react-parser";
import Board from "../../features/profile/components/Board";
import BookInfoHeader from "../../features/bookshelf/components/BookInfoHeader";
import BookQuote from "../../features/bookshelf/components/BookQuote";
import ScrollToRef from "../../components/ScrollToRef";
import { getBookById } from "../../services/books.service";
import { getEmailFromDisplayName } from "../../utils/userUtils";

const normalizeQuotes = (quotes) => {
  if (Array.isArray(quotes)) {
    return quotes.filter(Boolean);
  }

  if (typeof quotes === "string") {
    return quotes
      .split("\n")
      .map((quote) => quote.trim())
      .filter(Boolean);
  }

  return [];
};

const hasRenderableNotes = (notes) =>
  typeof notes === "string" &&
  notes
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim().length > 0;

const UserBookQuotes = () => {
  const { userName, bookId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const boardRef = useRef(null);
  const notesRef = useRef(null);
  const [book, setBook] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [showNotesToggle, setShowNotesToggle] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchBook = async () => {
      setLoading(true);

      try {
        const [email, fetchedBook] = await Promise.all([
          getEmailFromDisplayName(userName),
          getBookById(bookId),
        ]);

        if (cancelled) return;

        if (!email || !fetchedBook || fetchedBook.userEmail !== email) {
          navigate(`/book-shelf/${userName}`, { replace: true });
          return;
        }

        setBook(fetchedBook);
        setQuotes(normalizeQuotes(fetchedBook.quotes));
        setNotesExpanded(false);
      } catch (err) {
        console.error("UserBookQuotes fetchBook:", err);
        if (!cancelled) navigate(`/book-shelf/${userName}`, { replace: true });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBook();

    return () => {
      cancelled = true;
    };
  }, [bookId, navigate, userName]);

  useEffect(() => {
    if (loading || !location.hash) return;

    const timeoutId = window.setTimeout(() => {
      const target = document.getElementById(
        decodeURIComponent(location.hash.slice(1)),
      );
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [loading, location.hash, quotes]);

  useLayoutEffect(() => {
    const el = notesRef.current;
    if (!el) return;

    const needsToggle = el.scrollHeight > el.clientHeight + 10;
    setShowNotesToggle(needsToggle);
  }, [book?.notes, notesExpanded]);

  if (loading || !book) {
    return (
      <Board title="Loading Quotes..." ref={boardRef}>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <ScrollToRef scrollRef={boardRef} />
      </Board>
    );
  }

  const hasNotes = hasRenderableNotes(book.notes);

  return (
    <Board title={`QUOTES FROM ${book.title}`} ref={boardRef}>
      <BookInfoHeader book={book} />

      {hasNotes && (
        <div className="card mb-4 description-card">
          <div className="card-body p-4">
            <h5
              className="card-title"
              style={{ borderLeft: "3px solid #007bff", paddingLeft: "10px" }}
            >
              Book Notes
            </h5>
            <div
              className={`card-text ${
                !notesExpanded ? "line-clamp-content" : ""
              }`}
              ref={notesRef}
            >
              <div className="rendered-content">{parse(book.notes)}</div>
            </div>
            {showNotesToggle && (
              <div className="text-end mb-3">
                <button
                  onClick={() => setNotesExpanded((prev) => !prev)}
                  className="btn btn-outline-secondary btn-sm mt-2 show-more-btn"
                >
                  {notesExpanded ? "▲ Show Less" : "▼ Show More"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {quotes.length > 0 ? (
        quotes.map((quote, index) => (
          <div
            id={`quote-${index}`}
            key={`${book.id}-${index}`}
            className="d-flex mb-3 align-items-center"
            style={{ scrollMarginTop: "2rem" }}
          >
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
            <BookQuote>{quote}</BookQuote>
          </div>
        ))
      ) : (
        <div style={{ width: "100%", minHeight: 400 }}>
          <div className="alert alert-info text-center">
            <h4>No Quotes Found</h4>
            <p>
              No quotes have been added for{" "}
              <strong>
                {book.title} {book.title2}
              </strong>
              .
            </p>
          </div>
        </div>
      )}

      <ScrollToRef scrollRef={boardRef} />
    </Board>
  );
};

export default UserBookQuotes;
