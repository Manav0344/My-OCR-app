import React, { useState } from "react";
import { createWorker } from "tesseract.js";

export default function OCRProcessor({
  files,
  setOutputText,
  setProcessing,
  setProgress,
}) {
  const [handwritingMode, setHandwritingMode] = useState(false);

  //----------------------------------------
  // MAIN OCR PROCESS
  //----------------------------------------
  const processAll = async () => {
    if (!files || files.length === 0) {
      alert("Please upload images first.");
      return;
    }

    setProcessing(true);
    setOutputText("");
    setProgress({ current: 0, total: files.length });

    const worker = await createWorker("eng");

    try {
      // ⚙️ HANDWRITING OPTIMIZED OCR SETTINGS
      await worker.setParameters({
        tessedit_preserve_interword_spaces: "1",
        user_defined_dpi: "300",
        tessedit_pageseg_mode: handwritingMode ? "6" : "3",
      });

      let resultText = [];

      for (let i = 0; i < files.length; i++) {
        setProgress({ current: i + 1, total: files.length });

        const imgUrl = URL.createObjectURL(files[i]);

        const { data } = await worker.recognize(imgUrl);
        let text = data.text || "";

        text = initialCleanup(text);

        if (handwritingMode) {
          text = aiHandwritingCleanup(text);
        }

        text = mergeLinesToParagraphs(text).join("\n\n");

        resultText.push(text);

        URL.revokeObjectURL(imgUrl);
      }

      setOutputText(resultText.join("\n\n------------------\n\n"));
    } catch (err) {
      console.error(err);
      alert("OCR Failed – check console.");
    }

    await worker.terminate();
    setProcessing(false);
    setProgress({ current: 0, total: 0 });
  };

  //----------------------------------------
  // BASIC OCR TEXT CLEANUP
  //----------------------------------------
  const initialCleanup = (text) => {
    return text
      .replace(/\uFFFD/g, "")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .split("\n")
      .map((l) => l.trim())
      .join("\n")
      .trim();
  };

  //----------------------------------------
  // AI HANDWRITING CLEANUP
  //----------------------------------------
  const aiHandwritingCleanup = (text) => {
    return text
      .replace(/\b1\b/g, "I")
      .replace(/\b0\b/g, "O")
      .replace(/l\s/g, "I ")
      .replace(/\bfi\b/gi, "li")
      .replace(/\s{2,}/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\n+/g, "\n")
      .replace(/\bThls\b/gi, "This")
      .replace(/\bteh\b/gi, "the")
      .replace(/\brecieve\b/gi, "receive")
      .trim();
  };

  //----------------------------------------
  // PARAGRAPH MERGING
  //----------------------------------------
  const mergeLinesToParagraphs = (text) => {
    if (!text) return [];

    const lines = text.split("\n");
    const paragraphs = [];
    let buffer = "";

    for (let line of lines) {
      line = line.trim();

      if (!line) {
        if (buffer) paragraphs.push(buffer.trim());
        buffer = "";
        continue;
      }

      if (buffer.endsWith("-")) {
        buffer = buffer.slice(0, -1) + line;
      } else {
        buffer = buffer ? buffer + " " + line : line;
      }
    }

    if (buffer) paragraphs.push(buffer);

    return paragraphs.map((p) =>
      p.replace(/\s{2,}/g, " ").trim()
    );
  };

  //----------------------------------------
  // UI
  //----------------------------------------
  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "15px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        <input
          type="checkbox"
          checked={handwritingMode}
          onChange={(e) => setHandwritingMode(e.target.checked)}
        />
        ✍ Handwriting Mode
      </label>

      <br />

      <button
        onClick={processAll}
        style={{
          padding: "12px 20px",
          background: handwritingMode
            ? "#2e7d32"
            : "#1565c0",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "16px",
        }}
      >
        🚀 Start OCR
      </button>
    </div>
  );
}
