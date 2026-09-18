import React, { useState } from "react";
import { Plus, Check } from "lucide-react";
import { StatusIcon } from "../common/StatusIcon";
import { TabInfoBanner } from "../common/TabInfoBanner";

const SAMPLE_JOB_DESCRIPTION = `Job Title: Senior Software Engineer / Frontend Developer
Location: Remote / Hybrid

Job Overview:
We are seeking an experienced Software Engineer to develop scalable web applications, implement modular UI architectures, and collaborate with cross-functional teams.

Key Responsibilities:
- Build modular, high-performance UI components using React, TypeScript, and modern JavaScript (ES6+).
- Implement responsive styling and design systems with CSS3 and modern UI frameworks adhering to accessibility standards.
- Integrate RESTful APIs and GraphQL endpoints for data synchronization.
- Write unit and integration tests using Jest and React Testing Library.
- Collaborate with product managers, UX designers, and backend engineering teams in an Agile environment.
- Participate in CI/CD pipeline automation, Git version control, and cloud deployment workflows (AWS/Docker).

Required Qualifications:
- 3+ years of professional software engineering experience.
- Strong proficiency in React, TypeScript, HTML5, CSS3, and state management.
- Hands-on experience with automated testing, API integration, and performance optimization.
- Excellent communication, cross-functional collaboration, and technical problem-solving skills.`;

