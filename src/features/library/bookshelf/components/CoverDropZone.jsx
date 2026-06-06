import { useState } from "react";
import { compressCoverImageFile } from "../utils/imageStorage";

const CoverDropZone = ({ formData, setFormData }) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFiles = async (files) => {
    const file = files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadError("");
      setIsCompressing(true);

      try {
        const coverBase64 = await compressCoverImageFile(file);
        setFormData({
          ...formData,
          coverBase64,
        });
      } catch (error) {
        console.error("compressCoverImageFile:", error);
        setUploadError("Could not use this image");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => handleFiles(e.target.files);
    fileInput.click();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleClick}
      style={{
        width: "150px",
        height: "200px",
        border: "2px dashed #ccc",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
        fontSize: "0.9rem",
        textAlign: "center",
      }}>
      {isCompressing ? (
        <div style={{ padding: "10px", color: "#888" }}>Preparing cover...</div>
      ) : formData.coverBase64 ? (
        <img
          src={formData.coverBase64}
          alt="Book cover"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div style={{ padding: "10px", color: "#888" }}>
          Drag your file here
          <br />
          or click to upload
          {uploadError && (
            <>
              <br />
              <span style={{ color: "#dc3545" }}>{uploadError}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CoverDropZone;
