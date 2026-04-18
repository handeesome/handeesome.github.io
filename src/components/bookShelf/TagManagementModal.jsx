// components/TagManagementModal.jsx
import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import Modal from "../ui/Modal";

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🎨 Manage Tag Colors"
      size="md"
      bodyClassName="p-0"
      maxHeight="70vh">
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
                disabled={!newTagName.trim() || tagColors[newTagName.trim()]}>
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
                  transform: newTagColor === color ? "scale(1.1)" : "scale(1)",
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
    </Modal>
  );
};

export default TagManagementModal;
