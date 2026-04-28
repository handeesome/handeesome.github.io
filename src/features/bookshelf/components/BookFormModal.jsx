// components/BookFormModal.jsx
import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  Library,
  NotebookPen,
  Palette,
  Plus,
  Quote,
  Save,
  Search,
  Tags,
} from "lucide-react";
import CoverDropZone from "./CoverDropZone";
import TagManagementModal from "./TagManagementModal";
import BookShelfNameModal from "./BookShelfNameModal";
import BookSearchBar from "./BookSearchBar";
import FormDataTags from "./FormDataTags";
import FormRow from "./FormRow";
import { Editor } from "@tinymce/tinymce-react";
import Modal from "../../../components/ui/Modal";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  FormSection,
  ModalFooterActions,
  ModalSubmittingOverlay,
  ModalTitle,
} from "./ModalFormParts";
import "./ModalForms.css";
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
  quotesText: "",
});

const quotesToText = (quotes) => {
  if (Array.isArray(quotes)) {
    return quotes.join("\n");
  }

  return typeof quotes === "string" ? quotes : "";
};

const textToQuotes = (text) =>
  text
    .split("\n")
    .map((quote) => quote.trim())
    .filter(Boolean);

const dateInputValue = (value) => (value === "N/A" ? "" : value || "");

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
    quotesText: quotesToText(book?.quotes),
  });
  const quoteCount = textToQuotes(formData.quotesText || "").length;
  const hasValidationErrors = Object.values(validationErrors).some(Boolean);

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
        quotesText: quotesToText(book.quotes),
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
      quotes: textToQuotes(formData.quotesText || ""),
    };
    delete processedData.quotesText;

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
    <ModalFooterActions
      formId="bookForm"
      isLoading={isSubmitting}
      loadingLabel="Updating..."
      onCancel={onCancel}
      submitIcon={book?.id ? Save : Plus}
      submitLabel={book?.id ? "Update Book" : "Add Book"}
    />
  );

  if (!show) return null;

  return (
    <>
      <Modal
        isOpen={show}
        onClose={onCancel}
        title={<ModalTitle icon={BookOpen}>{title}</ModalTitle>}
        size="xl"
        className="book-form-modal"
        bodyClassName="book-form-modal-body"
        maxHeight="calc(100vh - 10rem)"
        footer={modalFooter}>
        {isSubmitting && <ModalSubmittingOverlay label="Updating book..." />}
        <form onSubmit={handleSubmit} id="bookForm" className="book-form">
          <div className="book-form-grid">
            <aside className="book-form-cover-panel">
              <div className="book-form-cover-sticky">
                <div className="book-form-panel-label">Cover</div>
                <div className="book-form-cover-wrap">
                  <CoverDropZone
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary book-form-search-btn"
                  onClick={() => setShowSearchModal(true)}>
                  <Search size={16} />
                  Find in bookshelf
                </button>

                <div className="book-form-side-fields">
                  <FormSection icon={Library} title="Shelves">
                    {hasValidationErrors && (
                      <div className="book-form-error-summary">
                        <AlertTriangle size={16} />
                        <span>Check the highlighted fields before saving.</span>
                      </div>
                    )}
                    <div className="book-form-pill-row">
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
                      <button
                        type="button"
                        className="btn btn-outline-primary book-form-manage-btn"
                        onClick={() => setShowShelfNameModal(true)}>
                        <Library size={16} />
                        Manage
                      </button>
                    </div>
                    {validationErrors.shelves && (
                      <small className="text-danger mt-2 d-block">
                        {validationErrors.shelves}
                      </small>
                    )}
                  </FormSection>

                  <FormSection icon={Tags} title="Tags">
                    <div className="book-form-pill-row">
                      <FormDataTags
                        items={allTags}
                        colors={tagColors}
                        selectedItems={selectedTags}
                        setSelectedItems={setSelectedTags}
                      />
                      <button
                        type="button"
                        onClick={() => setShowTagManagementModal(true)}
                        className="btn btn-outline-primary book-form-manage-btn">
                        <Palette size={16} />
                        Manage
                      </button>
                    </div>
                  </FormSection>

                  <FormSection icon={CalendarDays} title="Dates">
                    <div className="book-form-three-col">
                      <FormRow
                        label="Started"
                        type="date"
                        value={dateInputValue(formData.dateStarted)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateStarted: e.target.value || "N/A",
                          })
                        }
                      />
                      <FormRow
                        label="Finished"
                        type="date"
                        value={dateInputValue(formData.dateFinished)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateFinished: e.target.value || "N/A",
                          })
                        }
                      />
                      <FormRow
                        label="Added"
                        type="date"
                        value={dateInputValue(formData.dateAdded)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateAdded:
                              e.target.value ||
                              new Date().toISOString().split("T")[0],
                          })
                        }
                      />
                    </div>
                  </FormSection>
                </div>
              </div>
            </aside>

            <div className="book-form-fields">
              <FormSection icon={BookOpen} title="Book Details">
                <div className="book-form-two-col">
                  <FormRow
                    label="Title *"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (validationErrors.title) {
                        setValidationErrors((prev) => ({
                          ...prev,
                          title: undefined,
                        }));
                      }
                    }}
                    invalid={Boolean(validationErrors.title)}
                    validationMessage={validationErrors.title}
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
                    onChange={(e) => {
                      setFormData({ ...formData, author: e.target.value });
                      if (validationErrors.author) {
                        setValidationErrors((prev) => ({
                          ...prev,
                          author: undefined,
                        }));
                      }
                    }}
                    invalid={Boolean(validationErrors.author)}
                    validationMessage={validationErrors.author}
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
                    label="Rating"
                    placeholder={"1-5"}
                    type="number"
                    min="1"
                    max="5"
                    step="0.01"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                  />
                </div>
              </FormSection>

              <FormSection
                icon={NotebookPen}
                title="Notes"
                className="book-form-wide-section">
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
                      "Add the book introduction or your thoughts about this book.",
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
              </FormSection>

              <FormSection
                icon={Quote}
                title="Quotes"
                count={quoteCount > 0 ? quoteCount : undefined}
                className="book-form-wide-section">
                <textarea
                  className={`form-control book-form-quotes ${
                    darkMode ? "bg-dark text-light" : ""
                  }`}
                  rows={6}
                  value={formData.quotesText}
                  placeholder={
                    "Add one quote per line. Each line will be saved as a separate quote."
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, quotesText: e.target.value })
                  }
                />
              </FormSection>
            </div>
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
