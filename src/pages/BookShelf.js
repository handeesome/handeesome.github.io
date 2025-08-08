import Board from "../components/Board";
import TogglChart from "../components/TogglChart";
import books from "../data/books/books.json";
import Book from "../components/Book";

const Books = () => {
  return (
    <div className="bookshelf">
      {books.map((book) => (
        <Book
          id={book.key}
          title={book.title}
          title2={book.title2}
          author={book.author}
          numPages={book["num pages"]}
          avgRating={book["avg rating"]}
          shelves={book.shelves}
          introduction={book.introduction}
          dateStarted={book["date started"]}
          dateRead={book["date read"]}
          dateAdded={book["date added"]}
        />
      ))}
    </div>
  );
};
const BookLists = () => {
  const title = "Book Shelf";
  return (
    <Board title={title}>
      <Books />
    </Board>
  );
};
export default BookLists;
