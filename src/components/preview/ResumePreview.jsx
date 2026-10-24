import React from "react";
import { THEMES, FONTS } from "../../constants/templatesData";
import { getCategoryFieldContent } from "../../constants/categoryExamples";
import { getEffectiveSectionOrder } from "../../utils/sectionOrder";

export function ResumePreview({
  resume,
  layoutId,
  theme,
  font,
  documentStyle,
  categoryId = "general",
  fontSize: requestedFontSize = 12.5,
  lineHeight: requestedLineHeight = 1.5,
  sectionSpacing: requestedSectionSpacing = 14,
  showPageBreaks = false
}) {
  const t = THEMES[theme] || THEMES.slate;
  const f = FONTS[font] || FONTS.sans;
  const fields = getCategoryFieldContent(categoryId);
  const fontSize = layoutId === "compact" ? Math.max(10, Number(requestedFontSize) - 0.75) : Number(requestedFontSize);
  const lineHeight = layoutId === "compact" ? Math.max(1.2, Number(requestedLineHeight) - 0.12) : Number(requestedLineHeight);
  const sectionSpacing = layoutId === "compact" ? Math.max(4, Number(requestedSectionSpacing) - 5) : Number(requestedSectionSpacing);
  const headerStyle = { fontFamily: f.heading, color: t.text };
  const bodyStyle = {
    fontFamily: f.body,
    color: t.text,
    fontSize: Number(fontSize),
    lineHeight: Number(lineHeight),
    overflowWrap: "anywhere",
    position: "relative"
  };

  const photoPos = resume.photoPosition || { x: 50, y: 50 };
  const photoAlign = resume.photoAlign || "center";
  const photoImg = resume.photo ? (
    <img src={resume.photo} alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", objectPosition: `${photoPos.x}% ${photoPos.y}%`, flexShrink: 0 }} />
  ) : null;
  const dobLine = documentStyle === "intl" && resume.dob ? (
    <div style={{ fontSize: Number(fontSize) * 0.9, color: "#6b7280" }}>Date of birth: {resume.dob}</div>
  ) : null;
  const detailValues = [
    resume.profileDetails?.specialization,
    resume.profileDetails?.experienceLevel,
    resume.profileDetails?.availability,
    resume.profileDetails?.additional
  ].filter(Boolean);
  const profileDetailsLine = detailValues.length ? (
    <div style={{ fontSize: Number(fontSize) * 0.88, color: "#4b5563", marginTop: 3 }}>
      {detailValues.join(" | ")}
    </div>
  ) : null;

  const SectionTitle = ({ children }) => (
    <div className="rb-section-title" style={{
      fontFamily: f.heading,
      fontWeight: 700,
      fontSize: Number(fontSize) * 1.02,
      color: t.accent,
      letterSpacing: 0.3,
      borderBottom: layoutId === "portfolio" ? "none" : `1.5px solid ${t.accent}`,
      background: layoutId === "portfolio" ? t.accentSoft : "transparent",
      paddingLeft: layoutId === "portfolio" ? 6 : 0,
      paddingBottom: 3,
      marginTop: Number(sectionSpacing),
      marginBottom: 8
    }}>
      {children}
    </div>
  );

  const HeaderBlock = ({ isExecutive = false }) => {
    if (!photoImg) {
      return (
        <div style={{ textAlign: isExecutive ? "center" : "left", marginBottom: 6 }}>
          <div style={{ ...headerStyle, fontWeight: 700, fontSize: isExecutive ? 22 : 20 }}>{resume.name}</div>
          <div style={{ color: t.accent, fontSize: 13, marginTop: 2 }}>{resume.title}</div>
          <div style={{ fontSize: Number(fontSize) * 0.92, color: "#6b7280", marginTop: 4 }}>
            {[resume.email, resume.phone, resume.location, resume.links].filter(Boolean).join(" · ")}
          </div>
          {dobLine}
          {profileDetailsLine}
        </div>
      );
    }

    if (photoAlign === "left") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          {photoImg}
          <div>
            <div style={{ ...headerStyle, fontWeight: 700, fontSize: isExecutive ? 22 : 20 }}>{resume.name}</div>
            <div style={{ color: t.accent, fontSize: 13, marginTop: 2 }}>{resume.title}</div>
            <div style={{ fontSize: Number(fontSize) * 0.92, color: "#6b7280", marginTop: 4 }}>
              {[resume.email, resume.phone, resume.location, resume.links].filter(Boolean).join(" · ")}
            </div>
            {dobLine}
            {profileDetailsLine}
          </div>
        </div>
      );
    }

    if (photoAlign === "right") {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
          <div>
            <div style={{ ...headerStyle, fontWeight: 700, fontSize: isExecutive ? 22 : 20 }}>{resume.name}</div>
            <div style={{ color: t.accent, fontSize: 13, marginTop: 2 }}>{resume.title}</div>
            <div style={{ fontSize: Number(fontSize) * 0.92, color: "#6b7280", marginTop: 4 }}>
              {[resume.email, resume.phone, resume.location, resume.links].filter(Boolean).join(" · ")}
            </div>
            {dobLine}
            {profileDetailsLine}
          </div>
          {photoImg}
        </div>
      );
    }

    // Default centered
    return (
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>{photoImg}</div>
        <div style={{ ...headerStyle, fontWeight: 700, fontSize: isExecutive ? 22 : 20 }}>{resume.name}</div>
        <div style={{ color: t.accent, fontSize: 13, marginTop: 2 }}>{resume.title}</div>
        <div style={{ fontSize: Number(fontSize) * 0.92, color: "#6b7280", marginTop: 4 }}>
          {[resume.email, resume.phone, resume.location, resume.links].filter(Boolean).join(" · ")}
        </div>
        {dobLine}
        {profileDetailsLine}
      </div>
    );
  };

  const ExperienceBlock = () => (
    <div>
      {(resume.experience || []).map(e => (
        <div key={e.id} className="rb-entry" style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: Number(fontSize) * 1.04 }}>
            <span style={{ flex: "1 1 auto", minWidth: 0 }}>{e.role}{e.company ? `, ${e.company}` : ""}</span>
            <span style={{ flexShrink: 0, fontWeight: 400, color: "#6b7280", fontSize: Number(fontSize) * 0.9, whiteSpace: "nowrap", marginLeft: 8 }}>{e.dates}</span>
          </div>
          <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
            {(e.bullets || []).filter(b => b.included).map(b => <li key={b.id} style={{ marginBottom: 2 }}>{b.text}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );

  const EducationBlock = () => (
    <div>
      {(resume.education || []).map(ed => (
        <div key={ed.id} className="rb-entry" style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ flex: "1 1 auto", minWidth: 0 }}><strong>{ed.degree}</strong>{ed.school ? `, ${ed.school}` : ""}</span>
          <span style={{ flexShrink: 0, color: "#6b7280", fontSize: Number(fontSize) * 0.9, whiteSpace: "nowrap", marginLeft: 8 }}>{ed.dates}</span>
        </div>
      ))}
    </div>
  );

  const SkillsBlock = () => {
    const text = resume.skills || "";
    if (text.includes("\n")) {
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      return (
        <div>
          {lines.map((l, i) => (
            <div key={i} style={{ marginBottom: 3 }}>
              {l}
            </div>
          ))}
        </div>
      );
    }
    return <div>{text}</div>;
  };

  const ProjectsBlock = () => {
    const raw = resume.projects || "";
    if (!raw.trim()) return null;

    const blocks = raw.includes("\n\n") ? raw.split("\n\n").filter(Boolean) : [raw];

    return (
      <div>
        {blocks.map((block, i) => {
          const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
          if (!lines.length) return null;
          const titleLine = lines[0];
          const detailLines = lines.slice(1);

          return (
            <div key={i} className="rb-entry" style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: Number(fontSize) * 1.02 }}>
                {titleLine.replace(/^•\s*/, "")}
              </div>
              {detailLines.map((dl, j) => {
                if (dl.startsWith("•") || dl.startsWith("-")) {
                  return (
                    <div key={j} style={{ marginLeft: 14, fontSize: Number(fontSize) * 0.94, marginTop: 1 }}>
                      • {dl.replace(/^[-•*●▪]\s*/, "")}
                    </div>
                  );
                }
                const isTech = dl.toLowerCase().startsWith("tech stack:");
                return (
                  <div key={j} style={{ fontSize: Number(fontSize) * 0.94, color: isTech ? t.accent : "inherit", fontWeight: isTech ? 600 : 400, marginTop: 1 }}>
                    {dl}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const FeaturedProjectsBlock = () => <ProjectsBlock />;

  const PublicationsBlock = () => (
    <ul style={{ margin: "0 0 0 16px", padding: 0 }}>
      {(resume.publications || "").split("\n").filter(Boolean).map((p, i) => <li key={i} style={{ marginBottom: 4, fontStyle: "italic" }}>{p}</li>)}
    </ul>
  );

  const CertificationsBlock = () => {
    const text = resume.certifications || "";
    if (text.includes("\n") || text.includes("•") || text.includes("- ")) {
      const items = text.split(/\n|•/).map(s => s.replace(/^[-*•]\s*/, "").trim()).filter(Boolean);
      return (
        <ul style={{ margin: "0 0 0 16px", padding: 0 }}>
          {items.map((item, i) => <li key={i} style={{ marginBottom: 3 }}>{item}</li>)}
        </ul>
      );
    }
    return <div>{text}</div>;
  };

  const LanguagesBlock = () => {
    const text = resume.languages || "";
    if (text.includes("\n") || text.includes("•") || text.includes("- ")) {
      const items = text.split(/\n|•/).map(s => s.replace(/^[-*•]\s*/, "").trim()).filter(Boolean);
      return (
        <ul style={{ margin: "0 0 0 16px", padding: 0 }}>
          {items.map((item, i) => <li key={i} style={{ marginBottom: 3 }}>{item}</li>)}
        </ul>
      );
    }
    return <div>{text}</div>;
  };

  const ReferencesBlock = () => {
    const text = resume.references || "";
    if (!text.trim()) return null;
    const blocks = text.includes("\n\n") ? text.split("\n\n").filter(Boolean) : [text];

    return (
      <div>
        {blocks.map((block, i) => {
          const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
          return (
            <div key={i} style={{ marginBottom: 8 }}>
              {lines.map((l, j) => (
                <div key={j} style={{ fontWeight: (j === 0 || l.startsWith("[")) ? 600 : 400, fontSize: Number(fontSize) * (j === 0 ? 0.98 : 0.92) }}>
                  {l.replace(/^SUBHEADER:\s*/, "")}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const sectionOrder = getEffectiveSectionOrder(resume.sectionOrder, layoutId);

  const renderSectionByKey = (key) => {
    switch (key) {
      case "summary":
        return resume.summary ? (
          <React.Fragment key="summary">
            <SectionTitle>{fields.summaryTitle}</SectionTitle>
            <div>{resume.summary}</div>
          </React.Fragment>
        ) : null;
      case "experience":
        return (resume.experience && resume.experience.length) ? (
          <React.Fragment key="experience">
            <SectionTitle>{fields.experienceTitle}</SectionTitle>
            <ExperienceBlock />
          </React.Fragment>
        ) : null;
      case "projects":
        return resume.projects ? (
          <React.Fragment key="projects">
            <SectionTitle>{fields.projectsTitle}</SectionTitle>
            <ProjectsBlock />
          </React.Fragment>
        ) : null;
      case "education":
        return (resume.education && resume.education.length) ? (
          <React.Fragment key="education">
            <SectionTitle>{fields.educationTitle}</SectionTitle>
            <EducationBlock />
          </React.Fragment>
        ) : null;
      case "skills":
        return resume.skills ? (
          <React.Fragment key="skills">
            <SectionTitle>{fields.skillsTitle}</SectionTitle>
            <SkillsBlock />
          </React.Fragment>
        ) : null;
      case "publications":
        return resume.publications ? (
          <React.Fragment key="publications">
            <SectionTitle>{fields.publicationsTitle}</SectionTitle>
            <PublicationsBlock />
          </React.Fragment>
        ) : null;
      case "certifications":
        return resume.certifications ? (
          <React.Fragment key="certifications">
            <SectionTitle>{fields.certificationsTitle}</SectionTitle>
            <CertificationsBlock />
          </React.Fragment>
        ) : null;
      case "languages":
        return resume.languages ? (
          <React.Fragment key="languages">
            <SectionTitle>Languages</SectionTitle>
            <LanguagesBlock />
          </React.Fragment>
        ) : null;
      case "references":
        return resume.references ? (
          <React.Fragment key="references">
            <SectionTitle>References</SectionTitle>
            <ReferencesBlock />
          </React.Fragment>
        ) : null;
      default:
        return null;
    }
  };

  const PageBreakGuide = ({ top, pageNum }) => (
    <div className="no-print" style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      borderTop: "2px dashed #3b82f6",
      zIndex: 20,
      pointerEvents: "none"
    }}>
      <span style={{
        position: "absolute",
        right: 12,
        top: -10,
        background: "#3b82f6",
        color: "#fff",
        fontSize: 10,
        fontWeight: 600,
        padding: "2px 6px",
        borderRadius: 4
      }}>
        Page {pageNum} Boundary (A4/US Letter)
      </span>
    </div>
  );

  if (layoutId === "sidebar") {
    return (
      <div style={{ ...bodyStyle, display: "flex", background: "#fff", minHeight: 500 }}>
        {showPageBreaks && <><PageBreakGuide top={1056} pageNum={1} /><PageBreakGuide top={2112} pageNum={2} /></>}
        <div style={{ width: "32%", background: t.accentSoft, padding: "20px 16px" }}>
          {photoImg && <div style={{ marginBottom: 10 }}>{photoImg}</div>}
          <div style={{ fontFamily: f.heading, fontWeight: 700, fontSize: 18, color: t.text }}>{resume.name}</div>
          <div style={{ fontSize: 12, color: t.accent, marginBottom: 12 }}>{resume.title}</div>
          <SectionTitle>Contact</SectionTitle>
          <div style={{ fontSize: Number(fontSize) * 0.92 }}>{resume.email}<br />{resume.phone}<br />{resume.location}<br />{resume.links}</div>
          {dobLine}
          {profileDetailsLine}
          <SectionTitle>{fields.skillsTitle}</SectionTitle>
          <div style={{ fontSize: Number(fontSize) * 0.92 }}>{(resume.skills || "").split(",").map((s, i) => <div key={i} style={{ marginBottom: 2 }}>{s.trim()}</div>)}</div>
          {resume.languages && <><SectionTitle>Languages</SectionTitle><LanguagesBlock /></>}
        </div>
        <div style={{ width: "68%", padding: "20px 18px" }}>
          {sectionOrder.filter(key => key !== "skills" && key !== "languages").map(renderSectionByKey)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...bodyStyle, background: "#fff", padding: layoutId === "compact" ? "18px 22px" : "24px 26px" }}>
      {showPageBreaks && <><PageBreakGuide top={1056} pageNum={1} /><PageBreakGuide top={2112} pageNum={2} /></>}
      <HeaderBlock isExecutive={layoutId === "executive"} />
      {layoutId === "executive" && <div style={{ borderTop: `2px solid ${t.accent}`, margin: "10px 0" }} />}
      {sectionOrder.map(renderSectionByKey)}
    </div>
  );
}
