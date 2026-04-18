// components/BookFormModal.jsx
import React, { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import CoverDropZone from "./CoverDropZone";
import TagManagementModal from "./TagManagementModal";
import BookShelfNameModal from "./BookShelfNameModal";
import BookSearchBar from "./BookSearchBar";
import FormDataTags from "./FormDataTags";
import FormRow from "./FormRow";
import { Editor } from "@tinymce/tinymce-react";
import Modal from "../../../components/ui/Modal";
import { useTheme } from "../../../contexts/ThemeContext";
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
  renameShelf,
  deleteShelf,
}) => {
  const [selectedTags, setSelectedTags] = useState(book?.tags || []);
  const [selectedShelves, setSelectedShelves] = useState(book?.shelves || []);
  const [showTagManagementModal, setShowTagManagementModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShelfNameModal, setShowShelfNameModal] = useState(false);

  const { theme } = useTheme();
  const darkMode = theme === "dark" ? true : false;

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

  useEffect(() => {
    if (book?.id) {
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
  }, [book?.id]);

  useEffect(() => {
    // When a shelf is renamed, update selectedShelves to use the new name
    if (selectedShelves.length > 0 && allShelves.length > 0) {
      // Filter out any selected shelves that no longer exist in allShelves
      const validSelectedShelves = selectedShelves.filter((shelf) =>
        allShelves.includes(shelf)
      );

      // Only update if something changed to avoid infinite loops
      if (validSelectedShelves.length !== selectedShelves.length) {
        setSelectedShelves(validSelectedShelves);
      }
    }
  }, [allShelves]);

  const handleSubmit = async (e) => {
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
    setIsSubmitting(true);
    try {
      await onSubmit(processedData);

      // Only reset form data for new books (when book.id doesn't exist)
      if (!book?.id) {
        setFormData(getInitialFormData());
        setSelectedTags([]);
        setSelectedShelves([]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalFooter = (
    <>
      <button
        type="submit"
        form="bookForm"
        className="btn btn-primary"
        disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"></span>
            Updating...
          </>
        ) : book?.id ? (
          "💾 Update Book"
        ) : (
          "➕ Add Book"
        )}
      </button>
    </>
  );

  if (!show) return null;

  return (
    <>
      <Modal
        isOpen={show}
        onClose={onCancel}
        title={`📚${title}`}
        size="lg"
        footer={modalFooter}>
        {isSubmitting && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}>
            <div className="text-center">
              <div
                className="spinner-border mb-3"
                style={{ color: "white" }}
                role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div style={{ color: "white" }}>Updating book...</div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} id="bookForm">
          <div className="row g-0">
            <div className="col-md-4 d-flex justify-content-center align-items-start">
              <div className="text-center d-flex flex-column align-items-center">
                <div className="mb-3">
                  <CoverDropZone
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowSearchModal(true)}>
                  Get from
                  <br /> Cenhan's BookShelf
                </button>
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
                placeholder={"(optional)"}
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
                placeholder={"(optional)"}
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
                      onClick={() => setShowShelfNameModal(true)}>
                      Manage Shelves
                    </button>
                  </>
                }
              />
              <FormRow
                label="Rating (1-5)"
                placeholder={"(optional)"}
                type="number"
                min="1"
                max="5"
                step="0.01"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
                style={{ width: "120px" }}
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
                label="Date Started (optional)"
                type="date"
                value={formData.dateStarted}
                onChange={(e) =>
                  setFormData({ ...formData, dateStarted: e.target.value })
                }
              />
              <FormRow
                label="Date Finished (optional)"
                type="date"
                value={formData.dateFinished}
                onChange={(e) =>
                  setFormData({ ...formData, dateFinished: e.target.value })
                }
              />
              <FormRow
                label="Date Added (optional)"
                type="date"
                value={formData.dateAdded}
                onChange={(e) =>
                  setFormData({ ...formData, dateAdded: e.target.value })
                }
              />
            </div>
            <div>Notes:</div>
            <Editor
              value={formData.notes}
              onEditorChange={(content) =>
                setFormData({ ...formData, notes: content })
              }
              init={{
                height: 300,
                width: "100%",
                menubar: false,
                skin: darkMode ? "oxide-dark" : "oxide",
                content_css: darkMode ? "dark" : "default",

                placeholder:
                  "You can add the Book's Introduction or Your thoughts about this book...(optional)",
                plugins: [
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "searchreplace",
                ],
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | checklist numlist bullist indent outdent",
              }}
            />
          </div>
        </form>
      </Modal>
      <BookShelfNameModal
        isOpen={showShelfNameModal}
        onClose={() => setShowShelfNameModal(false)}
        existingShelves={allShelves}
        setAllShelves={setAllShelves}
        renameShelf={renameShelf}
        deleteShelf={deleteShelf}
        onShelfRenamed={(oldName, newName) => {
          setSelectedShelves((prev) =>
            prev.map((shelf) => (shelf === oldName ? newName : shelf))
          );
        }}
        onShelfDeleted={(deletedShelf) => {
          setSelectedShelves((prev) =>
            prev.filter((shelf) => shelf !== deletedShelf)
          );
        }}
      />
      <TagManagementModal
        isOpen={showTagManagementModal}
        onClose={() => setShowTagManagementModal(false)}
        tagColors={tagColors}
        onAddTag={addTagColor}
        onUpdateTag={updateTagColor}
        onDeleteTag={deleteTagColor}
      />
      <BookSearchBar
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelect={(bookData) => {
          setFormData({
            ...formData,
            title: bookData.title,
            title2: bookData.title2,
            author: bookData.author,
            pages: bookData.pages,
            rating: bookData.rating,
            coverBase64: `/images/bookCovers/${bookData.coverId}.jpg`,
          });
          setShowSearchModal(false);
        }}
      />
    </>
  );
};

export default BookFormModal;
