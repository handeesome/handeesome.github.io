// EditLibrary.jsx - Uses shared auth context for the editable library view.
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import HideBtnsContext from "../../contexts/HideBtnsContext";
import Board from "../../features/profile/components/Board";
import BookShelf from "../../features/library/bookshelf/components/BookShelf";
import BookFormModal from "../../features/library/bookshelf/components/BookFormModal";
import { useBookshelf } from "../../features/library/bookshelf/hooks/useBookShelf";
import { useAuth } from "../../contexts/AuthContext";
import UserToggleModal from "../../features/library/bookshelf/components/UserToggleModal";
import { Users, User } from "lucide-react";
import ProfileFormModal from "../../features/library/bookshelf/components/ProfileFormModal";
import LibraryCollectionSwitch from "../../features/library/components/LibraryCollectionSwitch";
import MediaRoom from "../../features/library/media/components/MediaRoom";
import MediaFormModal from "../../features/library/media/components/MediaFormModal";
import { useMediaRoom } from "../../features/library/media/hooks/useMediaRoom";

const EditLibrary = () => {
  // Get auth state from context
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCollection =
    searchParams.get("collection") === "media" ? "media" : "books";

  // UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUserToggleModal, setShowUserToggleModal] = useState(false);
  const [showProfileFormToggle, setShowProfileFormToggle] = useState(false);
  const [currentViewingUserEmail, setCurrentViewingUserEmail] = useState(null);

  // Use the extracted bookshelf hook — profileData.shelfName replaces the
  // separate fetchShelfName effect that previously called getProfileDataForUser()
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
    renameShelf,
    deleteShelf,
  } = useBookshelf(user, currentViewingUserEmail);
  const {
    mediaItems,
    tagColors: mediaTagColors,
    allShelves: allMediaShelves,
    loading: mediaLoading,
    editingMedia,
    addMedia,
    updateMedia,
    deleteMedia,
    handleEditMedia,
    addTagColor: addMediaTagColor,
    updateTagColor: updateMediaTagColor,
    deleteTagColor: deleteMediaTagColor,
    getTagColor: getMediaTagColor,
    setEditingMedia,
    setAllShelves: setAllMediaShelves,
    renameShelf: renameMediaShelf,
    deleteShelf: deleteMediaShelf,
  } = useMediaRoom(user, currentViewingUserEmail);

  const handleSwitchUser = async (userEmail) => {
    try {
      setCurrentViewingUserEmail(userEmail);
    } catch (error) {
      console.error("Error switching user:", error);
      throw error;
    }
  };

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

  const handleAddMedia = async (mediaData) => {
    const success = await addMedia(mediaData);
    if (success) {
      setShowAddForm(false);
    }
  };

  const handleUpdateMedia = async (mediaData) => {
    const success = await updateMedia(editingMedia.id, mediaData);
    if (success) {
      setEditingMedia(null);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch {
      alert("Error signing in. Please try again.");
    }
  };

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

  // Render sign-in page
  if (!user) {
    return (
      <Board title="My Library">
        <div className="text-center py-5">
          <h4>Welcome to Your Personal Library</h4>
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
  if (
    authLoading ||
    (activeCollection === "books" ? bookshelfLoading : mediaLoading)
  ) {
    return (
      <HideBtnsContext.Provider
        value={{
          hideSessions: true,
          hideQuotes: true,
          hideTimeTracker: true,
        }}>
        <BookShelf books={[]} title="My Library" loading />
      </HideBtnsContext.Provider>
    );
  }

  const handleProfileSubmit = async (profileUpdates) => {
    await updateEntireProfile(profileUpdates);
    setShowProfileFormToggle(false);
  };

  const addLibraryTagColor = async (tagName, color) => {
    const [bookSuccess, mediaSuccess] = await Promise.all([
      addTagColor(tagName, color),
      addMediaTagColor(tagName, color),
    ]);
    return bookSuccess !== false && mediaSuccess !== false;
  };

  const updateLibraryTagColor = async (tagName, color) => {
    const [bookSuccess, mediaSuccess] = await Promise.all([
      updateTagColor(tagName, color),
      updateMediaTagColor(tagName, color),
    ]);
    return bookSuccess !== false && mediaSuccess !== false;
  };

  const profileButton = (
    <button
      className="btn btn-warning mt-2"
      onClick={() => setShowProfileFormToggle(true)}>
      <User size={16} className="me-1" />
      Modify Profile
    </button>
  );

  const libraryActions = (
    <div className="d-flex gap-2 align-items-center flex-wrap">
      {activeCollection === "books" && (
        <button
          className="btn btn-success"
          onClick={() => setShowAddForm(true)}>
          + Add Book
        </button>
      )}
      {activeCollection === "media" && (
        <button
          className="btn btn-success"
          onClick={() => setShowAddForm(true)}>
          + Add Media
        </button>
      )}
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
  );

  if (activeCollection === "media") {
    return (
      <>
        <HideBtnsContext.Provider
          value={{
            hideSessions: true,
            hideQuotes: true,
            hideTimeTracker: true,
          }}>
          <MediaRoom
            mediaItems={mediaItems}
            title={
              <>
                <div>
                  <span>{profileData.shelfName || "My Library"}</span>
                </div>
                {profileButton}
              </>
            }
            paramGetTagColor={getMediaTagColor}
            titleRight={libraryActions}
            collectionSwitch={collectionSwitch}
            deleteMedia={deleteMedia}
            onEditMedia={handleEditMedia}
          />
        </HideBtnsContext.Provider>
        <MediaFormModal
          show={showAddForm}
          onCancel={() => setShowAddForm(false)}
          onSubmit={handleAddMedia}
          title="Add Media"
          tagColors={{ ...mediaTagColors, ...tagColors }}
          addTagColor={addLibraryTagColor}
          updateTagColor={updateLibraryTagColor}
          deleteTagColor={deleteMediaTagColor}
          allShelves={allMediaShelves}
          setAllShelves={setAllMediaShelves}
          renameShelf={renameMediaShelf}
          deleteShelf={deleteMediaShelf}
        />
        <MediaFormModal
          show={!!editingMedia}
          media={editingMedia}
          onCancel={() => setEditingMedia(null)}
          onSubmit={handleUpdateMedia}
          title="Edit Media"
          tagColors={{ ...mediaTagColors, ...tagColors }}
          addTagColor={addLibraryTagColor}
          updateTagColor={updateLibraryTagColor}
          deleteTagColor={deleteMediaTagColor}
          allShelves={allMediaShelves}
          setAllShelves={setAllMediaShelves}
          renameShelf={renameMediaShelf}
          deleteShelf={deleteMediaShelf}
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
  }

  // Main library interface, with books as the default collection.
  return (
    <>
      <HideBtnsContext.Provider
        value={{
          hideSessions: true,
          hideQuotes: true,
          hideTimeTracker: true,
        }}>
        <BookShelf
          books={getConvertedBooks()}
          title={
            <>
              <div>
                <span>{profileData.shelfName}</span>
              </div>
              {profileButton}
            </>
          }
          paramGetTagColor={getTagColor}
          hideTimeTracker={true}
          deleteBook={deleteBook}
          onEditBook={handleEditBook}
          titleRight={libraryActions}
          collectionSwitch={collectionSwitch}
        />
      </HideBtnsContext.Provider>

      <BookFormModal
        show={showAddForm}
        onCancel={() => setShowAddForm(false)}
        onSubmit={handleAddBook}
        title={"Add a Book"}
        tagColors={tagColors}
        addTagColor={addLibraryTagColor}
        updateTagColor={updateLibraryTagColor}
        deleteTagColor={deleteTagColor}
        allShelves={allShelves}
        setAllShelves={setAllShelves}
        renameShelf={renameShelf}
        deleteShelf={deleteShelf}
      />

      <BookFormModal
        show={!!editingBook}
        book={editingBook}
        onCancel={() => setEditingBook(null)}
        onSubmit={handleUpdateBook}
        title={"Edit Book"}
        tagColors={tagColors}
        addTagColor={addLibraryTagColor}
        updateTagColor={updateLibraryTagColor}
        deleteTagColor={deleteTagColor}
        allShelves={allShelves}
        setAllShelves={setAllShelves}
        renameShelf={renameShelf}
        deleteShelf={deleteShelf}
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

export default EditLibrary;
