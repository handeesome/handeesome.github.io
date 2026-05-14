import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Board from "../../../profile/components/Board";
import GoBackBtn from "../../../../components/GoBackButton";
import { getTagColor as defaultGetTagColor } from "../../../../utils/tagColors";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useHideBtns } from "../../../../contexts/HideBtnsContext";
import CollectionFilters from "../../components/CollectionFilters";
import CollectionLayoutSwitch from "../../components/CollectionLayoutSwitch";
import { MediaCard, MediaDetailed, MediaRow } from "./MediaCard";
import "../../bookshelf/components/BookShelf.css";

const setsEqual = (firstSet, secondSet) => {
  if (firstSet.size !== secondSet.size) return false;
  return [...firstSet].every((value) => secondSet.has(value));
};

const MediaRoom = ({
  mediaItems = [],
  title = "Media",
  paramGetTagColor,
  titleRight = null,
  collectionSwitch = null,
  deleteMedia,
  onEditMedia,
  loading = false,
}) => {
  const getTagColor = paramGetTagColor || defaultGetTagColor;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { hideEditDelete, hideActions } = useHideBtns();
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [layout, setLayout] = useState(searchParams.get("layout") || "grid");
  const [selectedShelf, setSelectedShelf] = useState(() => {
    if (searchParams.get("view") === "all") return null;
    return searchParams.get("shelf") || null;
  });
  const [selectedTags, setSelectedTags] = useState(() => {
    const tagParam = searchParams.get("tags");
    return tagParam ? new Set(tagParam.split(",")) : new Set();
  });
  const previousSearchRef = useRef(location.search);
  const syncingFromUrlRef = useRef(false);

  useEffect(() => {
    if (location.search === previousSearchRef.current) return;
    previousSearchRef.current = location.search;

    const urlParams = new URLSearchParams(location.search);
    const nextLayout = urlParams.get("layout");
    const hasUrlShelf = urlParams.has("shelf");
    const hasViewAll = urlParams.get("view") === "all";
    const urlControlsMedia =
      urlParams.has("layout") ||
      hasUrlShelf ||
      hasViewAll ||
      urlParams.has("tags");
    let changedFromUrl = false;

    if (nextLayout && nextLayout !== layout) {
      setLayout(nextLayout);
      changedFromUrl = true;
    }

    if (hasUrlShelf || hasViewAll) {
      const nextShelf = hasUrlShelf ? urlParams.get("shelf") : null;
      if (nextShelf !== selectedShelf) {
        setSelectedShelf(nextShelf);
        changedFromUrl = true;
      }
    }

    if (urlControlsMedia) {
      const tagParam = urlParams.get("tags");
      const nextTags = tagParam ? new Set(tagParam.split(",")) : new Set();
      if (!setsEqual(nextTags, selectedTags)) {
        setSelectedTags(nextTags);
        changedFromUrl = true;
      }
    }

    if (changedFromUrl) syncingFromUrlRef.current = true;
  }, [layout, location.search, selectedShelf, selectedTags]);

  const allShelves = useMemo(() => {
    const shelfSet = new Set();
    mediaItems.forEach((item) => {
      item.shelves?.forEach((shelf) => shelfSet.add(shelf.trim()));
    });
    return Array.from(shelfSet).sort();
  }, [mediaItems]);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    mediaItems.forEach((item) => {
      item.tags?.forEach((tag) => tagSet.add(tag.trim()));
    });
    return Array.from(tagSet).sort();
  }, [mediaItems]);

  const filteredShelfMedia = useMemo(() => {
    if (!selectedShelf) return mediaItems;
    return mediaItems.filter((item) => item.shelves?.includes(selectedShelf));
  }, [mediaItems, selectedShelf]);

  const filteredMedia = useMemo(() => {
    if (selectedTags.size === 0) return filteredShelfMedia;
    return filteredShelfMedia.filter((item) =>
      [...selectedTags].every((tag) => item.tags?.includes(tag))
    );
  }, [filteredShelfMedia, selectedTags]);

  const tagCounts = useMemo(() => {
    const counts = new Map();
    allTags.forEach((tag) => {
      counts.set(
        tag,
        filteredMedia.filter((item) => item.tags?.includes(tag)).length
      );
    });
    return counts;
  }, [allTags, filteredMedia]);

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    if (selectedShelf) {
      setSelectedTags(new Set());
    }
  }, [selectedShelf]);

  useEffect(() => {
    if (syncingFromUrlRef.current) {
      syncingFromUrlRef.current = false;
      return;
    }

    const params = new URLSearchParams();
    params.set("collection", "media");
    params.set("layout", layout);
    if (selectedShelf) {
      params.set("shelf", selectedShelf);
    } else {
      params.set("view", "all");
    }
    if (selectedTags.size > 0) {
      params.set("tags", Array.from(selectedTags).join(","));
    }

    const nextSearch = params.toString();
    if (nextSearch !== searchParams.toString()) {
      navigate(
        { pathname: location.pathname, search: `?${nextSearch}` },
        { replace: true, state: location.state, preventScrollReset: true }
      );
    }
  }, [
    layout,
    location.pathname,
    location.state,
    navigate,
    searchParams,
    selectedShelf,
    selectedTags,
  ]);

  const handleTagClick = (tag) => {
    setSelectedTags((prev) => {
      const nextTags = new Set(prev);
      if (nextTags.has(tag)) {
        nextTags.delete(tag);
      } else {
        nextTags.add(tag);
      }
      return nextTags;
    });
  };

  const clearFilter = () => {
    setSelectedShelf(null);
    setSelectedTags(new Set());
  };

  const layoutProps = {
    onShelfClick: setSelectedShelf,
    onTagClick: handleTagClick,
    selectedTags,
    getTagColor,
    onEditMedia,
    deleteMedia,
    theme,
  };

  const renderMedia = () => {
    if (layout === "detailed") {
      return (
        <div className="bookshelf">
          {filteredMedia.map((item) => (
            <MediaDetailed key={item.id} item={item} {...layoutProps} />
          ))}
        </div>
      );
    }

    if (layout === "table") {
      const showActionsColumn = !hideActions && !hideEditDelete;
      return (
        <div className="table-responsive">
          <table
            className={`table table-hover align-middle ${
              theme === "dark" ? "table-dark" : ""
            }`}
          >
            <thead className="table-dark sticky-top">
              <tr>
                <th style={{ width: "31%" }}>Title & Director</th>
                <th style={{ width: "12%" }}>Rating</th>
                <th style={{ width: "20%" }}>Shelf</th>
                <th style={{ width: "20%" }}>Tags</th>
                <th style={{ width: showActionsColumn ? "10%" : "17%" }}>
                  Added
                </th>
                {showActionsColumn && <th style={{ width: "10%" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredMedia.map((item) => (
                <MediaRow
                  key={item.id}
                  item={item}
                  showActionsColumn={showActionsColumn}
                  {...layoutProps}
                />
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row g-3 mb-3">
          {filteredMedia.map((item) => (
            <MediaCard key={item.id} item={item} {...layoutProps} />
          ))}
        </div>
      </div>
    );
  };

  const MediaTitleLoading = () => (
    <div
      className={`bookshelf-title-loading ${
        theme === "dark" ? "bookshelf-loading-dark" : ""
      }`}
      aria-label="Loading media room title">
      <span className="bookshelf-skeleton bookshelf-title-skeleton" />
      <span className="bookshelf-loading-dot" />
      <span className="bookshelf-loading-dot" />
      <span className="bookshelf-loading-dot" />
    </div>
  );

  const MediaItemsLoading = () => (
    <div
      className={`bookshelf-loading-section ${
        theme === "dark" ? "bookshelf-loading-dark" : ""
      }`}
      aria-hidden="true">
      <div className="bookshelf-loading-toolbar">
        <span className="bookshelf-skeleton bookshelf-filter-skeleton wide" />
        <span className="bookshelf-skeleton bookshelf-filter-skeleton" />
        <span className="bookshelf-skeleton bookshelf-filter-skeleton" />
      </div>
      <div className="row g-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="col-md-3 col-sm-6" key={index}>
            <div className="bookshelf-loading-card">
              <span className="bookshelf-skeleton bookshelf-cover-skeleton" />
              <span className="bookshelf-skeleton bookshelf-line-skeleton" />
              <span className="bookshelf-skeleton bookshelf-line-skeleton short" />
              <div className="bookshelf-loading-tags">
                <span className="bookshelf-skeleton bookshelf-pill-skeleton" />
                <span className="bookshelf-skeleton bookshelf-pill-skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const displayTitle = loading ? (
    <MediaTitleLoading />
  ) : selectedShelf ? (
    `${title} - ${selectedShelf}`
  ) : (
    title
  );

  return (
    <Board
      title={displayTitle}
      titleRight={
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <GoBackBtn defaultDest="/library" text="Back to Library" />
          {titleRight}
        </div>
      }
    >
      {loading ? (
        <div aria-busy="true" aria-live="polite">
          <span className="visually-hidden">Loading media...</span>
          <MediaItemsLoading />
        </div>
      ) : (
        <>
          {collectionSwitch && (
            <div className="row mb-2">
              <div className="col-12">{collectionSwitch}</div>
            </div>
          )}
          <CollectionLayoutSwitch layout={layout} onChange={setLayout} />

          <CollectionFilters
            allItems={mediaItems}
            allLabel="All Media"
            itemLabel="media item"
            filteredCount={filteredMedia.length}
            selectedShelf={selectedShelf}
            selectedTags={selectedTags}
            allShelves={allShelves}
            allTags={allTags}
            tagCounts={tagCounts}
            getTagColor={getTagColor}
            onShelfClick={setSelectedShelf}
            onTagClick={handleTagClick}
            onClearFilter={clearFilter}
            theme={theme}
          />

          {filteredMedia.length > 0 ? (
            renderMedia()
          ) : (
            <div className="text-center py-5">
              <h5>No media found in this filter</h5>
              <button className="btn btn-primary mt-2" onClick={clearFilter}>
                Show All Media
              </button>
            </div>
          )}
        </>
      )}
    </Board>
  );
};

export default MediaRoom;
