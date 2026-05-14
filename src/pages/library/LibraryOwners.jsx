import Board from "../../features/profile/components/Board";
import Avatar from "../../components/ui/Avatar";
import Modal from "../../components/ui/Modal";
import { useUsers } from "../../hooks/useUsers";
import { getDisplayNameFromEmail } from "../../utils/userUtils";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import books from "../../static/books/books.json";

const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.35 0-4.34-1.58-5.05-3.72H.94v2.33A9 9 0 0 0 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.94A9 9 0 0 0 0 9c0 1.45.34 2.82.94 4.03l3.01-2.33z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .94 4.97L3.95 7.3C4.66 5.16 6.65 3.58 9 3.58z"
    />
  </svg>
);

const LibraryOwners = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signInWithGoogle } = useAuth();
  const location = useLocation();
  const libraryBasePath = location.pathname.startsWith("/book-shelf")
    ? "/book-shelf"
    : "/library";

  // Replaces the manual useEffect + getUserList() pattern.
  // useUsers() handles loading state and caching internally.
  const { users, loading, getBookCount } = useUsers();

  const [showModal, setShowModal] = useState(false);
  const [fetchingBookCount, setFetchingBookCount] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState({
    shelfPath: "",
    shelfName: "",
    ownerName: "",
    src: "",
    booksNumber: null,
    description: "",
  });

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert("Error signing in. Please try again.");
    }
  };

  const handleToggleModal = (avatarData = {}) => {
    setSelectedAvatar({ ...avatarData, booksNumber: null });
    setShowModal(true);

    if (avatarData.shelfPath) {
      setFetchingBookCount(true);
      setTimeout(async () => {
        try {
          let bookCount;
          if (avatarData.shelfPath === "cenhan") {
            bookCount = books.length;
          } else {
            // getBookCount now uses getCountFromServer — no full payload download
            bookCount = await getBookCount(avatarData.userId);
          }
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

  const handleEnterLibrary = () => {
    if (selectedAvatar.shelfPath) {
      navigate(
        `${libraryBasePath}/${encodeURIComponent(selectedAvatar.shelfPath)}`
      );
    }
    setShowModal(false);
  };

  return (
    <>
      <Board
        title="Library Owners"
        titleRight={
          <div
            className="btn btn-outline-primary"
            onClick={() => {
              if (isAuthenticated) {
                navigate("/edit-library");
              } else {
                handleSignIn();
              }
            }}
          >
            {isAuthenticated ? (
              "Edit Your Library"
            ) : (
              <span className="d-inline-flex align-items-center gap-2">
                <GoogleIcon />
                Access Library
              </span>
            )}
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
                  description: "My personal library",
                })
              }
            />
            {users
              .filter(
                (user) =>
                  user.isPublic === true ||
                  user.isPublic === null ||
                  user.isPublic === undefined
              )
              .map((user) => {
                const displayName = getDisplayNameFromEmail(user.id);
                const routeName = (user.userName || displayName).trim();
                return (
                  <Avatar
                    src={user.avatarBase64}
                    key={user.id}
                    name={user.userName || displayName}
                    toggleModal={() =>
                      handleToggleModal({
                        shelfPath: routeName,
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
          {loading && (
            <div
              className="d-flex align-items-center justify-content-center gap-2 text-muted pb-3"
              role="status"
              aria-live="polite"
            >
              <span
                className="spinner-border spinner-border-sm"
                aria-hidden="true"
              />
              <span>Fetching more users...</span>
            </div>
          )}
        </div>
      </Board>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          selectedAvatar.ownerName
            ? `${selectedAvatar.ownerName}'s Library`
            : "Library"
        }
        size="lg"
      >
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
              <div style={fallbackStyle}>
                {getInitials(selectedAvatar.shelfName)}
              </div>
            )}
          </div>

          <div className="col-md-8">
            <div className="row">
              <div className="col-6">
                <strong>Owner:</strong> {selectedAvatar.ownerName || ""}
              </div>
              <div className="col-6">
                {fetchingBookCount ? (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  selectedAvatar.booksNumber ?? "..."
                )}{" "}
                <strong>Books</strong>
              </div>
              <div className="col-12 mt-2">
                <strong>Description:</strong>
                <p className="text-muted mt-1">
                  {selectedAvatar.description ||
                    "This library contains books and other personal collections."}
                </p>
              </div>
              <div className="col-12 mt-3">
                <button
                  className="btn btn-warning"
                  onClick={handleEnterLibrary}
                >
                  Enter Library
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LibraryOwners;
