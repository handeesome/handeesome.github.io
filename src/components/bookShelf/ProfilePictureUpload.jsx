import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import Modal from "../ui/Modal";
import { getCroppedImg } from "../../utils/cropImage";
const ProfilePictureUpload = ({ formData, setFormData }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setShowCropModal(true); // Open modal when image is loaded
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirmCrop = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

    // Here you would actually crop the image using croppedAreaPixels
    // For now, we'll just save the original image
    setFormData({
      ...formData,
      profilePictureBase64: croppedImage,
      cropData: croppedAreaPixels, // Save crop data for later processing
    });
    setShowCropModal(false);
    // Reset states
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleCancelCrop = () => {
    setImageSrc(null);
    setShowCropModal(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div>
      {/* Upload Area */}
      <div
        onClick={() => document.getElementById("profile-upload").click()}
        style={{
          width: "200px",
          height: "200px",
          border: "2px dashed #ccc",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
        }}>
        {formData.profilePictureBase64 ? (
          <img
            src={formData.profilePictureBase64}
            alt="Profile"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <p style={{ textAlign: "center", padding: "20px", color: "#888" }}>
            Click to upload profile picture
          </p>
        )}
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </div>

      {/* Crop Modal */}
      <Modal
        isOpen={showCropModal}
        onClose={handleCancelCrop}
        title="Adjust Your Profile Picture"
        size="lg"
        preventBackdropClose={true}
        footer={
          <div className="d-flex gap-2 w-100 justify-content-end">
            <button className="btn btn-secondary" onClick={handleCancelCrop}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleConfirmCrop}>
              Confirm
            </button>
          </div>
        }>
        <div>
          {/* Cropper Container */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "400px",
              backgroundColor: "#000",
            }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePictureUpload;
