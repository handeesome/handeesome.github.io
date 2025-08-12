import StarRating from "./StarRating";
import Book from "./Book";
import { useNavigate } from "react-router-dom";
import { getTagColor } from "../../utils/TagColors";
import { hexToRgb } from "../../utils/HexToRBG";

// Layout 1: Grid View - Simple covers with basic info
export const GridView = ({ books, onShelfClick, onTagClick, selectedTags }) => {
  const navigate = useNavigate();

  return (
    <div className="row g-3 mb-3">
      {books.map((book) => (
        <div key={book.id} className="col-md-3 col-sm-6">
          <div className="card h-100 shadow-sm book-card-grid">
            <div className="position-relative">
              <img
                src={`covers/${book.id}.jpg`}
                alt={book.title}
                className="card-img-top book-cover-grid"
                style={{ height: "200px", objectFit: "cover" }}
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
                    book.shelves.split(",").map((shelf, index) => (
                      <button
                        key={shelf.trim()}
                        className="btn btn-outline-primary btn-sm me-1 mb-1"
                        style={{ fontSize: "0.7rem", padding: "2px 6px" }}
                        onClick={() => onShelfClick(shelf.trim())}>
                        {shelf.trim()}
                      </button>
                    ))}
                </div>

                {/* Book Tags */}
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
                  <button
                    className="btn btn-sm btn-outline-info"
                    onClick={() =>
                      navigate(`/book-shelf/book/${book.id}/analytics`)
                    }>
                    📊 Reading Sessions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Layout 2: Detailed View - Your existing detailed cards
export const DetailedView = ({
  books,
  onShelfClick,
  onTagClick,
  selectedTags,
}) => {
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

// Layout 3: Table View - Compact table format
export const TableView = ({
  books,
  onShelfClick,
  onTagClick,
  selectedTags,
}) => {
  const navigate = useNavigate();

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-dark sticky-top">
          <tr>
            <th style={{ width: "25%" }}>Title & Author</th>
            <th style={{ width: "12%" }}>Rating</th>
            <th style={{ width: "8%" }}>Pages</th>
            <th style={{ width: "12%" }}>Shelf</th>
            <th style={{ width: "18%" }}>Tags</th>
            <th style={{ width: "15%" }}>Dates</th>
            <th style={{ width: "10%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="book-row">
              <td>
                <div>
                  <div className="fw-bold">{book.title}</div>
                  {book.title2 && (
                    <div className="text-muted small">{book.title2}</div>
                  )}
                  <div className="text-muted small">by {book.author}</div>
                </div>
              </td>
              <td>
                <StarRating
                  rating={book["avg rating"]}
                  size="sm"
                  showText={false}
                />
                <div className="small text-muted">{book["avg rating"]}</div>
              </td>
              <td>
                <span className="badge bg-secondary">{book["num pages"]}</span>
              </td>
              <td>
                <div className="d-flex flex-wrap gap-1">
                  {book.shelves &&
                    book.shelves.split(",").map((shelf, index) => (
                      <button
                        key={shelf.trim()}
                        className="btn btn-outline-primary btn-sm"
                        style={{ fontSize: "0.7rem", padding: "2px 6px" }}
                        onClick={() => onShelfClick(shelf.trim())}>
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
                        const isSelected =
                          selectedTags && selectedTags.has(tag);
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
                            onClick={() => onTagClick && onTagClick(tag)}>
                            {tag} {isSelected && "✓"}
                          </button>
                        );
                      })}
                      {book.tags.length > 2 && (
                        <span
                          className="small text-muted align-self-center"
                          title={`Additional tags: ${book.tags
                            .slice(2)
                            .join(", ")}`}>
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
              <td>
                <div className="btn-group-vertical btn-group-sm" role="group">
                  <button
                    className="btn btn-outline-info btn-sm mb-2"
                    onClick={() =>
                      navigate(`/book-shelf/book/${book.id}/analytics`)
                    }>
                    📊 Sessions
                  </button>
                  <button className="btn btn-outline-secondary btn-sm">
                    📝 Notes
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
