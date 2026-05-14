// src/pages/BookShelf/MyBooks.jsx
import books from "../../static/books/books.json";
import BookShelf from "../../features/library/bookshelf/components/BookShelf";
import HideBtnsContext from "../../contexts/HideBtnsContext";

const StaticBookshelf = ({
  title = "Bookshelf",
  titleRight = null,
  collectionSwitch = null,
} = {}) => {
  return (
    <HideBtnsContext.Provider value={{ hideEditDelete: true }}>
      <BookShelf
        books={books}
        title={title}
        titleRight={titleRight}
        collectionSwitch={collectionSwitch}
      />
    </HideBtnsContext.Provider>
  );
};

export default StaticBookshelf;
