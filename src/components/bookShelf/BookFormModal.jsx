// components/BookFormModal.jsx
import React, { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import CoverDropZone from "../bookShelf/CoverDropZone";
import TagManagementModal from "./TagManagementModal";
import FormDataTags from "./FormDataTags";
import FormRow from "./FormRow";
import { Editor } from "@tinymce/tinymce-react";
import Modal from "../ui/Modal";
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
    if (!book?.id) {
      setFormData(getInitialFormData());
      setSelectedTags([]);
      setSelectedShelves([]);
    }
  };

  const modalFooter = (
    <>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" form="bookForm" className="btn btn-primary">
        {book?.id ? "💾 Update Book" : "➕ Add Book"}
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
      <TagManagementModal
        isOpen={showTagManagementModal}
        onClose={() => setShowTagManagementModal(false)}
        tagColors={tagColors}
        onAddTag={addTagColor}
        onUpdateTag={updateTagColor}
        onDeleteTag={deleteTagColor}
      />
    </>
  );
};

export default BookFormModal;
