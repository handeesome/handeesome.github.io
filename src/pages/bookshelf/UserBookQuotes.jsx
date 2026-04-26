import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
      .split(/\n{2,}/)
      .map((quote) => quote.trim())
      .filter(Boolean);
  }

  return [];
};

const UserBookQuotes = () => {
  const { userName, bookId } = useParams();
  const navigate = useNavigate();
  const boardRef = useRef(null);
  const [book, setBook] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Board title={`QUOTES FROM ${book.title}`} ref={boardRef}>
      <BookInfoHeader book={book} />

      {quotes.length > 0 ? (
        quotes.map((quote, index) => (
          <div key={`${book.id}-${index}`} className="d-flex mb-3 align-items-center">
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
