import { useTheme } from "../../ThemeContext";
import Modal from "../ui/Modal";
import { useState } from "react";

const BookShelfNameModal = ({
  isOpen,
  onClose,
  existingShelves = [],
  setAllShelves,
  renameShelf,
  deleteShelf,
  onShelfRenamed,
  onShelfDeleted,
}) => {
  const { theme } = useTheme();
  const [showInput, setShowInput] = useState(false);
  const [newShelf, setNewShelf] = useState("");
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);
  const trimmed = newShelf.trim();
  const isEmpty = trimmed === "";
  const isDuplicate = existingShelves
    .map((s) => s.toLowerCase())
    .includes(trimmed.toLowerCase());

  const [editingName, setEditingName] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const bgDark = theme === "dark" ? "bg-dark text-light" : "";

  const onEditing = (name) => {
    setEditingName(name);
    setEditValue(name);
  };
  const saveEditing = async () => {
    const trimmedValue = editValue.trim();

    if (!trimmedValue) {
      alert("Shelf name cannot be empty");
      return;
    }

    if (trimmedValue === editingName) {
      // No change, just cancel editing
      setEditingName(null);
      setEditValue("");
      return;
    }
    const isDuplicateName = existingShelves
      .filter((s) => s !== editingName) // Exclude current shelf being edited
      .map((s) => s.toLowerCase())
      .includes(trimmedValue.toLowerCase());

    if (isDuplicateName) {
      alert("A shelf with this name already exists");
      return;
    }
    setIsRenaming(true);
    try {
      const success = await renameShelf(editingName, trimmedValue);
      if (success) {
        // Update local state only after successful Firebase update
        const updated = existingShelves.map((shelf) =>
          shelf === editingName ? trimmedValue : shelf
        );
        setAllShelves(updated);

        if (onShelfRenamed) {
          onShelfRenamed(editingName, trimmedValue);
        }

        setEditingName(null);
        setEditValue("");
      } else {
        alert("Failed to rename shelf. Please try again.");
      }
    } finally {
      setIsRenaming(false);
    }
  };
  const onDelete = async (shelfName) => {
    setIsDeleting(true);

    try {
      const success = await deleteShelf(shelfName);

      if (success) {
        // Update local state only after successful Firebase update
        const updated = existingShelves.filter((shelf) => shelf !== shelfName);
        setAllShelves(updated);

        // Notify parent component about the deletion
        if (onShelfDeleted) {
          onShelfDeleted(shelfName);
        }
      }
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Bookshelves"
      size="md"
      bodyClassName="p-0"
      maxHeight="70vh">
      <div className={`card ${bgDark}`}>
        <div
          className={`card-header bg-light ${bgDark} d-flex justify-content-between align-items-center`}>
          <h6 className="card-title mb-0 d-flex align-items-center">
            🏷️ Existing Shelves ({existingShelves.length})
          </h6>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowInput(true)}>
            Add New Shelf
          </button>
        </div>
        <div className="card-body">
          <div key="input-row" className="row g-2 align-items-center">
            <div
              className="col"
              style={{ display: showInput ? "block" : "none" }}>
              <input
                type="text"
                className={`form-control ${
                  theme === "dark" ? "bg-dark text-light" : ""
                }`}
                placeholder="New Shelf"
                value={newShelf}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewShelf(e.target.value);
                  if (value.trim()) {
                    setShowEmptyWarning(false);
                  }
                }}
              />
              {showEmptyWarning && (
                <small className="text-danger">
                  Shelf name cannot be empty.
                </small>
              )}

              {trimmed && isDuplicate && (
                <small className="text-danger">
                  Shelf name already exists.
                </small>
              )}
            </div>
            {showInput && (
              <button
                type="button"
                className="btn col-auto"
                onClick={() => {
                  if (isEmpty) {
                    setShowEmptyWarning(true);
                    return;
                  }
                  if (isDuplicate) return;
                  setAllShelves([...existingShelves, newShelf]);
                  setNewShelf("");
                  setShowEmptyWarning(false);
                  setShowInput(false);
                }}>
                ✔️
              </button>
            )}
          </div>
          {existingShelves.length === 0 ? (
            <p className="text-muted text-center py-3 mb-0">
              No shelves created yet
            </p>
          ) : (
            <div className="d-flex flex-column gap-2">
              {existingShelves.map((name) => (
                <div
                  key={name}
                  className={`d-flex align-items-center justify-content-between p-3 bg-light rounded ${bgDark}`}>
                  <div className="d-flex align-items-center gap-3">
                    {editingName === name ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span className="fw-medium">{name}</span>
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {editingName === name ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={saveEditing}
                          disabled={isRenaming || isDeleting}>
                          {isRenaming ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"></span>
                              Saving...
                            </>
                          ) : (
                            "Save"
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingName(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => onEditing(name)}
                          disabled={isRenaming || isDeleting}>
                          ✏️ Edit Name
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onDelete(name)}
                          disabled={isRenaming || isDeleting}>
                          {isDeleting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Deleting...
                            </>
                          ) : (
                            "🗑️ Delete"
                          )}
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

export default BookShelfNameModal;
