import { hexToRgb } from "../../../utils/hexToRgb";

const CollectionFilters = ({
  allItems,
  allLabel,
  itemLabel,
  filteredCount,
  selectedShelf,
  selectedTags,
  allShelves,
  allTags,
  tagCounts,
  getTagColor,
  onShelfClick,
  onTagClick,
  onClearFilter,
  theme,
}) => (
  <div className="row mb-4">
    <div className="col-12">
      <div
        className={`d-flex flex-wrap align-items-center gap-2 p-3 rounded ${
          theme === "light" ? "bg-light" : "bg-dark"
        }`}
      >
        <strong>Filter by shelf:</strong>
        <button
          className={`btn btn-sm ${
            !selectedShelf ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={onClearFilter}
        >
          {allLabel} ({allItems.length})
        </button>
        {allShelves.map((shelf) => {
          const shelfCount = allItems.filter((item) =>
            item.shelves?.includes(shelf)
          ).length;
          return (
            <button
              key={shelf}
              className={`btn btn-sm ${
                selectedShelf === shelf ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => onShelfClick(shelf)}
            >
              {shelf} ({shelfCount})
            </button>
          );
        })}
      </div>

      <div
        className={`d-flex flex-wrap align-items-center gap-2 p-3 rounded ${
          theme === "light" ? "bg-light" : "bg-dark"
        }`}
      >
        <strong>Filter by tags:</strong>
        {allTags.map((tag) => {
          const tagCount = tagCounts.get(tag);
          return (
            tagCount > 0 && (
              <button
                key={tag}
                className={`btn btn-sm book-tag ${
                  selectedTags.has(tag) ? "selected" : ""
                }`}
                style={{
                  "--tag-color": getTagColor(tag),
                  "--tag-color-rgb": hexToRgb(getTagColor(tag)),
                }}
                onClick={() => onTagClick(tag)}
              >
                {tag} ({tagCount})
              </button>
            )
          );
        })}
      </div>

      {(selectedShelf || selectedTags.size > 0) && (
        <div className="mt-2">
          <div
            className={`alert d-flex justify-content-between align-items-center mb-0 ${
              theme === "light" ? "alert-info" : "alert-dark"
            }`}
          >
            <span>
              <strong>
                Showing {filteredCount} {itemLabel}(s)
              </strong>
              {selectedShelf && (
                <>
                  {" from shelf: "}
                  <strong>
                    <em>{selectedShelf}</em>
                  </strong>
                </>
              )}
              {selectedTags.size > 0 && (
                <>
                  {" with tags: "}
                  <strong>
                    <em>{Array.from(selectedTags).join(", ")}</em>
                  </strong>
                </>
              )}
            </span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={onClearFilter}
            >
              Clear Filter ✕
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default CollectionFilters;
