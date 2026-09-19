import React from "react";
import { ScanSearch, FileText, Printer, Download, Loader2 } from "lucide-react";
import { ResumePreview } from "../preview/ResumePreview";
import { TabInfoBanner } from "../common/TabInfoBanner";

export function PreviewTab({
  resume, layoutId, colorId, fontId, documentStyle,
  pageSize, setPageSize,
  showAtsText, setShowAtsText,
  atsText,
  handleExportText, handlePrint, handleExportPdf, isExportingPdf,
  previewMeasureRef, pageBreaks
}) {
  return (
    <div>
      <TabInfoBanner
        title="Preview & Export Purpose"
        description="Inspect full-size rendered pages with print page-break guides, export directly as a PDF document, trigger browser printing, or view/download ATS plain-text."
      />
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <span style={{ color: "#6b7280" }}>Page size:</span>
          <button type="button" onClick={() => setPageSize("letter")} aria-pressed={pageSize === "letter"}
            style={{ padding: "5px 10px", borderRadius: 6, fontSize: 12.5, cursor: "pointer", border: "1px solid " + (pageSize === "letter" ? "#1e3a5f" : "#e5e7eb"), background: pageSize === "letter" ? "#eaf0f7" : "#fff" }}>US Letter</button>
          <button type="button" onClick={() => setPageSize("a4")} aria-pressed={pageSize === "a4"}
            style={{ padding: "5px 10px", borderRadius: 6, fontSize: 12.5, cursor: "pointer", border: "1px solid " + (pageSize === "a4" ? "#1e3a5f" : "#e5e7eb"), background: pageSize === "a4" ? "#eaf0f7" : "#fff" }}>A4</button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={() => setShowAtsText(s => !s)} aria-pressed={showAtsText}
            style={{ display: "flex", alignItems: "center", gap: 6, background: showAtsText ? "#eaf0f7" : "#fff", color: "#1e3a5f", border: "1px solid " + (showAtsText ? "#1e3a5f" : "#d7dbe0"), borderRadius: 7, padding: "9px 14px", fontSize: 13.5, cursor: "pointer" }}>
            <ScanSearch size={15} aria-hidden="true" /> {showAtsText ? "Hide" : "Show"} ATS view
          </button>
          <button type="button" onClick={handleExportText} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", color: "#1e3a5f", border: "1px solid #d7dbe0", borderRadius: 7, padding: "9px 14px", fontSize: 13.5, cursor: "pointer" }}>
            <FileText size={15} /> Download ATS .txt
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
      <p className="no-print" style={{ fontSize: 11.5, color: "#9aa1ab", marginTop: -6, marginBottom: 14 }}>
        Click <strong>Export PDF</strong> to download a PDF file directly. If using <strong>Print</strong>, ensure "Background graphics" is enabled in your browser print settings to include theme accent colors.
      </p>
      <div className={showAtsText ? "rb-preview-split" : ""} style={{ display: showAtsText ? "grid" : "block", gridTemplateColumns: showAtsText ? "1fr 1fr" : undefined, gap: 18, alignItems: "start" }}>
        <div style={{ maxWidth: showAtsText ? "none" : (pageSize === "a4" ? 698 : 720), margin: showAtsText ? 0 : "0 auto", position: "relative" }}>
          <div className="print-only-preview" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb" }} ref={previewMeasureRef}>
            <ResumePreview resume={resume} layoutId={layoutId} theme={colorId} font={fontId} documentStyle={documentStyle} />
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
