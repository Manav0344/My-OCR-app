import React from "react";
import Tesseract from "tesseract.js";

export default function OCRProcessor({ files, setOutputText, setProcessing, setProgress, language = "eng" }) {
  const processAll = async () => {
    if (!files || files.length === 0) {
      alert("Please add one or more images first.");
      return;
    }

    setProcessing(true);
    setOutputText("");
    setProgress({ current: 0, total: files.length });

    try {
      const allText = [];

      for (let i = 0; i < files.length; i++) {
        setProgress({ current: i + 1, total: files.length });
        const objectURL = URL.createObjectURL(files[i]);

        const result = await Tesseract.recognize(objectURL, language, {
          logger: (m) => {
            if (m.status === "recognizing text") {
              console.log(`Progress: ${Math.round(m.progress * 100)}%`);
            }
          },
        });

        const cleaned = cleanText(result.data.text);
        const paragraphs = splitIntoParagraphs(cleaned);

        allText.push(paragraphs.join("\n\n")); // double newline between paragraphs

        URL.revokeObjectURL(objectURL);
      }

      setOutputText(allText.join("\n\n\n")); // triple newline between images
    } catch (err) {
      console.error("OCR Error:", err);
      alert("OCR failed. See console.");
    } finally {
      setProcessing(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  const cleanText = (text) => {
    if (!text) return "";
    return text
      .replace(/\uFFFD/g, "") // remove weird chars
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .split("\n")
      .map((l) => l.trim())
      .join("\n")
      .trim();
  };

  const splitIntoParagraphs = (text) => {
    if (!text) return [];
    const lines = text.split("\n");
    const paragraphs = [];
    let buffer = "";

    const endsSentence = (line) => /[.\?!;:”)"'\]]$/.test(line);

    for (let line of lines) {
      line = line.trim();
      if (!line) {
        if (buffer) {
          paragraphs.push(buffer.trim());
          buffer = "";
        }
        continue;
      }

      // handle hyphenated words at line breaks
      if (buffer.endsWith("-")) {
        buffer = buffer.slice(0, -1) + line;
      } else {
        buffer += buffer ? " " + line : line;
      }

      // if line ends with a sentence-ending punctuation, consider ending paragraph
      if (endsSentence(line)) {
        paragraphs.push(buffer.trim());
        buffer = "";
      }
    }

    if (buffer) paragraphs.push(buffer.trim());

    // remove extra spaces inside paragraphs
    return paragraphs.map((p) => p.replace(/\s{2,}/g, " ").trim());
  };

  return (
    <div style={{ marginTop: 12 }}>
      <button
        onClick={processAll}
        style={{
          padding: "10px 16px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Process All Images
      </button>
    </div>
  );
}
