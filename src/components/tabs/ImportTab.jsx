import React, { useState } from "react";
import { Upload, ScanSearch } from "lucide-react";
import { parseResumeText } from "../../utils/parser";
import { TabInfoBanner } from "../common/TabInfoBanner";

export function ImportTab({ setResume, setTab }) {
  const [importText, setImportText] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const [importError, setImportError] = useState("");
  const [pendingImport, setPendingImport] = useState(null);

  async function handleDocxUpload(file) {
    if (!file) return;
    setImportError("");
    setImportBusy(true);
    setPendingImport(null);
    try {
      // Dynamic import to keep initial bundle size lightweight
      const mammothModule = await import("mammoth");
      const mammoth = mammothModule.default || mammothModule;
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setImportText(result.value);
    } catch (err) {
      setImportError("Couldn't read that .docx file. Try pasting the text instead.");
    } finally {
      setImportBusy(false);
    }
  }

  function handleParseImport() {
    if (!importText.trim()) return;
    setImportError("");
    try {
      const { resume: parsed, summaryCounts } = parseResumeText(importText);
      setPendingImport({ resume: parsed, summaryCounts });
    } catch (err) {
      setImportError("Couldn't parse that text. Try pasting a cleaner copy, or fill in the Build tab by hand.");
    }
  }

  function applyImport() {
    if (!pendingImport) return;
    setResume(pendingImport.resume);
    setPendingImport(null);
    setImportText("");
    setTab("build");
  }

  return (
    <div>
      <TabInfoBanner
        title="Import Purpose"
        description="Upload an existing .docx file or paste raw text to parse contact info, work experience, education, and skills into your working draft."
      />
      <h3 style={{ marginTop: 0, fontSize: 15 }}>Import an existing resume</h3>
      <p style={{ fontSize: 12, color: "#6b7280", marginTop: 0, marginBottom: 14 }}>
        Best-effort parsing, not perfect — it looks for section headers like "Experience" and "Education" and does its best with dates and bullets. PDF isn't supported here since there's no PDF-reading library available in this environment; convert to .docx or paste the text instead. Always review the result on the Build tab afterward.
      </p>

      <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, background: "#eef1f4", border: "none", borderRadius: 6, padding: "8px 14px", cursor: "pointer", marginBottom: 14 }}>
        <Upload size={14} aria-hidden="true" /> {importBusy ? "Reading file…" : "Upload a .docx file"}
        <input type="file" accept=".docx" onChange={ev => handleDocxUpload(ev.target.files && ev.target.files[0])} disabled={importBusy}
          style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }} />
      </label>

      <div style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 6 }}>...or paste resume text directly:</div>
      <textarea value={importText} onChange={e => setImportText(e.target.value)} rows={12}
        placeholder="Paste your existing resume text here — from a Word doc, a text file, or copied out of a PDF viewer"
        style={{ width: "100%", padding: 10, border: "1px solid #d7dbe0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", resize: "vertical", marginBottom: 10 }} />

      {importError && <div style={{ fontSize: 12, color: "#b0392f", marginBottom: 10 }}>{importError}</div>}

      <button type="button" onClick={handleParseImport} disabled={!importText.trim() || importBusy}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 7, padding: "9px 16px", fontSize: 13.5, cursor: importText.trim() ? "pointer" : "default", opacity: importText.trim() ? 1 : 0.5 }}>
        <ScanSearch size={15} aria-hidden="true" /> Parse this text
      </button>

      {pendingImport && (
        <div style={{ marginTop: 18, border: "1px solid #e5e7eb", borderRadius: 8, padding: 14, background: "#fafbfc" }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Here's what was detected:</div>
          <ul style={{ margin: "0 0 12px 18px", padding: 0, fontSize: 12.5, color: "#374151" }}>
            <li>{pendingImport.summaryCounts.hasName ? `Name: ${pendingImport.resume.name}` : "No name detected"}</li>
            <li>{pendingImport.summaryCounts.hasContact ? "Email and/or phone found" : "No email or phone detected"}</li>
            <li>{pendingImport.summaryCounts.hasSummary ? "Summary section found" : "No summary section detected"}</li>
            <li>{pendingImport.summaryCounts.experienceCount} experience {pendingImport.summaryCounts.experienceCount === 1 ? "entry" : "entries"} found</li>
            <li>{pendingImport.summaryCounts.educationCount} education {pendingImport.summaryCounts.educationCount === 1 ? "entry" : "entries"} found</li>
            <li>{pendingImport.summaryCounts.hasSkills ? "Skills list found" : "No skills list detected"}</li>
          </ul>
          <div style={{ fontSize: 12, color: "#8a4a2a", marginBottom: 12 }}>
            Applying this will replace whatever is currently in the Build tab. You'll land there afterward to fix anything that came through wrong.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={applyImport} style={{ background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 7, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}>Apply and review on Build tab</button>
            <button type="button" onClick={() => setPendingImport(null)} style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 7, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}>Discard</button>
          </div>
        </div>
      )}
    </div>
  );
}
