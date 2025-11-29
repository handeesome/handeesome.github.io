import Board from "../../components/Board";
import Avatar from "../../components/Avatar";
import { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import { getUserList, getDisplayNameFromEmail, getBookCountForUser } from "../../utils/userUtils";
import { useAuth } from "../../contexts/authContext";
import { useNavigate, useLocation } from "react-router-dom";
import books from "../../data/books/books.json";

const UserSelection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signInWithGoogle } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [fetchingBookCount, setFetchingBookCount] = useState(false);
  const location = useLocation();

  // Add state for the selected avatar data
  const [selectedAvatar, setSelectedAvatar] = useState({
    shelfPath: "",
    shelfName: "",
    ownerName: "",
    src: "",
    booksNumber: null,
    description: "",
  });

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const userList = await getUserList();
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, [location]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert("Error signing in. Please try again.");
    }
  };

  // Updated to accept avatar data
  const handleToggleModal = (avatarData = {}) => {
    setSelectedAvatar({ ...avatarData, booksNumber: null });
    setShowModal(true);

    if (avatarData.shelfPath) {
      setFetchingBookCount(true);
      setTimeout(async () => {
        try {
          let bookCount;
          if (avatarData.shelfPath === "cenhan") {
            // For cenhan, use the local books.json
            bookCount = books.length;
          } else {
            // For other users, fetch from Firebase
            bookCount = await getBookCountForUser(avatarData.userId);
          }

          // Update the book count
          setSelectedAvatar((prev) => ({ ...prev, booksNumber: bookCount }));
        } catch (error) {
          console.error("Error fetching book count:", error);
          setSelectedAvatar((prev) => ({ ...prev, booksNumber: 0 }));
        } finally {
          setFetchingBookCount(false);
        }
      }, 0);
    }
  };

  // Helper functions for the modal
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2);
  };

  const avatarStyle = {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };

  const fallbackStyle = {
    ...avatarStyle,
    backgroundColor: "#6c757d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  };

  const handleEnterBookshelf = () => {
    if (selectedAvatar.shelfPath) {
      // Navigate to the user's bookshelf
      navigate(`/book-shelf/${getDisplayNameFromEmail(selectedAvatar.shelfPath)}`);
    }
    setShowModal(false);
  };

  return (
    <>
      <Board
        title={`${loading ? "Loading..." : "Book Shelf Users"}`}
        titleRight={
          <div
            className="btn btn-outline-primary"
            onClick={() => {
              if (isAuthenticated) {
                navigate("/edit-bookshelf");
              } else {
                handleSignIn();
              }
            }}
          >
            {isAuthenticated ? "Edit Your Book Shelf" : "Create Your Own Book Shelf"}
          </div>
        }
      >
        <div className="container" style={{ minHeight: "80vh" }}>
          <div className="d-flex gap-3 p-3 justify-content-center flex-wrap">
            <Avatar
              src="avatar.jpg"
              name="Cenhan"
              toggleModal={() =>
                handleToggleModal({
                  shelfPath: "cenhan",
                  shelfName: "乱七八糟de书架",
                  ownerName: "Cenhan",
                  src: "avatar.jpg",
                  description: "My personal book shelf",
                })
              }
            />
            {users
              .filter((user) => user.isPublic === true || user.isPublic === null || user.isPublic === undefined)
              .map((user) => {
                const displayName = getDisplayNameFromEmail(user.id);
                return (
                  <Avatar
                    src={user.avatarBase64}
                    key={user.id}
                    name={user.userName || displayName}
                    toggleModal={() =>
                      handleToggleModal({
                        shelfPath: getDisplayNameFromEmail(user.id),
                        userId: user.id,
                        shelfName: user.shelfName || displayName,
                        ownerName: user.userName || displayName,
                        src: user.avatarBase64 || null,
                        description: user.shelfDescription,
                      })
                    }
                  />
                );
              })}
          </div>
        </div>
      </Board>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedAvatar.shelfName || "Somebody's Shelf"} size="lg">
        <div className="row">
          <div className="col-md-4 d-flex align-items-start">
            {selectedAvatar.src ? (
              <img
                src={selectedAvatar.src}
                alt={selectedAvatar.shelfName || "Unknown"}
                style={avatarStyle}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : (
              <div style={fallbackStyle}>{getInitials(selectedAvatar.shelfName)}</div>
            )}
          </div>

          <div className="col-md-8">
            <div className="row">
              <div className="col-6">
                <strong>Owner:</strong> {selectedAvatar.ownerName || ""}
              </div>
              <div className="col-6">
                {fetchingBookCount ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : (
                  selectedAvatar.booksNumber ?? "..."
                )}{" "}
                <strong>Books</strong>
              </div>
              <div className="col-12 mt-2">
                <strong>Description:</strong>
                <p className="text-muted mt-1">
                  {selectedAvatar.description || "This is a book shelf containing various books and collections."}
                </p>
              </div>
              <div className="col-12 mt-3">
                <button className="btn btn-warning" onClick={handleEnterBookshelf}>
                  Enter this Book Shelf
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserSelection;
