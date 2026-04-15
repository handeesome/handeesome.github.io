import { getTagColor as defaultGetTagColor } from "../../utils/TagColors";
import { useTheme } from "../../ThemeContext";
import BookDetailed from "./BookDetailed";
import BookCard from "./BookCard";
import BookRow from "./BookRow";
import { useHideBtns } from "./HideBtnsContext";

// Layout 1: Grid View - Simple covers with basic info
export const GridView = ({
  books,
  onShelfClick,
  onTagClick,
  selectedTags,
  paramGetTagColor,
  deleteBook,
  onEditBook,
}) => {
  const getTagColor = paramGetTagColor || defaultGetTagColor;
  const { theme } = useTheme();

  return (
    <div className="container">
      <div className="row g-3 mb-3">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onShelfClick={onShelfClick}
            onTagClick={onTagClick}
            selectedTags={selectedTags}
            getTagColor={getTagColor}
            onEditBook={onEditBook}
            deleteBook={deleteBook}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
};

// Layout 2: Detailed View - Your existing detailed cards
export const DetailedView = ({
  books,
  onShelfClick,
  onTagClick,
  selectedTags,
  paramGetTagColor,
  deleteBook,
  onEditBook,
}) => {
  return (
    <div className="bookshelf">
      {books.map((book) => (
        <BookDetailed
          key={book.id}
          id={book.id}
          title={book.title}
          title2={book.title2}
          author={book.author}
          numPages={book["num pages"]}
          avgRating={book["avg rating"]}
          shelves={book.shelves}
          tags={book.tags}
          dateStarted={book["date started"]}
          dateRead={book["date read"]}
          dateAdded={book["date added"]}
          onShelfClick={onShelfClick}
          onTagClick={onTagClick}
          selectedTags={selectedTags}
          paramGetTagColor={paramGetTagColor}
          coverBase64={book.coverBase64}
          notes={book.notes}
          deleteBook={deleteBook}
          onEditBook={onEditBook}
        />
      ))}
    </div>
  );
};

// Layout 3: Table View - Compact table format
export const TableView = ({
  books,
  onShelfClick,
  onTagClick,
  selectedTags,
  paramGetTagColor,
  deleteBook,
  onEditBook,
}) => {
  const { theme } = useTheme();
  const { hideActions } = useHideBtns();

  return (
    <div className="table-responsive">
      <table
        className={`table table-hover align-middle ${
          theme === "dark" ? "table-dark" : ""
        }`}
      >
        <thead className="table-dark sticky-top">
          <tr>
            <th style={{ width: "31%" }}>Title & Author</th>
            {/* <th style={{ width: "12%" }}>Rating</th> */}
            <th style={{ width: "8%" }}>Pages</th>
            <th style={{ width: "18%" }}>Shelf</th>
            <th style={{ width: "18%" }}>Tags</th>
            <th style={{ width: hideActions ? "25%" : "15%" }}>Dates</th>
            {!hideActions && <th style={{ width: "10%" }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <BookRow
              key={book.id}
              book={book}
              onShelfClick={onShelfClick}
              onTagClick={onTagClick}
              selectedTags={selectedTags}
              paramGetTagColor={paramGetTagColor}
              deleteBook={deleteBook}
              onEditBook={onEditBook}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
