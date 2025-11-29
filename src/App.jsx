import { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import OCRProcessor from "./components/OCRProcessor";
import OutputBox from "./components/OutputBox";

export default function App() {
  const [files, setFiles] = useState([]); // selected images
  const [outputText, setOutputText] = useState(""); // OCR result
  const [processing, setProcessing] = useState(false); // processing state
  const [progress, setProgress] = useState({ current: 0, total: 0 }); // progress
  const [language, setLanguage] = useState("eng"); // default language

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: 6 }}>Image → Clean Word-Ready Text (Batch OCR)</h1>
      <p style={{ marginTop: 0, color: "#333" }}>
        Upload multiple scanned images (jpg/png). Click <strong>Process All</strong>. The app will extract text,
        merge lines into long paragraphs, and show a justified document view you can copy into Word.
      </p>

      {/* Language selector */}
      <div style={{ marginTop: 16 }}>
        <label style={{ marginRight: 10, fontWeight: "bold" }}>Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option value="eng">English</option>
          <option value="hin">Hindi</option>
          <option value="guj">Gujarati</option>
          <option value="tam">Tamil</option>
          <option value="kan">Kannada</option>
          <option value="tel">Telugu</option>
        </select>
      </div>

      {/* Modern Image Uploader */}
      <ImageUploader files={files} setFiles={setFiles} />

      {/* Buttons */}
      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <OCRProcessor
          files={files}
          setOutputText={setOutputText}
          setProcessing={setProcessing}
          setProgress={setProgress}
          language={language}
        />
        <button
          onClick={() => {
            setFiles([]);
            setOutputText("");
          }}
          style={{
            padding: "10px 16px",
            background: "#eee",
            borderRadius: 6,
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Clear All
        </button>
      </div>

      {/* Processing indicator */}
      {processing && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 12,
            background: "#f0f4ff",
            border: "1px solid #d0d7ff",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            maxWidth: 400,
            margin: "20px auto",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: 8, fontWeight: "bold", color: "#1976d2" }}>
            Processing image {progress.current} of {progress.total} ⏳
          </div>

          <div
            style={{
              width: "100%",
              height: 16,
              background: "#e0e0e0",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
                height: "100%",
                background: "linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)",
                transition: "width 0.3s ease",
              }}
            ></div>
          </div>

          <div style={{ marginTop: 8, color: "#1976d2", fontSize: 14 }}>
            Please wait<span style={{ animation: "dots 1s steps(5, end) infinite" }}>...</span>
          </div>

          <style>
            {`
              @keyframes dots {
                0%, 20% { content: ''; }
                40% { content: '.'; }
                60% { content: '..'; }
                80%, 100% { content: '...'; }
              }
            `}
          </style>
        </div>
      )}

      {/* Output box with copy button */}
      <OutputBox text={outputText} setText={setOutputText} />
    </div>
  );
}
