// FirebaseBookshelf.jsx
import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import HideBtnsContext from "../../components/bookShelf/HideBtnsContext";

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
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  db as firestore,
  auth as firebaseAuth,
} from "../../components/bookShelf/firebase-config";
import Board from "../../components/Board";
import BookShelf from "../../components/bookShelf/BookShelf";
import UserToggleModal from "../../components/bookShelf/UserToggleModal";
import BookFormModal from "../../components/bookShelf/BookFormModal";

const FirebaseBookshelf = () => {
  const [user, setUser] = useState(null);
  const [tagColors, setTagColors] = useState([]);
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [unauthorizedEmail, setUnauthorizedEmail] = useState("");

  const [showUserToggleModal, setShowUserToggleModal] = useState(false);
  const [currentViewingUserEmail, setCurrentViewingUserEmail] = useState(null);

  const [allShelves, setAllShelves] = useState([
    ...new Set(books.flatMap((book) => book.shelves)),
  ]);

  useEffect(() => {
    setAllShelves([...new Set(books.flatMap((book) => book.shelves))]);
  }, [books]);

  const checkWhitelist = async (userEmail) => {
    try {
      const whitelistDocRef = doc(firestore, "whitelist", userEmail);
      const whitelistDoc = await getDoc(whitelistDocRef);

      return whitelistDoc.exists() && whitelistDoc.data().authorized === true;
    } catch (error) {
      console.error("Error checking whitelist:", error);
      return false;
    }
  };

  // Get the current user's email (either logged in user or user being viewed by admin)
  const getCurrentUserEmail = () => {
    if (currentViewingUserEmail && user?.email === "ducenhandee@gmail.com") {
      return currentViewingUserEmail;
    }
    return user?.email;
  };

  // Get the current user's ID (for tag colors and other operations)
  const getCurrentUserId = () => {
    if (currentViewingUserEmail && user?.email === "ducenhandee@gmail.com") {
      // For viewed users, use their email as ID for tag colors
      return currentViewingUserEmail.replace(/[^a-zA-Z0-9]/g, "_");
    }
    return user?.uid;
  };

  // Function to switch viewing user
  const handleSwitchUser = async (targetEmail) => {
    if (user?.email !== "ducenhandee@gmail.com") {
      throw new Error("Unauthorized: Only admin can switch users");
    }

    setCurrentViewingUserEmail(targetEmail);
    await fetchBooks(targetEmail);
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (currentUser) => {
        setLoading(true);

        if (currentUser) {
          // Check if user is whitelisted
          const isWhitelisted = await checkWhitelist(currentUser.email);

          if (isWhitelisted) {
            // User is authorized
            setUser(currentUser);
            setIsUnauthorized(false);
            setUnauthorizedEmail("");
            fetchBooks(currentUser.email);
            setCurrentViewingUserEmail(null);
          } else {
            // User is not authorized
            console.log(`Unauthorized access attempt by: ${currentUser.email}`);
            setUnauthorizedEmail(currentUser.email);
            setIsUnauthorized(true);
            setUser(null);
            setBooks([]);

            // Don't sign out immediately - let the unauthorized page show first
            // The user can manually sign out from the unauthorized page
          }
        } else {
          // No user signed in - reset everything
          setUser(null);
          setBooks([]);
          setIsUnauthorized(false);
          setUnauthorizedEmail("");
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch books from Firebase
  const fetchBooks = async (userEmail) => {
    try {
      const q = query(
        collection(firestore, "books"),
        where("userEmail", "==", userEmail)
      );
      const querySnapshot = await getDocs(q);
      const userBooks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort on client side with multiple criteria
      userBooks.sort((a, b) => {
        const dateA = new Date(a.dateAdded || 0);
        const dateB = new Date(b.dateAdded || 0);
        const dateDiff = dateB - dateA;

        if (dateDiff !== 0) {
          return dateDiff;
        }

        const createdA = a.createdAt?.toDate?.() || new Date(0);
        const createdB = b.createdAt?.toDate?.() || new Date(0);
        const createdDiff = createdB - createdA;

        if (createdDiff !== 0) {
          return createdDiff;
        }

        return a.id.localeCompare(b.id);
      });

      setBooks(userBooks);
      setAllShelves([...new Set(userBooks.flatMap((book) => book.shelves))]);

      // Fetch tag colors - create user ID from the email parameter passed to this function
      const userId = userEmail.replace(/[^a-zA-Z0-9]/g, "_");
      const userDocRef = doc(firestore, "books", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setTagColors(userData.tagColors || {});
      } else {
        setTagColors({});
      }
    } catch (error) {
      console.error("Error fetching books or tag colors:", error);
      console.error("Error details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Authentication functions
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(firebaseAuth, provider);
      // The whitelist check will happen in the onAuthStateChanged listener
    } catch (error) {
      console.error("Error signing in:", error);
      setLoading(false);

      // Show user-friendly error message
      if (error.code === "auth/popup-closed-by-user") {
        // User closed the popup, no need to show error
        return;
      } else {
        alert("Error signing in. Please try again.");
      }
    }
  };

  const handleSignOut = () => {
    signOut(firebaseAuth);
    setIsUnauthorized(false);
    setUnauthorizedEmail("");
  };

  const addTagColor = async (newTagName, newTagColor) => {
    if (!user || !newTagName) return false;

    const userDocRef = doc(firestore, "books", getCurrentUserId());

    try {
      await setDoc(
        userDocRef,
        {
          tagColors: { [newTagName]: newTagColor },
          userId: getCurrentUserId(),
        },
        { merge: true }
      );

      setTagColors((prev) => ({ ...prev, [newTagName]: newTagColor }));
      console.log(
        `Successfully added tag color: ${newTagName} -> ${newTagColor}`
      );
      return true;
    } catch (error) {
      console.error("Error adding tag color:", error);
      return false;
    }
  };

  const updateTagColor = async (tagName, newColor) => {
    if (!user || !tagName) return false;

    const userDocRef = doc(firestore, "books", getCurrentUserId());

    try {
      await updateDoc(userDocRef, {
        [`tagColors.${tagName}`]: newColor,
        userId: getCurrentUserId(),
      });

      setTagColors((prev) => ({ ...prev, [tagName]: newColor }));
      console.log(`Successfully updated tag color: ${tagName} -> ${newColor}`);
      return true;
    } catch (error) {
      console.error("Error updating tag color:", error);
      return false;
    }
  };

  const deleteTagColor = async (tagName) => {
    if (!user || !tagName) return false;

    // Show confirmation dialog
    if (
      !window.confirm(
        `Are you sure you want to delete the tag "${tagName}"? This action cannot be undone.`
      )
    ) {
      return false;
    }

    const userDocRef = doc(firestore, "books", getCurrentUserId());

    try {
      await updateDoc(userDocRef, {
        [`tagColors.${tagName}`]: deleteField(),
      });

      const booksWithTag = books.filter(
        (book) => book.tags && book.tags.includes(tagName)
      );

      const updatePromises = booksWithTag.map(async (book) => {
        const updatedTags = book.tags.filter((tag) => tag !== tagName);
        const bookRef = doc(firestore, "books", book.id);
        await updateDoc(bookRef, {
          tags: updatedTags,
        });
        return { ...book, tags: updatedTags };
      });

      const updatedBooks = await Promise.all(updatePromises);

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

      console.log(`Successfully deleted tag color: ${tagName}`);
      return true;
    } catch (error) {
      console.error("Error deleting tag color:", error);
      return false;
    }
  };

  // Book CRUD operations
  const addBook = async (bookData) => {
    if (!user) return;

    try {
      const docRef = await addDoc(collection(firestore, "books"), {
        ...bookData,
        userId: getCurrentUserId(),
        userEmail: getCurrentUserEmail(),
        dateAdded: new Date().toISOString().split("T")[0],
        createdAt: new Date(),
      });

      const newBook = {
        id: docRef.id,
        ...bookData,
        userId: getCurrentUserId(),
        userEmail: getCurrentUserEmail(),
      };
      setBooks((prev) => [newBook, ...prev]);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const updateBook = async (bookId, bookData) => {
    console.log("Updating book:", bookId, bookData);
    try {
      await updateDoc(doc(firestore, "books", bookId), bookData);
      setBooks((prev) =>
        prev.map((book) =>
          book.id === bookId ? { ...book, ...bookData } : book
        )
      );
      setEditingBook(null);
      console.log("Book updated successfully");
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleEditBook = (bookId) => {
    const bookToEdit = books.find((book) => book.id === bookId);
    if (bookToEdit) {
      setEditingBook(bookToEdit);
    }
  };

  const deleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await deleteDoc(doc(firestore, "books", bookId));
      setBooks((prev) => prev.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const convertedBooks = books.map((book) => ({
    id: book.id,
    title: book.title,
    title2: book.title2,
    author: book.author,
    "num pages": book.pages,
    "avg rating": book.rating,
    shelves: book.shelves,
    tags: book.tags,
    "date started": book.dateStarted,
    "date read": book.dateFinished,
    "date added": book.dateAdded,
    coverBase64: book.coverBase64,
    notes: book.notes || "",
  }));

  if (isUnauthorized) {
    return (
      <Board title="🚫 Access Denied">
        <div className="text-center py-5">
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚫</div>
          <h4 className="text-danger">Access Not Authorized</h4>
          <p className="text-muted mb-4">
            The account <strong>{unauthorizedEmail}</strong> is not authorized
            to access this bookshelf.
          </p>
          <div className="alert alert-warning" role="alert">
            <strong>Need access?</strong>
            <br />
            Please contact the administrator to request access to this bookshelf
            application.
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              signOut(firebaseAuth);
            }}>
            Try Different Account
          </button>
        </div>
      </Board>
    );
  }

  if (!user) {
    return (
      <Board title="📚 My Bookshelf">
        <div className="text-center py-5">
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
          <h4>Welcome to Your Personal Bookshelf</h4>
          <p className="text-muted mb-4">
            Sign in with your authorized Google account
          </p>

          <button
            className="btn btn-primary btn-lg"
            onClick={signInWithGoogle}
            disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"></span>
                Checking authorization...
              </>
            ) : (
              "Sign in with Google"
            )}
          </button>

          <div className="mt-4">
            <small className="text-muted">
              Only authorized users can access this bookshelf.
              <br />
              Contact the administrator if you need access.
            </small>
          </div>
        </div>
      </Board>
    );
  }

  if (loading) {
    return (
      <Board title="📚 My Firebase Bookshelf">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Verifying authorization...</h5>
        </div>
      </Board>
    );
  }

  const getTagColor = (tag) => {
    return tagColors[tag] || "#6c757d";
  };

  const getDisplayName = () => {
    if (currentViewingUserEmail && user?.email === "ducenhandee@gmail.com") {
      return currentViewingUserEmail.split("@")[0]; // Extract username from email
    }
    return user.displayName;
  };

  return (
    <>
      <HideBtnsContext.Provider value={{ hideSessions: true }}>
        <BookShelf
          books={convertedBooks}
          title={`📚 ${getDisplayName()}'s Bookshelf ${
            currentViewingUserEmail ? "(Admin View)" : ""
          }`}
          paramGetTagColor={getTagColor}
          hideTimeTracker={true}
          deleteBook={deleteBook}
          onEditBook={handleEditBook}
          titleRight={
            <div className="d-flex gap-2 align-items-center">
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
              <button
                className="btn btn-outline-secondary"
                onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          }
        />
      </HideBtnsContext.Provider>

      <BookFormModal
        show={showAddForm}
        onCancel={() => setShowAddForm(false)}
        onSubmit={(bookData) => addBook(bookData)}
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
        onSubmit={(bookData) => updateBook(editingBook.id, bookData)}
        title={"Edit Book"}
        tagColors={tagColors}
        addTagColor={addTagColor}
        updateTagColor={updateTagColor}
        deleteTagColor={deleteTagColor}
        allShelves={allShelves}
        setAllShelves={setAllShelves}
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
