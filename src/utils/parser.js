import { STOPWORDS } from "../constants/dictionary.js";

export const DEFAULT_SECTION_ORDER = [
  "summary", "experience", "projects", "education", "skills",
  "certifications", "publications", "languages", "references"
];

export function blankResume() {
  return {
    name: "", title: "", email: "", phone: "", location: "", links: "",
    summary: "", experience: [], education: [], skills: "", projects: "",
    publications: "", certifications: "", languages: "", references: "", photo: "",
    photoPosition: { x: 50, y: 50 }, photoAlign: "center", dob: "",
    sectionOrder: [...DEFAULT_SECTION_ORDER]
  };
}

export function emptyResume() {
  return {
    name: "John Doe",
    title: "Senior Product Manager",
    email: "john.doe@email.com",
    phone: "(555) 019-2834",
    location: "Austin, TX",
    links: "linkedin.com/in/johndoe",
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
    references: "",
    photo: "",
    photoPosition: { x: 50, y: 50 },
    photoAlign: "center",
    dob: "",
    sectionOrder: [...DEFAULT_SECTION_ORDER]
  };
}

const EXPANDED_SECTION_PATTERNS = {
  summary: [
    /^(professional summary|executive summary|career summary|summary|profile|objective|career objective|about( me)?|personal statement|summary of qualifications)\s*:?$/i
  ],
  experience: [
    /^(experience|work experience|employment( history)?|professional experience|work history|career history|relevant experience|positions held|where i worked)\s*:?$/i
  ],
  education: [
    /^(education|academic background|academic qualifications|academic history|education & training|education & qualifications|degrees & education)\s*:?$/i
  ],
  skills: [
    /^(skills|skills & competencies|technical skills|core competencies|skills & abilities|key skills|skills & tools|technical competencies|soft skills|tech stack|tools & technologies|technical proficiencies|areas of expertise)\s*:?$/i
  ],
  projects: [
    /^(projects|featured projects|personal projects|academic projects|key projects|projects & portfolio|selected works|what i built)\s*:?$/i
  ],
  publications: [
    /^(publications?( ?(&|and) ?grants)?|grants|research|publications & research|awards & honors|patents)\s*:?$/i
  ],
  certifications: [
    /^(certifications?|licenses?|certifications? & licenses?|professional certifications?|credentials|courses & certifications?)\s*:?$/i
  ],
  languages: [
    /^(languages?|languages? spoken|language proficiency|foreign languages)\s*:?$/i
  ],
  references: [
    /^(references?|recommendations?|referees?|professional references)\s*:?$/i
  ]
};

function cleanHtmlAndLine(l) {
  if (!l) return "";
  return l
    .replace(/<[^>]+>/g, "")
    .replace(/^SECTION_HEADER:\s*/i, "")
    .replace(/^SUBHEADER:\s*/i, "")
    .replace(/^[-•*●▪]\s*/, "")
    .replace(/^\d+[.)]\s*/, "")
    .replace(/:$/, "")
    .trim();
}

export function matchImportSectionKey(line) {
  if (!line) return null;
  const clean = cleanHtmlAndLine(line);
  if (!clean || clean.length > 60) return null;

  for (const [key, patterns] of Object.entries(EXPANDED_SECTION_PATTERNS)) {
    for (const pat of patterns) {
      if (pat.test(clean)) return key;
    }
  }

  return null;
}

