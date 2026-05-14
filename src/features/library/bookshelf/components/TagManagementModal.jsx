// components/TagManagementModal.jsx
import React, { useState } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import Modal from "../../../../components/ui/Modal";
import {
  Check,
  CirclePlus,
  Pencil,
  Palette,
  SwatchBook,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { FormSection, ModalTitle } from "./ModalFormParts";
import "./ModalForms.css";

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
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [updatingTag, setUpdatingTag] = useState(null);
  const { theme } = useTheme();
  const trimmedNewTagName = newTagName.trim();
  const tagEntries = Object.entries(tagColors);
  const duplicateTag = Boolean(trimmedNewTagName && tagColors[trimmedNewTagName]);

  const handleAddTag = async () => {
    if (trimmedNewTagName && !tagColors[trimmedNewTagName]) {
      setIsAddingTag(true);
      try {
        const success = await onAddTag(trimmedNewTagName, newTagColor);
        if (success !== false) {
          setNewTagName("");
          setNewTagColor("#FF6B6B");
        }
      } finally {
        setIsAddingTag(false);
      }
    }
  };

  const handleUpdateTag = async (tagName) => {
    setUpdatingTag(tagName);
    try {
      const success = await onUpdateTag(tagName, editColor);
      if (success !== false) {
        setEditingTag(null);
        setEditColor("");
      }
    } finally {
      setUpdatingTag(null);
    }
  };

  const startEditing = (tagName, currentColor) => {
    setEditingTag(tagName);
    setEditColor(currentColor);
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
  const inputThemeClass = theme === "dark" ? "bg-dark text-light" : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<ModalTitle icon={Palette}>Manage Tag Colors</ModalTitle>}
      size="lg"
      className="book-form-modal tag-management-modal"
      bodyClassName="book-form-modal-body"
      maxHeight="70vh">
      <div className="tag-management">
        <FormSection
          icon={CirclePlus}
          title="Add Tag"
          className="tag-management-section">
          <div className="tag-management-add-row">
            <div className="tag-management-name-field">
              <input
                type="text"
                className={`form-control ${inputThemeClass} ${
                  duplicateTag ? "is-invalid" : ""
                }`}
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              />
              {duplicateTag && (
                <div className="invalid-feedback d-block">
                  This tag already exists.
                </div>
              )}
            </div>
            <label className="tag-management-color-input">
              <input
                type="color"
                className={`form-control form-control-color ${inputThemeClass}`}
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                aria-label="New tag color"
              />
            </label>
            <button
              type="button"
              className="btn btn-primary tag-management-add-btn"
              onClick={handleAddTag}
              disabled={!trimmedNewTagName || duplicateTag || isAddingTag}>
              {isAddingTag ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  />
                  Adding...
                </>
              ) : (
                <>
                  <CirclePlus size={16} />
                  Add
                </>
              )}
            </button>
          </div>

          <div className="tag-management-swatch-grid" aria-label="Quick colors">
            {predefinedColors.map((color) => (
              <button
                key={color}
                type="button"
                className={`tag-management-swatch ${
                  newTagColor === color ? "selected" : ""
                }`}
                onClick={() => setNewTagColor(color)}
                style={{ "--swatch-color": color }}
                title={color}
                aria-label={`Use color ${color}`}>
                {newTagColor === color && <Check size={13} strokeWidth={3} />}
              </button>
            ))}
          </div>
        </FormSection>

        <FormSection
          icon={SwatchBook}
          title="Existing Tags"
          count={tagEntries.length}
          className={`tag-management-section ${bgDark}`}>
          {tagEntries.length === 0 ? (
            <div className="tag-management-empty">
              <Tag size={22} />
              No tags created yet
            </div>
          ) : (
            <div className="tag-management-list">
              {tagEntries.map(([tagName, color]) => (
                <div key={tagName} className="tag-management-item">
                  <div className="tag-management-tag-preview">
                    <span
                      className="tag-management-color-dot"
                      style={{ backgroundColor: color }}
                    />
                    <span
                      className="tag-management-pill"
                      style={{ "--tag-color": color }}>
                      {tagName}
                    </span>
                  </div>

                  <div className="tag-management-actions">
                    {editingTag === tagName ? (
                      <>
                        <input
                          type="color"
                          className={`form-control form-control-color ${inputThemeClass}`}
                          value={editColor}
                          onChange={(e) => setEditColor(e.target.value)}
                          aria-label={`Color for ${tagName}`}
                        />
                        <button
                          type="button"
                          className="btn btn-success btn-sm tag-management-icon-btn"
                          onClick={() => handleUpdateTag(tagName)}
                          disabled={updatingTag === tagName}>
                          {updatingTag === tagName ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm"
                                aria-hidden="true"
                              />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check size={15} />
                              Save
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm tag-management-icon-btn"
                          onClick={() => setEditingTag(null)}>
                          <X size={15} />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm tag-management-icon-btn"
                          onClick={() => startEditing(tagName, color)}
                          title="Edit color">
                          <Pencil size={15} />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm tag-management-icon-btn"
                          onClick={() => onDeleteTag(tagName)}
                          title="Delete tag">
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </FormSection>
      </div>
    </Modal>
  );
};

export default TagManagementModal;
