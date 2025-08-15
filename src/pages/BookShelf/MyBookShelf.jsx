// src/pages/BookShelf/MyBooks.jsx
import books from "../../data/books/books.json";
import BookShelf from "../../components/bookShelf/BookShelf";
import HideBtnsContext from "../../components/bookShelf/HideBtnsContext";

const MyBookShelf = () => {
  return (
    <HideBtnsContext.Provider value={{ hideEditDelete: true }}>
      <BookShelf books={books} title="Book Shelf" />
    </HideBtnsContext.Provider>
  );
};

export default MyBookShelf;
