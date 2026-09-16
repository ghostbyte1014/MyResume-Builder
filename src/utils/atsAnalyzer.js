import { LAYOUTS } from "../constants/templatesData";
import { STRONG_VERBS, keywordWeight } from "../constants/dictionary";
import { resumeToText } from "./textExporter";
import { tokenize } from "./parser";

export function analyzeResume(resume, jobDescription, layoutId, documentStyle) {
  const resumeText = resumeToText(resume);
  const resumeTokens = new Set(tokenize(resumeText));
  const findings = [];
  let score = 0;
  const maxScore = 100;

  // 1. Keyword match (25 pts)
  let keywordPct = null;
  let missingKeywords = [];
  if (jobDescription && jobDescription.trim().length > 20) {
    const jdTokens = tokenize(jobDescription);
    const freq = {};
    jdTokens.forEach(t => { freq[t] = (freq[t] || 0) + 1; });
    const uniqueJd = Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, 40);
    const weights = uniqueJd.map(keywordWeight);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const matchedWeight = uniqueJd.reduce((sum, t, i) => sum + (resumeTokens.has(t) ? weights[i] : 0), 0);
    missingKeywords = uniqueJd.filter(t => !resumeTokens.has(t)).slice(0, 12);
    keywordPct = totalWeight ? Math.round((matchedWeight / totalWeight) * 100) : 100;
    const pts = Math.round((keywordPct / 100) * 25);
    score += pts;
    findings.push({
      label: "Keyword match vs job description",
      status: keywordPct >= 60 ? "good" : keywordPct >= 35 ? "warn" : "bad",
      detail: `${keywordPct}% of the job description's top terms appear in your resume, weighted toward skills and tools over generic action words.`,
    });
  } else {
    score += 17;
    findings.push({
      label: "Keyword match vs job description",
      status: "warn",
      detail: "Paste a job description above to get a real keyword match score.",
    });
  }

  // 2. Formatting / parsing risk (15 pts)
  const layout = LAYOUTS.find(l => l.id === layoutId) || LAYOUTS[0];
  const formatPts = layout.atsRisk === "low" ? 15 : layout.atsRisk === "medium" ? 9 : 3;
  score += formatPts;
  findings.push({
    label: "Formatting & parsing risk",
    status: layout.atsRisk === "low" ? "good" : "warn",
    detail: layout.atsRisk === "low"
      ? "Your selected layout is single-flow and parses cleanly in most ATS software."
      : "Two-column layouts are sometimes read out of order by older ATS parsers. Switch to a classic or executive layout for high-stakes applications.",
  });

  // 3. Section completeness (15 pts)
  const sections = [
    ["Summary", resume.summary && resume.summary.trim().length > 20],
    ["Work experience", resume.experience && resume.experience.length > 0 && resume.experience.some(e => e.bullets.some(b => b.included && b.text.trim()))],
    ["Education", resume.education && resume.education.length > 0],
    ["Skills", resume.skills && resume.skills.trim().length > 0],
  ];
  const presentCount = sections.filter(s => s[1]).length;
  score += Math.round((presentCount / sections.length) * 15);
  const missingSections = sections.filter(s => !s[1]).map(s => s[0]);
  findings.push({
    label: "Core sections present",
    status: missingSections.length === 0 ? "good" : "bad",
    detail: missingSections.length === 0 ? "Summary, experience, education and skills are all filled in." : `Missing or thin: ${missingSections.join(", ")}.`,
  });

  // 4. Quantification & action verbs (15 pts)
  const allBullets = (resume.experience || []).flatMap(e => (e.bullets || []).filter(b => b.included).map(b => b.text).filter(Boolean));
  const withNumbers = allBullets.filter(b => /\d/.test(b));
  const withStrongVerb = allBullets.filter(b => {
    const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "");
    return STRONG_VERBS.includes(firstWord);
  });
  const quantPct = allBullets.length ? Math.round((withNumbers.length / allBullets.length) * 100) : 0;
  const verbPct = allBullets.length ? Math.round((withStrongVerb.length / allBullets.length) * 100) : 0;
  const quantScore = Math.round(((quantPct + verbPct) / 200) * 15);
  score += quantScore;
  findings.push({
    label: "Quantified, action-driven bullets",
    status: quantPct >= 50 && verbPct >= 50 ? "good" : quantPct >= 25 || verbPct >= 25 ? "warn" : "bad",
    detail: `${quantPct}% of bullets include a number or metric; ${verbPct}% open with a strong action verb.`,
  });

  // 4b. Date formatting consistency (10 pts)
  const classifyDate = (str) => {
    if (!str || !str.trim()) return null;
    const s = str.trim();
    if (/^\d{4}\s*[-–—to]+\s*(\d{4}|present)/i.test(s)) return "year";
    if (/[a-z]{3,9}\.?\s+\d{4}/i.test(s)) return "month";
    return "other";
  };
  const allDateStrings = [...(resume.experience || []).map(e => e.dates), ...(resume.education || []).map(e => e.dates)];
  const filledDates = allDateStrings.filter(d => d && d.trim());
  const dateFormats = new Set(filledDates.map(classifyDate).filter(Boolean));
  let dateStatus = "good";
  let dateDetail = "Date formats are consistent across your entries.";
  if (filledDates.length === 0) {
    dateStatus = "warn";
    dateDetail = "No dates found on your experience or education entries.";
  } else if (dateFormats.size > 1) {
    dateStatus = "warn";
    dateDetail = 'Mixed date formats detected (e.g. "2022 - 2024" vs "Jan 2022 - Mar 2024"). Pick one style and use it everywhere.';
  } else if (dateFormats.has("other")) {
    dateStatus = "warn";
    dateDetail = "Some dates aren't in a standard year or month-year format, which can confuse ATS parsers.";
  } else if (filledDates.length < allDateStrings.length) {
    dateStatus = "warn";
    dateDetail = "One or more entries is missing dates.";
  }
  score += dateStatus === "good" ? 10 : 5;
  findings.push({ label: "Date formatting consistency", status: dateStatus, detail: dateDetail });

  // 5. Contact completeness (10 pts)
  const contactFields = [resume.name, resume.email, resume.phone, resume.location];
  const contactPresent = contactFields.filter(f => f && f.trim().length > 0).length;
  score += Math.round((contactPresent / contactFields.length) * 10);
  findings.push({
    label: "Contact information",
    status: contactPresent === contactFields.length ? "good" : "warn",
    detail: contactPresent === contactFields.length ? "Name, email, phone and location are all present." : "Add any missing contact fields so recruiters and ATS parsers can find them.",
  });

  // 6. Length (10 pts)
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  const maxWords = documentStyle === "intl" ? 1800 : 900;
  const lengthNorm = documentStyle === "intl" ? "a CV can reasonably run two to three pages" : "aim for one page, two at most";
  let lengthStatus = "good";
  let lengthDetail = `${wordCount} words - a solid length (${lengthNorm}).`;
  if (wordCount < 150) { lengthStatus = "bad"; lengthDetail = `${wordCount} words is quite thin. Add more detail to your experience bullets.`; }
  else if (wordCount > maxWords) { lengthStatus = "warn"; lengthDetail = `${wordCount} words is long even for a CV (${lengthNorm}). Trim to the most relevant, recent experience.`; }
  score += lengthStatus === "good" ? 10 : lengthStatus === "warn" ? 6 : 3;
  findings.push({ label: "Length", status: lengthStatus, detail: lengthDetail });

  // 7. Photo presence & layout alignment ATS risk logic
  if (resume.photo) {
    const align = resume.photoAlign || "center";
    if (align === "left" || align === "right") {
      score = Math.max(0, score - 14);
      findings.push({
        label: `Photo layout alignment (${align})`,
        status: "bad",
        detail: `Photo is aligned '${align}' inline with the header text block. Side-by-side floating elements frequently cause legacy ATS text parsers to misread or concatenate header contact text out of order.`,
      });
    } else {
      score = Math.max(0, score - 10);
      findings.push({
        label: "Photo / image",
        status: "warn",
        detail: "A photo is included (centered above header). Many ATS parsers cannot read embedded image text and some pipelines auto-reject resumes containing images.",
      });
    }
  }

  return {
    score: Math.max(0, Math.min(maxScore, score)),
    findings,
    keywordPct,
    missingKeywords,
  };
}