export function AtsTab({
  resume, setResume,
  jobDescription, setJobDescription,
  analysis, reqAnalysis, hasJD
}) {
  const [addedSkills, setAddedSkills] = useState({});
  const [copyFeedback, setCopyFeedback] = useState(false);

  function handleAddMissingSkill(skill) {
    if (!skill) return;
    const cleanSkill = skill.trim();
    setResume(r => {
      const existing = (r.skills || "").split(",").map(s => s.trim()).filter(Boolean);
      if (existing.map(s => s.toLowerCase()).includes(cleanSkill.toLowerCase())) {
        return r;
      }
      const updated = existing.length ? [...existing, cleanSkill].join(", ") : cleanSkill;
      return { ...r, skills: updated };
    });
    setAddedSkills(prev => ({ ...prev, [cleanSkill.toLowerCase()]: true }));
  }

  async function handlePasteClipboard() {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setJobDescription(text);
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
        }
      }
    } catch (err) {
      // Clipboard permissions unavailable or denied
    }
  }

  function handleLoadSample() {
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
  }

  function handleClear() {
    setJobDescription("");
  }

  const wordCount = (jobDescription || "").trim().split(/\s+/).filter(Boolean).length;

  return (
    <div>
      <TabInfoBanner
        title="ATS Check Purpose"
        description="Evaluate your resume against 100-point Applicant Tracking System (ATS) parsing rules, detect layout risks, and match keywords against a target job posting."
      />

      {/* Header & Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: "#1e293b" }}>
            Target Job Description
            <span style={{ fontSize: 12, fontWeight: 400, color: "#64748b", marginLeft: 6 }}>
              (Optional)
            </span>
          </h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            type="button"
            onClick={handleLoadSample}
            style={{
              fontSize: 12,
              fontWeight: 500,
              background: "#ffffff",
              color: "#1e3a5f",
              border: "1px solid #cbd5e1",
              padding: "4px 10px",
              borderRadius: 5,
              cursor: "pointer",
              transition: "background 0.15s, border-color 0.15s"
            }}
          >
            Load Sample
          </button>

          <button
            type="button"
            onClick={handlePasteClipboard}
            style={{
              fontSize: 12,
              fontWeight: 500,
              background: "#ffffff",
              color: "#334155",
              border: "1px solid #cbd5e1",
              padding: "4px 10px",
              borderRadius: 5,
              cursor: "pointer"
            }}
          >
            {copyFeedback ? "Pasted" : "Paste Clipboard"}
          </button>

          {jobDescription && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                fontSize: 12,
                fontWeight: 500,
                background: "#ffffff",
                color: "#64748b",
                border: "1px solid #e2e8f0",
                padding: "4px 10px",
                borderRadius: 5,
                cursor: "pointer"
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <textarea
        value={jobDescription}
        onChange={e => setJobDescription(e.target.value)}
        rows={7}
        placeholder="Paste target job posting here to evaluate keyword overlap and role requirements..."
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #d1d5db",
          borderRadius: 6,
          fontSize: 13,
          fontFamily: "inherit",
          resize: "vertical",
          lineHeight: 1.5,
          boxSizing: "border-box",
          background: "#ffffff",
          color: "#1e293b"
        }}
      />

      {/* Status Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 6,
        marginBottom: 14,
        fontSize: 11.5,
        color: "#64748b"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: hasJD ? "#16a34a" : "#94a3b8"
          }} />
          <span>
            {hasJD
              ? `Real-time analysis active (${wordCount} words parsed)`
              : "Live evaluation active — inputs update results automatically."}
          </span>
        </div>
      </div>

      {/* Clean Empty State Walkthrough */}
      {!hasJD && (
        <div style={{
          marginTop: 10,
          padding: "12px 14px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 6
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 8 }}>
            How Keyword Matching Works
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 4, padding: "8px 10px", fontSize: 11.5, color: "#475569" }}>
              <div style={{ fontWeight: 600, color: "#1e293b", marginBottom: 2 }}>1. Provide Job Posting</div>
              Paste the target job description or click <em>Load Sample</em>.
            </div>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 4, padding: "8px 10px", fontSize: 11.5, color: "#475569" }}>
              <div style={{ fontWeight: 600, color: "#1e293b", marginBottom: 2 }}>2. Automated Evaluation</div>
              Scores and keyword relevance calculate immediately in real-time.
            </div>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 4, padding: "8px 10px", fontSize: 11.5, color: "#475569" }}>
              <div style={{ fontWeight: 600, color: "#1e293b", marginBottom: 2 }}>3. Address Skill Gaps</div>
              Add detected missing skills to your resume with a single click.
            </div>
          </div>
        </div>
      )}

      {/* Missing Keywords Section */}
      {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
        <div style={{ marginTop: 14, padding: "12px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1e293b", marginBottom: 2 }}>
            Missing Target Skills
          </div>
          <div style={{ fontSize: 11.5, color: "#64748b", marginBottom: 8 }}>
            Click a skill to append it directly to your resume:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {analysis.missingKeywords.map(k => {
              const isAdded = addedSkills[k.toLowerCase()];
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleAddMissingSkill(k)}
                  disabled={isAdded}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5,
                    background: isAdded ? "#f0fdf4" : "#ffffff",
                    color: isAdded ? "#166534" : "#334155",
                    border: "1px solid " + (isAdded ? "#bbf7d0" : "#cbd5e1"),
                    padding: "3px 8px", borderRadius: 4, cursor: isAdded ? "default" : "pointer", fontWeight: 500
                  }}
                >
                  {isAdded ? <Check size={11} color="#166534" /> : <Plus size={11} color="#64748b" />}
                  <span>{k}</span>
                  {isAdded && <span style={{ fontSize: 10, color: "#166534" }}>(Added)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Requirement-by-Requirement Match */}
      {hasJD && reqAnalysis && reqAnalysis.requirements && reqAnalysis.requirements.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <h3 style={{ fontSize: 14.5, margin: 0, fontWeight: 600, color: "#1e293b" }}>Requirement Coverage</h3>
            <span style={{ fontSize: 11.5, color: "#64748b" }}>
              {reqAnalysis.requirements.filter(r => r.status === "strong").length} of {reqAnalysis.requirements.length} matched
            </span>
          </div>
          <p style={{ fontSize: 11.5, color: "#64748b", marginTop: 2, marginBottom: 10 }}>
            Evaluation of target job requirements against resume content.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {reqAnalysis.requirements.map((r, i) => {
              const iconStatus = r.status === "strong" ? "good" : r.status === "partial" ? "warn" : "bad";
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    padding: "8px 10px",
                    background: "#ffffff",
                    border: "1px solid #f1f5f9",
                    borderRadius: 4
                  }}
                >
                  <div style={{ marginTop: 2 }}><StatusIcon status={iconStatus} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, color: "#1e293b", lineHeight: 1.4 }}>{r.text}</div>
                    {r.status !== "strong" && r.missingTerms.length > 0 && (
                      <div style={{ fontSize: 11, color: "#b45309", marginTop: 2 }}>
                        Unmatched terms: {r.missingTerms.slice(0, 5).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
