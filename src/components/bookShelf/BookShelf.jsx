import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Board from "../Board";
import { getTagColor as defaultGetTagColor } from "../../utils/TagColors";
import { hexToRgb } from "../../utils/HexToRBG";
import { GridView, DetailedView, TableView } from "./BookShelfLayouts";
import { useTheme } from "../../ThemeContext";

const BookShelf = ({
  books,
  title = "Book Shelf",
  paramGetTagColor,
  titleRight = null,
  deleteBook,
  onEditBook,
  hideTimeTracker,
}) => {
  const getTagColor = paramGetTagColor || defaultGetTagColor;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Add layout state
  const [layout, setLayout] = useState(searchParams.get("layout") || "grid");

  const [selectedShelf, setSelectedShelf] = useState(() => {
    const urlShelf = searchParams.get("shelf");
    if (urlShelf) {
      return urlShelf; // Use URL parameter if it exists
    }

    if (searchParams.get("view") === "all") {
      return null;
    }

    // Check if "currently-reading" exists in the books
    const hasCurrentlyReading = books.some(
      (book) => book.shelves && book.shelves.includes("currently-reading")
    );

    return hasCurrentlyReading ? "currently-reading" : null;
  });
  const [selectedTags, setSelectedTags] = useState(() => {
    const tagParam = searchParams.get("tags");

    return tagParam ? new Set(tagParam.split(",")) : new Set();
  });

  // Get all unique shelves for the filter dropdown/buttons
  const allShelves = useMemo(() => {
    const shelfSet = new Set();
    books.forEach((book) => {
      if (book.shelves) {
        book.shelves.forEach((shelf) => {
          shelfSet.add(shelf.trim());
        });
      }
    });
    return Array.from(shelfSet).sort();
  }, [books]);

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
  }, [books]);

  // Filter books based on selected shelf
  const filteredShelfBooks = useMemo(() => {
    if (!selectedShelf) {
      return books; // Show all books if no filter
    }
    return books.filter((book) => {
      if (!book.shelves) return false;
      return book.shelves.includes(selectedShelf);
    });
  }, [selectedShelf, books]);

  const filteredBooks = useMemo(() => {
    if (selectedTags.size === 0) {
      return filteredShelfBooks;
    }
    return filteredShelfBooks.filter((book) => {
      if (!book.tags) return false;
      return [...selectedTags].every((tag) => book.tags.includes(tag));
    });
  }, [selectedTags, filteredShelfBooks]);

  useEffect(() => {
    const params = new URLSearchParams();

    params.set("layout", layout);

    if (selectedShelf) {
      params.set("shelf", selectedShelf);
    } else {
      params.set("view", "all");
    }

    if (selectedTags.size > 0) {
      params.set("tags", Array.from(selectedTags).join(","));
    }

    setSearchParams(params, { replace: true });
  }, [layout, selectedShelf, selectedTags, setSearchParams]);

  const handleTimeTrackerClick = () => {
    navigate("./time-tracker");
  };

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

  const renderBooks = () => {
    const props = {
      books: filteredBooks,
      onShelfClick: handleShelfClick,
      onTagClick: handleTagClick,
      selectedTags: selectedTags,
      paramGetTagColor: getTagColor,
      deleteBook: deleteBook,
      onEditBook: onEditBook,
    };

    switch (layout) {
      case "detailed":
        return <DetailedView {...props} />;
      case "table":
        return <TableView {...props} />;
      case "grid":
      default:
        return <GridView {...props} />;
    }
  };

  const displayTitle = selectedShelf ? `${title} - ${selectedShelf}` : title;
  return (
    <Board
      title={displayTitle}
      titleRight={
        <div className="d-flex gap-2 align-items-center">
          {titleRight}
          {!hideTimeTracker && (
            <button
              className="btn btn-outline-info"
              onClick={handleTimeTrackerClick}>
              📈 View Time Tracker →
            </button>
          )}
        </div>
      }>
      {/* Layout Selector */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex justify-content-center">
            <div className="btn-group" role="group" aria-label="Layout options">
              <button
                className={`btn ${
                  layout === "grid" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setLayout("grid")}>
                <i className="fas fa-th-large me-1"></i>
                🏁 Grid View
              </button>
              <button
                className={`btn ${
                  layout === "detailed" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setLayout("detailed")}>
                <i className="fas fa-list me-1"></i>
                📖 Detailed View
              </button>
              <button
                className={`btn ${
                  layout === "table" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setLayout("table")}>
                <i className="fas fa-table me-1"></i>
                📋 Table View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="row mb-4">
        <div className="col-12">
          <div
            className={`d-flex flex-wrap align-items-center gap-2 p-3 rounded ${
              theme === "light" ? "bg-light" : "bg-dark"
            }`}>
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
                (book) => book.shelves && book.shelves.includes(shelf)
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
          {/* Tags Filter - Only show in non-table view to save space */}
          <div
            className={`d-flex flex-wrap align-items-center gap-2 p-3 rounded ${
              theme === "light" ? "bg-light" : "bg-dark"
            }`}>
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
          {(selectedShelf || selectedTags.size > 0) && (
            <div className="mt-2">
              <div
                className={`alert d-flex justify-content-between align-items-center mb-0 ${
                  theme === "light" ? "alert-info" : "alert-dark"
                }`}>
                <span>
                  <strong>Showing {filteredBooks.length} book(s)</strong>
                  {selectedShelf && (
                    <>
                      {" from shelf: "}
                      <strong>
                        <em>{selectedShelf}</em>
                      </strong>
                    </>
                  )}
                  {selectedTags.size > 0 && (
                    <>
                      {" with tags: "}
                      <strong>
                        <em>{Array.from(selectedTags).join(", ")}</em>
                      </strong>
                    </>
                  )}
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

      {/* Books Display */}
      <div className="row">
        <div className="col-12">
          {filteredBooks.length > 0 ? (
            renderBooks()
          ) : (
            <div className="text-center py-5">
              <h5>No books found in this filter</h5>
              <button className="btn btn-primary mt-2" onClick={clearFilter}>
                Show All Books
              </button>
            </div>
          )}
        </div>
      </div>
    </Board>
  );
};

export default BookShelf;
