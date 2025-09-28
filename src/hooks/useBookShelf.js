// useBookshelf.js - Cleaned Version (Everyone Can Read)
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  getDoc,
  setDoc,
  deleteField,
} from "firebase/firestore";
import { db as firestore } from "../lib/firebase-config";

export const useBookshelf = (user, currentViewingUserEmail = null) => {
  const [books, setBooks] = useState([]);
  const [tagColors, setTagColors] = useState({});
  const [allShelves, setAllShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);

  const [profileData, setProfileData] = useState({
    userName: "",
    shelfName: "",
    shelfDescription: "",
    avatarBase64: "",
    isPublic: true,
  });

  // Update shelves when books change
  useEffect(() => {
    setAllShelves([...new Set(books.flatMap((book) => book.shelves || []))]);
  }, [books]);

  // Helper functions - SIMPLIFIED FOR PUBLIC READ ACCESS
  const getCurrentUserEmail = useMemo(() => {
    // If viewing another user's bookshelf, use that email
    if (currentViewingUserEmail) {
      return currentViewingUserEmail;
    }
    // Otherwise, use authenticated user's email (for own bookshelf)
    return user?.email;
  }, [currentViewingUserEmail, user?.email]);

  const getCurrentUserId = useMemo(() => {
    // For tag colors and book ownership
    if (currentViewingUserEmail) {
      return currentViewingUserEmail.replace(/[^a-zA-Z0-9]/g, "_");
    }
    return user?.uid;
  }, [currentViewingUserEmail, user?.uid]);

  // Check if current user can edit (owner or admin)
  const canEdit = useMemo(() => {
    if (!user) return false;

    // Admin can edit anyone's bookshelf
    if (user.email === "ducenhandee@gmail.com") return true;

    // Users can edit their own bookshelf
    if (!currentViewingUserEmail) return true;

    // Users can edit if viewing their own bookshelf
    return user.email === currentViewingUserEmail;
  }, [user, currentViewingUserEmail]);

  // CORE FUNCTION: Fetch books (Public - anyone can read)
  const fetchBooks = useCallback(
    async (targetEmail = null) => {
      const emailToFetch = targetEmail || getCurrentUserEmail;
      if (!emailToFetch) {
        console.warn("No email provided for fetching books");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch books
        const q = query(
          collection(firestore, "books"),
          where("userEmail", "==", emailToFetch)
        );
        const querySnapshot = await getDocs(q);
        const userBooks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort books by date added (newest first), then by creation date, then by ID
        userBooks.sort((a, b) => {
          const dateA = new Date(a.dateAdded || 0);
          const dateB = new Date(b.dateAdded || 0);
          const dateDiff = dateB - dateA;

          if (dateDiff !== 0) return dateDiff;

          const createdA = a.createdAt?.toDate?.() || new Date(0);
          const createdB = b.createdAt?.toDate?.() || new Date(0);
          const createdDiff = createdB - createdA;

          if (createdDiff !== 0) return createdDiff;

          return a.id.localeCompare(b.id);
        });

        setBooks(userBooks);

        // Fetch tag colors
        const userDocRef = doc(firestore, "userdata", emailToFetch);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setTagColors(userData.tagColors || {});

          setProfileData({
            userName: userData.userName || "",
            shelfName: userData.shelfName || "",
            shelfDescription: userData.shelfDescription || "",
            avatarBase64: userData.avatarBase64 || "",
            isPublic:
              userData.isPublic !== undefined ? userData.isPublic : true,
          });
        } else {
          setTagColors({});
          setProfileData({
            userName: "",
            shelfName: "",
            shelfDescription: "",
            avatarBase64: "",
            isPublic: true,
          });
        }
      } catch (error) {
        console.error("Error fetching books or tag colors:", error);
        setBooks([]);
        setTagColors({});
        setProfileData({
          userName: "",
          shelfName: "",
          shelfDescription: "",
          avatarBase64: "",
          isPublic: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [getCurrentUserEmail]
  );

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (getCurrentUserEmail) {
      fetchBooks();
    }
  }, [getCurrentUserEmail, fetchBooks]);

  // BOOK CRUD OPERATIONS (Require edit permissions)
  const addBook = useCallback(
    async (bookData) => {
      if (!canEdit) {
        console.warn("No permission to add books");
        return false;
      }

      try {
        const docRef = await addDoc(collection(firestore, "books"), {
          ...bookData,
          userId: getCurrentUserId,
          userEmail: getCurrentUserEmail,
          dateAdded: new Date().toISOString().split("T")[0],
          createdAt: new Date(),
        });

        const newBook = {
          id: docRef.id,
          ...bookData,
          userId: getCurrentUserId,
          userEmail: getCurrentUserEmail,
          dateAdded: new Date().toISOString().split("T")[0],
          createdAt: new Date(),
        };

        setBooks((prev) => [newBook, ...prev]);
        return true;
      } catch (error) {
        console.error("Error adding book:", error);
        return false;
      }
    },
    [canEdit, getCurrentUserId, getCurrentUserEmail]
  );

  const updateBook = useCallback(
    async (bookId, bookData) => {
      if (!canEdit) {
        console.warn("No permission to update books");
        return false;
      }

      try {
        await updateDoc(doc(firestore, "books", bookId), bookData);
        setBooks((prev) =>
          prev.map((book) =>
            book.id === bookId ? { ...book, ...bookData } : book
          )
        );
        setEditingBook(null);
        return true;
      } catch (error) {
        console.error("Error updating book:", error);
        return false;
      }
    },
    [canEdit]
  );

  const deleteBook = useCallback(
    async (bookId) => {
      if (!canEdit) {
        console.warn("No permission to delete books");
        return false;
      }

      if (!window.confirm("Are you sure you want to delete this book?")) {
        return false;
      }

      try {
        await deleteDoc(doc(firestore, "books", bookId));
        setBooks((prev) => prev.filter((book) => book.id !== bookId));
        return true;
      } catch (error) {
        console.error("Error deleting book:", error);
        return false;
      }
    },
    [canEdit]
  );

  const handleEditBook = useCallback(
    (bookId) => {
      if (!canEdit) {
        console.warn("No permission to edit books");
        return;
      }

      const bookToEdit = books.find((book) => book.id === bookId);
      if (bookToEdit) {
        setEditingBook(bookToEdit);
      }
    },
    [books, canEdit]
  );

  const updateProfileData = useCallback(
    async (updates) => {
      if (!canEdit) {
        console.warn("No permission to update profile");
        return false;
      }

      const userDocRef = doc(firestore, "userdata", getCurrentUserEmail);

      try {
        // Merge the updates with existing data
        await setDoc(
          userDocRef,
          {
            ...updates,
            userEmail: getCurrentUserEmail,
            updatedAt: new Date(),
          },
          { merge: true }
        );

        // Update local state
        setProfileData((prev) => ({ ...prev, ...updates }));
        return true;
      } catch (error) {
        console.error("Error updating profile data:", error);
        return false;
      }
    },
    [canEdit, getCurrentUserEmail]
  );

  const updateUserName = useCallback(
    async (newUserName) => {
      return await updateProfileData({ userName: newUserName });
    },
    [updateProfileData]
  );

  const updateShelfName = useCallback(
    async (newShelfName) => {
      return await updateProfileData({ shelfName: newShelfName });
    },
    [updateProfileData]
  );

  const updateShelfDescription = useCallback(
    async (newDescription) => {
      return await updateProfileData({ shelfDescription: newDescription });
    },
    [updateProfileData]
  );

  const updateAvatar = useCallback(
    async (newAvatarBase64) => {
      return await updateProfileData({ avatarBase64: newAvatarBase64 });
    },
    [updateProfileData]
  );

  // Bulk update profile (for forms)
  const updateEntireProfile = useCallback(
    async (profileUpdates) => {
      const { userName, shelfName, shelfDescription, avatarBase64, isPublic } =
        profileUpdates;

      return await updateProfileData({
        userName: userName || "",
        shelfName: shelfName || "",
        shelfDescription: shelfDescription || "",
        avatarBase64: avatarBase64 || "",
        isPublic: isPublic !== undefined ? isPublic : true,
      });
    },
    [updateProfileData]
  );

  const fetchProfileData = useCallback(
    async (targetEmail = null) => {
      const emailToFetch = targetEmail || getCurrentUserEmail;

      if (!emailToFetch) {
        console.warn("No email provided for fetching profile data");
        return;
      }

      try {
        const userDocRef = doc(firestore, "userdata", emailToFetch);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const profile = {
            userName: userData.userName || "",
            shelfName: userData.shelfName || "",
            shelfDescription: userData.shelfDescription || "",
            avatarBase64: userData.avatarBase64 || "",
            isPublic:
              userData.isPublic !== undefined ? userData.isPublic : true,
          };

          setProfileData(profile);
        } else {
          // No profile data exists, set default empty profile
          const defaultProfile = {
            userName: "",
            shelfName: "",
            shelfDescription: "",
            avatarBase64: "",
            isPublic: true,
          };

          setProfileData(defaultProfile);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setProfileData({
          userName: "",
          shelfName: "",
          shelfDescription: "",
          avatarBase64: "",
          isPublic: true,
        });
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

  // Clear profile data (Require edit permissions)
  const clearProfileData = useCallback(async () => {
    if (!canEdit) {
      console.warn("No permission to clear profile");
      return false;
    }

    if (!window.confirm("Are you sure you want to clear all profile data?")) {
      return false;
    }

    return await updateProfileData({
      userName: "",
      shelfName: "",
      shelfDescription: "",
      avatarBase64: "",
      isPublic: true,
    });
  }, [canEdit, updateProfileData]);

  // TAG COLOR OPERATIONS (Require edit permissions)
  const addTagColor = useCallback(
    async (newTagName, newTagColor) => {
      if (!canEdit || !newTagName) return false;

      const userDocRef = doc(firestore, "userdata", getCurrentUserEmail);

      try {
        await setDoc(
          userDocRef,
          {
            tagColors: { [newTagName]: newTagColor },
            userEmail: getCurrentUserEmail,
          },
          { merge: true }
        );

        setTagColors((prev) => ({ ...prev, [newTagName]: newTagColor }));
        return true;
      } catch (error) {
        console.error("Error adding tag color:", error);
        return false;
      }
    },
    [canEdit, getCurrentUserEmail]
  );

  const updateTagColor = useCallback(
    async (tagName, newColor) => {
      if (!canEdit || !tagName) return false;

      const userDocRef = doc(firestore, "userdata", getCurrentUserEmail);

      try {
        await updateDoc(userDocRef, {
          [`tagColors.${tagName}`]: newColor,
          userEmail: getCurrentUserEmail,
        });

        setTagColors((prev) => ({ ...prev, [tagName]: newColor }));
        return true;
      } catch (error) {
        console.error("Error updating tag color:", error);
        return false;
      }
    },
    [canEdit, getCurrentUserEmail]
  );

  const deleteTagColor = useCallback(
    async (tagName) => {
      if (!canEdit || !tagName) return false;

      if (
        !window.confirm(`Are you sure you want to delete the tag "${tagName}"?`)
      ) {
        return false;
      }

      const userDocRef = doc(firestore, "userdata", getCurrentUserEmail);

      try {
        await updateDoc(userDocRef, {
          [`tagColors.${tagName}`]: deleteField(),
        });

        // Remove tag from all books
        const booksWithTag = books.filter(
          (book) => book.tags && book.tags.includes(tagName)
        );

        const updatePromises = booksWithTag.map(async (book) => {
          const updatedTags = book.tags.filter((tag) => tag !== tagName);
          const bookRef = doc(firestore, "books", book.id);
          await updateDoc(bookRef, { tags: updatedTags });
          return { ...book, tags: updatedTags };
        });

        await Promise.all(updatePromises);

        // Update local state
        setTagColors((prev) => {
          const updated = { ...prev };
          delete updated[tagName];
          return updated;
        });

        setBooks((prevBooks) => {
          return prevBooks.map((book) => {
            if (book.tags && book.tags.includes(tagName)) {
              return {
                ...book,
                tags: book.tags.filter((tag) => tag !== tagName),
              };
            }
            return book;
          });
        });

        return true;
      } catch (error) {
        console.error("Error deleting tag color:", error);
        return false;
      }
    },
    [canEdit, getCurrentUserEmail, books]
  );

  // UTILITY FUNCTIONS
  const getTagColor = useCallback(
    (tag) => {
      return tagColors[tag] || "#6c757d";
    },
    [tagColors]
  );

  const getConvertedBooks = useCallback(() => {
    return books.map((book) => ({
      id: book.id,
      title: book.title,
      title2: book.title2,
      author: book.author,
      "num pages": book.pages,
      "avg rating": book.rating,
      shelves: book.shelves || [],
      tags: book.tags || [],
      "date started": book.dateStarted,
      "date read": book.dateFinished,
      "date added": book.dateAdded,
      coverBase64: book.coverBase64,
      notes: book.notes || "",
    }));
  }, [books]);

  // ADMIN FUNCTION: Switch to view another user's bookshelf
  const switchUser = useCallback(
    async (targetEmail) => {
      await fetchBooks(targetEmail);
    },
    [fetchBooks]
  );

  // Add this inside your hook, e.g., after updateEntireProfile
  const updatePublic = useCallback(
    async (isPublic) => {
      if (!canEdit) {
        console.warn("No permission to update public status");
        return false;
      }

      const userDocRef = doc(firestore, "userdata", getCurrentUserEmail);

      try {
        // Merge only the isPublic field
        await setDoc(
          userDocRef,
          { isPublic, updatedAt: new Date() },
          { merge: true }
        );

        // Update local state
        setProfileData((prev) => ({ ...prev, isPublic }));

        return true;
      } catch (error) {
        console.error("Error updating public status:", error);
        return false;
      }
    },
    [canEdit, getCurrentUserEmail]
  );

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

    // Tag operations
    addTagColor,
    updateTagColor,
    deleteTagColor,
    getTagColor,

    // Utility functions
    getConvertedBooks,
    getCurrentUserEmail,
    getCurrentUserId,
    switchUser,

    // State setters
    setEditingBook,
    setAllShelves,

    updatePublic,
  };
};
