import React, { useState } from "react";
import { Plus, Check } from "lucide-react";
import { StatusIcon } from "../common/StatusIcon";
import { TabInfoBanner } from "../common/TabInfoBanner";

export function AtsTab({
  resume, setResume,
  jobDescription, setJobDescription,
  analysis, reqAnalysis, hasJD
}) {
  const [addedSkills, setAddedSkills] = useState({});

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

  return (
    <div>
      <TabInfoBanner
        title="ATS Check Purpose"
        description="Evaluate your resume against 100-point Applicant Tracking System (ATS) parsing rules, detect layout risks, and match keywords against a target job posting."
      />
      <h3 style={{ marginTop: 0, fontSize: 15 }}>Paste the job description (optional but recommended)</h3>
      <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={8}
        placeholder="Paste the job posting here to check keyword match..."
        style={{ width: "100%", padding: 10, border: "1px solid #d7dbe0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit", resize: "vertical" }} />

      {analysis.missingKeywords.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 6 }}>Top terms from the job post missing in your resume (click to add):</div>
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
                    display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12,
                    background: isAdded ? "#f0fdf4" : "#fdf1ea",
                    color: isAdded ? "#166534" : "#8a4a2a",
                    border: "1px solid " + (isAdded ? "#bbf7d0" : "#fcd34d"),
                    padding: "4px 10px", borderRadius: 12, cursor: isAdded ? "default" : "pointer", fontWeight: 500
                  }}
                >
                  {isAdded ? <Check size={12} color="#166534" /> : <Plus size={12} color="#8a4a2a" />}
                  <span>{k}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {hasJD && reqAnalysis.requirements.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <h3 style={{ fontSize: 15, marginBottom: 2 }}>Requirement-by-requirement match</h3>
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 0, marginBottom: 12 }}>
            Each line from the posting, checked against your resume. This is keyword overlap, not true understanding of the requirement — use it to spot gaps, not as a verdict.
          </p>
          {reqAnalysis.requirements.map((r, i) => {
            const iconStatus = r.status === "strong" ? "good" : r.status === "partial" ? "warn" : "bad";
            return (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #f1f2f4" }}>
                <div style={{ marginTop: 2 }}><StatusIcon status={iconStatus} /></div>
                <div>
                  <div style={{ fontSize: 13 }}>{r.text}</div>
                  {r.status !== "strong" && r.missingTerms.length > 0 && (
                    <div style={{ fontSize: 11.5, color: "#8a4a2a", marginTop: 2 }}>Not clearly covered: {r.missingTerms.slice(0, 5).join(", ")}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
