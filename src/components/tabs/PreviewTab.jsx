import React, { useState } from "react";
import { ScanSearch, FileText, Printer, Download, Loader2, ChevronUp, ChevronDown, Layers, FileType, Scissors } from "lucide-react";
import { ResumePreview } from "../preview/ResumePreview";
import { TabInfoBanner } from "../common/TabInfoBanner";
import { exportResumeToDocx } from "../../utils/docxExporter";
import { getCategoryFieldContent } from "../../constants/categoryExamples";
import { getEffectiveSectionOrder } from "../../utils/sectionOrder";

export function PreviewTab({
  resume, setResume, layoutId, colorId, fontId, documentStyle, categoryId = "general",
  pageSize, setPageSize,
  showAtsText, setShowAtsText,
  atsText,
  handleExportText, handlePrint, handleExportPdf, isExportingPdf,
  previewMeasureRef, pageBreaks
}) {
  const [showSectionOrder, setShowSectionOrder] = useState(false);
  const [showPageBreaksToggle, setShowPageBreaksToggle] = useState(false);
  const fields = getCategoryFieldContent(categoryId);

  const sectionOrder = getEffectiveSectionOrder(resume.sectionOrder, layoutId);

  const sectionLabels = {
    summary: fields.summaryTitle,
    experience: fields.experienceTitle,
    projects: fields.projectsTitle,
    education: fields.educationTitle,
    skills: fields.skillsTitle,
    certifications: fields.certificationsTitle,
    publications: fields.publicationsTitle,
    languages: "Languages",
    references: "References"
  };

  function moveSection(fromIdx, toIdx) {
    if (fromIdx < 0 || toIdx < 0 || toIdx >= sectionOrder.length) return;
    const copy = [...sectionOrder];
    const [moved] = copy.splice(fromIdx, 1);
    copy.splice(toIdx, 0, moved);
    setResume(r => ({ ...r, sectionOrder: copy }));
  }

  return (
    <div>
      <TabInfoBanner
        title="Preview & Export Purpose"
        description="Inspect full-size rendered pages with print page-break guides, reorder resume sections live, export directly as a PDF or Word (.docx) document, trigger browser printing, or download ATS plain-text."
      />
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, flexWrap: "wrap" }}>
          <span style={{ color: "#6b7280" }}>Page size:</span>
          <button type="button" onClick={() => setPageSize("letter")} aria-pressed={pageSize === "letter"}
            style={{ padding: "5px 10px", borderRadius: 6, fontSize: 12.5, cursor: "pointer", border: "1px solid " + (pageSize === "letter" ? "#1e3a5f" : "#e5e7eb"), background: pageSize === "letter" ? "#eaf0f7" : "#fff" }}>US Letter</button>
          <button type="button" onClick={() => setPageSize("a4")} aria-pressed={pageSize === "a4"}
            style={{ padding: "5px 10px", borderRadius: 6, fontSize: 12.5, cursor: "pointer", border: "1px solid " + (pageSize === "a4" ? "#1e3a5f" : "#e5e7eb"), background: pageSize === "a4" ? "#eaf0f7" : "#fff" }}>A4</button>

          <button type="button" onClick={() => setShowSectionOrder(s => !s)}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, fontSize: 12.5, cursor: "pointer", border: "1px solid " + (showSectionOrder ? "#1e3a5f" : "#e5e7eb"), background: showSectionOrder ? "#eaf0f7" : "#fff", marginLeft: 6 }}>
            <Layers size={13} /> Reorder Sections
          </button>

          <button type="button" onClick={() => setShowPageBreaksToggle(s => !s)}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, fontSize: 12.5, cursor: "pointer", border: "1px solid " + (showPageBreaksToggle ? "#3b82f6" : "#e5e7eb"), background: showPageBreaksToggle ? "#eff6ff" : "#fff", color: showPageBreaksToggle ? "#1d4ed8" : "inherit" }}>
            <Scissors size={13} /> {showPageBreaksToggle ? "Hide" : "Show"} Page Breaks
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={() => setShowAtsText(s => !s)} aria-pressed={showAtsText}
            style={{ display: "flex", alignItems: "center", gap: 6, background: showAtsText ? "#eaf0f7" : "#fff", color: "#1e3a5f", border: "1px solid " + (showAtsText ? "#1e3a5f" : "#d7dbe0"), borderRadius: 7, padding: "9px 14px", fontSize: 13.5, cursor: "pointer" }}>
            <ScanSearch size={15} aria-hidden="true" /> {showAtsText ? "Hide" : "Show"} ATS view
          </button>
          <button type="button" onClick={handleExportText} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", color: "#1e3a5f", border: "1px solid #d7dbe0", borderRadius: 7, padding: "9px 14px", fontSize: 13.5, cursor: "pointer" }}>
            <FileText size={15} /> ATS .txt
          </button>
          <button type="button" onClick={() => exportResumeToDocx(resume, categoryId, layoutId)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", color: "#1e3a5f", border: "1px solid #1e3a5f", borderRadius: 7, padding: "9px 14px", fontSize: 13.5, cursor: "pointer" }}>
            <FileType size={15} /> Word (.docx)
          </button>
          <button type="button" onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", color: "#1e3a5f", border: "1px solid #1e3a5f", borderRadius: 7, padding: "9px 14px", fontSize: 13.5, cursor: "pointer" }}>
            <Printer size={15} /> Print
          </button>
          <button type="button" onClick={handleExportPdf} disabled={isExportingPdf} style={{ display: "flex", alignItems: "center", gap: 6, background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 7, padding: "9px 16px", fontSize: 13.5, cursor: isExportingPdf ? "wait" : "pointer", opacity: isExportingPdf ? 0.75 : 1 }}>
            {isExportingPdf ? <Loader2 size={15} style={{ animation: "rb-spin 1s linear infinite" }} /> : <Download size={15} />}
            {isExportingPdf ? "Exporting PDF..." : "Export PDF"}
          </button>
        </div>
      </div>

      {/* Reorder Sections Panel */}
      {showSectionOrder && (
        <div className="no-print" style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 8, padding: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>
            Section Order Manager — Drag or click arrows to move sections:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {sectionOrder.map((secKey, idx) => (
              <div key={secKey} style={{ display: "flex", alignItems: "center", gap: 4, background: "#ffffff", border: "1px solid #cbd5e1", padding: "4px 8px", borderRadius: 6, fontSize: 12 }}>
                <span style={{ fontWeight: 500, color: "#334155" }}>{sectionLabels[secKey] || secKey}</span>
                <button type="button" onClick={() => moveSection(idx, idx - 1)} disabled={idx === 0} style={{ background: "none", border: "none", padding: 1, cursor: idx === 0 ? "default" : "pointer", color: idx === 0 ? "#cbd5e1" : "#64748b" }}><ChevronUp size={14} /></button>
                <button type="button" onClick={() => moveSection(idx, idx + 1)} disabled={idx === sectionOrder.length - 1} style={{ background: "none", border: "none", padding: 1, cursor: idx === sectionOrder.length - 1 ? "default" : "pointer", color: idx === sectionOrder.length - 1 ? "#cbd5e1" : "#64748b" }}><ChevronDown size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="no-print" style={{ fontSize: 11.5, color: "#9aa1ab", marginTop: -6, marginBottom: 14 }}>
        Click <strong>Export PDF</strong> for PDF download, or <strong>Word (.docx)</strong> for an editable Word document.
      </p>

      <div className={showAtsText ? "rb-preview-split" : ""} style={{ display: showAtsText ? "grid" : "block", gridTemplateColumns: showAtsText ? "1fr 1fr" : undefined, gap: 18, alignItems: "start" }}>
        <div style={{ maxWidth: showAtsText ? "none" : (pageSize === "a4" ? 698 : 720), margin: showAtsText ? 0 : "0 auto", position: "relative" }}>
          <div className="print-only-preview" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb" }} ref={previewMeasureRef}>
            <ResumePreview resume={resume} layoutId={layoutId} theme={colorId} font={fontId} documentStyle={documentStyle} categoryId={categoryId} showPageBreaks={showPageBreaksToggle} />
          </div>
          {!showAtsText && pageBreaks.map((h, i) => (
            <div key={i} className="no-print" style={{ position: "absolute", left: 0, right: 0, top: h, borderTop: "2px dashed #b0392f", pointerEvents: "none" }}>
              <span style={{ position: "absolute", right: 0, top: -9, background: "#b0392f", color: "#fff", fontSize: 10.5, padding: "1px 6px", borderRadius: 3 }}>Page {i + 2} starts here</span>
            </div>
          ))}
        </div>
        {showAtsText && (
          <div className="no-print">
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
              This is the plain text an ATS parser extracts from this resume — no styling, no columns, just the raw content it reads.
            </div>
            <pre style={{ background: "#1f2937", color: "#e5e7eb", padding: 16, borderRadius: 8, fontSize: 11.5, lineHeight: 1.6, whiteSpace: "pre-wrap", overflowWrap: "anywhere", maxHeight: 640, overflowY: "auto", margin: 0, fontFamily: "'Courier New', monospace" }}>
              {atsText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
