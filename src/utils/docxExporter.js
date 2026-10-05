/** Escape HTML special characters so user-entered text is safe inside the Word HTML document. */
function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function exportResumeToDocx(resume) {
  const name = esc(resume.name || "Resume");
  const title = esc(resume.title || "");
  const contactInfo = [resume.email, resume.phone, resume.location, resume.links]
    .filter(Boolean).map(esc).join(" | ");

  const formatList = (str) => {
    if (!str) return "";
    return str
      .split("\n")
      .filter(Boolean)
      .map(l => `<p style="margin-left: 18px; margin-top: 0pt; margin-bottom: 2pt; mso-margin-top-alt: 0pt; mso-margin-bottom-alt: 2pt; line-height: 1.2;">• ${esc(l.replace(/^[-•*●▪]\s*/, ""))}</p>`)
      .join("");
  };

  const formatProjects = (str) => {
    if (!str) return "";
    const blocks = str.includes("\n\n") ? str.split("\n\n").filter(Boolean) : [str];
    return blocks
      .map(b => {
        const lines = b.split("\n").filter(Boolean);
        if (!lines.length) return "";
        const tLine = lines[0];
        const rest = lines.slice(1);
        return `
          <p style="font-weight: bold; font-size: 11pt; margin-top: 6pt; margin-bottom: 2pt; mso-margin-top-alt: 6pt; mso-margin-bottom-alt: 2pt;">${esc(tLine.replace(/^•\s*/, ""))}</p>
          ${rest
            .map(r => `<p style="margin-left: ${r.startsWith("•") || r.startsWith("-") ? "18px" : "0px"}; margin-top: 0pt; margin-bottom: 2pt; mso-margin-top-alt: 0pt; mso-margin-bottom-alt: 2pt; line-height: 1.2;">${esc(r)}</p>`)
            .join("")}
        `;
      })
      .join("");
  };

  const formatExperience = (exp) => {
    if (!exp || !exp.length) return "";
    return exp
      .map(e => `
        <div style="margin-bottom: 8pt;">
          <table style="width: 100%; border-collapse: collapse; margin-top: 0pt; margin-bottom: 2pt;">
            <tr>
              <td style="font-weight: bold; font-size: 11pt; padding: 0;">${esc(e.role)}${e.company ? `, ${esc(e.company)}` : ""}</td>
              <td style="text-align: right; color: #4b5563; font-size: 10pt; padding: 0;">${esc(e.dates || "")}</td>
            </tr>
          </table>
          ${(e.bullets || [])
            .filter(b => b.included)
            .map(b => `<p style="margin-left: 18px; margin-top: 0pt; margin-bottom: 2pt; mso-margin-top-alt: 0pt; mso-margin-bottom-alt: 2pt; line-height: 1.2;">• ${esc(b.text)}</p>`)
            .join("")}
        </div>
      `)
      .join("");
  };

  const formatEducation = (edu) => {
    if (!edu || !edu.length) return "";
    return edu
      .map(e => `
        <table style="width: 100%; border-collapse: collapse; margin-top: 0pt; margin-bottom: 4pt;">
          <tr>
            <td style="font-size: 10.5pt; padding: 0;"><strong>${esc(e.degree)}</strong>${e.school ? `, ${esc(e.school)}` : ""}</td>
            <td style="text-align: right; color: #4b5563; font-size: 10pt; padding: 0;">${esc(e.dates || "")}</td>
          </tr>
        </table>
      `)
      .join("");
  };

  const formatReferences = (str) => {
    if (!str) return "";
    const blocks = str.includes("\n\n") ? str.split("\n\n").filter(Boolean) : [str];
    return blocks
      .map(b => `<div style="margin-bottom: 6pt; line-height: 1.2;">${esc(b).replace(/\n/g, "<br/>")}</div>`)
      .join("");
  };

  const sectionOrder = resume.sectionOrder || [
    "summary", "experience", "projects", "education", "skills",
    "certifications", "publications", "languages", "references"
  ];

  let bodyHtml = "";

  for (const key of sectionOrder) {
    switch (key) {
      case "summary":
        if (resume.summary) {
          bodyHtml += `
            <h2 style="color: #1e3a5f; border-bottom: 1.5pt solid #1e3a5f; font-size: 12.5pt; margin-top: 10pt; margin-bottom: 4pt; padding-bottom: 2pt;">PROFESSIONAL SUMMARY</h2>
            <p style="margin-top: 0pt; margin-bottom: 8pt; mso-margin-top-alt: 0pt; mso-margin-bottom-alt: 8pt; line-height: 1.25;">${resume.summary}</p>
          `;
        }
        break;
      case "experience":
        if (resume.experience && resume.experience.length) {
          bodyHtml += `
            <h2 style="color: #1e3a5f; border-bottom: 1.5pt solid #1e3a5f; font-size: 12.5pt; margin-top: 10pt; margin-bottom: 4pt; padding-bottom: 2pt;">WORK EXPERIENCE</h2>
            ${formatExperience(resume.experience)}
          `;
        }
        break;
      case "projects":
        if (resume.projects) {
          bodyHtml += `
            <h2 style="color: #1e3a5f; border-bottom: 1.5pt solid #1e3a5f; font-size: 12.5pt; margin-top: 10pt; margin-bottom: 4pt; padding-bottom: 2pt;">PROJECTS</h2>
            ${formatProjects(resume.projects)}
          `;
        }
        break;
      case "education":
        if (resume.education && resume.education.length) {
          bodyHtml += `
            <h2 style="color: #1e3a5f; border-bottom: 1.5pt solid #1e3a5f; font-size: 12.5pt; margin-top: 10pt; margin-bottom: 4pt; padding-bottom: 2pt;">EDUCATION</h2>
            ${formatEducation(resume.education)}
          `;
        }
        break;
      case "skills":
        if (resume.skills) {
          bodyHtml += `
            <h2 style="color: #1e3a5f; border-bottom: 1.5pt solid #1e3a5f; font-size: 12.5pt; margin-top: 10pt; margin-bottom: 4pt; padding-bottom: 2pt;">SKILLS & COMPETENCIES</h2>
            ${formatList(resume.skills)}
          `;
        }
        break;
      case "certifications":
        if (resume.certifications) {
          bodyHtml += `
            <h2 style="color: #1e3a5f; border-bottom: 1.5pt solid #1e3a5f; font-size: 12.5pt; margin-top: 10pt; margin-bottom: 4pt; padding-bottom: 2pt;">CERTIFICATIONS & CREDENTIALS</h2>
            ${formatList(resume.certifications)}
          `;
        }
        break;
      case "publications":
        if (resume.publications) {
          bodyHtml += `
            <h2 style="color: #1e3a5f; border-bottom: 1.5pt solid #1e3a5f; font-size: 12.5pt; margin-top: 10pt; margin-bottom: 4pt; padding-bottom: 2pt;">PUBLICATIONS & RESEARCH</h2>
            ${formatList(resume.publications)}
          `;
        }
        break;
      case "languages":
        if (resume.languages) {
          bodyHtml += `
            <h2 style="color: #1e3a5f; border-bottom: 1.5pt solid #1e3a5f; font-size: 12.5pt; margin-top: 10pt; margin-bottom: 4pt; padding-bottom: 2pt;">LANGUAGES</h2>
            ${formatList(resume.languages)}
          `;
        }
        break;
      case "references":
        if (resume.references) {
          bodyHtml += `
            <h2 style="color: #1e3a5f; border-bottom: 1.5pt solid #1e3a5f; font-size: 12.5pt; margin-top: 10pt; margin-bottom: 4pt; padding-bottom: 2pt;">REFERENCES</h2>
            ${formatReferences(resume.references)}
          `;
        }
        break;
      default:
        break;
    }
  }

  const htmlDocument = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${name} Resume</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 8.5in 11in;
          margin: 0.5in 0.6in 0.5in 0.6in;
          mso-header-margin: 0.5in;
          mso-footer-margin: 0.5in;
          mso-paper-source: 0;
        }
        body {
          font-family: Arial, Calibri, sans-serif;
          font-size: 10.5pt;
          line-height: 1.2;
          color: #1f2937;
          margin: 0;
          padding: 0;
        }
        p, div, td, th {
          margin-top: 0pt;
          margin-bottom: 2pt;
          mso-margin-top-alt: 0pt;
          mso-margin-bottom-alt: 2pt;
          mso-add-space: auto;
          line-height: 1.2;
        }
        h1 {
          font-size: 18pt;
          font-weight: bold;
          margin-top: 0pt;
          margin-bottom: 2pt;
          mso-margin-top-alt: 0pt;
          mso-margin-bottom-alt: 2pt;
          text-transform: uppercase;
          color: #111827;
        }
        .subtitle {
          font-size: 11pt;
          color: #4b5563;
          margin-top: 0pt;
          margin-bottom: 3pt;
          mso-margin-top-alt: 0pt;
          mso-margin-bottom-alt: 3pt;
        }
        .contact {
          font-size: 9.5pt;
          color: #4b5563;
          margin-top: 0pt;
          margin-bottom: 8pt;
          mso-margin-top-alt: 0pt;
          mso-margin-bottom-alt: 8pt;
          border-bottom: 1px solid #d1d5db;
          padding-bottom: 4pt;
        }
        h2 {
          color: #1e3a5f;
          border-bottom: 1.5pt solid #1e3a5f;
          font-size: 12.5pt;
          font-weight: bold;
          margin-top: 10pt;
          margin-bottom: 4pt;
          mso-margin-top-alt: 10pt;
          mso-margin-bottom-alt: 4pt;
          padding-bottom: 2pt;
          text-transform: uppercase;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin-top: 0pt;
          margin-bottom: 2pt;
        }
        td {
          padding: 0;
          vertical-align: top;
        }
      </style>
    </head>
    <body>
      <h1>${name}</h1>
      ${title ? `<div class="subtitle">${title}</div>` : ""}
      ${contactInfo ? `<div class="contact">${contactInfo}</div>` : ""}
      ${bodyHtml}
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff" + htmlDocument], {
    type: "application/msword;charset=utf-8"
  });

  const fileName = (name ? name.replace(/\s+/g, "_") : "Resume") + "_CV.doc";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
