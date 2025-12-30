// FirebaseBookshelf.jsx - Using Shared Auth Context
import React, { useCallback, useEffect, useState } from "react";
import HideBtnsContext from "../../components/bookShelf/HideBtnsContext";
import Board from "../../components/Board";
import BookShelf from "../../components/bookShelf/BookShelf";
import BookFormModal from "../../components/bookShelf/BookFormModal";
import { useBookshelf } from "../../hooks/useBookShelf";
import { useAuth } from "../../contexts/authContext";
import UserToggleModal from "../../components/bookShelf/UserToggleModal";
import { Users, User } from "lucide-react";
import ProfileFormModal from "../../components/bookShelf/ProfileFormModal";
import { getProfileDataForUser } from "../../utils/userUtils";
import { LockOpen, LockKeyhole } from "lucide-react";

const FirebaseBookshelf = () => {
  // Get auth state from context
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();

  // UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUserToggleModal, setShowUserToggleModal] = useState(false);
  const [showProfileFormToggle, setShowProfileFormToggle] = useState(false);
  const [currentViewingUserEmail, setCurrentViewingUserEmail] = useState(null);

  const [shelfName, setShelfName] = useState("");

  useEffect(() => {
    if (user) {
      const fetchShelfName = async () => {
        const profileData = await getProfileDataForUser(user.email);
        setShelfName(profileData?.shelfName || "");
      };
      fetchShelfName();
    }
  }, [user]);

  const handleSwitchUser = async (userEmail) => {
    try {
      // Set which user's data we're viewing
      setCurrentViewingUserEmail(userEmail);

      // You might need to trigger a data refresh here
      // This depends on how your useBookshelf hook works
      console.log(`Switched to viewing user: ${userEmail}`);
    } catch (error) {
      console.error("Error switching user:", error);
      throw error; // Re-throw so UserToggleModal can handle it
    }
  };
  // Use the extracted bookshelf hook
  const {
    tagColors,
    allShelves,
    loading: bookshelfLoading,
    editingBook,
    profileData,
    addBook,
    updateBook,
    deleteBook,
    handleEditBook,
    addTagColor,
    updateTagColor,
    deleteTagColor,
    getTagColor,
    getConvertedBooks,
    setEditingBook,
    setAllShelves,
    updateEntireProfile,
    updatePublic,
  } = useBookshelf(user, currentViewingUserEmail);

  // Enhanced book operations that close modals
  const handleAddBook = async (bookData) => {
    const success = await addBook(bookData);
    if (success) {
      setShowAddForm(false);
    }
  };

  const handleUpdateBook = async (bookData) => {
    const success = await updateBook(editingBook.id, bookData);
    if (success) {
      setEditingBook(null);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert("Error signing in. Please try again.");
    }
  };

  // Render sign-in page
  if (!user) {
    return (
      <Board title="📚 My Bookshelf">
        <div className="text-center py-5">
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
          <h4>Welcome to Your Personal Bookshelf</h4>
          <p className="text-muted mb-4">
            Sign in with your Google account to get started
          </p>

          <button
            className="btn btn-primary btn-lg"
            onClick={handleSignIn}
            disabled={authLoading}>
            {authLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"></span>
                Signing in...
              </>
            ) : (
              "Sign in with Google"
            )}
          </button>
        </div>
      </Board>
    );
  }

  // Render loading state
  if (authLoading || bookshelfLoading) {
    return (
      <Board title="📚 My Bookshelf">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading your bookshelf...</h5>
        </div>
      </Board>
    );
  }
  const togglePublic = () => {
    updatePublic(!profileData.isPublic);
  };

  const handleProfileSubmit = async (profileUpdates) => {
    await updateEntireProfile(profileUpdates);

    setShelfName(profileUpdates.shelfName || "");

    setShowProfileFormToggle(false);
  };
  // Main bookshelf interface
  return (
    <>
      <HideBtnsContext.Provider value={{ hideSessions: true }}>
        <BookShelf
          books={getConvertedBooks()}
          title={
            <>
              <div>
                <span>{shelfName}</span>
              </div>
              <button
                onClick={() => togglePublic()}
                className={`btn mt-2 ${
                  profileData.isPublic ? "btn-success" : "btn-secondary"
                }`}>
                {profileData.isPublic ? <LockOpen /> : <LockKeyhole />}{" "}
                {profileData.isPublic ? "PUBLIC" : "PRIVATE"}
              </button>
            </>
          }
          paramGetTagColor={getTagColor}
          hideTimeTracker={true}
          deleteBook={deleteBook}
          onEditBook={handleEditBook}
          titleRight={
            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn btn-warning"
                onClick={() => setShowProfileFormToggle(true)}>
                <User size={16} className="me-1" />
                Modify Profile
              </button>
              <button
                className="btn btn-success"
                onClick={() => setShowAddForm(true)}>
                + Add Book
              </button>
              {user?.email === "ducenhandee@gmail.com" && (
                <button
                  className="btn btn-info"
                  onClick={() => setShowUserToggleModal(true)}
                  title="Switch User View">
                  <Users size={16} className="me-1" />
                  Switch User
                </button>
              )}
              <button className="btn btn-outline-secondary" onClick={signOut}>
                Sign Out
              </button>
            </div>
          }
        />
      </HideBtnsContext.Provider>

      <BookFormModal
        show={showAddForm}
        onCancel={() => setShowAddForm(false)}
        onSubmit={handleAddBook}
        title={"Add a Book"}
        tagColors={tagColors}
        addTagColor={addTagColor}
        updateTagColor={updateTagColor}
        deleteTagColor={deleteTagColor}
        allShelves={allShelves}
        setAllShelves={setAllShelves}
      />

      <BookFormModal
        show={!!editingBook}
        book={editingBook}
        onCancel={() => setEditingBook(null)}
        onSubmit={handleUpdateBook}
        title={"Edit Book"}
        tagColors={tagColors}
        addTagColor={addTagColor}
        updateTagColor={updateTagColor}
        deleteTagColor={deleteTagColor}
        allShelves={allShelves}
        setAllShelves={setAllShelves}
      />
      <ProfileFormModal
        isOpen={showProfileFormToggle}
        onClose={() => setShowProfileFormToggle(false)}
        onSubmit={handleProfileSubmit}
        profileData={profileData}
        defaultName={user.displayName || user.email.split("@")[0]}
      />
      <UserToggleModal
        isOpen={showUserToggleModal}
        onClose={() => setShowUserToggleModal(false)}
        currentUser={user}
        currentViewingUserEmail={currentViewingUserEmail}
        onSwitchUser={handleSwitchUser}
      />
    </>
  );
};

export default FirebaseBookshelf;
