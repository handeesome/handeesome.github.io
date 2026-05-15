import ProfilePictureUpload from "./ProfilePictureUpload";
import Modal from "../../../../components/ui/Modal";
import { useState } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import {
  BookOpen,
  FileText,
  Globe2,
  LockKeyhole,
  Save,
  UserRound,
} from "lucide-react";
import {
  FormSection,
  ModalFooterActions,
  ModalTitle,
} from "./ModalFormParts";
import "./ModalForms.css";

const ProfileFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  profileData,
  defaultName,
}) => {
  const [formData, setFormData] = useState({
    userName: profileData.userName || defaultName || "User",
    shelfName: profileData.shelfName || defaultName || "User's Library",
    shelfDescription:
      profileData.shelfDescription ||
      "This is a library containing various books and collections.",
    profilePictureBase64: profileData.avatarBase64 || "",
    cropData: null,
    isPublic: profileData.isPublic !== undefined ? profileData.isPublic : true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form refresh
    setIsLoading(true);

    try {
      await onSubmit({
        userName: formData.userName,
        shelfName: formData.shelfName,
        shelfDescription: formData.shelfDescription,
        avatarBase64: formData.profilePictureBase64,
        cropData: formData.cropData,
        isPublic: formData.isPublic,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update profile.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const modalFooter = (
    <ModalFooterActions
      formId="profileForm"
      isLoading={isLoading}
      loadingLabel="Updating..."
      onCancel={onClose}
      submitIcon={Save}
      submitLabel="Update Profile"
    />
  );
  const { theme } = useTheme();
  const darkBg = theme === "dark" ? "bg-dark text-light" : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<ModalTitle icon={UserRound}>Modify Profile</ModalTitle>}
      size="lg"
      className="book-form-modal profile-form-modal"
      bodyClassName="book-form-modal-body"
      maxHeight="calc(100vh - 10rem)"
      footer={modalFooter}>
      {!isLoading ? (
        <form onSubmit={handleSubmit} id="profileForm" className="profile-form">
          <aside className="profile-form-avatar-panel">
            <div className="book-form-panel-label">Profile Picture</div>
            <ProfilePictureUpload
              formData={formData}
              setFormData={setFormData}
            />

            <FormSection
              icon={formData.isPublic ? Globe2 : LockKeyhole}
              title="Visibility"
              className="profile-form-visibility">
              <label className="profile-form-switch">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublic: e.target.checked })
                  }
                />
                <span className="profile-form-switch-track" />
                <span className="profile-form-switch-text">
                  {formData.isPublic ? "Public library" : "Private library"}
                </span>
              </label>
            </FormSection>
          </aside>

          <div className="profile-form-fields">
            <FormSection icon={UserRound} title="Identity">
              <div className="book-form-two-col">
                <div className="profile-form-field">
                  <label htmlFor="userName" className="form-label">
                    User Name
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
                <div className="profile-form-field">
                  <label htmlFor="shelfName" className="form-label">
                    Library Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${darkBg}`}
                    id="shelfName"
                    value={formData.shelfName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, shelfName: e.target.value })
                    }
                    placeholder="Enter library name"
                  />
                </div>
              </div>
            </FormSection>

            <FormSection icon={BookOpen} title="Library Details">
              <div className="profile-form-field">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className={`form-control profile-form-description ${darkBg}`}
                  id="description"
                  rows="6"
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
            </FormSection>

            <section className="profile-form-preview">
              <FileText size={18} />
              <div>
                <div className="profile-form-preview-title">
                  {formData.shelfName || "Untitled library"}
                </div>
                <div className="profile-form-preview-text">
                  {formData.shelfDescription || "No description yet"}
                </div>
              </div>
            </section>
          </div>
        </form>
      ) : (
        <div className="profile-form-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted mb-0">Updating your profile...</h5>
        </div>
      )}
    </Modal>
  );
};

export default ProfileFormModal;
