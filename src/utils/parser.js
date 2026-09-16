import { STOPWORDS } from "../constants/dictionary";

export function blankResume() {
  return {
    name: "", title: "", email: "", phone: "", location: "", links: "",
    summary: "", experience: [], education: [], skills: "", projects: "",
    publications: "", certifications: "", languages: "", photo: "",
    photoPosition: { x: 50, y: 50 }, photoAlign: "center", dob: "",
  };
}

export function emptyResume() {
  return {
    name: "Jordan Rivera",
    title: "Senior Product Manager",
    email: "jordan.rivera@email.com",
    phone: "(555) 019-2834",
    location: "Austin, TX",
    links: "linkedin.com/in/jordanrivera",
    summary: "Product manager with 7 years leading cross-functional teams to ship consumer-facing features. Skilled at translating ambiguous problems into shipped roadmaps that move revenue and retention.",
    experience: [
      { id: 1, role: "Senior Product Manager", company: "Northwind Software", dates: "2022 - Present", bullets: [
        { id: 101, text: "Led a team of 8 engineers to launch a redesigned onboarding flow, increasing activation by 24%", included: true },
        { id: 102, text: "Drove pricing experiment that grew ARPU by $4.20/user across 3 markets", included: true },
        { id: 103, text: "Managed roadmap for a product line generating $12M in annual revenue", included: true },
      ] },
      { id: 2, role: "Product Manager", company: "Fenwick Analytics", dates: "2019 - 2022", bullets: [
        { id: 201, text: "Built the first self-serve reporting tool, reducing support tickets by 31%", included: true },
        { id: 202, text: "Coordinated launch across 4 teams and 2 time zones, shipping on schedule", included: true },
        { id: 203, text: "Improved trial-to-paid conversion by 9 percentage points through onboarding redesign", included: true },
      ] },
    ],
    education: [
      { id: 1, school: "University of Texas at Austin", degree: "B.S. in Business Administration", dates: "2015 - 2019" },
    ],
    skills: "Product strategy, Roadmapping, SQL, A/B testing, Figma, Stakeholder management, Agile/Scrum, Data analysis",
    projects: "",
    publications: "",
    certifications: "",
    languages: "English (native), Spanish (professional)",
    photo: "",
    photoPosition: { x: 50, y: 50 },
    photoAlign: "center",
    dob: "",
  };
}

const IMPORT_SECTION_PATTERNS = {
  summary: /^(summary|profile|objective|about( me)?)\b/i,
  experience: /^(experience|work experience|employment( history)?|professional experience)\b/i,
  education: /^education\b/i,
  skills: /^(skills|technical skills|core competencies)\b/i,
  projects: /^projects\b/i,
  publications: /^(publications?( ?(&|and) ?grants)?|grants)\b/i,
  certifications: /^(certifications?|licenses?)\b/i,
  languages: /^languages\b/i,
};

export function matchImportSectionKey(line) {
  if (!line || line.length > 40) return null;
  const clean = line.replace(/:$/, "").trim();
  for (const [key, re] of Object.entries(IMPORT_SECTION_PATTERNS)) {
    if (re.test(clean)) return key;
  }
  return null;
}

export function stripBulletMarker(line) {
  return line.replace(/^[-•*●▪]\s*/, "").replace(/^\d+[.)]\s*/, "").trim();
}

export function splitIntoParagraphs(lines) {
  const paras = [];
  let current = [];
  for (const l of lines) {
    if (!l) { if (current.length) { paras.push(current); current = []; } }
    else current.push(l);
  }
  if (current.length) paras.push(current);
  return paras;
}

export function extractDateRange(line) {
  const m = line.match(/\(?((?:[A-Za-z]{3,9}\.?\s+)?\d{4}\s*(?:[-–—]|to)\s*(?:(?:[A-Za-z]{3,9}\.?\s+)?\d{4}|present))\)?/i);
  return m ? { dates: m[1].trim(), rest: (line.slice(0, m.index) + line.slice(m.index + m[0].length)).replace(/[-–—,()]\s*$/, "").trim() } : { dates: "", rest: line };
}