export function extractRequirementLines(jobDescription) {
  if (!jobDescription) return [];
  const normalized = jobDescription.replace(/[•▪●○·]/g, "\n").replace(/\r/g, "");
  const rawLines = normalized
    .split("\n")
    .flatMap(line => line.split(/(?<=[.;])\s+(?=[A-Z])/));
  const cleaned = rawLines
    .map(l => l.trim().replace(/^[-*\d]+[.)]?\s*/, ""))
    .filter(Boolean);
  const seen = new Set();
  const unique = [];
  for (const line of cleaned) {
    const toks = tokenize(line);
    if (toks.length < 2 || line.length > 220) continue;
    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(line);
  }
  return unique.slice(0, 15);
}

export function analyzeRequirements(resume, jobDescription) {
  const lines = extractRequirementLines(jobDescription);
  const resumeTokens = new Set(tokenize(resumeToText(resume)));

  const requirements = lines.map(line => {
    const toks = Array.from(new Set(tokenize(line)));
    const weights = toks.map(keywordWeight);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const matchedWeight = toks.reduce((sum, t, i) => sum + (resumeTokens.has(t) ? weights[i] : 0), 0);
    const ratio = totalWeight ? matchedWeight / totalWeight : 0;
    const matchedTerms = toks.filter(t => resumeTokens.has(t));
    const missingTerms = toks.filter(t => !resumeTokens.has(t));
    let status = "missing";
    if (ratio >= 0.6) status = "strong";
    else if (ratio >= 0.25) status = "partial";
    return { text: line, status, matchedTerms, missingTerms, ratio };
  });

  const strong = requirements.filter(r => r.status === "strong");
  const partial = requirements.filter(r => r.status === "partial");
  const missing = requirements.filter(r => r.status === "missing");

  const strengths = strong.slice(0, 6).map(r => r.text);
  const weaknesses = missing.slice(0, 6).map(r => r.text);

  const suggestions = [];
  missing.slice(0, 5).forEach(r => {
    if (r.missingTerms.length) {
      suggestions.push(`Add a bullet or skill mentioning ${r.missingTerms.slice(0, 3).join(", ")} to cover: "${r.text}"`);
    }
  });
  partial.slice(0, 3).forEach(r => {
    if (r.missingTerms.length) {
      suggestions.push(`Make "${r.text}" more explicit by naming ${r.missingTerms.slice(0, 2).join(", ")} directly, not just implying it`);
    }
  });

  const coveragePct = requirements.length
    ? Math.round(((strong.length + partial.length * 0.5) / requirements.length) * 100)
    : null;

  return { requirements, strengths, weaknesses, suggestions, coveragePct, strongCount: strong.length, partialCount: partial.length, missingCount: missing.length };
}
