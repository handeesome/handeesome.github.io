import { useParams } from "react-router-dom";
import MyBookShelf from "./MyBookShelf";
import { default as DefaultBookShelf } from "../../components/bookShelf/BookShelf";
import { useBookshelf } from "../../hooks/useBookShelf";
import { useEffect, useState } from "react";
import { getEmailFromDisplayName } from "../../utils/userUtils";
import HideBtnsContext from "../../components/bookShelf/HideBtnsContext";

const BookShelf = () => {
  const [userEmail, setUserEmail] = useState(null);
  // Three states: "resolving" (looking up email), "ready" (email found), "not-found"
  const [resolveState, setResolveState] = useState("resolving");

  const { userName } = useParams();

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

  if (userName === "cenhan") {
    return <MyBookShelf />;
  }

  // Still looking up the email, or the hook hasn't fetched yet
  const isLoading = resolveState === "resolving" || (resolveState === "ready" && bookshelfLoading);

  if (resolveState === "not-found") {
    return (
      <DefaultBookShelf
        books={[]}
        title="User not found"
        paramGetTagColor={() => "#6c757d"}
      />
    );
  }

  return (
    <HideBtnsContext.Provider
      value={{
        hideEditDelete: true,
        hideSessions: true,
        hideActions: true,
        hideTimeTracker: true,
      }}>
      <DefaultBookShelf
        books={getConvertedBooks()}
        title={isLoading ? "Loading..." : (profileData.shelfName || userName)}
        paramGetTagColor={getTagColor}
      />
    </HideBtnsContext.Provider>
  );
};

export default BookShelf;
