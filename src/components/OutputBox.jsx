import React from "react";

export default function OutputBox({ text, setText }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>OCR Output</h2>
        <button
          onClick={copyToClipboard}
          style={{
            padding: "6px 12px",
            background: "linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Copy
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        style={{
          width: "100%",
          marginTop: 12,
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
          resize: "vertical",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      />
    </div>
  );
}
