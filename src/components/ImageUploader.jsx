import React from "react";

export default function ImageUploader({ files, setFiles }) {
  const handleFiles = (e) => {
    const fileList = Array.from(e.target.files || []);
    const images = fileList.filter((f) => /image\/(png|jpeg|jpg)/.test(f.type));
    if (images.length === 0) return;
    setFiles((prev) => [...prev, ...images]);
    e.target.value = ""; // reset input
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ marginTop: 20 }}>
      <label
        htmlFor="file-upload"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          background: "linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)",
          color: "white",
          fontWeight: "bold",
          borderRadius: 8,
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        Choose Images
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        style={{ display: "none" }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
        {files.length === 0 ? (
          <div
            style={{
              padding: 20,
              border: "2px dashed #aaa",
              borderRadius: 12,
              color: "#777",
              textAlign: "center",
              flex: 1,
              minWidth: 200,
            }}
          >
            No images selected
          </div>
        ) : (
          files.map((f, i) => (
            <div
              key={i}
              style={{
                width: 120,
                padding: 8,
                borderRadius: 8,
                background: "#fff",
                border: "1px solid #ddd",
                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                position: "relative",
              }}
            >
              <img
                src={URL.createObjectURL(f)}
                alt={f.name}
                style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6 }}
              />
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
                  lineHeight: "20px",
                  textAlign: "center",
                }}
                title="Remove"
              >
                ×
              </button>
              <div
                style={{
                  fontSize: 12,
                  marginTop: 6,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {f.name}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