export function stripBulletMarker(line) {
  if (!line) return "";
  return line
    .replace(/^SUBHEADER:\s*/i, "")
    .replace(/^SECTION_HEADER:\s*/i, "")
    .replace(/^[-•*●▪]\s*/, "")
    .replace(/^\d+[.)]\s*/, "")
    .trim();
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
  if (!lines || !lines.length) return [];

  const blocks = splitIntoParagraphs(lines);
  const finalEntries = [];

  for (const block of blocks) {
    let currentEntryLines = [];
    for (let i = 0; i < block.length; i++) {
      const line = stripBulletMarker(block[i]);
      if (!line) continue;

      const hasDates = !!extractDateRange(line).dates;
      const isSchoolOrDegree = /college|university|school|institute|academy|bachelor|master|doctor|phd|b\.?s|m\.?s|b\.?a|m\.?a|associate|diploma|high\s*school|senior|junior/i.test(line);

      const currentHasDates = currentEntryLines.some(l => !!extractDateRange(l).dates);

      if (currentEntryLines.length > 0 && currentHasDates && isSchoolOrDegree) {
        finalEntries.push(currentEntryLines);
        currentEntryLines = [line];
      } else {
        currentEntryLines.push(line);
      }
    }
    if (currentEntryLines.length) {
      finalEntries.push(currentEntryLines);
    }
  }

  return finalEntries.map((para, i) => {
    let degree = "";
    let school = "";
    let dates = "";

    for (const rawLine of para) {
      const line = stripBulletMarker(rawLine);
      const dateInfo = extractDateRange(line);

      if (dateInfo.dates && !dates) {
        dates = dateInfo.dates;
        const rest = dateInfo.rest.replace(/^[|–—-\s]+|[|–—-\s]+$/g, "").trim();
        if (rest && !/expected\s*graduation/i.test(rest)) {
          if (!degree && /high\s*school|senior|degree|bachelor|master|phd|associate|diploma|b\.?s|m\.?s/i.test(rest)) {
            degree = rest;
          } else if (!school && /college|university|school|institute|academy/i.test(rest)) {
            school = rest;
          } else if (!degree) {
            degree = rest;
          }
        } else if (rest && /expected\s*graduation/i.test(rest)) {
          dates += ` | ${rest}`;
        }
      } else {
        if (/college|university|school|institute|academy/i.test(line)) {
          if (!school) school = line;
          else if (!degree) degree = line;
        } else if (/bachelor|master|doctor|phd|b\.?s|m\.?s|b\.?a|m\.?a|associate|diploma|degree|high\s*school|senior|junior/i.test(line)) {
          if (!degree) degree = line;
          else if (!school) school = line;
        } else {
          if (!degree) degree = line;
          else if (!school) school = line;
        }
      }
    }

    return {
      id: Date.now() + i * 10 + 500000,
      degree: degree || para[0] || "",
      school: school || (para[1] && para[1] !== degree ? para[1] : ""),
      dates: dates || ""
    };
  });
}

export function parseProjectsSection(lines) {
  if (!lines || !lines.length) return "";

  const projectBlocks = [];
  let currentBlock = [];
  let pendingCategory = "";

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const clean = stripBulletMarker(rawLine);
    if (!clean) continue;

    const isCategoryHeader = /^[A-Z0-9\s/&|-]{4,45}$/.test(clean) &&
      !clean.includes(":") &&
      !clean.includes("—") &&
      !clean.startsWith("-") &&
      !clean.startsWith("•") &&
      !/tech\s*stack|url|github|live|developed|built|created|implemented|focused/i.test(clean);

    if (isCategoryHeader) {
      if (currentBlock.length) {
        projectBlocks.push(currentBlock.join("\n"));
        currentBlock = [];
      }
      pendingCategory = clean;
      continue;
    }

    const isBulletOrTech = rawLine.startsWith("-") || rawLine.startsWith("•") || /^(tech\s*stack|github|live|url|link):/i.test(clean);
    const isTitle = !isBulletOrTech && (
      clean.includes("—") || clean.includes("-") || clean.includes("(") || currentBlock.length === 0
    );

    if (isTitle && currentBlock.length > 0 && !isBulletOrTech) {
      projectBlocks.push(currentBlock.join("\n"));
      currentBlock = [];
    }

    if (currentBlock.length === 0 && pendingCategory) {
      currentBlock.push(`[${pendingCategory}] ${clean}`);
      pendingCategory = "";
    } else {
      currentBlock.push(rawLine.startsWith("-") || rawLine.startsWith("•") ? `• ${clean}` : clean);
    }
  }

  if (currentBlock.length) {
    projectBlocks.push(currentBlock.join("\n"));
  }

  return projectBlocks.join("\n\n");
}

