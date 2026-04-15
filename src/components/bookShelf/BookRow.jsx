import { useNavigate } from "react-router-dom";
import { useHideBtns } from "./HideBtnsContext";
import { hexToRgb } from "../../utils/HexToRBG";
import StarRating from "./StarRating";

const BookRow = ({
  book,
  onShelfClick,
  onTagClick,
  selectedTags,
  paramGetTagColor,
  deleteBook,
  onEditBook,
}) => {
  const getTagColor = paramGetTagColor || defaultGetTagColor;
  const navigate = useNavigate();

  const { hideEditDelete, hideSessions, hideActions } = useHideBtns();
  return (
    <tr key={book.id} className="book-row">
      <td>
        <div>
          <div className="fw-bold">{book.title}</div>
          {book.title2 && <div className="text-muted small">{book.title2}</div>}
          <div className="text-muted small">by {book.author}</div>
        </div>
      </td>
      {/* <td>
        <StarRating rating={book["avg rating"]} size="sm" showText={false} />
        <div className="small text-muted">{book["avg rating"]}</div>
      </td> */}
      <td>
        <span className="badge bg-secondary">{book["num pages"]}</span>
      </td>
      <td>
        <div className="d-flex flex-wrap gap-1">
          {book.shelves &&
            book.shelves.map((shelf) => (
              <button
                key={shelf.trim()}
                className="btn btn-outline-primary btn-sm"
                style={{ fontSize: "0.7rem", padding: "2px 6px" }}
                onClick={() => onShelfClick(shelf.trim())}
              >
                {shelf.trim()}
              </button>
            ))}
        </div>
      </td>
      <td>
        <div className="d-flex flex-wrap gap-1">
          {book.tags && book.tags.length > 0 ? (
            <>
              {book.tags.slice(0, 2).map((tag) => {
                const isSelected = selectedTags && selectedTags.has(tag);
                const tagColor = getTagColor(tag);
                return (
                  <button
                    key={tag}
                    className={`btn btn-sm book-tag ${
                      isSelected ? "selected" : ""
                    }`}
                    style={{
                      fontSize: "0.6rem",
                      padding: "2px 4px",
                      "--tag-color": tagColor,
                      "--tag-color-rgb": hexToRgb(tagColor),
                    }}
                    onClick={() => onTagClick && onTagClick(tag)}
                  >
                    {tag} {isSelected && "✓"}
                  </button>
                );
              })}
              {book.tags.length > 2 && (
                <span
                  className="small text-muted align-self-center"
                  title={`Additional tags: ${book.tags.slice(2).join(", ")}`}
                >
                  +{book.tags.length - 2}
                </span>
              )}
            </>
          ) : (
            <span className="text-muted small">No tags</span>
          )}
        </div>
      </td>
      <td>
        <div className="small">
          <div>
            <strong>Started:</strong> {book["date started"] || "N/A"}
          </div>
          <div>
            <strong>Read:</strong> {book["date read"] || "N/A"}
          </div>
          <div>
            <strong>Added:</strong> {book["date added"]}
          </div>
        </div>
      </td>
      {!hideActions && (
        <td>
          <div className="btn-group-vertical btn-group-sm" role="group">
            {!hideEditDelete && (
              <>
                <button
                  className="btn btn-outline-warning btn-sm mb-1"
                  onClick={() => onEditBook && onEditBook(book.id)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-outline-danger btn-sm mb-1"
                  onClick={() => deleteBook && deleteBook(book.id)}
                >
                  🗑️ Delete
                </button>
              </>
            )}
            {!hideSessions && (
              <>
                <button
                  className="btn btn-outline-info btn-sm mb-2"
                  onClick={() =>
                    navigate(`/book-shelf/book/${book.id}/analytics`)
                  }
                >
                  📊 Sessions
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate(`/book-shelf/book/${book.id}/notes`)}
                >
                  📝 Notes
                </button>
              </>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};

export default BookRow;
