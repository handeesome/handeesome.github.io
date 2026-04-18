import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Board from "../../components/Board";
import BookTimeAnalytics from "../../features/bookshelf/components/BookTimeAnalytics";
import books from "../../data/books/books.json";
import BookInfoHeader from "../../features/bookshelf/components/BookInfoHeader";
import ScrollToRef from "../../components/ScrollToRef";

const BookAnalytics = () => {
  const { bookId } = useParams(); // Get book ID from URL
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const boardRef = useRef(null);

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
      <Board title="Loading Analytics..." ref={boardRef}>
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
    <Board title={`Time Analytics - ${book.title}`} ref={boardRef}>
      {/* Book Info Header */}
      <BookInfoHeader book={book} />

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
      <ScrollToRef scrollRef={boardRef} />
    </Board>
  );
};

export default BookAnalytics;
