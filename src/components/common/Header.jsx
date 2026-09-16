import React from "react";
import { Upload, FileText, Palette, ScanSearch, FolderOpen, Eye, Bot } from "lucide-react";
import { ResumeIcon } from "./ResumeIcon";

export function Header({ tab, setTab, isAiLoading = false }) {
  const tabs = [
    { id: "import", label: "Import", icon: Upload, desc: "Import existing .docx or text resume" },
    { id: "build", label: "Build", icon: FileText, desc: "Edit personal details, experience, & skills" },
    { id: "design", label: "Templates", icon: Palette, desc: "Customize layouts, color themes, & typography" },
    { id: "analyze", label: "ATS check", icon: ScanSearch, desc: "Audit 100-pt ATS compliance & job match" },
    { id: "ai", label: "AI Advisor", icon: Bot, desc: "AI candidate evaluations, Q&A, & cover letter" },
    { id: "versions", label: "Versions", icon: FolderOpen, desc: "Save version snapshots & JSON backups" },
    { id: "preview", label: "Preview", icon: Eye, desc: "Print preview, ATS plain text, & PDF export" },
  ];

  return (
    <div className="no-print" style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 24px" }}>
      <div className="rb-header-inner" style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ResumeIcon size={34} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17.5, color: "#0f172a" }}>
              MyResume Builder
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Tailored Templates · Smart ATS Review · AI Career Advisor · Version History
            </div>
          </div>
        </div>
        <div className="rb-tabs" style={{ display: "flex", gap: 4 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => !isAiLoading && setTab(t.id)}
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
        </div>
      </div>
    </div>
  );
}
