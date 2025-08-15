// components/BookFormModal.jsx
import React, { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { useTheme } from "../../ThemeContext";
import CoverDropZone from "../bookShelf/CoverDropZone";
import TagManagementModal from "./TagManagementModal";
import FormDataTags from "./FormDataTags";
import FormRow from "./FormRow";

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
  }, [book?.id]);

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
      <div className="modal-dialog modal-lg modal-dialog-centered">
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
                  <FormRow
                    label="Notes"
                    type="textarea"
                    rows="3"
                    placeholder="You can add the Book's Introduction or Your thoughts about this book...(optional)"
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

export default BookFormModal;
