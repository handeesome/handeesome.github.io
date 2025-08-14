// src/pages/BookShelf/MyBooks.jsx
import books from "../../data/books/books.json";
import BookShelf from "../../components/bookShelf/BookShelf";

const MyBookShelf = () => {
  return <BookShelf books={books} title="Book Shelf" />;
};

export default MyBookShelf;
