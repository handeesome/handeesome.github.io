import { useState } from "react";

const CoverDropZone = ({ formData, setFormData }) => {
  const handleFiles = (files) => {
    const file = files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          coverBase64: reader.result,
        });
      };
      reader.readAsDataURL(file);
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
      {formData.coverBase64 ? (
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
        </div>
      )}
    </div>
  );
};

export default CoverDropZone;