export function parseReferencesSection(lines) {
  if (!lines || !lines.length) return "";
  const inputLines = typeof lines === "string" ? lines.split(/\r?\n/) : lines;

  const refBlocks = [];
  let currentBlock = [];

  for (let i = 0; i < inputLines.length; i++) {
    const line = stripBulletMarker(inputLines[i]);
    if (!line) continue;

    const isSubFieldHeader = /^\[?(?:title|position|organization|company|email|phone|contact)\b/i.test(line);
    const isNewRefHeader = !isSubFieldHeader && (
      /^(?:\[?reference\s*(?:name)?\s*\d*\]?|\[?ref\s*\d*\]?|\[?name\s*\d*\]?)/i.test(line) ||
      (currentBlock.length >= 3 && (/^\[[A-Z]/.test(line) || (/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/.test(line) && !line.includes("@"))))
    );

    if (isNewRefHeader && currentBlock.length > 0) {
      refBlocks.push(currentBlock.join("\n"));
      currentBlock = [];
    }
    currentBlock.push(line);
  }

  if (currentBlock.length) {
    refBlocks.push(currentBlock.join("\n"));
  }

  return refBlocks.join("\n\n");
}

export function prepareInputLines(rawTextOrHtml) {
  if (!rawTextOrHtml) return [];
  let text = rawTextOrHtml;
  if (/<[a-z][\s\S]*>/i.test(text)) {
    text = text.replace(/<h[1-6][^>]*>/gi, "\n").replace(/<\/h[1-6]>/gi, "\n");
    text = text.replace(/<p[^>]*>/gi, "\n").replace(/<\/p>/gi, "\n");
    text = text.replace(/<ul[^>]*>/gi, "\n").replace(/<\/ul>/gi, "\n");
    text = text.replace(/<li[^>]*>/gi, "\n- ").replace(/<\/li>/gi, "\n");
    text = text.replace(/<br\s*\/?>/gi, "\n");
    text = text.replace(/<[^>]+>/g, "");
    text = text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");
  }
  return text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
}

export function parseResumeText(text) {
  const lines = prepareInputLines(text);
  const resume = blankResume();
  if (!lines.length) return { resume, summaryCounts: { hasName: false } };

  const fullText = lines.join("\n");

  let idx = 0;
  resume.name = cleanHtmlAndLine(lines[idx]);
  idx++;

  let contactLines = [];
  while (idx < lines.length) {
    const l = lines[idx];
    if (!l) { idx++; continue; }
    if (matchImportSectionKey(l)) break;
    contactLines.push(l);
    idx++;
    if (contactLines.length >= 5) break;
  }

  if (contactLines.length && !/@/.test(contactLines[0]) && !/\d{3}/.test(contactLines[0]) && contactLines[0].length < 80) {
    resume.title = cleanHtmlAndLine(contactLines[0]);
    contactLines = contactLines.slice(1);
  }

  const contactText = contactLines.join(" | ");

  const emails = (contactText + " | " + fullText).match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  resume.email = emails[0] || "";

  const phones = (contactText + " | " + fullText).match(/(\+?\d[\d\s().-]{7,}\d)/g) || [];
  resume.phone = phones[0] || "";

  const linkMatches = (contactText + " | " + fullText).match(/((?:https?:\/\/)?(?:www\.)?(?:linkedin\.com\/in\/[\w-]+|github\.com\/[\w-]+|[\w-]+\.(?:dev|io|me|com|app|org|net)\/[\w-]+))\S*/gi) || [];
  resume.links = Array.from(new Set(linkMatches)).join(" · ");

  const locMatch = (contactText + " | " + fullText).match(/\b[A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+)*,\s*(?:[A-Z]{2}|[A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+)*)\b/);
  resume.location = locMatch ? locMatch[0] : "";

  const sections = {};
  let currentKey = null;
  for (; idx < lines.length; idx++) {
    const l = lines[idx];
    const key = matchImportSectionKey(l);
    if (key) {
      currentKey = key;
      sections[key] = sections[key] || [];
      continue;
    }
    if (currentKey) {
      (sections[currentKey] = sections[currentKey] || []).push(l);
    }
  }

  resume.summary = (sections.summary || []).map(cleanHtmlAndLine).filter(Boolean).join(" ");
  resume.experience = parseExperienceSection(sections.experience || []);
  resume.education = parseEducationSection(sections.education || []);
  resume.skills = (sections.skills || []).map(stripBulletMarker).filter(Boolean).join("\n");
  resume.projects = parseProjectsSection(sections.projects || []);
  resume.publications = (sections.publications || []).map(stripBulletMarker).filter(Boolean).join("\n");
  resume.certifications = (sections.certifications || []).map(stripBulletMarker).filter(Boolean).join("\n");
  resume.languages = (sections.languages || []).map(stripBulletMarker).filter(Boolean).join("\n");
  resume.references = parseReferencesSection(sections.references || []);

  const cleaned = cleanupMixedLanguagesAndReferences(resume);

  const summaryCounts = {
    hasName: !!cleaned.name,
    hasContact: !!(cleaned.email || cleaned.phone),
    experienceCount: cleaned.experience.length,
    educationCount: cleaned.education.length,
    hasSkills: !!cleaned.skills,
    hasSummary: !!cleaned.summary,
  };

  return { resume: cleaned, summaryCounts };
}

export function cleanupMixedLanguagesAndReferences(r) {
  if (!r || typeof r !== "object") return r;
  let languages = r.languages || "";
  let references = r.references || "";

  if (languages) {
    const match = languages.match(/^(.*?)(?:\s*(?:,|;|\n)?\s*REFERENCES\b\s*:?\s*)(.*)$/is);
    if (match) {
      languages = match[1].replace(/[,;\s]+$/, "").trim();
      const extracted = match[2].trim();
      references = references ? `${references}\n\n${extracted}` : extracted;
    }
  }

  return {
    ...r,
    languages,
    references
  };
}

export function tokenize(text) {
  return (text.toLowerCase().match(/[a-z][a-z+#.]{1,}/g) || []).filter(w => !STOPWORDS.has(w) && w.length > 2);
}

