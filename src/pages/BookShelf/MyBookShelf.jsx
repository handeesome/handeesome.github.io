// src/pages/BookShelf/MyBooks.jsx
import books from "../../data/books/books.json";
import BookShelf from "../../features/bookshelf/components/BookShelf";
import HideBtnsContext from "../../contexts/HideBtnsContext";
import GoBackBtn from "../../components/GoBackButton";

const MyBookShelf = () => {
  return (
    <HideBtnsContext.Provider value={{ hideEditDelete: true }}>
      <BookShelf books={books} title="Book Shelf" />
    </HideBtnsContext.Provider>
  );
};

export default MyBookShelf;
