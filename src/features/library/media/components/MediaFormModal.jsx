import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clapperboard,
  Library,
  Palette,
  Plus,
  Save,
  Star,
  Tags,
} from "lucide-react";
import Modal from "../../../../components/ui/Modal";
import CoverDropZone from "../../bookshelf/components/CoverDropZone";
import FormDataTags from "../../bookshelf/components/FormDataTags";
import FormRow from "../../bookshelf/components/FormRow";
import BookShelfNameModal from "../../bookshelf/components/BookShelfNameModal";
import TagManagementModal from "../../bookshelf/components/TagManagementModal";
import { Editor } from "@tinymce/tinymce-react";
import {
  TINYMCE_API_KEY,
  TINYMCE_CLOUD_CHANNEL,
} from "../../../../lib/tinymce-config";
import {
  FormSection,
  getModalSubmitErrorMessage,
  ModalFooterActions,
  ModalSubmittingOverlay,
  ModalSubmitErrorAlert,
  ModalTitle,
} from "../../bookshelf/components/ModalFormParts";
import { useTheme } from "../../../../contexts/ThemeContext";
import {
  FIRESTORE_FIELD_VALUE_LIMIT_BYTES,
  isFirestoreCoverTooLarge,
} from "../../bookshelf/utils/imageStorage";
import "../../bookshelf/components/ModalForms.css";

const today = () => new Date().toISOString().split("T")[0];

const getInitialFormData = () => ({
  title: "",
  director: "",
  cast: "",
  rating: "",
  shelves: ["watching"],
  tags: [],
  dateAdded: today(),
  review: "",
  coverBase64: "",
});

