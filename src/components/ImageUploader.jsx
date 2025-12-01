import React, { useState } from "react";

export default function ImageUploader({ files, setFiles }) {
  const [dragActive, setDragActive] = useState(false);

  const addValidImages = (fileList) => {
    const list = Array.from(fileList || []);
    const images = list.filter((f) =>
      /image\/(png|jpeg|jpg|webp)/.test(f.type)
    );

    if (images.length === 0) return;

    setFiles((prev) => [...prev, ...images]);
  };

  // File input
  const handleFiles = (e) => {
    addValidImages(e.target.files);
    e.target.value = "";
  };

  // Drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.length) {
      addValidImages(e.dataTransfer.files);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ marginTop: 20 }}>

      {/* DROP ZONE */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          padding: 30,
          borderRadius: 16,
          border: dragActive ? "3px dashed #1976d2" : "3px dashed #aaa",
          background: dragActive ? "#e3f2fd" : "#fafafa",
          textAlign: "center",
          transition: "all 0.2s ease",
        }}
      >
        <h3 style={{ margin: 0, color: "#333" }}>
          Drag & Drop Images Here
        </h3>

        <p style={{ fontSize: 14, color: "#555" }}>
          or click to select files
        </p>

        <label
          htmlFor="file-upload"
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg, #1976d2, #64b5f6)",
            color: "white",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          Browse Images
        </label>

        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFiles}
          style={{ display: "none" }}
        />
      </div>

      {/* IMAGE PREVIEW */}
      {files.length > 0 && (

        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "flex-start",
          }}
        >
          {files.map((f, i) => (
            <div
              key={i}
              style={{
                width: 120,
                padding: 8,
                borderRadius: 10,
                background: "#fff",
                border: "1px solid #ddd",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                position: "relative",
              }}
            >
              <img
                src={URL.createObjectURL(f)}
                alt={f.name}
                style={{
                  width: "100%",
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />

              {/* REMOVE */}
              <button
                onClick={() => removeFile(i)}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: 22,
                  height: 22,
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>

              <div
                style={{
                  fontSize: 11,
                  marginTop: 6,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {f.name}
              </div>
            </div>
          ))}
        </div>

      )}

    </div>
  );
}
