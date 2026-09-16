export function resumeToText(r) {
  if (!r) return "";
  const exp = (r.experience || []).map(e => `${e.role || ""} ${e.company || ""} ${(e.bullets || []).filter(b => b.included).map(b => b.text).join(" ")}`).join(" ");
  const edu = (r.education || []).map(e => `${e.degree || ""} ${e.school || ""}`).join(" ");
  return [r.title, r.summary, exp, edu, r.skills, r.projects, r.publications, r.certifications].filter(Boolean).join(" ");
}

export function resumeToPlainText(r) {
  if (!r) return "";
  const lines = [];
  lines.push(r.name || "");
  if (r.title) lines.push(r.title);
  lines.push([r.email, r.phone, r.location, r.links].filter(Boolean).join(" | "));
  lines.push("");
  if (r.summary) { lines.push("SUMMARY"); lines.push(r.summary); lines.push(""); }
  if (r.experience && r.experience.length) {
    lines.push("EXPERIENCE");
    r.experience.forEach(e => {
      lines.push(`${e.role || ""}${e.company ? ", " + e.company : ""}${e.dates ? " (" + e.dates + ")" : ""}`);
      (e.bullets || []).filter(b => b.included).forEach(b => lines.push(`- ${b.text}`));
      lines.push("");
    });
  }
  if (r.projects) {
    lines.push("PROJECTS");
    r.projects.split("\n").filter(Boolean).forEach(p => lines.push(`- ${p}`));
    lines.push("");
  }
  if (r.education && r.education.length) {
    lines.push("EDUCATION");
    r.education.forEach(ed => lines.push(`${ed.degree || ""}${ed.school ? ", " + ed.school : ""}${ed.dates ? " (" + ed.dates + ")" : ""}`));
    lines.push("");
  }
  if (r.publications) {
    lines.push("PUBLICATIONS & GRANTS");
    r.publications.split("\n").filter(Boolean).forEach(p => lines.push(`- ${p}`));
    lines.push("");
  }
  if (r.skills) { lines.push("SKILLS"); lines.push(r.skills); lines.push(""); }
  if (r.certifications) { lines.push("CERTIFICATIONS"); lines.push(r.certifications); lines.push(""); }
  if (r.languages) { lines.push("LANGUAGES"); lines.push(r.languages); lines.push(""); }
  return lines.join("\n").trim();
}

export function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
