import { resumeToPlainText } from "./textExporter";

export function getStoredApiKey() {
  if (import.meta.env && import.meta.env.VITE_OPENROUTER_API_KEY) {
    return import.meta.env.VITE_OPENROUTER_API_KEY.trim();
  }
  if (typeof window !== "undefined" && window.localStorage) {
    const key = window.localStorage.getItem("openrouter_api_key");
    if (key) return key.trim();
  }
  return "";
}

/**
 * Trims text to max characters to prevent wasting tokens on boilerplate legalese/EEO statements.
 */
function pruneText(text, maxChars = 1500) {
  if (!text) return "";
  const cleaned = text.trim();
  if (cleaned.length <= maxChars) return cleaned;
  return cleaned.slice(0, maxChars) + "...\n[Truncated for token optimization]";
}

export async function analyzeResumeWithOpenRouter({ resume, jobDescription, targetCompany, targetRole }) {
  const activeKey = getStoredApiKey();
  if (!activeKey) {
    throw new Error("AI Review is currently unavailable or offline. Please try again in a few minutes.");
  }

  const activeModel = (import.meta.env && import.meta.env.VITE_OPENROUTER_MODEL) || "openai/gpt-4o-mini";
  
  const resumeText = pruneText(resumeToPlainText(resume), 2000);
  const prunedJd = pruneText(jobDescription, 1500);

  const prompt = `
Candidate Resume:
${resumeText}

Target Role: ${targetRole || resume.title || "Target Position"}
Target Company: ${targetCompany || "Not specified"}

Job Description:
${prunedJd || "Evaluate career narrative & bullet strength."}

Evaluate fit and return ONLY valid JSON matching this schema:
{
  "overallScore": 85,
  "verdict": "One short concise verdict sentence.",
  "dimensionScores": {
    "technical": 88,
    "leadership": 82,
    "impact": 90,
    "formatting": 95
  },
  "strengths": ["Short strength 1", "Short strength 2", "Short strength 3"],
  "weaknesses": ["Short gap 1", "Short gap 2"],
  "missingSkills": ["Skill1", "Skill2", "Skill3"],
  "tailoredSummary": "A 2-sentence executive summary rewrite.",
  "bulletImprovements": [
    {
      "expId": 1,
      "bulletId": 101,
      "original": "exact original bullet snippet",
      "improved": "High-impact rewritten action bullet with metrics.",
      "rationale": "Short impact note."
    }
  ],
  "interviewQuestions": [
    {
      "question": "Behavioral question targeting gap area?",
      "starTip": "STAR tip: Situation/Task, Action to highlight, Result."
    }
  ],
  "coverLetter": "Dear Hiring Manager at Company,\\n\\nParagraph 1 opening hook...\\n\\nParagraph 2 key matching accomplishments...\\n\\nParagraph 3 confident closing."
}

STRICT CONSTRAINTS:
- Limit strengths & weaknesses to max 3 items each.
- Limit bulletImprovements to max 3 items.
- Limit interviewQuestions to max 2 items.
- Output ONLY the raw JSON object. No Markdown formatting or conversational filler.
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${activeKey}`,
      "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "http://localhost:5173",
      "X-Title": "MyResume Builder AI",
    },
    body: JSON.stringify({
      model: activeModel,
      messages: [
        { role: "system", content: "You are a concise resume optimization engine that outputs raw JSON only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 1200,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    throw new Error("AI Review is currently unavailable or offline. Please try again in a few minutes.");
  }

  const data = await response.json();
  const contentStr = data.choices?.[0]?.message?.content || "";

  try {
    const cleanJsonStr = contentStr.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const parsed = JSON.parse(cleanJsonStr);
    return parsed;
  } catch (err) {
    throw new Error("AI Review is currently unavailable or offline. Please try again in a few minutes.");
  }
}
