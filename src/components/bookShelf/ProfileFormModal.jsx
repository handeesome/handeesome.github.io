import ProfilePictureUpload from "./ProfilePictureUpload";
import Modal from "../ui/Modal";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
const ProfileFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  profileData,
  defaultName,
}) => {
  const [formData, setFormData] = useState({
    userName: profileData.userName || defaultName || "User",
    shelfName: profileData.shelfName || defaultName || "User's Bookshelf",
    shelfDescription:
      profileData.shelfDescription ||
      "This is a book shelf containing various books and collections.",
    profilePictureBase64: profileData.avatarBase64 || "",
    cropData: null,
    isPublic: profileData.isPublic !== undefined ? profileData.isPublic : true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form refresh
    setIsLoading(true);

    const success = await onSubmit({
      userName: formData.userName,
      shelfName: formData.shelfName,
      shelfDescription: formData.shelfDescription,
      avatarBase64: formData.profilePictureBase64, // Fixed property name
      cropData: formData.cropData,
      isPublic: formData.isPublic,
    });

    setIsLoading(false);

    if (success) {
      onClose(); // Close modal on success
    } else {
      console.error("Failed to update profile");
      // Optionally show error message to user
    }
  };

  const modalFooter = (
    <button type="submit" form="profileForm" className="btn btn-primary">
      Update Profile
    </button>
  );
  const { theme } = useTheme();
  const darkBg = theme === "dark" ? "bg-dark text-light" : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Modify Profile"}
      size="lg"
      footer={modalFooter}>
      {!isLoading ? (
        <div className="row">
          <div className="col-md-4 d-flex align-items-center justify-content-center">
            <ProfilePictureUpload
              formData={formData}
              setFormData={setFormData}
            />
          </div>
          <div className="col-md-8">
            <form onSubmit={handleSubmit} id="profileForm">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="userName" className="form-label">
                    <strong>User Name:</strong>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${darkBg}`}
                    id="userName"
                    value={formData.userName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, userName: e.target.value })
                    }
                    placeholder="Enter user name"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="shelfName" className="form-label">
                    <strong>Shelf Name:</strong>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${darkBg}`}
                    id="shelfName"
                    value={formData.shelfName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, shelfName: e.target.value })
                    }
                    placeholder="Enter shelf name"
                  />
                </div>

                <div className="col-12 mb-3">
                  <label htmlFor="description" className="form-label">
                    <strong>Description:</strong>
                  </label>
                  <textarea
                    className={`form-control ${darkBg}`}
                    id="description"
                    rows="3"
                    value={formData.shelfDescription || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shelfDescription: e.target.value,
                      })
                    }
                    placeholder="Enter description"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Updating your Profile...</h5>
        </div>
      )}
    </Modal>
  );
};

export default ProfileFormModal;
