import { useState, useRef, useLayoutEffect } from "react";
import parse from "html-react-parser";
import { marked } from "marked";
import StarRating from "./StarRating";
import { getTagColor as defaultGetTagColor } from "../../utils/TagColors";
import { hexToRgb } from "../../utils/HexToRBG";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../ThemeContext";
import { useHideBtns } from "./HideBtnsContext";
import BookQuotes from "../../data/books/book-quotes.json";
import Introductions from "../../data/books/introductions.json";

const BookDetailed = ({
  id,
  title,
  title2,
  author,
  numPages,
  avgRating,
  shelves,
  tags,
  dateStarted,
  dateRead,
  dateAdded,
  onShelfClick,
  onTagClick,
  selectedTags,
  paramGetTagColor,
  coverBase64,
  notes,
  deleteBook,
  onEditBook,
}) => {
  const getTagColor = paramGetTagColor || defaultGetTagColor;
  const introduction = marked(Introductions[id] ?? notes ?? "");
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const textRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { hideEditDelete, hideSessions } = useHideBtns();

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    // If your content includes images/fonts, you can also wrap in requestAnimationFrame
    const needsToggle = el.scrollHeight > el.clientHeight + 10;
    setShowToggle(needsToggle);
  }, [introduction]);

  const shelfArray = shelves ? shelves.map((shelf) => shelf.trim()) : [];

  const handleShelfClick = (shelf) => {
    if (onShelfClick) {
      onShelfClick(shelf);
    }
  };

  const handleReadSessionsClick = () => {
    navigate(`/book-shelf/book/${id}/analytics`);
  };

  const handleViewNotesClick = () => {
    navigate(`/book-shelf/book/${id}/notes`);
  };

  const handleDeleteBook = (bookId) => {
    deleteBook(bookId);
  };
  return (
    <div
      className={`card mb-4 shadow-sm ${theme === "light" ? "" : "bg-dark"}`}
    >
      <div className="row g-0">
        {/* BookDetailed Cover */}
        <div className="col-md-4 d-flex justify-content-center mt-4">
          <img
            src={
              coverBase64 ||
              `/images/bookCovers/${id}.jpg` ||
              "/default-cover.jpg"
            }
            alt={title}
            className="fixed-img rounded-start"
            onError={(e) =>
              (e.currentTarget.src = coverBase64 || "/default-cover.jpg")
            }
          />
        </div>

        {/* BookDetailed Info */}
        <div className="col-md-8 ">
          <div className="card-body d-flex flex-column justify-content-between h-100">
            <div>
              <h5 className="card-title">{title}</h5>
              {title2 && <h5 className="card-title text-muted">{title2}</h5>}
              <h6 className="card-subtitle mb-3 text-muted">by {author}</h6>

              <div className="row justify-content-between align-items-start mb-3">
                {/* BookDetailed Metadata */}
                <div className="col-md-auto">
                  <div className="mb-2">
                    <p className="mb-1">
                      <strong>Pages:</strong> {numPages}
                    </p>

                    {/* <div className="mb-1 d-flex align-items-center gap-2">
                      <strong>Rating:</strong>
                      <StarRating
                        rating={avgRating}
                        size="sm"
                        showText={true}
                      />
                    </div> */}

                    <div className="mb-1">
                      <strong>Shelf:</strong>{" "}
                      {shelfArray.map((shelf, index) => (
                        <span key={shelf}>
                          <button
                            className="btn btn-outline-primary btn-sm mx-1 book-tag"
                            onClick={() => handleShelfClick(shelf)}
                          >
                            {shelf}
                          </button>
                          {index < shelfArray.length - 1 && " "}
                        </span>
                      ))}
                    </div>
                    <div className="mb-1">
                      <strong>Tags:</strong>{" "}
                      {tags &&
                        tags.map((tag, index) => {
                          const isSelected =
                            selectedTags && selectedTags.has(tag);
                          const tagColor = getTagColor(tag);
                          return (
                            <span key={tag}>
                              <button
                                className={`btn btn-sm mx-1 book-tag ${
                                  isSelected ? "selected" : ""
                                }`}
                                style={{
                                  "--tag-color": tagColor,
                                  "--tag-color-rgb": hexToRgb(tagColor),
                                }}
                                onClick={() => onTagClick && onTagClick(tag)}
                              >
                                {tag} {isSelected && " ✓"}
                              </button>
                              {index < tags.length - 1 && " "}
                            </span>
                          );
                        })}
                    </div>

                    {/* Dates Grid */}
                    <div className="book-dates">
                      <span className="book-date-label">Date Started:</span>
                      <span className="book-date-value">
                        {dateStarted || "N/A"}
                      </span>

                      <span className="book-date-label">Date Finished:</span>
                      <span className="book-date-value">
                        {dateRead || "N/A"}
                      </span>

                      <span className="book-date-label">Date Added:</span>
                      <span className="book-date-value">
                        {dateAdded || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-md-auto d-flex flex-column gap-2 mt-2 mt-md-0">
                  {!hideEditDelete && (
                    <>
                      <button
                        className="btn btn-outline-warning btn-lg"
                        onClick={() => onEditBook && onEditBook(id)}
                      >
                        Edit Book
                      </button>
                      <button
                        className="btn btn-outline-danger btn-lg"
                        onClick={() => {
                          handleDeleteBook(id);
                        }}
                      >
                        Delete Book
                      </button>
                    </>
                  )}
                  {!hideSessions && (
                    <>
                      <button
                        className="btn btn-outline-info btn-lg"
                        onClick={handleReadSessionsClick}
                      >
                        Reading Sessions
                      </button>
                      <button
                        className="btn btn-outline-warning btn-lg"
                        onClick={handleViewNotesClick}
                      >
                        View {BookQuotes[id]?.[1]?.length || 0} Notes
                      </button>
                    </>
                  )}
                  {shelfArray.some(
                    (shelf) => shelf.toLowerCase() === "finished",
                  ) && <img src="/completed.png" style={{ width: "128px" }} />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-10 offset-md-1">
          {/* BookDetailed Introduction */}
          <div className="col-md-auto">
            <div
              className={`card-text ${!expanded ? "line-clamp-content" : ""}`}
              ref={textRef}
            >
              <div className="rendered-content">{parse(introduction)}</div>
            </div>

            {showToggle && (
              <div className="text-end mb-3">
                <button
                  onClick={() => setExpanded((prev) => !prev)}
                  className="btn btn-outline-secondary btn-sm mt-2 show-more-btn"
                >
                  {expanded ? "▲ Show Less" : "▼ Show More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailed;
