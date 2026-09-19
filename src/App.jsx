import React, { useState, useMemo, useEffect, useRef } from "react";
import { ChevronRight, CheckCircle2, XCircle, Eye } from "lucide-react";
import { CATEGORIES } from "./constants/templatesData";
import { emptyResume, cleanupMixedLanguagesAndReferences } from "./utils/parser";
import { resumeToPlainText, downloadTextFile } from "./utils/textExporter";
import { exportResumePDF } from "./utils/pdfExporter";
import { analyzeResume, analyzeRequirements } from "./utils/atsAnalyzer";

import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";
import { StatusIcon } from "./components/common/StatusIcon";
import { ResumePreview } from "./components/preview/ResumePreview";

import { ImportTab } from "./components/tabs/ImportTab";
import { BuildTab } from "./components/tabs/BuildTab";
import { TemplatesTab } from "./components/tabs/TemplatesTab";
import { AtsTab } from "./components/tabs/AtsTab";
import { AiTab } from "./components/tabs/AiTab";
import { VersionsTab } from "./components/tabs/VersionsTab";
import { PreviewTab } from "./components/tabs/PreviewTab";

const DRAFT_STORAGE_KEY = "myresume_builder_auto_draft";

export default function App() {
  const [resume, setResume] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const saved = window.localStorage.getItem(DRAFT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.resume) {
            if (parsed.resume.name === "Jordan Rivera") {
              parsed.resume.name = "John Doe";
              if (parsed.resume.email === "jordan.rivera@email.com") parsed.resume.email = "john.doe@email.com";
              if (parsed.resume.links === "linkedin.com/in/jordanrivera") parsed.resume.links = "linkedin.com/in/johndoe";
            }
            return cleanupMixedLanguagesAndReferences(parsed.resume);
          }
        }
      } catch (err) {
        // Fallback
      }
    }
    return emptyResume();
  });

  const [tab, setTab] = useState("design");
  const [categoryId, setCategoryId] = useState("business");
  const category = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  const [layoutId, setLayoutId] = useState(category.layout);
  const [colorId, setColorId] = useState(category.color);
  const [fontId, setFontId] = useState(category.font);
  const [jobDescription, setJobDescription] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const saved = window.localStorage.getItem(DRAFT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.jobDescription) return parsed.jobDescription;
        }
      } catch (err) {
        // Fallback
      }
    }
    return "";
  });
  const [pageSize, setPageSize] = useState("letter");
  const [showAtsText, setShowAtsText] = useState(false);
  const [documentStyle, setDocumentStyle] = useState("us");
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const [fontSize, setFontSize] = useState(12.5);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [sectionSpacing, setSectionSpacing] = useState(14);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Persistent AI Analysis Result across tab switches & browser refreshes
  const [aiAnalysisResult, setAiAnalysisResult] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const saved = window.localStorage.getItem(DRAFT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.aiAnalysisResult) return parsed.aiAnalysisResult;
        }
      } catch (err) {
        // Fallback
      }
    }
    return null;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          const payload = {
            resume,
            layoutId,
            colorId,
            fontId,
            categoryId,
            documentStyle,
            pageSize,
            fontSize,
            lineHeight,
            sectionSpacing,
            jobDescription,
            aiAnalysisResult,
            savedAt: new Date().toISOString()
          };
          window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
          // ignore limits
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [resume, layoutId, colorId, fontId, categoryId, documentStyle, pageSize, fontSize, lineHeight, sectionSpacing, jobDescription, aiAnalysisResult]);

  const [debouncedResume, setDebouncedResume] = useState(resume);
  const [debouncedJd, setDebouncedJd] = useState(jobDescription);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedResume(resume), 250);
    return () => clearTimeout(timer);
  }, [resume]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedJd(jobDescription), 250);
    return () => clearTimeout(timer);
  }, [jobDescription]);

  const atsText = useMemo(() => resumeToPlainText(resume), [resume]);
  const previewMeasureRef = useRef(null);
  const [previewHeightPx, setPreviewHeightPx] = useState(0);

  function pickDocumentStyle(style) {
    setDocumentStyle(style);
    setPageSize(style === "intl" ? "a4" : "letter");
  }

  const analysis = useMemo(() => analyzeResume(debouncedResume, debouncedJd, layoutId, documentStyle), [debouncedResume, debouncedJd, layoutId, documentStyle]);
  const reqAnalysis = useMemo(() => analyzeRequirements(debouncedResume, debouncedJd), [debouncedResume, debouncedJd]);
  const hasJD = jobDescription && jobDescription.trim().length > 20;

  const pageContentHeightPx = pageSize === "a4" ? 1026 : 960;

  useEffect(() => {
    const el = previewMeasureRef.current;
    if (!el || tab !== "preview") return;
    const measure = () => setPreviewHeightPx(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [resume, layoutId, colorId, fontId, documentStyle, pageSize, fontSize, lineHeight, sectionSpacing, tab]);

  const pageBreaks = [];
  for (let h = pageContentHeightPx; h < previewHeightPx; h += pageContentHeightPx) pageBreaks.push(h);

  function pickCategory(id) {
    const c = CATEGORIES.find(cc => cc.id === id) || CATEGORIES[0];
    setCategoryId(id);
    setLayoutId(c.layout);
    setColorId(c.color);
    setFontId(c.font);
  }

  function handlePrint() {
    window.print();
  }

  async function handleExportPdf() {
    const suffix = documentStyle === "intl" ? "cv" : "resume";
    const filename = (resume.name || suffix).trim().replace(/\s+/g, "_").toLowerCase() + `_${suffix}.pdf`;

    const element = previewMeasureRef.current;
    if (!element) return;

    try {
      setIsExportingPdf(true);
      await exportResumePDF(element, filename, pageSize);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF: " + (error?.message || "Unknown error"));
    } finally {
      setIsExportingPdf(false);
    }
  }

  function handleExportText() {
    const suffix = documentStyle === "intl" ? "cv" : "resume";
    const filename = (resume.name || suffix).trim().replace(/\s+/g, "_").toLowerCase() + `_${suffix}.txt`;
    downloadTextFile(filename, resumeToPlainText(resume));
  }

  const scoreColor = analysis.score >= 75 ? "#1a7f4b" : analysis.score >= 50 ? "#b8860b" : "#b0392f";

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f6f7f9", minHeight: "100vh" }} className="rb-root">
      <style>{`
        @keyframes rb-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media print {
          @page { size: ${pageSize === "a4" ? "A4" : "letter"}; margin: 0; }
          html, body { background: #fff !important; margin: 0 !important; padding: 0 !important; }
          .rb-root { background: #fff !important; margin: 0 !important; padding: 0 !important; }
          .no-print { display: none !important; }
          .print-only-preview {
            box-shadow: none !important;
            border: none !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0.4in !important;
          }
          .rb-entry { break-inside: avoid; page-break-inside: avoid; }
          .rb-section-title { break-after: avoid; page-break-after: avoid; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
        .rb-root button:focus-visible,
        .rb-root input:focus-visible,
        .rb-root textarea:focus-visible,
        .rb-root [tabindex]:focus-visible {
          outline: 2px solid #1e3a5f;
          outline-offset: 2px;
        }
        .rb-mini-preview-mobile-cta { display: none; }
        @media (max-width: 860px) {
          .rb-header-inner { flex-direction: column; align-items: flex-start !important; gap: 10px; }
          .rb-tabs { overflow-x: auto; width: 100%; -webkit-overflow-scrolling: touch; }
          .rb-tabs button { flex-shrink: 0; }
          .rb-grid { grid-template-columns: 1fr !important; }
          .rb-2col { grid-template-columns: 1fr !important; }
          .rb-mini-preview-scaled { display: none !important; }
          .rb-mini-preview-mobile-cta { display: flex !important; }
          .rb-preview-split { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Header tab={tab} setTab={setTab} isAiLoading={isAiLoading} />

      <div className="rb-grid" style={{ maxWidth: 1180, margin: "0 auto", padding: "22px 24px 60px", display: tab === "preview" ? "block" : "grid", gridTemplateColumns: tab === "preview" ? "1fr" : "1fr 420px", gap: 22 }}>

        {/* MAIN EDITING WORKSPACE PANEL */}
        {tab !== "preview" && (
          <div className="no-print" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20 }}>
            {tab === "import" && <ImportTab setResume={setResume} setTab={setTab} />}
            {tab === "build" && <BuildTab resume={resume} setResume={setResume} documentStyle={documentStyle} />}
            {tab === "design" && (
              <TemplatesTab
                documentStyle={documentStyle} pickDocumentStyle={pickDocumentStyle}
                categoryId={categoryId} pickCategory={pickCategory}
                layoutId={layoutId} setLayoutId={setLayoutId}
                colorId={colorId} setColorId={setColorId}
                fontId={fontId} setFontId={setFontId}
                fontSize={fontSize} setFontSize={setFontSize}
                lineHeight={lineHeight} setLineHeight={setLineHeight}
                sectionSpacing={sectionSpacing} setSectionSpacing={setSectionSpacing}
              />
            )}
            {tab === "analyze" && (
              <AtsTab
                resume={resume} setResume={setResume}
                jobDescription={jobDescription} setJobDescription={setJobDescription}
                analysis={analysis} reqAnalysis={reqAnalysis} hasJD={hasJD}
              />
            )}
            {tab === "ai" && (
              <AiTab
                resume={resume} setResume={setResume}
                jobDescription={jobDescription} setJobDescription={setJobDescription}
                setTab={setTab}
                setIsAiLoading={setIsAiLoading}
                analysisResult={aiAnalysisResult}
                setAnalysisResult={setAiAnalysisResult}
              />
            )}
            {tab === "versions" && (
              <VersionsTab
                resume={resume} setResume={setResume}
                layoutId={layoutId} setLayoutId={setLayoutId}
                colorId={colorId} setColorId={setColorId}
                fontId={fontId} setFontId={setFontId}
                categoryId={categoryId} setCategoryId={setCategoryId}
                documentStyle={documentStyle} setDocumentStyle={setDocumentStyle}
                pageSize={pageSize} setPageSize={setPageSize}
                setTab={setTab}
              />
            )}
          </div>
        )}

        {/* RIGHT SIDE PANEL: live preview mini + score */}
        {tab !== "preview" ? (
          <div className="no-print" style={{ position: "sticky", top: 20, alignSelf: "start" }}>
            {tab === "analyze" ? (
              <div>
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{ fontSize: 34, fontWeight: 700, color: scoreColor }}>{analysis.score}</div>
                    <div style={{ fontSize: 12.5, color: "#6b7280" }}>ATS readiness score<br />out of 100</div>
                  </div>
                  {analysis.findings.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "flex-start" }}>
                      <div style={{ marginTop: 2 }}><StatusIcon status={f.status} /></div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{f.label}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{f.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {hasJD && reqAnalysis.requirements.length > 0 && (
                  <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20, marginTop: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                      <div style={{ fontSize: 26, fontWeight: 700, color: scoreColor }}>{reqAnalysis.coveragePct}%</div>
                      <div style={{ fontSize: 12.5, color: "#6b7280" }}>Requirements covered<br />{reqAnalysis.strongCount} strong · {reqAnalysis.partialCount} partial · {reqAnalysis.missingCount} missing</div>
                    </div>

                    {reqAnalysis.strengths.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1a7f4b", marginBottom: 6 }}>Strengths</div>
                        {reqAnalysis.strengths.map((s, i) => (
                          <div key={i} style={{ fontSize: 12, color: "#374151", marginBottom: 4, display: "flex", gap: 6 }}>
                            <CheckCircle2 size={13} color="#1a7f4b" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {reqAnalysis.weaknesses.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#b0392f", marginBottom: 6 }}>Weaknesses</div>
                        {reqAnalysis.weaknesses.map((w, i) => (
                          <div key={i} style={{ fontSize: 12, color: "#374151", marginBottom: 4, display: "flex", gap: 6 }}>
                            <XCircle size={13} color="#b0392f" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                            <span>{w}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {reqAnalysis.suggestions.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#8a6a3a", marginBottom: 6 }}>Suggestions</div>
                        {reqAnalysis.suggestions.map((s, i) => (
                          <div key={i} style={{ fontSize: 12, color: "#374151", marginBottom: 4, display: "flex", gap: 6 }}>
                            <StatusIcon status="warn" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: "#e9ebee", borderRadius: 10, padding: 12, border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                  <span>Live preview</span>
                  <button type="button" style={{ display: "flex", alignItems: "center", gap: 3, cursor: "pointer", color: "#1e3a5f", background: "none", border: "none", fontSize: 12, padding: 0 }} onClick={() => setTab("preview")}>Full view <ChevronRight size={13} aria-hidden="true" /></button>
                </div>
                <div className="rb-mini-preview-scaled" style={{ transform: "scale(0.62)", transformOrigin: "top left", width: "161%", height: 420, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.12)", borderRadius: 4 }}>
                  <ResumePreview
                    resume={resume}
                    layoutId={layoutId}
                    theme={colorId}
                    font={fontId}
                    documentStyle={documentStyle}
                    fontSize={fontSize}
                    lineHeight={lineHeight}
                    sectionSpacing={sectionSpacing}
                  />
                </div>
                <button type="button" className="rb-mini-preview-mobile-cta" onClick={() => setTab("preview")}
                  style={{ width: "100%", alignItems: "center", justifyContent: "center", gap: 6, background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 7, padding: "10px 14px", fontSize: 13.5, cursor: "pointer" }}>
                  <Eye size={15} aria-hidden="true" /> View full preview
                </button>
              </div>
            )}
          </div>
        ) : (
          <PreviewTab
            resume={resume} layoutId={layoutId} colorId={colorId} fontId={fontId} documentStyle={documentStyle}
            pageSize={pageSize} setPageSize={setPageSize}
            showAtsText={showAtsText} setShowAtsText={setShowAtsText}
            atsText={atsText}
            handleExportText={handleExportText} handlePrint={handlePrint}
            handleExportPdf={handleExportPdf} isExportingPdf={isExportingPdf}
            previewMeasureRef={previewMeasureRef} pageBreaks={pageBreaks}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
