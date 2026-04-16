import { useParams } from "react-router-dom";
import MyBookShelf from "./MyBookShelf";
import { default as DefaultBookShelf } from "../../components/bookShelf/BookShelf";
import { useBookshelf } from "../../hooks/useBookShelf";
import { useEffect, useState } from "react";
import { getEmailFromDisplayName } from "../../utils/userUtils";
import HideBtnsContext from "../../components/bookShelf/HideBtnsContext";

const BookShelf = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [resolving, setResolving] = useState(true);

  const { userName } = useParams();

  // Only needed to translate the URL slug → email; profile data comes from the hook.
  useEffect(() => {
    if (userName === "cenhan") {
      setResolving(false);
      return;
    }

    let cancelled = false;
    setResolving(true);

    getEmailFromDisplayName(userName)
      .then((foundEmail) => {
        if (!cancelled && foundEmail) setUserEmail(foundEmail);
      })
      .catch((err) => console.error("Error finding user email:", err))
      .finally(() => { if (!cancelled) setResolving(false); });

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
        title={`${resolving || bookshelfLoading ? "Loading..." : ""}${
          profileData.shelfName ?? ""
        }`}
        paramGetTagColor={getTagColor}
      />
    </HideBtnsContext.Provider>
  );
};

export default BookShelf;
