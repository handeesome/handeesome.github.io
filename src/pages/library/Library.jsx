import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import StaticBookshelf from "./StaticBookshelf";
import { default as DefaultBookShelf } from "../../features/library/bookshelf/components/BookShelf";
import { useBookshelf } from "../../features/library/bookshelf/hooks/useBookShelf";
import { useEffect, useState } from "react";
import { getEmailFromDisplayName } from "../../utils/userUtils";
import HideBtnsContext from "../../contexts/HideBtnsContext";
import LibraryCollectionSwitch from "../../features/library/components/LibraryCollectionSwitch";
import MediaRoom from "../../features/library/media/components/MediaRoom";
import { useMediaRoom } from "../../features/library/media/hooks/useMediaRoom";

const BookShelf = () => {
  const [userEmail, setUserEmail] = useState(null);
  // Three states: "resolving" (looking up email), "ready" (email found), "not-found"
  const [resolveState, setResolveState] = useState("resolving");

  const { userName } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCollection =
    searchParams.get("collection") === "media" ? "media" : "books";

  const handleCollectionChange = (collection) => {
    const nextParams = new URLSearchParams(searchParams);

    if (collection === "media") {
      nextParams.set("collection", "media");
    } else {
      nextParams.delete("collection");
    }

    navigate(
      {
        search: nextParams.toString() ? `?${nextParams.toString()}` : "",
      },
      { replace: true },
    );
  };

  const collectionSwitch = (
    <LibraryCollectionSwitch
      activeCollection={activeCollection}
      onChange={handleCollectionChange}
    />
  );

  // Translate the URL slug → full email.
  // useBookshelf is not called until this resolves so there is no race condition.
  useEffect(() => {
    if (userName === "cenhan") return; // handled by early return below

    let cancelled = false;
    setResolveState("resolving");
    setUserEmail(null);

    getEmailFromDisplayName(userName)
      .then((foundEmail) => {
        if (cancelled) return;
        if (foundEmail) {
          setUserEmail(foundEmail);
          setResolveState("ready");
        } else {
          setResolveState("not-found");
        }
      })
      .catch((err) => {
        console.error("Error finding user email:", err);
        if (!cancelled) setResolveState("not-found");
      });

    return () => { cancelled = true; };
  }, [userName]);

  const {
    getConvertedBooks,
    getTagColor,
    profileData,
    loading: bookshelfLoading,
  } = useBookshelf(null, userEmail);
  const {
    mediaItems,
    getTagColor: getMediaTagColor,
    profileData: mediaProfileData,
    loading: mediaLoading,
  } = useMediaRoom(null, userEmail);

  if (userName === "cenhan") {
    if (activeCollection === "media") {
      return (
        <HideBtnsContext.Provider
          value={{
            hideEditDelete: true,
            hideActions: true,
            hideSessions: true,
            hideQuotes: true,
            hideTimeTracker: true,
          }}>
          <MediaRoom
            mediaItems={[]}
            title="Cenhan's Library - Media"
            paramGetTagColor={getMediaTagColor}
            collectionSwitch={collectionSwitch}
          />
        </HideBtnsContext.Provider>
      );
    }

    return (
      <StaticBookshelf
        title="Cenhan's Library"
        collectionSwitch={collectionSwitch}
      />
    );
  }

  // Still looking up the email, or the hook hasn't fetched yet
  const isLoading =
    resolveState === "resolving" ||
    (resolveState === "ready" && bookshelfLoading);
  const isMediaLoading =
    resolveState === "resolving" || (resolveState === "ready" && mediaLoading);

  if (resolveState === "not-found") {
    return (
      <DefaultBookShelf
        books={[]}
        title="User not found"
        paramGetTagColor={() => "#6c757d"}
      />
    );
  }

  if (activeCollection === "media") {
    return (
      <HideBtnsContext.Provider
        value={{
          hideEditDelete: true,
          hideActions: true,
          hideSessions: true,
          hideQuotes: true,
          hideTimeTracker: true,
        }}>
        <MediaRoom
          mediaItems={mediaItems}
          title={
            isMediaLoading
              ? "Loading..."
              : `${mediaProfileData.shelfName || userName} - Media`
          }
          paramGetTagColor={getMediaTagColor}
          collectionSwitch={collectionSwitch}
          loading={isMediaLoading}
        />
      </HideBtnsContext.Provider>
    );
  }

  return (
    <HideBtnsContext.Provider
      value={{
        hideEditDelete: true,
        hideSessions: true,
        hideTimeTracker: true,
      }}>
      <DefaultBookShelf
        books={getConvertedBooks()}
        title={isLoading ? "Loading..." : (profileData.shelfName || userName)}
        collectionSwitch={collectionSwitch}
        paramGetTagColor={getTagColor}
        loading={isLoading}
      />
    </HideBtnsContext.Provider>
  );
};

export default BookShelf;
