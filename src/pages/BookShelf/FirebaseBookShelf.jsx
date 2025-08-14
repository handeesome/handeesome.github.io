// FirebaseBookshelf.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { X, Edit2, Trash2, Plus, Palette } from "lucide-react";

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
import { db as firestore, auth as firebaseAuth } from "./firebase-config";
import { useTheme } from "../../ThemeContext";
import Board from "../../components/Board";
import BookShelf from "../../components/bookShelf/BookShelf";
import CoverDropZone from "../../components/bookShelf/CoverDropZone";

const TagManagementModal = ({
  isOpen,
  onClose,
  tagColors = {},
  onAddTag,
  onUpdateTag,
  onDeleteTag,
}) => {
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#FF6B6B");
  const [editingTag, setEditingTag] = useState(null);
  const [editColor, setEditColor] = useState("");
  const { theme } = useTheme();

  const handleAddTag = () => {
    if (newTagName.trim() && !tagColors[newTagName.trim()]) {
      onAddTag(newTagName.trim(), newTagColor);
      setNewTagName("");
      setNewTagColor("#FF6B6B");
    }
  };

  const handleUpdateTag = (tagName) => {
    onUpdateTag(tagName, editColor);
    setEditingTag(null);
    setEditColor("");
  };

  const startEditing = (tagName, currentColor) => {
    setEditingTag(tagName);
    setEditColor(currentColor);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const predefinedColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FECA57",
    "#FF9FF3",
    "#54A0FF",
    "#5F27CD",
    "#00D2D3",
    "#FF9F43",
    "#C44569",
    "#F8B500",
    "#6C5CE7",
    "#A29BFE",
    "#6C7CE0",
  ];

  if (!isOpen) return null;

  const bgDark = theme === "dark" ? "bg-dark text-light" : "";

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleBackdropClick}>
      <div className="modal-dialog modal-dialog-centered">
        <div className={`modal-content ${bgDark}`}>
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center">
              🎨 Manage Tag Colors
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"></button>
          </div>

          <div
            className="modal-body"
            style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {/* Add New Tag */}
            <div className={`card mb-4 ${bgDark}`}>
              <div className={`card-header bg-light ${bgDark}`}>
                <h6 className="card-title mb-0 d-flex align-items-center">
                  ➕ Add New Tag
                </h6>
              </div>
              <div className="card-body">
                <div className="row g-2 mb-3">
                  <div className="col">
                    <input
                      type="text"
                      className={`form-control ${bgDark}`}
                      placeholder="Tag name"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                  </div>
                  <div className="col-auto">
                    <input
                      type="color"
                      className={`form-control form-control-color ${bgDark}`}
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      style={{ width: "3rem" }}
                    />
                  </div>
                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddTag}
                      disabled={
                        !newTagName.trim() || tagColors[newTagName.trim()]
                      }>
                      Add
                    </button>
                  </div>
                </div>

                {/* Quick Color Picker */}
                <div className="d-flex flex-wrap gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`btn p-0 rounded-circle ${
                        newTagColor === color
                          ? "border border-dark border-3"
                          : "border"
                      }`}
                      onClick={() => setNewTagColor(color)}
                      style={{
                        backgroundColor: color,
                        width: "24px",
                        height: "24px",
                        transform:
                          newTagColor === color ? "scale(1.1)" : "scale(1)",
                      }}
                      title={color}></button>
                  ))}
                </div>
              </div>
            </div>

            {/* Existing Tags */}
            <div className={`card ${bgDark}`}>
              <div className={`card-header bg-light ${bgDark}`}>
                <h6 className="card-title mb-0 d-flex align-items-center">
                  🏷️ Existing Tags ({Object.keys(tagColors).length})
                </h6>
              </div>
              <div className="card-body">
                {Object.keys(tagColors).length === 0 ? (
                  <p className="text-muted text-center py-3 mb-0">
                    No tags created yet
                  </p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {Object.entries(tagColors).map(([tagName, color]) => (
                      <div
                        key={tagName}
                        className={`d-flex align-items-center justify-content-between p-3 bg-light rounded ${bgDark}`}>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle border"
                            style={{
                              backgroundColor: color,
                              width: "24px",
                              height: "24px",
                            }}
                          />
                          <span className="fw-medium">{tagName}</span>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          {editingTag === tagName ? (
                            <>
                              <input
                                type="color"
                                className="form-control form-control-color"
                                value={editColor}
                                onChange={(e) => setEditColor(e.target.value)}
                                style={{ width: "2rem", height: "2rem" }}
                              />
                              <button
                                type="button"
                                className="btn btn-success btn-sm"
                                onClick={() => handleUpdateTag(tagName)}>
                                Save
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => setEditingTag(null)}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => startEditing(tagName, color)}
                                title="Edit color">
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => onDeleteTag(tagName)}
                                title="Delete tag">
                                🗑️ Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormDataTags = ({
  items = [],
  colors = {},
  selectedItems = [],
  setSelectedItems,
  showInput,
  setShowInput,
  newShelf,
  setNewShelf,
  allShelves,
  setAllShelves,
  onItemsToggle,
}) => {
  const { theme } = useTheme();
  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((t) => t !== item) : [...prev, item]
    );

    if (onItemsToggle) {
      onItemsToggle(item);
    }
  };

  const defaultColors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
  ];
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        maxWidth: "300px",
      }}>
      {items.map((item, index) => {
        const isSelected = selectedItems.includes(item);
        const color =
          colors[item] || defaultColors[index % defaultColors.length];
        return (
          <button
            key={item}
            type="button"
            className={`btn book-tag ${isSelected ? "selected" : ""}`}
            onClick={() => toggleItem(item)}
            style={{
              fontSize: "0.6rem",
              padding: "2px 4px",
              "--tag-color": color,
            }}>
            {item} {isSelected && "✔"}
          </button>
        );
      })}
      <div key="input-row" className="row g-2 align-items-center">
        <div className="col" style={{ display: showInput ? "block" : "none" }}>
          <input
            type="text"
            className={`form-control ${
              theme === "dark" ? "bg-dark text-light" : ""
            }`}
            placeholder="New Shelf"
            value={newShelf}
            onChange={(e) => setNewShelf(e.target.value)}
          />
        </div>
        {showInput && (
          <button
            type="button"
            className="btn col-auto"
            onClick={() => {
              setAllShelves([...allShelves, newShelf]);
              setNewShelf("");
              setShowInput(false);
            }}>
            ✔️
          </button>
        )}
      </div>
    </div>
  );
};

const FormRow = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  options,
  customComponent,
  hideInput = false,
  ...rest
}) => {
  const { theme } = useTheme();
  const darkBg = theme === "dark" ? "bg-dark text-light" : "";
  return (
    <div className="row g-3 align-items-center mb-2">
      {label && (
        <div className="col-md-auto">
          <label className="form-label mb-0">{label}</label>
        </div>
      )}
      <div className="col-auto d-flex gap-2">
        {!hideInput && (
          <>
            {type === "select" ? (
              <select
                className={`form-select ${darkBg}`}
                value={value}
                onChange={onChange}
                {...rest}>
                {options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : type === "textarea" ? (
              <textarea
                className={`form-control ${darkBg}`}
                placeholder={placeholder || label}
                style={{ width: "100vh" }}
                value={value}
                onChange={onChange}
                {...rest}
              />
            ) : (
              <input
                type={type}
                className={`form-control ${darkBg}`}
                placeholder={placeholder || label}
                value={value}
                onChange={onChange}
                {...rest}
              />
            )}
          </>
        )}
        {customComponent && customComponent}
      </div>
    </div>
  );
};

const getInitialFormData = () => ({
  title: "",
  title2: "",
  author: "",
  pages: "",
  rating: "",
  shelves: ["to-read"],
  tags: [],
  dateStarted: "N/A",
  dateFinished: "N/A",
  dateAdded: new Date().toISOString().split("T")[0],
  notes: "",
});

const BookFormModal = ({
  book = {},
  onSubmit,
  onCancel,
  title,
  show,
  tagColors,
  addTagColor,
  updateTagColor,
  deleteTagColor,
  allShelves,
  setAllShelves,
}) => {
  const { theme } = useTheme();
  const [showInput, setShowInput] = useState(false);
  const [selectedTags, setSelectedTags] = useState(book?.tags || []);
  const [selectedShelves, setSelectedShelves] = useState(book?.shelves || []);
  const [newShelf, setNewShelf] = useState("");
  const [showTagManagementModal, setShowTagManagementModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const allTags = Object.keys(tagColors);

  const [formData, setFormData] = useState({
    ...getInitialFormData(),
    // prefill with book data if needed
    ...(book || {}),
    pages: book?.pages || "",
    rating: book?.rating || "",
    shelves: book?.shelves || ["to-read"],
    tags: book?.tags || [],
    coverBase64: book?.coverBase64 || "",
  });
  // Add this useEffect in BookFormModal component, after your useState declarations
  useEffect(() => {
    if (book && book.id) {
      // Update form data when book prop changes
      setFormData({
        ...getInitialFormData(),
        ...book,
        pages: book.pages || "",
        rating: book.rating || "",
        shelves: book.shelves || ["to-read"],
        tags: book.tags || [],
        coverBase64: book.coverBase64 || "",
      });

      // Update selected items
      setSelectedTags(book.tags || []);
      setSelectedShelves(book.shelves || []);
    } else if (!book) {
      // Only reset when book becomes null/undefined
      setFormData(getInitialFormData());
      setSelectedTags([]);
      setSelectedShelves([]);
    }
  }, [book?.id]); // Only depend on book.id instead of the entire book object
  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErrors({});
    const errors = {};
    if (selectedShelves.length === 0) {
      errors.shelves = "At least one shelf must be selected";
    }

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.author.trim()) {
      errors.author = "Author is required";
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const processedData = {
      ...formData,
      pages: parseInt(formData.pages) || 0,
      rating: parseFloat(formData.rating) || 0,
      tags: selectedTags,
      shelves: selectedShelves,
      coverBase64: formData.coverBase64,
    };
    onSubmit(processedData);

    // Only reset form data for new books (when book.id doesn't exist)
    if (!book.id) {
      setFormData(getInitialFormData());
      setSelectedTags([]);
      setSelectedShelves([]);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!show) return null;
  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleBackdropClick}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className={`modal-content ${theme === "dark" ? "bg-dark" : ""}`}>
          <div className="modal-header">
            <h5 className="modal-title">📚{title}</h5>
            <button
              type="button"
              className={`btn-close ${
                theme === "dark" ? "btn-close-white" : ""
              }`}
              onClick={onCancel}
              aria-label="Close"></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit} id="bookForm">
              <div className="row g-0">
                <div className="col-md-4 d-flex justify-content-center align-items-start">
                  <div className="text-center">
                    <div className="mb-3">
                      <CoverDropZone
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <FormRow
                    label="Title *"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                  <FormRow
                    label="Second Title"
                    value={formData.title2}
                    onChange={(e) =>
                      setFormData({ ...formData, title2: e.target.value })
                    }
                  />
                  <FormRow
                    label="Author *"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    required
                  />

                  <FormRow
                    label="Pages"
                    type="number"
                    min="1"
                    value={formData.pages}
                    onChange={(e) =>
                      setFormData({ ...formData, pages: e.target.value })
                    }
                  />
                  <FormRow
                    label="Shelves"
                    hideInput="true"
                    value={formData.shelves}
                    customComponent={
                      <>
                        <FormDataTags
                          items={allShelves}
                          selectedItems={selectedShelves}
                          setSelectedItems={setSelectedShelves}
                          showInput={showInput}
                          setShowInput={setShowInput}
                          newShelf={newShelf}
                          setNewShelf={setNewShelf}
                          allShelves={allShelves}
                          setAllShelves={setAllShelves}
                          onItemsToggle={() => {
                            if (validationErrors.shelves) {
                              setValidationErrors((prev) => ({
                                ...prev,
                                shelves: undefined,
                              }));
                            }
                          }}
                        />
                        {validationErrors.shelves && (
                          <small className="text-danger mt-1 d-block">
                            ⚠️{validationErrors.shelves}
                          </small>
                        )}

                        <button
                          type="button"
                          className="btn btn-primary col-auto"
                          onClick={() => setShowInput(true)}>
                          New Shelf
                        </button>
                      </>
                    }
                  />
                  <FormRow
                    label="Rating (1-5)"
                    type="number"
                    min="1"
                    max="5"
                    step="0.01"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                  />
                  <FormRow
                    label="Tags"
                    hideInput="true"
                    customComponent={
                      <>
                        <FormDataTags
                          items={allTags}
                          colors={tagColors}
                          selectedItems={selectedTags}
                          setSelectedItems={setSelectedTags}
                        />
                        <button
                          type="button"
                          onClick={() => setShowTagManagementModal(true)}
                          className="btn btn-outline-primary d-flex align-items-center gap-2"
                          style={{
                            backgroundColor: "#6f42c1",
                            borderColor: "#6f42c1",
                            color: "white",
                          }}>
                          <Palette size={18} />
                          Manage Tags
                        </button>
                      </>
                    }
                  />

                  <FormRow
                    label="Date Started"
                    type="date"
                    value={formData.dateStarted}
                    onChange={(e) =>
                      setFormData({ ...formData, dateStarted: e.target.value })
                    }
                  />
                  <FormRow
                    label="Date Finished"
                    type="date"
                    value={formData.dateFinished}
                    onChange={(e) =>
                      setFormData({ ...formData, dateFinished: e.target.value })
                    }
                  />
                  <FormRow
                    label="Date Added"
                    type="date"
                    value={formData.dateAdded}
                    onChange={(e) =>
                      setFormData({ ...formData, dateAdded: e.target.value })
                    }
                  />
                  <FormRow
                    label="Notes"
                    type="textarea"
                    rows="3"
                    placeholder="You can add the Book's Introduction or Your thoughts about this book..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" form="bookForm" className="btn btn-primary">
              {book.id ? "💾 Update Book" : "➕ Add Book"}
            </button>
          </div>
        </div>
      </div>
      <TagManagementModal
        isOpen={showTagManagementModal}
        onClose={() => setShowTagManagementModal(false)}
        tagColors={tagColors}
        onAddTag={addTagColor}
        onUpdateTag={updateTagColor}
        onDeleteTag={deleteTagColor}
      />
    </div>
  );
};

const FirebaseBookshelf = () => {
  const [user, setUser] = useState(null);
  const [tagColors, setTagColors] = useState([]);
  const [books, setBooks] = useState([]);

  const [allShelves, setAllShelves] = useState([
    ...new Set(books.flatMap((book) => book.shelves)),
  ]);

  useEffect(() => {
    setAllShelves([...new Set(books.flatMap((book) => book.shelves))]);
  }, [books]);

  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchBooks(currentUser.uid);
      } else {
        setBooks([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch books from Firebase
  const fetchBooks = async (userId) => {
    try {
      const q = query(
        collection(firestore, "books"),
        where("userId", "==", userId)
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

      // FIXED: Fetch tag colors from the user's document in books collection
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
      await signInWithPopup(firebaseAuth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = () => {
    signOut(firebaseAuth);
    setIsExpanded(false);
  };

  const addTagColor = async (newTagName, newTagColor) => {
    if (!user || !newTagName) return false;

    const userDocRef = doc(firestore, "books", user.uid);

    try {
      await setDoc(
        userDocRef,
        {
          tagColors: { [newTagName]: newTagColor },
          userId: user.uid,
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

    const userDocRef = doc(firestore, "books", user.uid);

    try {
      await updateDoc(userDocRef, {
        [`tagColors.${tagName}`]: newColor,
        userId: user.uid,
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

    const userDocRef = doc(firestore, "books", user.uid);

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
        userId: user.uid,
        dateAdded: new Date().toISOString().split("T")[0],
        createdAt: new Date(),
      });

      const newBook = { id: docRef.id, ...bookData, userId: user.uid };
      setBooks((prev) => [newBook, ...prev]);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const updateBook = async (bookId, bookData) => {
    console.log("Updating book:", bookId, bookData); // Add this for debugging
    try {
      await updateDoc(doc(firestore, "books", bookId), bookData);
      setBooks((prev) =>
        prev.map((book) =>
          book.id === bookId ? { ...book, ...bookData } : book
        )
      );
      setEditingBook(null); // This should close the modal
      console.log("Book updated successfully"); // Add this for debugging
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
    notes: book.notes || "", // Ensure notes is always a string
  }));

  if (!user) {
    return (
      <Board title="📚 My Firebase Bookshelf">
        <div className="text-center py-5">
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
          <h4>Welcome to Your Personal Bookshelf</h4>
          <p className="text-muted mb-4">
            Sign in to start managing your book collection
          </p>
          <button className="btn btn-primary btn-lg" onClick={signInWithGoogle}>
            Sign in with Google
          </button>
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
          <h5 className="text-muted">Loading your books...</h5>
        </div>
      </Board>
    );
  }
  const getTagColor = (tag) => {
    return tagColors[tag] || "#6c757d"; // Default gray if tag not found
  };

  return (
    <>
      <BookShelf
        books={convertedBooks}
        title={`📚 ${user.displayName}'s Bookshelf`}
        paramGetTagColor={getTagColor}
        disableBtns={true}
        deleteBook={deleteBook}
        onEditBook={handleEditBook}
        titleRight={
          <div className="d-flex gap-2 align-items-center">
            <button
              className="btn btn-success"
              onClick={() => setShowAddForm(true)}>
              + Add Book
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        }
      />
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
    </>
  );
};

export default FirebaseBookshelf;
