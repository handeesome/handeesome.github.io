import { useState, useMemo } from "react";
import Board from "../components/Board";
import TogglChart from "../components/bookShelf/TogglChart";
import books from "../data/books/books.json";
import Book from "../components/bookShelf/Book";
import { getTagColor } from "../util/TagColors";
import { hexToRgb } from "../util/HexToRBG";

const Books = ({ books, onShelfClick, onTagClick, selectedTags }) => {
  return (
    <div className="bookshelf">
      {books.map((book) => (
        <Book
          key={book.id}
          id={book.id}
          title={book.title}
          title2={book.title2}
          author={book.author}
          numPages={book["num pages"]}
          avgRating={book["avg rating"]}
          shelves={book.shelves}
          tags={book.tags}
          introduction={book.introduction}
          dateStarted={book["date started"]}
          dateRead={book["date read"]}
          dateAdded={book["date added"]}
          onShelfClick={onShelfClick}
          onTagClick={onTagClick}
          selectedTags={selectedTags}
        />
      ))}
    </div>
  );
};

const BookLists = () => {
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [selectedTags, setSelectedTags] = useState(new Set());

  // Get all unique shelves for the filter dropdown/buttons
  const allShelves = useMemo(() => {
    const shelfSet = new Set();
    books.forEach((book) => {
      if (book.shelves) {
        book.shelves.split(",").forEach((shelf) => {
          shelfSet.add(shelf.trim());
        });
      }
    });
    return Array.from(shelfSet).sort();
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    books.forEach((book) => {
      if (book.tags) {
        book.tags.map((tag) => {
          tagSet.add(tag.trim());
        });
      }
    });
    return Array.from(tagSet).sort();
  });

  // Filter books based on selected shelf
  const filteredShelfBooks = useMemo(() => {
    if (!selectedShelf) {
      return books; // Show all books if no filter
    }
    return books.filter((book) => {
      if (!book.shelves) return false;
      const bookShelves = book.shelves.split(",").map((shelf) => shelf.trim());
      return bookShelves.includes(selectedShelf);
    });
  }, [selectedShelf]);

  const filteredBooks = useMemo(() => {
    if (selectedTags.size === 0) {
      return filteredShelfBooks;
    }
    return filteredShelfBooks.filter((book) => {
      if (!book.tags) return false;
      return [...selectedTags].every((tag) => book.tags.includes(tag));
    });
  }, [selectedTags, filteredShelfBooks]);

  const handleShelfClick = (shelf) => {
    setSelectedShelf(shelf);
  };

  const handleTagClick = (tag) => {
    if (selectedTags.has(tag)) {
      setSelectedTags((prev) => {
        const newTags = new Set(prev);
        newTags.delete(tag);
        return newTags;
      });
    } else {
      setSelectedTags((prev) => new Set(prev).add(tag));
    }
  };

  const clearFilter = () => {
    setSelectedShelf(null);
    setSelectedTags(new Set());
  };

  const title = selectedShelf ? `Book Shelf - ${selectedShelf}` : "Book Shelf";

  return (
    <Board title={title}>
      {/* Filter Controls */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-wrap align-items-center gap-2 p-3 bg-light rounded">
            <strong>Filter by shelf:</strong>

            {/* All Books Button */}
            <button
              className={`btn btn-sm ${
                !selectedShelf ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={clearFilter}>
              All Books ({books.length})
            </button>

            {/* Shelf Filter Buttons */}
            {allShelves.map((shelf) => {
              const shelfCount = books.filter(
                (book) =>
                  book.shelves &&
                  book.shelves
                    .split(",")
                    .map((s) => s.trim())
                    .includes(shelf)
              ).length;

              return (
                <button
                  key={shelf}
                  className={`btn btn-sm ${
                    selectedShelf === shelf
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => handleShelfClick(shelf)}>
                  {shelf} ({shelfCount})
                </button>
              );
            })}
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2 p-3 bg-light rounded">
            <strong>Filter by tags:</strong>
            {allTags.map((tag) => {
              const tagBooks = filteredShelfBooks || books;
              const tagCount = tagBooks.filter(
                (book) => book.tags && book.tags.includes(tag)
              ).length;

              return (
                <button
                  key={tag}
                  className={`btn btn-sm book-tag ${
                    selectedTags.has(tag) ? "selected" : ""
                  }`}
                  style={{
                    "--tag-color": getTagColor(tag),
                    "--tag-color-rgb": hexToRgb(getTagColor(tag)),
                  }}
                  onClick={() => handleTagClick(tag)}>
                  {tag} ({tagCount})
                </button>
              );
            })}
          </div>

          {/* Current Filter Status */}
          {selectedShelf && (
            <div className="mt-2">
              <div className="alert alert-info d-flex justify-content-between align-items-center mb-0">
                <span>
                  <strong>Showing {filteredBooks.length} book(s)</strong> from
                  shelf:{" "}
                  <strong>
                    <em>{selectedShelf}</em>
                  </strong>{" "}
                  that relates to{" "}
                  <strong>
                    <em>{Array.from(selectedTags).join(", ")}</em>
                  </strong>
                  {"."}
                </span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={clearFilter}>
                  Clear Filter ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Books List */}
      {filteredBooks.length > 0 ? (
        <Books
          books={filteredBooks}
          onShelfClick={handleShelfClick}
          onTagClick={handleTagClick}
          selectedTags={selectedTags}
        />
      ) : (
        <div className="text-center py-5">
          <h5>No books found in this filter</h5>
          <button className="btn btn-primary mt-2" onClick={clearFilter}>
            Show All Books
          </button>
        </div>
      )}

      {/* Optional: TogglChart component - you can uncomment if needed */}
      {/* <TogglChart /> */}
    </Board>
  );
};

export default BookLists;
