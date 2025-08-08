import "../styles/Book.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useRef, useEffect } from "react";
const Book = ({
  id,
  title,
  title2,
  author,
  numPages,
  avgRating,
  shelves,
  dateStarted = "not started",
  dateRead,
  dateAdded,
}) => {
  const [introduction, setIntroduction] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setShowToggle(el.scrollHeight > el.clientHeight + 10); // allow some tolerance
    }
  }, []);
  useEffect(() => {
    fetch(`../data/books/introductions/${id}.md`)
      .then((res) => res.text())
      .then((text) => {
        setIntroduction(text);
        console.log(text);
      })
      .catch((err) => {
        console.error(`Failed to load /introductions/${id}.md`, err);
        setIntroduction(""); // fallback or leave empty
      });
  }, [id]);
  return (
    <div className="card mb-4 shadow-sm">
      <div className="row g-0">
        {/* Book Cover */}
        <div className="col-md-4 d-flex justify-content-center align-items-center">
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
              <h5 className="card-title">{title2}</h5>
              <h6 className="card-subtitle mb-3 text-muted">by {author}</h6>

              <div className="row justify-content-between align-items-start mb-3 ">
                {/* Book Metadata */}
                <div className="col-md-auto">
                  <div className="mb-2">
                    <p className="mb-1">
                      <strong>Pages:</strong> {numPages}
                    </p>
                    <p className="mb-1">
                      <strong>Average Rating:</strong> {avgRating ?? "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Shelf:</strong> {shelves}
                    </p>
                    <p className="mb-1">
                      <strong>Date Started:</strong> {dateStarted}
                    </p>
                    <p className="mb-1">
                      <strong>Date Finished:</strong>{" "}
                      {dateRead ?? "Not finished yet"}
                    </p>
                    <p className="mb-1">
                      <strong>Date Added:</strong> {dateAdded}
                    </p>
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
              {/* Book Intro */}
              <div className="col-md-auto">
                <p
                  className={`card-text ${!expanded ? "line-clamp-6" : ""}`}
                  ref={textRef}>
                  {introduction}
                </p>
                {showToggle && (
                  <button
                    onClick={() => setExpanded((prev) => !prev)}
                    className="btn btn-link p-0">
                    {expanded ? "Show Less" : " Show More"}
                  </button>
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
