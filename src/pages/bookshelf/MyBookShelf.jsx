// src/pages/BookShelf/MyBooks.jsx
import books from "../../static/books/books.json";
import BookShelf from "../../features/bookshelf/components/BookShelf";
import HideBtnsContext from "../../contexts/HideBtnsContext";

const MyBookShelf = () => {
  return (
    <HideBtnsContext.Provider value={{ hideEditDelete: true }}>
      <BookShelf books={books} title="Book Shelf" />
    </HideBtnsContext.Provider>
  );
};

export default MyBookShelf;
