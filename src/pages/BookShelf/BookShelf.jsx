import { useParams } from "react-router-dom";
import MyBookShelf from "./MyBookShelf";
import { default as DefaultBookShelf } from "../../components/bookShelf/BookShelf";
import { useBookshelf } from "../../hooks/useBookShelf";
import { useEffect, useState } from "react";
import {
  getEmailFromDisplayName,
  getProfileDataForUser,
} from "../../utils/userUtils";
import HideBtnsContext from "../../components/bookShelf/HideBtnsContext";

const BookShelf = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const { userName } = useParams();

  useEffect(() => {
    const findUserEmail = async () => {
      if (userName === "cenhan") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const foundEmail = await getEmailFromDisplayName(userName);
        const profileData = await getProfileDataForUser(foundEmail);

        if (foundEmail) {
          setUserEmail(foundEmail);
        }
        if (profileData) {
          setUser(profileData);
        }
      } catch (error) {
        console.error("Error finding user email:", error);
      } finally {
        setLoading(false);
      }
    };
    findUserEmail();
  }, [userName]);
  const {
    getConvertedBooks,
    getTagColor,
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
        title={`${loading || bookshelfLoading ? "Loading..." : ""}${
          user?.shelfName || `${userName}'s Book Shelf`
        }`}
        paramGetTagColor={getTagColor}
      />
    </HideBtnsContext.Provider>
  );
};

export default BookShelf;
