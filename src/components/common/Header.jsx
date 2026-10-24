import React, { useState } from "react";
import { Upload, FileText, Palette, ScanSearch, FolderOpen, Eye, Bot, Star, Menu, X, RotateCcw } from "lucide-react";
import { ResumeIcon } from "./ResumeIcon";

export function Header({ tab, setTab, isAiLoading = false, onResetResume, onOpenFeedback }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "import", label: "Import", icon: Upload, desc: "Import existing .docx or text resume" },
    { id: "build", label: "Build", icon: FileText, desc: "Edit personal details, experience, & skills" },
    { id: "design", label: "Templates", icon: Palette, desc: "Customize layouts, color themes, & typography" },
    { id: "analyze", label: "ATS check", icon: ScanSearch, desc: "Audit 100-pt ATS compliance & job match" },
    { id: "ai", label: "AI Advisor", icon: Bot, desc: "AI candidate evaluations, Q&A, & cover letter" },
    { id: "versions", label: "Versions", icon: FolderOpen, desc: "Save version snapshots & JSON backups" },
    { id: "preview", label: "Preview", icon: Eye, desc: "Print preview, ATS plain text, & PDF export" },
  ];

  const handleTabClick = (tabId) => {
    if (!isAiLoading) {
      setTab(tabId);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className="no-print"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        padding: "12px 24px",
      }}
    >
      <style>{`
        .rb-header-inner {
          max-width: 1180px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }
        .rb-mobile-toggle-btn {
          display: none;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border: 1px solid #d1d5db;
          border-radius: 7px;
          background: #fff;
          color: #374151;
          cursor: pointer;
        }
        .rb-desktop-tabs {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        @media (max-width: 860px) {
          .rb-header-subtitle { display: none; }
          .rb-mobile-toggle-btn { display: flex; }
          .rb-desktop-tabs {
            display: ${isMobileMenuOpen ? "flex" : "none"} !important;
            flex-direction: column;
            position: absolute;
            top: calc(100% + 12px);
            left: -24px;
            right: -24px;
            background: #ffffff;
            border-bottom: 1px solid #e5e7eb;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            padding: 12px 20px;
            gap: 8px;
            align-items: stretch;
            z-index: 101;
          }
          .rb-desktop-tabs button {
            width: 100%;
            justify-content: flex-start;
            padding: 10px 14px;
          }
        }
      `}</style>

      <div className="rb-header-inner">
        <button
          type="button"
          onClick={() => handleTabClick("design")}
          disabled={isAiLoading}
          title="Go to Home (Templates)"
          aria-label="MyResume Builder Home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "none",
            border: "none",
            padding: "4px 8px",
            margin: "-4px -8px",
            borderRadius: 8,
            textAlign: "left",
            cursor: isAiLoading ? "not-allowed" : "pointer",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
        >
          <ResumeIcon size={34} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17.5, color: "#0f172a" }}>
              MyResume Builder
            </div>
            <div className="rb-header-subtitle" style={{ fontSize: 12, color: "#64748b" }}>
              Tailored Templates · Smart ATS Review · AI Career Advisor · Version History
            </div>
          </div>
        </button>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="rb-mobile-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Navigation Tabs Drawer / Bar */}
        <nav className="rb-desktop-tabs" aria-label="Main Navigation">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTabClick(t.id)}
              disabled={isAiLoading}
              title={t.desc}
              aria-current={tab === t.id ? "page" : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 7,
                border: "1px solid " + (tab === t.id ? "#1e3a5f" : "#e5e7eb"),
                background: tab === t.id ? "#1e3a5f" : "#fff",
                color: tab === t.id ? "#fff" : "#374151",
                fontSize: 13.5, fontWeight: 500,
                cursor: isAiLoading ? "not-allowed" : "pointer",
                opacity: isAiLoading && tab !== t.id ? 0.5 : 1
              }}
            >
              <t.icon size={15} aria-hidden="true" /> {t.label}
            </button>
          ))}
          {onResetResume && (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onResetResume();
              }}
              disabled={isAiLoading}
              title="Restore the default General mock resume"
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 7,
                border: "1px solid #64748b", background: "#fff", color: "#334155",
                fontSize: 13, fontWeight: 600, cursor: isAiLoading ? "not-allowed" : "pointer",
                opacity: isAiLoading ? 0.5 : 1
              }}
            >
              <RotateCcw size={14} aria-hidden="true" /> Reset
            </button>
          )}
          {onOpenFeedback && (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenFeedback();
              }}
              title="Submit rating & review"
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 7,
                border: "1px solid #f59e0b", background: "#fef3c7", color: "#92400e",
                fontSize: 13, fontWeight: 600, cursor: "pointer"
              }}
            >
              <Star size={14} fill="#f59e0b" color="#f59e0b" /> Rate
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
