import { useTheme } from "../../contexts/ThemeContext";
import GoBackBtn from "../GoBackButton";
const BookInfoHeader = ({ book }) => {
  const { theme } = useTheme();
  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className={`card ${theme === "dark" ? "bg-dark" : ""}`}>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-2">
                <img
                  src={`/images/bookCovers/${book.id}.jpg`}
                  alt={book.title}
                  className="img-fluid rounded"
                  style={{ maxHeight: "150px", objectFit: "cover" }}
                />
              </div>
              <div className="col-md-10">
                <h4 className="card-title">{book.title}</h4>
                {book.title2 && <h5 className="text-muted">{book.title2}</h5>}
                <p className="card-text">
                  <strong>Author:</strong> {book.author}
                  <br />
                  <strong>Pages:</strong> {book["num pages"]}
                  <br />
                  <strong>Reading Status:</strong> {book.shelves}
                </p>
                <GoBackBtn
                  defaultDest="/book-shelf"
                  text="Back to Book Shelf"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookInfoHeader;
