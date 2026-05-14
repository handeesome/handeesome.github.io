import { useLayoutEffect, useRef, useState } from "react";
import parse from "html-react-parser";
import { marked } from "marked";
import StarRating from "../../bookshelf/components/StarRating";
import { hexToRgb } from "../../../../utils/hexToRgb";
import { useHideBtns } from "../../../../contexts/HideBtnsContext";

const MediaCover = ({ item, className = "", style = {} }) => {
  if (item.coverBase64) {
    return (
      <img
        src={item.coverBase64}
        alt={item.title}
        className={className}
        style={style}
      />
    );
  }

  return (
    <div
      className={`d-flex align-items-center justify-content-center text-center text-muted ${className}`}
      style={{
        minHeight: "220px",
        background: "rgba(108, 117, 125, 0.16)",
        ...style,
      }}
    >
      No cover
    </div>
  );
};

export const MediaCard = ({
  item,
  onShelfClick,
  onTagClick,
  selectedTags,
  getTagColor,
  onEditMedia,
  deleteMedia,
  theme,
}) => {
  const { hideEditDelete } = useHideBtns();

  return (
    <div className="col-md-3 col-sm-6">
      <div
        className={`card h-100 shadow-sm book-card-grid ${
          theme === "light" ? "" : "bg-dark"
        }`}
      >
        <MediaCover
          item={item}
          className="book-cover-grid"
          style={{ width: "100%", height: "auto" }}
        />
        <div className="card-body p-3 d-flex flex-column">
          <h6 className="card-title mb-1 text-center">{item.title}</h6>
          {item.director && (
            <p className="card-text text-muted mb-2">by {item.director}</p>
          )}
          {item.cast && (
            <p className="card-text text-muted small mb-2">
              Cast: {item.cast}
            </p>
          )}

          <div className="mb-2 d-flex flex-wrap justify-content-center">
            {item.shelves?.map((shelf) => (
              <button
                key={shelf.trim()}
                className="btn btn-outline-primary btn-sm me-1 mb-1"
                style={{ fontSize: "0.7rem", padding: "2px 6px" }}
                onClick={() => onShelfClick(shelf.trim())}
              >
                {shelf.trim()}
              </button>
            ))}
          </div>

          {item.tags?.length > 0 && (
            <div className="mb-2 d-flex flex-wrap justify-content-center">
              {item.tags.slice(0, 4).map((tag) => {
                const isSelected = selectedTags?.has(tag);
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
                    onClick={() => onTagClick?.(tag)}
                  >
                    {tag} {isSelected && "✓"}
                  </button>
                );
              })}
              {item.tags.length > 4 && (
                <span className="small text-muted mt-1 d-block text-center">
                  +{item.tags.length - 4} more
                </span>
              )}
            </div>
          )}

          <div className="mt-auto">
            <div className="mb-2 d-flex justify-content-center">
              <StarRating rating={item.rating} size="sm" />
            </div>
            {!hideEditDelete && (
              <div className="d-grid gap-2">
                <button
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => onEditMedia?.(item.id)}
                >
                  ✏️ Edit Media
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteMedia?.(item.id)}
                >
                  🗑️ Delete Media
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MediaDetailed = ({
  item,
  onShelfClick,
  onTagClick,
  selectedTags,
  getTagColor,
  onEditMedia,
  deleteMedia,
  theme,
}) => {
  const { hideEditDelete } = useHideBtns();
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const textRef = useRef(null);
  const review = marked(item.review ?? "");

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const needsToggle = el.scrollHeight > el.clientHeight + 10;
    setShowToggle(needsToggle);
  }, [review]);

  return (
    <div
      id={`media-${item.id}`}
      className={`card mb-4 shadow-sm ${theme === "light" ? "" : "bg-dark"}`}
    >
      <div className="row g-0">
        <div className="col-md-4 d-flex justify-content-center mt-4">
          <MediaCover item={item} className="fixed-img rounded-start" />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <div className="d-flex justify-content-between gap-3 flex-wrap">
              <div>
                <h5 className="card-title">{item.title}</h5>
                {item.director && (
                  <h6 className="card-subtitle mb-3 text-muted">
                    by {item.director}
                  </h6>
                )}
              </div>
              {!hideEditDelete && (
                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => onEditMedia?.(item.id)}
                  >
                    ✏️ Edit Media
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => deleteMedia?.(item.id)}
                  >
                    🗑️ Delete Media
                  </button>
                </div>
              )}
            </div>

            <div className="mb-2 d-flex align-items-center gap-2">
              <strong>Rating:</strong>
              <StarRating rating={item.rating} size="sm" showText />
            </div>
            {item.cast && (
              <p className="mb-2">
                <strong>Cast:</strong> {item.cast}
              </p>
            )}
            <p className="mb-2">
              <strong>Date Added:</strong> {item.dateAdded || "N/A"}
            </p>
            <div className="mb-2">
              <strong>Shelf:</strong>{" "}
              {item.shelves?.map((shelf) => (
                <button
                  key={shelf}
                  className="btn btn-outline-primary btn-sm mx-1 book-tag"
                  onClick={() => onShelfClick(shelf)}
                >
                  {shelf}
                </button>
              ))}
            </div>
            <div className="mb-3">
              <strong>Tags:</strong>{" "}
              {item.tags?.map((tag) => {
                const isSelected = selectedTags?.has(tag);
                const tagColor = getTagColor(tag);
                return (
                  <button
                    key={tag}
                    className={`btn btn-sm mx-1 book-tag ${
                      isSelected ? "selected" : ""
                    }`}
                    style={{
                      "--tag-color": tagColor,
                      "--tag-color-rgb": hexToRgb(tagColor),
                    }}
                    onClick={() => onTagClick?.(tag)}
                  >
                    {tag} {isSelected && "✓"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {item.review && (
          <div className="col-md-10 offset-md-1">
            <div className="col-md-auto">
              <div
                className={`card-text ${
                  !expanded ? "line-clamp-content" : ""
                }`}
                ref={textRef}
              >
                <div className="rendered-content">{parse(review)}</div>
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
        )}
      </div>
    </div>
  );
};

export const MediaRow = ({
  item,
  onShelfClick,
  onTagClick,
  selectedTags,
  getTagColor,
  onEditMedia,
  deleteMedia,
  showActionsColumn,
}) => {
  const { hideEditDelete } = useHideBtns();

  return (
    <tr>
      <td>
        <div className="fw-bold">{item.title}</div>
        {item.director && (
          <div className="text-muted small">by {item.director}</div>
        )}
        {item.cast && <div className="text-muted small">Cast: {item.cast}</div>}
      </td>
      <td>
        <StarRating rating={item.rating} size="sm" showText={false} />
        <div className="small text-muted">{item.rating}</div>
      </td>
      <td>
        <div className="d-flex flex-wrap gap-1">
          {item.shelves?.map((shelf) => (
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
          {item.tags?.length ? (
            <>
              {item.tags.slice(0, 2).map((tag) => {
                const isSelected = selectedTags?.has(tag);
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
                    onClick={() => onTagClick?.(tag)}
                  >
                    {tag} {isSelected && "✓"}
                  </button>
                );
              })}
              {item.tags.length > 2 && (
                <span
                  className="small text-muted align-self-center"
                  title={`Additional tags: ${item.tags.slice(2).join(", ")}`}
                >
                  +{item.tags.length - 2}
                </span>
              )}
            </>
          ) : (
            <span className="text-muted small">No tags</span>
          )}
        </div>
      </td>
      <td>{item.dateAdded || "N/A"}</td>
      {showActionsColumn && (
        <td>
          {!hideEditDelete && (
            <div className="btn-group-vertical btn-group-sm" role="group">
              <button
                className="btn btn-outline-warning btn-sm mb-1"
                onClick={() => onEditMedia?.(item.id)}
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-outline-danger btn-sm mb-1"
                onClick={() => deleteMedia?.(item.id)}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </td>
      )}
    </tr>
  );
};
