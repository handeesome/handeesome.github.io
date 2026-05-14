import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import Modal from "../../../../components/ui/Modal";
import { getCroppedImg } from "../../../../utils/cropImage";
import { Camera, Check, ImagePlus, SlidersHorizontal, X } from "lucide-react";

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
    <div className="profile-picture-upload">
      <button
        type="button"
        className="profile-picture-dropzone"
        onClick={() => document.getElementById("profile-upload").click()}>
        {formData.profilePictureBase64 ? (
          <>
            <img src={formData.profilePictureBase64} alt="Profile" />
            <span className="profile-picture-change">
              <Camera size={16} />
              Change
            </span>
          </>
        ) : (
          <span className="profile-picture-placeholder">
            <ImagePlus size={24} />
            Upload photo
          </span>
        )}
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </button>

      <Modal
        isOpen={showCropModal}
        onClose={handleCancelCrop}
        title={
          <span className="book-form-title">
            <SlidersHorizontal size={20} />
            Adjust Profile Picture
          </span>
        }
        size="lg"
        className="book-form-modal profile-crop-modal"
        bodyClassName="book-form-modal-body"
        preventBackdropClose={true}
        footer={
          <div className="book-form-footer">
            <button
              type="button"
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
              onClick={handleCancelCrop}>
              <X size={16} />
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center gap-2"
              onClick={handleConfirmCrop}>
              <Check size={16} />
              Confirm
            </button>
          </div>
        }>
        <div className="profile-crop">
          <div className="profile-crop-stage">
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
          <label className="profile-crop-zoom">
            <span>Zoom</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </label>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePictureUpload;
