import React, { useState } from "react";
import { CheckCircle2, XCircle, Zap, RefreshCw, Bot, Plus, Check, Copy, Download, HelpCircle, FileText, ArrowRight } from "lucide-react";
import { getStoredApiKey, analyzeResumeWithOpenRouter } from "../../utils/openrouter";
import { downloadTextFile } from "../../utils/textExporter";
import { TabInfoBanner } from "../common/TabInfoBanner";

export function AiTab({ resume, setResume, jobDescription, setJobDescription, setTab, setIsAiLoading, analysisResult, setAnalysisResult }) {
  const [targetCompany, setTargetCompany] = useState("");
  const [targetRole, setTargetRole] = useState(resume.title || "");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appliedSummary, setAppliedSummary] = useState(false);
  const [appliedBullets, setAppliedBullets] = useState({});
  const [addedSkills, setAddedSkills] = useState({});
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  const hasApiKey = !!getStoredApiKey();

  async function handleRunAnalysis() {
    setError("");
    if (!hasApiKey) {
      setError("AI Review is currently unavailable or offline. Please try again in a few minutes.");
      return;
    }
    setLoading(true);
    if (setIsAiLoading) setIsAiLoading(true);
    setAnalysisResult(null);
    setAppliedSummary(false);
    setAppliedBullets({});
    setAddedSkills({});
    setCopiedCoverLetter(false);

    try {
      const result = await analyzeResumeWithOpenRouter({
        resume,
        jobDescription,
        targetCompany,
        targetRole
      });
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message || "An unexpected error occurred during AI analysis.");
    } finally {
      setLoading(false);
      if (setIsAiLoading) setIsAiLoading(false);
    }
  }

  function handleApplySummary(newSummary) {
    setResume(r => ({ ...r, summary: newSummary }));
    setAppliedSummary(true);
  }

  function handleApplyBullet(expId, bulletId, newText) {
    setResume(r => ({
      ...r,
      experience: r.experience.map(e => {
        if (e.id === expId || !e.id) {
          return {
            ...e,
            bullets: e.bullets.map(b => (b.id === bulletId || !b.id ? { ...b, text: newText } : b))
          };
        }
        return e;
      })
    }));
    setAppliedBullets(prev => ({ ...prev, [bulletId || expId]: true }));
  }

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

  function handleCopyCoverLetter() {
    if (!analysisResult?.coverLetter) return;
    navigator.clipboard.writeText(analysisResult.coverLetter);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 3000);
  }

  function handleDownloadCoverLetter() {
    if (!analysisResult?.coverLetter) return;
    const comp = (targetCompany || "company").trim().replace(/\s+/g, "_").toLowerCase();
    const filename = `${(resume.name || "candidate").trim().replace(/\s+/g, "_").toLowerCase()}_cover_letter_${comp}.txt`;
    downloadTextFile(filename, analysisResult.coverLetter);
  }

  const scoreColor = analysisResult
    ? (analysisResult.overallScore >= 75 ? "#1a7f4b" : analysisResult.overallScore >= 50 ? "#b8860b" : "#b0392f")
    : "#1e3a5f";

  return (
    <div>
      <TabInfoBanner
        title="AI Career Advisor Purpose"
        description="Run token-optimized AI evaluations to receive multi-dimension scores, 1-click missing skills addition, STAR interview Q&A prep, and tailored cover letters."
      />

      {/* FULL-SCREEN MODAL OVERLAY WHILE AI IS ANALYZING */}
      {loading && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "#fff", padding: "32px 40px", borderRadius: 12, textAlign: "center", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)", maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <RefreshCw size={36} color="#1e3a5f" style={{ animation: "spin 1s linear infinite" }} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>AI Career Advisor Analyzing Resume...</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 8, lineHeight: 1.5 }}>
              Evaluating role fit, multi-dimension metrics, tailored summary, and bullet enhancements. Please wait.
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
          <Bot size={18} color="#1e3a5f" /> AI Career Advisor
        </h3>
        <p style={{ fontSize: 12.5, color: "#64748b", margin: "3px 0 0 0" }}>
          Get multi-dimension role evaluations, 1-click missing skills addition, interview prep Q&A, and tailored cover letters.
        </p>
      </div>

      {/* TARGET ROLE & JOB DESCRIPTION INPUTS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label htmlFor="rb-target-company" style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#334155", marginBottom: 4 }}>Target Company (optional)</label>
          <input
            id="rb-target-company"
            value={targetCompany}
            onChange={e => setTargetCompany(e.target.value)}
            placeholder="e.g. Google, Stripe, Microsoft"
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #d7dbe0", borderRadius: 6, fontSize: 13.5, fontFamily: "inherit" }}
          />
        </div>
        <div>
          <label htmlFor="rb-target-role" style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#334155", marginBottom: 4 }}>Target Job Title</label>
          <input
            id="rb-target-role"
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Product Manager"
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #d7dbe0", borderRadius: 6, fontSize: 13.5, fontFamily: "inherit" }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="rb-jd-input" style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#334155", marginBottom: 4 }}>
          Job Posting Requirements
        </label>
        <textarea
          id="rb-jd-input"
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          rows={5}
          placeholder="Paste the target job posting here for intelligent role alignment..."
          style={{ width: "100%", padding: 10, border: "1px solid #d7dbe0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", resize: "vertical" }}
        />
      </div>

      {error && <div style={{ fontSize: 12.5, color: "#b0392f", marginBottom: 14, background: "#fdf2f2", padding: "8px 12px", borderRadius: 6, border: "1px solid #f87171" }}>{error}</div>}

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 24 }}>
        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", gap: 8, background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 7,
            padding: "10px 18px", fontSize: 13.5, fontWeight: 500, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? <RefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Zap size={15} />}
          {loading ? "Evaluating candidate fit..." : "Run AI Resume Review"}
        </button>

        {analysisResult && (
          <button
            type="button"
            onClick={() => setTab("build")}
            style={{
              display: "flex", alignItems: "center", gap: 6, background: "#f1f5f9", color: "#0f172a", border: "1px solid #cbd5e1",
              borderRadius: 7, padding: "10px 16px", fontSize: 13, cursor: "pointer", fontWeight: 500
            }}
          >
            <span>Continue Editing on Build Tab</span> <ArrowRight size={15} />
          </button>
        )}
      </div>

      {/* ANALYSIS RESULTS VIEW */}
      {analysisResult && (
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 18, background: "#fff" }}>
          {/* TOP BAR WITH CONTINUE EDITING BUTTON */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #f1f2f4" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>AI Analysis Results</div>
            <button
              type="button"
              onClick={() => setTab("build")}
              style={{
                display: "flex", alignItems: "center", gap: 6, background: "#1e3a5f", color: "#fff", border: "none",
                borderRadius: 6, padding: "7px 14px", fontSize: 12.5, cursor: "pointer", fontWeight: 500
              }}
            >
              <span>Continue Editing on Build Tab</span> <ArrowRight size={14} />
            </button>
          </div>

          {/* VERDICT & SCORE HEADER */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 14, borderBottom: "1px solid #f1f2f4", marginBottom: 16 }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: scoreColor }}>{analysisResult.overallScore}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: scoreColor }}>Overall Match Score / 100</div>
              <div style={{ fontSize: 13, color: "#334155", marginTop: 2 }}>{analysisResult.verdict}</div>
            </div>
          </div>

          {/* MULTI-DIMENSION FIT BREAKDOWN */}
          {analysisResult.dimensionScores && (
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 14, marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 10 }}>Multi-Dimension Readiness Breakdown</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
                {[
                  { key: "technical", label: "Technical Skills", val: analysisResult.dimensionScores.technical || 80 },
                  { key: "leadership", label: "Leadership & Strategy", val: analysisResult.dimensionScores.leadership || 80 },
                  { key: "impact", label: "Impact & Metrics", val: analysisResult.dimensionScores.impact || 80 },
                  { key: "formatting", label: "Format & Structure", val: analysisResult.dimensionScores.formatting || 90 },
                ].map(dim => (
                  <div key={dim.key}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#475569", marginBottom: 3 }}>
                      <span>{dim.label}</span>
                      <span style={{ fontWeight: 600 }}>{dim.val}%</span>
                    </div>
                    <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${dim.val}%`, height: "100%", background: dim.val >= 75 ? "#166534" : dim.val >= 50 ? "#b8860b" : "#b0392f", borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STRENGTHS & WEAKNESSES GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#166534", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                <CheckCircle2 size={15} color="#166534" /> Key Strengths
              </div>
              <ul style={{ margin: "0 0 0 16px", padding: 0, fontSize: 12, color: "#15803d" }}>
                {(analysisResult.strengths || []).map((s, i) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
              </ul>
            </div>

            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#991b1b", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                <XCircle size={15} color="#991b1b" /> Areas to Improve
              </div>
              <ul style={{ margin: "0 0 0 16px", padding: 0, fontSize: 12, color: "#b91c1c" }}>
                {(analysisResult.weaknesses || []).map((w, i) => <li key={i} style={{ marginBottom: 4 }}>{w}</li>)}
              </ul>
            </div>
          </div>

          {/* 1-CLICK ADD MISSING SKILLS PILLS */}
          {analysisResult.missingSkills && analysisResult.missingSkills.length > 0 && (
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: 12, marginBottom: 18 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#92400e", marginBottom: 6 }}>
                Detected Missing Hard Skills (Click to add directly to Skills section):
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {analysisResult.missingSkills.map((sk, i) => {
                  const isAdded = addedSkills[sk.toLowerCase()];
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddMissingSkill(sk)}
                      disabled={isAdded}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12,
                        background: isAdded ? "#f0fdf4" : "#fff",
                        color: isAdded ? "#166534" : "#78350f",
                        border: "1px solid " + (isAdded ? "#bbf7d0" : "#fcd34d"),
                        padding: "4px 10px", borderRadius: 12, cursor: isAdded ? "default" : "pointer", fontWeight: 500
                      }}
                    >
                      {isAdded ? <Check size={12} color="#166534" /> : <Plus size={12} color="#78350f" />}
                      <span>{sk}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAILORED SUMMARY PROPOSAL */}
          {analysisResult.tailoredSummary && (
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 14, marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f" }}>
                  Suggested Professional Summary
                </div>
                <button
                  type="button"
                  onClick={() => handleApplySummary(analysisResult.tailoredSummary)}
                  disabled={appliedSummary}
                  style={{
                    display: "flex", alignItems: "center", gap: 4, background: appliedSummary ? "#166534" : "#1e3a5f", color: "#fff",
                    border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 12, fontWeight: 500, cursor: appliedSummary ? "default" : "pointer"
                  }}
                >
                  <Zap size={13} /> {appliedSummary ? "Applied to Resume" : "Apply to Summary"}
                </button>
              </div>
              <div style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.5, background: "#fff", padding: 10, borderRadius: 6, border: "1px solid #cbd5e1" }}>
                {analysisResult.tailoredSummary}
              </div>
            </div>
          )}

          {/* BULLET-BY-BULLET IMPROVEMENTS */}
          {analysisResult.bulletImprovements && analysisResult.bulletImprovements.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a", marginBottom: 10 }}>
                Suggested Bullet Improvements
              </div>
              {analysisResult.bulletImprovements.map((b, bi) => {
                const isApplied = appliedBullets[b.bulletId || b.expId || bi];
                return (
                  <div key={bi} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12, marginBottom: 10, background: "#f8fafc" }}>
                    <div style={{ fontSize: 11.5, color: "#64748b", marginBottom: 4 }}>Original:</div>
                    <div style={{ fontSize: 12, color: "#475569", textDecoration: "line-through", marginBottom: 8 }}>{b.original}</div>
                    
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: "#1e3a5f", marginBottom: 2 }}>Suggested Revision:</div>
                    <div style={{ fontSize: 12.5, color: "#0f172a", fontWeight: 500, marginBottom: 6 }}>{b.improved}</div>
                    {b.rationale && <div style={{ fontSize: 11, color: "#64748b", fontStyle: "italic", marginBottom: 8 }}>Impact note: {b.rationale}</div>}

                    <button
                      type="button"
                      onClick={() => handleApplyBullet(b.expId, b.bulletId, b.improved)}
                      disabled={isApplied}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4, background: isApplied ? "#166534" : "#1e3a5f", color: "#fff",
                        border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 11.5, cursor: isApplied ? "default" : "pointer"
                      }}
                    >
                      <Zap size={12} /> {isApplied ? "Applied" : "Apply to Bullet"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* INTERVIEW PREPARATION Q&A */}
          {analysisResult.interviewQuestions && analysisResult.interviewQuestions.length > 0 && (
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: 14, marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1e40af", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <HelpCircle size={15} color="#1e40af" /> Likely Interview Questions & STAR Strategy Tips
              </div>
              {analysisResult.interviewQuestions.map((q, qi) => (
                <div key={qi} style={{ marginBottom: 10, background: "#fff", padding: 10, borderRadius: 6, border: "1px solid #dbeafe" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1e3a5f" }}>Q: {q.question}</div>
                  <div style={{ fontSize: 12, color: "#3b82f6", marginTop: 4 }}>{q.starTip}</div>
                </div>
              ))}
            </div>
          )}

          {/* TAILORED COVER LETTER GENERATOR */}
          {analysisResult.coverLetter && (
            <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 8, padding: 14, marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
                  <FileText size={15} color="#1e3a5f" /> Tailored Cover Letter
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    onClick={handleCopyCoverLetter}
                    style={{
                      display: "flex", alignItems: "center", gap: 4, background: "#fff", color: "#1e3a5f",
                      border: "1px solid #cbd5e1", borderRadius: 6, padding: "5px 10px", fontSize: 11.5, cursor: "pointer", fontWeight: 500
                    }}
                  >
                    <Copy size={13} /> {copiedCoverLetter ? "Copied!" : "Copy Text"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadCoverLetter}
                    style={{
                      display: "flex", alignItems: "center", gap: 4, background: "#1e3a5f", color: "#fff",
                      border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 11.5, cursor: "pointer", fontWeight: 500
                    }}
                  >
                    <Download size={13} /> Download (.txt)
                  </button>
                </div>
              </div>
              <pre style={{ background: "#fff", padding: 12, borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 12, color: "#334155", lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>
                {analysisResult.coverLetter}
              </pre>
            </div>
          )}

          {/* BOTTOM CONTINUE EDITING BUTTON */}
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 10, borderTop: "1px solid #f1f2f4" }}>
            <button
              type="button"
              onClick={() => setTab("build")}
              style={{
                display: "flex", alignItems: "center", gap: 6, background: "#1e3a5f", color: "#fff", border: "none",
                borderRadius: 7, padding: "9px 18px", fontSize: 13, cursor: "pointer", fontWeight: 500
              }}
            >
              <span>Continue Editing on Build Tab</span> <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