const MediaFormModal = ({
  media = {},
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
  const [selectedTags, setSelectedTags] = useState(media?.tags || []);
  const [selectedShelves, setSelectedShelves] = useState(media?.shelves || []);
  const [showTagManagementModal, setShowTagManagementModal] = useState(false);
  const [showShelfNameModal, setShowShelfNameModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const allTags = Object.keys(tagColors || {});
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const [localShelves, setLocalShelves] = useState(() =>
    Array.from(new Set([...(allShelves || []), ...(media?.shelves || [])]))
  );

  const [formData, setFormData] = useState({
    ...getInitialFormData(),
    ...(media || {}),
    rating: media?.rating || "",
    shelves: media?.shelves || ["watching"],
    tags: media?.tags || [],
    coverBase64: media?.coverBase64 || "",
  });
  const shelfOptions = Array.from(
    new Set([...localShelves, ...selectedShelves])
  );

  useEffect(() => {
    if (media?.id) {
      setFormData({
        ...getInitialFormData(),
        ...media,
        rating: media.rating || "",
        shelves: media.shelves || ["watching"],
        tags: media.tags || [],
        coverBase64: media.coverBase64 || "",
      });
      setSelectedTags(media.tags || []);
      setSelectedShelves(media.shelves || []);
    } else if (!media) {
      setFormData(getInitialFormData());
      setSelectedTags([]);
      setSelectedShelves([]);
    }
  }, [media?.id]);

  useEffect(() => {
    setLocalShelves((prev) =>
      Array.from(new Set([...prev, ...(allShelves || []), ...selectedShelves]))
    );
  }, [allShelves, selectedShelves]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setSubmitError("");
    const errors = {};

    if (!formData.title.trim()) errors.title = "Title is required";
    if (selectedShelves.length === 0) {
      errors.shelves = "At least one shelf must be selected";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const processedData = {
      ...formData,
      rating: parseFloat(formData.rating) || 0,
      tags: selectedTags,
      shelves: selectedShelves,
      coverBase64: formData.coverBase64,
      dateAdded: formData.dateAdded || today(),
    };

    if (isFirestoreCoverTooLarge(processedData.coverBase64)) {
      setSubmitError(
        getModalSubmitErrorMessage(
          new Error(
            `The value of property "coverBase64" is longer than ${FIRESTORE_FIELD_VALUE_LIMIT_BYTES} bytes.`
          ),
          "media item"
        )
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(processedData);
      if (success === false) {
        setSubmitError(getModalSubmitErrorMessage(null, "media item"));
        return;
      }

      if (!media?.id) {
        setFormData(getInitialFormData());
        setSelectedTags([]);
        setSelectedShelves([]);
      }
    } catch (err) {
      setSubmitError(getModalSubmitErrorMessage(err, "media item"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalFooter = (
    <ModalFooterActions
      formId="mediaForm"
      isLoading={isSubmitting}
      loadingLabel="Saving..."
      onCancel={onCancel}
      submitIcon={media?.id ? Save : Plus}
      submitLabel={media?.id ? "Update Media" : "Add Media"}
    />
  );

  if (!show) return null;

  return (
    <>
      <Modal
        isOpen={show}
        onClose={onCancel}
        title={<ModalTitle icon={Clapperboard}>{title}</ModalTitle>}
        size="xl"
        className="book-form-modal"
        bodyClassName="book-form-modal-body"
        maxHeight="calc(100vh - 10rem)"
        footer={modalFooter}
        overlay={
          isSubmitting ? (
            <ModalSubmittingOverlay label="Saving media..." />
          ) : null
        }
      >
        <form onSubmit={handleSubmit} id="mediaForm" className="book-form">
          <ModalSubmitErrorAlert
            message={submitError}
            onDismiss={() => setSubmitError("")}
          />
          <div className="book-form-fields media-form-fields">
            <FormSection
              icon={Clapperboard}
              title="Cover"
              className="media-form-cover-section"
            >
              <div className="media-form-cover-wrap">
                <CoverDropZone formData={formData} setFormData={setFormData} />
              </div>
            </FormSection>

            <FormSection icon={Clapperboard} title="Media Details">
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
                  label="Director"
                  value={formData.director}
                  onChange={(e) =>
                    setFormData({ ...formData, director: e.target.value })
                  }
                />
                <FormRow
                  label="Cast"
                  placeholder="cast1, cast2"
                  value={formData.cast}
                  onChange={(e) =>
                    setFormData({ ...formData, cast: e.target.value })
                  }
                />
                <FormRow
                  label="Rating"
                  placeholder="1-5"
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

            <div className="media-form-taxonomy-row">
              <FormSection icon={Library} title="Shelves">
                <div className="book-form-pill-row">
                  <FormDataTags
                    items={shelfOptions}
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
                    onClick={() => setShowShelfNameModal(true)}
                  >
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
                    className="btn btn-outline-primary book-form-manage-btn"
                  >
                    <Palette size={16} />
                    Manage
                  </button>
                </div>
              </FormSection>
            </div>

            <FormSection icon={CalendarDays} title="Added Date">
              <div className="book-form-two-col">
                <FormRow
                  label="Added"
                  type="date"
                  value={formData.dateAdded || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, dateAdded: e.target.value })
                  }
                />
              </div>
            </FormSection>

            <FormSection
              icon={Star}
              title="Review"
              className="book-form-wide-section"
            >
              <Editor
                apiKey={TINYMCE_API_KEY}
                cloudChannel={TINYMCE_CLOUD_CHANNEL}
                value={formData.review}
                onEditorChange={(content) =>
                  setFormData({ ...formData, review: content })
                }
                init={{
                  height: 320,
                  width: "100%",
                  menubar: false,
                  skin: darkMode ? "oxide-dark" : "oxide",
                  content_css: darkMode ? "dark" : "default",
                  highlight_on_focus: false,
                  placeholder:
                    "Write review notes, reactions, or anything worth remembering.",
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
          </div>
        </form>
      </Modal>

      <BookShelfNameModal
        isOpen={showShelfNameModal}
        onClose={() => setShowShelfNameModal(false)}
        existingShelves={shelfOptions}
        setAllShelves={(nextShelves) => {
          setLocalShelves(nextShelves);
          setAllShelves(nextShelves);
        }}
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
    </>
  );
};

export default MediaFormModal;
