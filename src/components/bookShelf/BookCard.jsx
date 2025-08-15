import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";
import { hexToRgb } from "../../utils/HexToRBG";
import { useContext, useState } from "react";
import { useHideBtns } from "./HideBtnsContext";

const BookCard = ({
  book,
  onShelfClick,
  onTagClick,
  selectedTags,
  getTagColor,
  onEditBook,
  deleteBook,
  theme,
}) => {
  const navigate = useNavigate();
  // Move the useState hook here - now each BookCard has its own consistent hook
  const [imgSrc, setImgSrc] = useState(`covers/${book.id}.jpg`);
  const { hideEditDelete, hideSessions } = useHideBtns();

  return (
    <div key={book.id} className="col-md-3 col-sm-6">
      <div
        className={`card h-100 shadow-sm book-card-grid ${
          theme === "light" ? "" : "bg-dark"
        }`}>
        <div className="position-relative">
          <img
            src={imgSrc || book.coverBase64}
            alt={book.title}
            className="card-img-top book-cover-grid"
            style={{ height: "200px", objectFit: "cover" }}
            onError={() => setImgSrc(book.coverBase64 || "/default-cover.jpg")}
          />
        </div>

        {/* Use flexbox to control layout */}
        <div className="card-body p-3 d-flex flex-column">
          {/* Top content - will take available space */}
          <div className="flex-grow-1">
            <h6
              className="card-title mb-1"
              style={{ fontSize: "1rem", lineHeight: "1.2" }}>
              {book.title}
              {book.title2 && (
                <div className="text-muted small">{book.title2}</div>
              )}
            </h6>
            <p className="card-text text-muted mb-2">by {book.author}</p>

            {/* Shelf Tags */}
            <div className="mb-2">
              {book.shelves &&
                book.shelves.map((shelf) => (
                  <button
                    key={shelf.trim()}
                    className="btn btn-outline-primary btn-sm me-1 mb-1"
                    style={{ fontSize: "0.7rem", padding: "2px 6px" }}
                    onClick={() => onShelfClick(shelf.trim())}>
                    {shelf.trim()}
                  </button>
                ))}
            </div>

            {/* BookDetailed Tags */}
            {book.tags && book.tags.length > 0 && (
              <div className="mb-2">
                {book.tags.slice(0, 3).map((tag) => {
                  const isSelected = selectedTags && selectedTags.has(tag);
                  const tagColor = getTagColor(tag);
                  return (
                    <button
                      key={tag}
                      className={`btn btn-sm me-1 mb-1 book-tag ${
                        isSelected ? "selected" : ""
                      }`}
                      style={{
                        "--tag-color": tagColor,
                        "--tag-color-rgb": hexToRgb(tagColor),
                      }}
                      onClick={() => onTagClick && onTagClick(tag)}>
                      {tag} {isSelected && "✓"}
                    </button>
                  );
                })}
                {book.tags.length > 3 && (
                  <span className="small text-muted">
                    +{book.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom content - always at bottom */}
          <div className="mt-auto">
            <div className="mb-2 d-flex justify-content-center">
              <StarRating rating={book["avg rating"]} size="sm" />
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-2">
              {!hideEditDelete && (
                <>
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => onEditBook && onEditBook(book.id)}>
                    ✏️ Edit Book
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteBook && deleteBook(book.id)}>
                    🗑️ Delete Book
                  </button>
                </>
              )}
              {!hideSessions && (
                <button
                  className="btn btn-sm btn-outline-info"
                  onClick={() =>
                    navigate(`/book-shelf/book/${book.id}/analytics`)
                  }>
                  📊 Reading Sessions
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