export function parseExperienceSection(lines) {
  return splitIntoParagraphs(lines).map((para, i) => {
    const { dates, rest } = extractDateRange(para[0]);
    const parts = rest.split(/,| at | @ /).map(s => s && s.trim()).filter(Boolean);
    const role = parts[0] || rest;
    const company = parts.slice(1).join(", ") || "";
    const bulletLines = para.slice(1).map(stripBulletMarker).filter(Boolean);
    return {
      id: Date.now() + i * 1000,
      role, company, dates,
      bullets: (bulletLines.length ? bulletLines : [""]).map((t, bi) => ({ id: Date.now() + i * 1000 + bi + 1, text: t, included: true })),
    };
  });
}

export function parseEducationSection(lines) {
  return splitIntoParagraphs(lines).map((para, i) => {
    const { dates, rest } = extractDateRange(para.join(" "));
    const parts = rest.split(/,| - /).map(s => s && s.trim()).filter(Boolean);
    return { id: Date.now() + i * 10 + 500000, degree: parts[0] || rest, school: parts.slice(1).join(", ") || "", dates };
  });
}

export function parseResumeText(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim());
  const resume = blankResume();
  let idx = 0;
  while (idx < lines.length && !lines[idx]) idx++;
  resume.name = lines[idx] || "";
  idx++;

  let contactLines = [];
  while (idx < lines.length) {
    const l = lines[idx];
    if (!l) { idx++; continue; }
    if (matchImportSectionKey(l)) break;
    contactLines.push(l);
    idx++;
    if (contactLines.length >= 4) break;
  }

  if (contactLines.length && !/@/.test(contactLines[0]) && !/\d{3}/.test(contactLines[0]) && contactLines[0].length < 60) {
    resume.title = contactLines[0];
    contactLines = contactLines.slice(1);
  }
  const contactText = contactLines.join(" | ");
  resume.email = (contactText.match(/[\w.+-]+@[\w-]+\.[\w.-]+/) || [""])[0];
  resume.phone = (contactText.match(/(\+?\d[\d\s().-]{7,}\d)/) || [""])[0];
  const linkMatch = contactText.match(/((https?:\/\/)?(www\.)?(linkedin\.com|github\.com|[\w-]+\.(dev|io|me|com)\/[\w-]+)\S*)/i);
  resume.links = linkMatch ? linkMatch[0] : "";
  const locMatch = contactText.match(/\b[A-Z][a-zA-Z.'-]+(?:\s[A-Z][a-zA-Z.'-]+)?,\s?[A-Z]{2}\b/);
  resume.location = locMatch ? locMatch[0] : "";

  const sections = {};
  let currentKey = null;
  for (; idx < lines.length; idx++) {
    const l = lines[idx];
    const key = matchImportSectionKey(l);
    if (key) { currentKey = key; sections[key] = sections[key] || []; continue; }
    if (currentKey) (sections[currentKey] = sections[currentKey] || []).push(l);
  }

  resume.summary = (sections.summary || []).filter(Boolean).join(" ");
  resume.experience = parseExperienceSection(sections.experience || []);
  resume.education = parseEducationSection(sections.education || []);
  resume.skills = (sections.skills || []).map(stripBulletMarker).filter(Boolean).join(", ");
  resume.projects = (sections.projects || []).map(stripBulletMarker).filter(Boolean).join("\n");
  resume.publications = (sections.publications || []).map(stripBulletMarker).filter(Boolean).join("\n");
  resume.certifications = (sections.certifications || []).filter(Boolean).join(", ");
  resume.languages = (sections.languages || []).filter(Boolean).join(", ");

  const summaryCounts = {
    hasName: !!resume.name,
    hasContact: !!(resume.email || resume.phone),
    experienceCount: resume.experience.length,
    educationCount: resume.education.length,
    hasSkills: !!resume.skills,
    hasSummary: !!resume.summary,
  };

  return { resume, summaryCounts };
}

export function tokenize(text) {
  return (text.toLowerCase().match(/[a-z][a-z+#.]{1,}/g) || []).filter(w => !STOPWORDS.has(w) && w.length > 2);
}
