import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import Board from "../../../profile/components/Board";
import { getTagColor as defaultGetTagColor } from "../../../../utils/tagColors";
import { GridView, DetailedView, TableView } from "./BookShelfLayouts";
import { useTheme } from "../../../../contexts/ThemeContext";
import GoBackBtn from "../../../../components/GoBackButton";
import { useHideBtns } from "../../../../contexts/HideBtnsContext";
import CollectionFilters from "../../components/CollectionFilters";
import CollectionLayoutSwitch from "../../components/CollectionLayoutSwitch";
import "./BookShelf.css";

const setsEqual = (firstSet, secondSet) => {
  if (firstSet.size !== secondSet.size) return false;
  return [...firstSet].every((value) => secondSet.has(value));
};

const BookShelf = ({
  books = [],
  title = "Bookshelf",
  paramGetTagColor,
  titleRight = null,
  collectionSwitch = null,
  deleteBook,
  onEditBook,
  loading = false,
}) => {
  const getTagColor = paramGetTagColor || defaultGetTagColor;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { hideTimeTracker } = useHideBtns();
  const [isInitialMount, setIsInitialMount] = useState(true);
  const previousSearchRef = useRef(location.search);
  const syncingFromUrlRef = useRef(false);

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

  useEffect(() => {
    if (location.search === previousSearchRef.current) return;

    previousSearchRef.current = location.search;

    const urlParams = new URLSearchParams(location.search);
    const nextLayout = urlParams.get("layout");
    const hasUrlShelf = urlParams.has("shelf");
    const hasViewAll = urlParams.get("view") === "all";
    const urlControlsBookshelf =
      urlParams.has("layout") ||
      hasUrlShelf ||
      hasViewAll ||
      urlParams.has("tags");
    let changedFromUrl = false;

    if (nextLayout && nextLayout !== layout) {
      setLayout(nextLayout);
      changedFromUrl = true;
    }

    if (hasUrlShelf || hasViewAll) {
      const nextShelf = hasUrlShelf ? urlParams.get("shelf") : null;
      if (nextShelf !== selectedShelf) {
        setSelectedShelf(nextShelf);
        changedFromUrl = true;
      }
    }

    if (urlControlsBookshelf) {
      const tagParam = urlParams.get("tags");
      const nextTags = tagParam ? new Set(tagParam.split(",")) : new Set();

      if (!setsEqual(nextTags, selectedTags)) {
        setSelectedTags(nextTags);
        changedFromUrl = true;
      }
    }

    if (changedFromUrl) {
      syncingFromUrlRef.current = true;
    }
  }, [layout, location.search, selectedShelf, selectedTags]);

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

  const tagCounts = useMemo(() => {
    const counts = new Map();

    allTags.forEach((tag) => {
      const count = filteredBooks.filter(
        (book) => book.tags && book.tags.includes(tag)
      ).length;
      counts.set(tag, count);
    });

    return counts;
  }, [filteredBooks, allTags]);

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    if (selectedShelf) {
      setSelectedTags(new Set());
    }
  }, [selectedShelf]);

  useEffect(() => {
    if (syncingFromUrlRef.current) {
      syncingFromUrlRef.current = false;
      return;
    }

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

    const nextSearch = params.toString();

    if (nextSearch !== searchParams.toString()) {
      navigate(
        {
          pathname: location.pathname,
          search: `?${nextSearch}`,
          hash: location.hash,
        },
        {
          replace: true,
          state: location.state,
          preventScrollReset: true,
        }
      );
    }
  }, [
    layout,
    location.hash,
    location.pathname,
    location.state,
    navigate,
    searchParams,
    selectedShelf,
    selectedTags,
  ]);

  useEffect(() => {
    if (loading || !location.hash) return;

    const scrollToHash = () => {
      const target = document.getElementById(
        decodeURIComponent(location.hash.slice(1)),
      );
      if (!target) return;

      const navbar = document.querySelector(".navbar.fixed-top");
      const navbarHeight = navbar?.getBoundingClientRect().height ?? 0;
      const scrollBuffer = 72;
      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight -
        scrollBuffer;

      window.scrollTo({ top: targetTop, behavior: "smooth" });
      navigate(
        {
          pathname: location.pathname,
          search: location.search,
          hash: "",
        },
        {
          replace: true,
          state: location.state,
          preventScrollReset: true,
        },
      );
    };

    const timeoutId = window.setTimeout(scrollToHash, 100);
    return () => window.clearTimeout(timeoutId);
  }, [
    filteredBooks,
    layout,
    loading,
    location.hash,
    location.pathname,
    location.search,
    location.state,
    navigate,
  ]);

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

  const BookShelfTitleLoading = () => (
    <div
      className={`bookshelf-title-loading ${
        theme === "dark" ? "bookshelf-loading-dark" : ""
      }`}
      aria-label="Loading bookshelf title">
      <span className="bookshelf-skeleton bookshelf-title-skeleton" />
      <span className="bookshelf-loading-dot" />
      <span className="bookshelf-loading-dot" />
      <span className="bookshelf-loading-dot" />
    </div>
  );

  const BookShelfBooksLoading = () => (
    <div
      className={`bookshelf-loading-section ${
        theme === "dark" ? "bookshelf-loading-dark" : ""
      }`}
      aria-hidden="true">
      <div className="bookshelf-loading-toolbar">
        <span className="bookshelf-skeleton bookshelf-filter-skeleton wide" />
        <span className="bookshelf-skeleton bookshelf-filter-skeleton" />
        <span className="bookshelf-skeleton bookshelf-filter-skeleton" />
      </div>
      <div className="row g-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="col-md-3 col-sm-6" key={index}>
            <div className="bookshelf-loading-card">
              <span className="bookshelf-skeleton bookshelf-cover-skeleton" />
              <span className="bookshelf-skeleton bookshelf-line-skeleton" />
              <span className="bookshelf-skeleton bookshelf-line-skeleton short" />
              <div className="bookshelf-loading-tags">
                <span className="bookshelf-skeleton bookshelf-pill-skeleton" />
                <span className="bookshelf-skeleton bookshelf-pill-skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const displayTitle = loading ? (
    <BookShelfTitleLoading />
  ) : selectedShelf ? (
    `${title} - ${selectedShelf}`
  ) : (
    title
  );
  return (
    <Board
      title={displayTitle}
      titleRight={
        <div className="d-flex gap-2 align-items-center">
          <GoBackBtn
            defaultDest="/library"
            text="Back to Library"
            preferDefaultDest
          />

          {titleRight}
          {!hideTimeTracker && (
            <button
              className="btn btn-warning"
              onClick={handleTimeTrackerClick}>
              📈 View Time Tracker →
            </button>
          )}
        </div>
      }>
      {loading ? (
        <div aria-busy="true" aria-live="polite">
          <span className="visually-hidden">Loading bookshelf...</span>
          <BookShelfBooksLoading />
        </div>
      ) : (
        <>
          {collectionSwitch && (
            <div className="row mb-2">
              <div className="col-12">{collectionSwitch}</div>
            </div>
          )}
          <CollectionLayoutSwitch layout={layout} onChange={setLayout} />

          <CollectionFilters
            allItems={books}
            allLabel="All Books"
            itemLabel="book"
            filteredCount={filteredBooks.length}
            selectedShelf={selectedShelf}
            selectedTags={selectedTags}
            allShelves={allShelves}
            allTags={allTags}
            tagCounts={tagCounts}
            getTagColor={getTagColor}
            onShelfClick={handleShelfClick}
            onTagClick={handleTagClick}
            onClearFilter={clearFilter}
            theme={theme}
          />

          {/* Books Display */}
          <div className="row">
            <div className="col-12">
              {filteredBooks.length > 0 ? (
                renderBooks()
              ) : (
                <div className="text-center py-5">
                  <h5>No books found in this filter</h5>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={clearFilter}>
                    Show All Books
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Board>
  );
};

export default BookShelf;
