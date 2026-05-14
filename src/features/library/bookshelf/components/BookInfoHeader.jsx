import { useTheme } from "../../../../contexts/ThemeContext";
import GoBackBtn from "../../../../components/GoBackButton";
import { useNavigate } from "react-router-dom";
import { getBookCoverSrc, handleBookCoverError } from "../utils/bookCovers";

const BookInfoHeader = ({ book, showReadingSessionsButton = false }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const coverSrc = getBookCoverSrc(book);
  const pages = book["num pages"] ?? book.pages ?? "N/A";

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className={`card ${theme === "dark" ? "bg-dark" : ""}`}>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-2">
                <img
                  src={coverSrc}
                  alt={book.title}
                  className="img-fluid rounded"
                  style={{ maxHeight: "150px", objectFit: "cover" }}
                  onError={(e) => handleBookCoverError(e, book)}
                />
              </div>
              <div className="col-md-10">
                <h4 className="card-title">{book.title}</h4>
                {book.title2 && <h5 className="text-muted">{book.title2}</h5>}
                <p className="card-text">
                  <strong>Author:</strong> {book.author}
                  <br />
                  <strong>Pages:</strong> {pages}
                  <br />
                  <strong>Reading Status:</strong> {book.shelves}
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <GoBackBtn
                    defaultDest="/book-shelf"
                    text="Go Back to Previous Page"
                  />
                  {showReadingSessionsButton && (
                    <button
                      className="btn btn-warning shadow-sm"
                      type="button"
                      onClick={() =>
                        navigate(`/book-shelf/book/${book.id}/analytics`)
                      }
                    >
                      Reading Sessions →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookInfoHeader;
