const LibraryCollectionSwitch = ({
  activeCollection,
  onChange,
  className = "",
}) => (
  <div className={`d-flex justify-content-center ${className}`}>
    <div
      className="btn-group"
      role="group"
      aria-label="Library collection options"
    >
      <button
        type="button"
        className={`btn ${
          activeCollection === "books" ? "btn-success" : "btn-outline-success"
        }`}
        onClick={() => onChange("books")}
      >
        Books
      </button>
      <button
        type="button"
        className={`btn ${
          activeCollection === "media" ? "btn-success" : "btn-outline-success"
        }`}
        onClick={() => onChange("media")}
      >
        Media
      </button>
    </div>
  </div>
);

export default LibraryCollectionSwitch;
