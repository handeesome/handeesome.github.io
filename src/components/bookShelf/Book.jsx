import "../../styles/Book.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import StarRating from "./StarRating";
import { getTagColor } from "../../util/TagColors";
import { hexToRgb } from "../../util/HexToRBG";

const Book = ({
  id,
  title,
  title2,
  author,
  numPages,
  avgRating,
  shelves,
  tags,
  dateStarted = "not started",
  dateRead,
  dateAdded,
  onShelfClick,
  onTagClick,
  selectedTags,
}) => {
  const [introduction, setIntroduction] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    import(`../../data/books/introductions/${id}.md?raw`)
      .then((res) => {
        setIntroduction(res.default);

        setTimeout(() => {
          const el = textRef.current;
          if (el) {
            setShowToggle(el.scrollHeight > el.clientHeight + 10);
          }
        }, 200);
      })
      .catch((err) => {
        console.error(`Failed to load /introductions/${id}.md`, err);
        setIntroduction("");
      });
  }, [id]);

  const shelfArray = shelves
    ? shelves.split(",").map((shelf) => shelf.trim())
    : [];

  const handleShelfClick = (shelf) => {
    if (onShelfClick) {
      onShelfClick(shelf);
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="row g-0">
        {/* Book Cover */}
        <div className="col-md-4 d-flex justify-content-center mt-4">
          <img
            src={`covers/${id}.jpg`}
            alt={title}
            className="fixed-img rounded-start"
          />
        </div>

        {/* Book Info */}
        <div className="col-md-8">
          <div className="card-body d-flex flex-column justify-content-between h-100">
            <div>
              <h5 className="card-title">{title}</h5>
              {title2 && <h5 className="card-title text-muted">{title2}</h5>}
              <h6 className="card-subtitle mb-3 text-muted">by {author}</h6>

              <div className="row justify-content-between align-items-start mb-3">
                {/* Book Metadata */}
                <div className="col-md-auto">
                  <div className="mb-2">
                    <p className="mb-1">
                      <strong>Pages:</strong> {numPages}
                    </p>

                    <div className="mb-1 d-flex align-items-center gap-2">
                      <strong>Rating:</strong>
                      <StarRating
                        rating={avgRating}
                        size="sm"
                        showText={true}
                      />
                    </div>

                    <div className="mb-1">
                      <strong>Shelf:</strong>{" "}
                      {shelfArray.map((shelf, index) => (
                        <span key={shelf}>
                          <button
                            className="btn btn-outline-primary btn-sm mx-1 book-tag"
                            onClick={() => handleShelfClick(shelf)}>
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
                                onClick={() => onTagClick && onTagClick(tag)}>
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
                      <span className="book-date-value">{dateStarted}</span>

                      <span className="book-date-label">Date Finished:</span>
                      <span className="book-date-value">
                        {dateRead ?? "Not finished yet"}
                      </span>

                      <span className="book-date-label">Date Added:</span>
                      <span className="book-date-value">{dateAdded}</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-auto d-flex flex-column gap-2 mt-2 mt-md-0">
                  <button className="btn btn-outline-info btn-lg">
                    Time Track Analysis
                  </button>
                  <button className="btn btn-outline-secondary btn-lg">
                    View Notes
                  </button>
                </div>
              </div>

              {/* Book Introduction */}
              <div className="col-md-auto">
                <div
                  className={`card-text ${
                    !expanded ? "line-clamp-content" : ""
                  }`}
                  ref={textRef}>
                  <ReactMarkdown
                    components={{
                      blockquote: ({ node, ...props }) => (
                        <div
                          style={{
                            borderLeft: "4px solid #007bff",
                            backgroundColor: "#f8f9fa",
                            padding: "0.75rem 1rem",
                            margin: "0.75rem 0",
                            fontStyle: "italic",
                            borderRadius: "0 4px 4px 0",
                          }}
                          {...props}
                        />
                      ),
                    }}>
                    {introduction}
                  </ReactMarkdown>
                </div>

                {showToggle && (
                  <div className="text-end">
                    <button
                      onClick={() => setExpanded((prev) => !prev)}
                      className="btn btn-outline-secondary btn-sm mt-2 show-more-btn">
                      {expanded ? "▲ Show Less" : "▼ Show More"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
