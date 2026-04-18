// hooks/useBookShelf.js
// ─────────────────────────────────────────────────────────────────────────────
// Manages all bookshelf React state for one user.
// Consumes services only — zero firebase/firestore imports in this file.
// Public API is identical to the previous version so no UI changes are needed.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getBooksByUser,
  addBook as svcAddBook,
  updateBook as svcUpdateBook,
  deleteBook as svcDeleteBook,
  removeTagFromBooks,
  renameShelfOnBooks,
  removeShelfFromBooks,
} from "../../../services/books.service";
import {
  getProfile,
  updateProfile as svcUpdateProfile,
  upsertTagColor,
  removeTagColor,
} from "../../../services/profile.service";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ADMIN_EMAIL = "ducenhandee@gmail.com";

const DEFAULT_PROFILE = {
  userName: "",
  shelfName: "",
  shelfDescription: "",
  avatarBase64: "",
  isPublic: true,
  tagColors: {},
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * @param {object|null} user            - Firebase Auth user from useAuth()
 * @param {string|null} currentViewingUserEmail - email being viewed (null = own shelf)
 */
export const useBookshelf = (user, currentViewingUserEmail = null) => {
  const [books,       setBooks]       = useState([]);
  const [profileData, setProfileData] = useState({ ...DEFAULT_PROFILE });
  const [loading,     setLoading]     = useState(true);
  const [editingBook, setEditingBook] = useState(null);

  // ── Stable derived values ─────────────────────────────────────────────────

  /** The email whose data we are displaying (own or viewed). */
  const getCurrentUserEmail = useMemo(
    () => currentViewingUserEmail ?? user?.email ?? null,
    [currentViewingUserEmail, user?.email]
  );

  /** Stable userId string (used when writing new books). */
  const getCurrentUserId = useMemo(() => {
    if (currentViewingUserEmail) {
      return currentViewingUserEmail.replace(/[^a-zA-Z0-9]/g, "_");
    }
    return user?.uid ?? null;
  }, [currentViewingUserEmail, user?.uid]);

  /** True when the logged-in user may modify the displayed shelf. */
  const canEdit = useMemo(() => {
    if (!user) return false;
    if (user.email === ADMIN_EMAIL) return true;
    if (!currentViewingUserEmail) return true;
    return user.email === currentViewingUserEmail;
  }, [user, currentViewingUserEmail]);

  /** Unique sorted shelf names derived from current book list. */
  const allShelves = useMemo(
    () => [...new Set(books.flatMap((b) => b.shelves ?? []))],
    [books]
  );

  /** Convenience: tag colour map extracted from profileData. */
  const tagColors = profileData.tagColors ?? {};

  // ── Data loading ──────────────────────────────────────────────────────────

  const fetchBooks = useCallback(
    async (targetEmail = null) => {
      const emailToFetch = targetEmail ?? getCurrentUserEmail;
      if (!emailToFetch) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [fetchedBooks, fetchedProfile] = await Promise.all([
          getBooksByUser(emailToFetch),
          getProfile(emailToFetch),
        ]);
        setBooks(fetchedBooks);
        setProfileData(fetchedProfile);
      } catch (err) {
        console.error("useBookshelf fetchBooks:", err);
        setBooks([]);
        setProfileData({ ...DEFAULT_PROFILE });
      } finally {
        setLoading(false);
      }
    },
    [getCurrentUserEmail]
  );

  useEffect(() => {
    if (getCurrentUserEmail) fetchBooks();
  }, [getCurrentUserEmail, fetchBooks]);

  // ── Book CRUD ─────────────────────────────────────────────────────────────

  const addBook = useCallback(
    async (bookData) => {
      if (!canEdit || !getCurrentUserEmail) return false;
      try {
        const created = await svcAddBook(
          getCurrentUserEmail,
          getCurrentUserId,
          bookData
        );
        setBooks((prev) => [created, ...prev]);
        return true;
      } catch (err) {
        console.error("addBook:", err);
        return false;
      }
    },
    [canEdit, getCurrentUserEmail, getCurrentUserId]
  );

  const updateBook = useCallback(
    async (bookId, bookData) => {
      if (!canEdit) return false;
      try {
        await svcUpdateBook(bookId, bookData);
        setBooks((prev) =>
          prev.map((b) => (b.id === bookId ? { ...b, ...bookData } : b))
        );
        setEditingBook(null);
        return true;
      } catch (err) {
        console.error("updateBook:", err);
        return false;
      }
    },
    [canEdit]
  );

  const deleteBook = useCallback(
    async (bookId) => {
      if (!canEdit) return false;
      if (!window.confirm("Are you sure you want to delete this book?"))
        return false;
      try {
        await svcDeleteBook(bookId);
        setBooks((prev) => prev.filter((b) => b.id !== bookId));
        return true;
      } catch (err) {
        console.error("deleteBook:", err);
        return false;
      }
    },
    [canEdit]
  );

  const handleEditBook = useCallback(
    (bookId) => {
      if (!canEdit) return;
      setEditingBook(books.find((b) => b.id === bookId) ?? null);
    },
    [canEdit, books]
  );

  // ── Profile mutations ─────────────────────────────────────────────────────

  const updateProfileData = useCallback(
    async (updates) => {
      if (!canEdit || !getCurrentUserEmail) return false;
      try {
        await svcUpdateProfile(getCurrentUserEmail, updates);
        setProfileData((prev) => ({ ...prev, ...updates }));
        return true;
      } catch (err) {
        console.error("updateProfileData:", err);
        return false;
      }
    },
    [canEdit, getCurrentUserEmail]
  );

  const updateUserName        = useCallback((v) => updateProfileData({ userName: v }),        [updateProfileData]);
  const updateShelfName       = useCallback((v) => updateProfileData({ shelfName: v }),       [updateProfileData]);
  const updateShelfDescription= useCallback((v) => updateProfileData({ shelfDescription: v }),[updateProfileData]);
  const updateAvatar          = useCallback((v) => updateProfileData({ avatarBase64: v }),    [updateProfileData]);

  const updateEntireProfile = useCallback(
    async (profileUpdates) => {
      const { userName, shelfName, shelfDescription, avatarBase64, isPublic } =
        profileUpdates;
      return updateProfileData({
        userName:         userName         ?? "",
        shelfName:        shelfName        ?? "",
        shelfDescription: shelfDescription ?? "",
        avatarBase64:     avatarBase64     ?? "",
        isPublic:         isPublic         ?? true,
      });
    },
    [updateProfileData]
  );

  const updatePublic = useCallback(
    (isPublic) => updateProfileData({ isPublic }),
    [updateProfileData]
  );

  const fetchProfileData = useCallback(
    async (targetEmail = null) => {
      const email = targetEmail ?? getCurrentUserEmail;
      if (!email) return;
      try {
        const fetched = await getProfile(email);
        setProfileData(fetched);
      } catch (err) {
        console.error("fetchProfileData:", err);
      }
    },
    [getCurrentUserEmail]
  );

  const getProfileData = useCallback(
    async (targetEmail = null) => {
      await fetchProfileData(targetEmail);
      return profileData;
    },
    [fetchProfileData, profileData]
  );

  const clearProfileData = useCallback(async () => {
    if (!canEdit) return false;
    if (!window.confirm("Are you sure you want to clear all profile data?"))
      return false;
    return updateProfileData({
      userName: "", shelfName: "", shelfDescription: "",
      avatarBase64: "", isPublic: true,
    });
  }, [canEdit, updateProfileData]);

  // ── Tag colour operations ─────────────────────────────────────────────────

  const addTagColor = useCallback(
    async (tagName, color) => {
      if (!canEdit || !tagName || !getCurrentUserEmail) return false;
      try {
        await upsertTagColor(getCurrentUserEmail, tagName, color);
        setProfileData((prev) => ({
          ...prev,
          tagColors: { ...prev.tagColors, [tagName]: color },
        }));
        return true;
      } catch (err) {
        console.error("addTagColor:", err);
        return false;
      }
    },
    [canEdit, getCurrentUserEmail]
  );

  const updateTagColor = useCallback(
    async (tagName, newColor) => {
      if (!canEdit || !tagName || !getCurrentUserEmail) return false;
      try {
        await upsertTagColor(getCurrentUserEmail, tagName, newColor);
        setProfileData((prev) => ({
          ...prev,
          tagColors: { ...prev.tagColors, [tagName]: newColor },
        }));
        return true;
      } catch (err) {
        console.error("updateTagColor:", err);
        return false;
      }
    },
    [canEdit, getCurrentUserEmail]
  );

  const deleteTagColor = useCallback(
    async (tagName) => {
      if (!canEdit || !tagName || !getCurrentUserEmail) return false;
      if (!window.confirm(`Are you sure you want to delete the tag "${tagName}"?`))
        return false;
      try {
        // 1. Batch-update all affected books (atomic, chunked)
        await removeTagFromBooks(books, tagName);
        // 2. Remove the tag colour key from userdata
        await removeTagColor(getCurrentUserEmail, tagName);

        // 3. Optimistic local state update
        setBooks((prev) =>
          prev.map((b) =>
            b.tags?.includes(tagName)
              ? { ...b, tags: b.tags.filter((t) => t !== tagName) }
              : b
          )
        );
        setProfileData((prev) => {
          const { [tagName]: _, ...rest } = prev.tagColors ?? {};
          return { ...prev, tagColors: rest };
        });
        return true;
      } catch (err) {
        console.error("deleteTagColor:", err);
        return false;
      }
    },
    [canEdit, getCurrentUserEmail, books]
  );

  // ── Shelf operations ──────────────────────────────────────────────────────

  const renameShelf = useCallback(
    async (oldShelfName, newShelfName) => {
      if (!canEdit || !oldShelfName || !newShelfName) return false;
      if (oldShelfName === newShelfName) return false;
      if (allShelves.includes(newShelfName)) return false;
      try {
        await renameShelfOnBooks(books, oldShelfName, newShelfName);
        setBooks((prev) =>
          prev.map((b) =>
            b.shelves?.includes(oldShelfName)
              ? {
                  ...b,
                  shelves: b.shelves.map((s) =>
                    s === oldShelfName ? newShelfName : s
                  ),
                }
              : b
          )
        );
        return true;
      } catch (err) {
        console.error("renameShelf:", err);
        return false;
      }
    },
    [canEdit, books, allShelves]
  );

  const deleteShelf = useCallback(
    async (shelfName) => {
      if (!canEdit || !shelfName) return false;
      const affected = books.filter((b) => b.shelves?.includes(shelfName));
      const msg =
        affected.length > 0
          ? `Are you sure you want to delete the shelf "${shelfName}"? This will remove it from ${affected.length} book(s).`
          : `Are you sure you want to delete the shelf "${shelfName}"?`;
      if (!window.confirm(msg)) return false;
      try {
        await removeShelfFromBooks(books, shelfName);
        setBooks((prev) =>
          prev.map((b) =>
            b.shelves?.includes(shelfName)
              ? { ...b, shelves: b.shelves.filter((s) => s !== shelfName) }
              : b
          )
        );
        return true;
      } catch (err) {
        console.error("deleteShelf:", err);
        return false;
      }
    },
    [canEdit, books]
  );

  // ── Utility ───────────────────────────────────────────────────────────────

  const getTagColor = useCallback(
    (tag) => tagColors[tag] ?? "#6c757d",
    [tagColors]
  );

  /**
   * Returns books in the shape expected by the static BookShelf component
   * (mirrors the old getConvertedBooks format exactly).
   */
  const getConvertedBooks = useCallback(
    () =>
      books.map((b) => ({
        id:           b.id,
        title:        b.title,
        title2:       b.title2,
        author:       b.author,
        "num pages":  b.pages,
        "avg rating": b.rating,
        shelves:      b.shelves ?? [],
        tags:         b.tags ?? [],
        "date started": b.dateStarted,
        "date read":    b.dateFinished,
        "date added":   b.dateAdded,
        coverBase64:    b.coverBase64,
        notes:          b.notes ?? "",
      })),
    [books]
  );

  /** Admin helper: reload the shelf as if viewing a different user. */
  const switchUser = useCallback(
    async (targetEmail) => {
      await fetchBooks(targetEmail);
    },
    [fetchBooks]
  );

  // ── Public API (identical surface to previous hook) ───────────────────────

  return {
    // State
    books,
    tagColors,
    allShelves,
    loading,
    editingBook,
    profileData,

    // Permissions
    canEdit,

    // Book operations
    addBook,
    updateBook,
    deleteBook,
    handleEditBook,
    fetchBooks,

    // Profile operations
    updateProfileData,
    updateUserName,
    updateShelfName,
    updateShelfDescription,
    updateAvatar,
    updateEntireProfile,
    getProfileData,
    fetchProfileData,
    clearProfileData,
    updatePublic,

    // Tag operations
    addTagColor,
    updateTagColor,
    deleteTagColor,
    getTagColor,

    // Shelf operations
    renameShelf,
    deleteShelf,

    // Utilities
    getConvertedBooks,
    getCurrentUserEmail,
    getCurrentUserId,
    switchUser,

    // State setters (kept for components that use them directly)
    setEditingBook,
    setAllShelves: () => {}, // allShelves is now derived — setter is a no-op
  };
};
