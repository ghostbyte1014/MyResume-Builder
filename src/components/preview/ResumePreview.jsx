import React from "react";
import { THEMES, FONTS } from "../../constants/templatesData";

export function ResumePreview({
  resume,
  layoutId,
  theme,
  font,
  documentStyle,
  fontSize = 12.5,
  lineHeight = 1.5,
  sectionSpacing = 14
}) {
  const t = THEMES[theme] || THEMES.slate;
  const f = FONTS[font] || FONTS.sans;
  const headerStyle = { fontFamily: f.heading, color: t.text };
  const bodyStyle = {
    fontFamily: f.body,
    color: t.text,
    fontSize: Number(fontSize),
    lineHeight: Number(lineHeight),
    overflowWrap: "anywhere"
  };

  const photoPos = resume.photoPosition || { x: 50, y: 50 };
  const photoAlign = resume.photoAlign || "center";
  const photoImg = resume.photo ? (
    <img src={resume.photo} alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", objectPosition: `${photoPos.x}% ${photoPos.y}%`, flexShrink: 0 }} />
  ) : null;
  const dobLine = documentStyle === "intl" && resume.dob ? (
    <div style={{ fontSize: Number(fontSize) * 0.9, color: "#6b7280" }}>Date of birth: {resume.dob}</div>
  ) : null;

  const SectionTitle = ({ children }) => (
    <div className="rb-section-title" style={{
      fontFamily: f.heading,
      fontWeight: 700,
      fontSize: Number(fontSize) * 1.02,
      color: t.accent,
      letterSpacing: 0.3,
      borderBottom: `1.5px solid ${t.accent}`,
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

  const SkillsBlock = () => <div>{resume.skills}</div>;

  const ProjectsBlock = () => (
    <ul style={{ margin: "0 0 0 16px", padding: 0 }}>
      {(resume.projects || "").split("\n").filter(Boolean).map((p, i) => <li key={i} style={{ marginBottom: 2 }}>{p}</li>)}
    </ul>
  );

  const FeaturedProjectsBlock = () => (
    <div>
      {(resume.projects || "").split("\n").filter(Boolean).map((p, i) => {
        const parts = p.split(/\s[-–—]\s/);
        return (
          <div key={i} className="rb-entry" style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: Number(fontSize) * 1.02 }}>{parts[0]}</div>
            {parts.length > 1 && <div style={{ fontSize: Number(fontSize) * 0.96 }}>{parts.slice(1).join(" - ")}</div>}
          </div>
        );
      })}
    </div>
  );

  const PublicationsBlock = () => (
    <ul style={{ margin: "0 0 0 16px", padding: 0 }}>
      {(resume.publications || "").split("\n").filter(Boolean).map((p, i) => <li key={i} style={{ marginBottom: 4, fontStyle: "italic" }}>{p}</li>)}
    </ul>
  );

  if (layoutId === "sidebar") {
    return (
      <div style={{ ...bodyStyle, display: "flex", background: "#fff", minHeight: 500 }}>
        <div style={{ width: "32%", background: t.accentSoft, padding: "20px 16px" }}>
          {photoImg && <div style={{ marginBottom: 10 }}>{photoImg}</div>}
          <div style={{ fontFamily: f.heading, fontWeight: 700, fontSize: 18, color: t.text }}>{resume.name}</div>
          <div style={{ fontSize: 12, color: t.accent, marginBottom: 12 }}>{resume.title}</div>
          <SectionTitle>Contact</SectionTitle>
          <div style={{ fontSize: Number(fontSize) * 0.92 }}>{resume.email}<br />{resume.phone}<br />{resume.location}<br />{resume.links}</div>
          {dobLine}
          <SectionTitle>Skills</SectionTitle>
          <div style={{ fontSize: Number(fontSize) * 0.92 }}>{(resume.skills || "").split(",").map((s, i) => <div key={i} style={{ marginBottom: 2 }}>{s.trim()}</div>)}</div>
          {resume.languages && <><SectionTitle>Languages</SectionTitle><div style={{ fontSize: Number(fontSize) * 0.92 }}>{resume.languages}</div></>}
        </div>
        <div style={{ width: "68%", padding: "20px 18px" }}>
          <SectionTitle>Summary</SectionTitle>
          <div>{resume.summary}</div>
          <SectionTitle>Experience</SectionTitle>
          <ExperienceBlock />
          {resume.projects && <><SectionTitle>Projects</SectionTitle><ProjectsBlock /></>}
          <SectionTitle>Education</SectionTitle>
          <EducationBlock />
          {resume.publications && <><SectionTitle>Publications</SectionTitle><PublicationsBlock /></>}
        </div>
      </div>
    );
  }

  if (layoutId === "executive") {
    return (
      <div style={{ ...bodyStyle, background: "#fff", padding: "26px 28px" }}>
        <HeaderBlock isExecutive />
        <div style={{ borderTop: `2px solid ${t.accent}`, margin: "10px 0" }} />
        <SectionTitle>Summary</SectionTitle>
        <div>{resume.summary}</div>
        <SectionTitle>Experience</SectionTitle>
        <ExperienceBlock />
        {resume.projects && <><SectionTitle>Projects</SectionTitle><ProjectsBlock /></>}
        <SectionTitle>Education</SectionTitle>
        <EducationBlock />
        {resume.publications && <><SectionTitle>Publications</SectionTitle><PublicationsBlock /></>}
        <SectionTitle>Skills</SectionTitle>
        <SkillsBlock />
      </div>
    );
  }

  if (layoutId === "compact") {
    return (
      <div style={{ ...bodyStyle, fontSize: Number(fontSize) * 0.92, background: "#fff", padding: "20px 22px" }}>
        <HeaderBlock />
        <SectionTitle>Summary</SectionTitle>
        <div>{resume.summary}</div>
        <SectionTitle>Education</SectionTitle>
        <EducationBlock />
        <SectionTitle>Experience</SectionTitle>
        <ExperienceBlock />
        {resume.projects && <><SectionTitle>Projects</SectionTitle><ProjectsBlock /></>}
        {resume.publications && <><SectionTitle>Publications</SectionTitle><PublicationsBlock /></>}
        <SectionTitle>Skills</SectionTitle>
        <SkillsBlock />
        {resume.certifications && <><SectionTitle>Certifications</SectionTitle><div>{resume.certifications}</div></>}
      </div>
    );
  }

  if (layoutId === "portfolio") {
    return (
      <div style={{ ...bodyStyle, background: "#fff", padding: "24px 26px" }}>
        <HeaderBlock />
        <SectionTitle>Summary</SectionTitle>
        <div>{resume.summary}</div>
        {resume.projects && <><SectionTitle>Featured projects</SectionTitle><FeaturedProjectsBlock /></>}
        <SectionTitle>Skills</SectionTitle>
        <SkillsBlock />
        <SectionTitle>Experience</SectionTitle>
        <ExperienceBlock />
        <SectionTitle>Education</SectionTitle>
        <EducationBlock />
        {resume.certifications && <><SectionTitle>Certifications</SectionTitle><div>{resume.certifications}</div></>}
      </div>
    );
  }

  if (layoutId === "academic") {
    return (
      <div style={{ ...bodyStyle, fontSize: Number(fontSize) * 0.92, background: "#fff", padding: "22px 24px" }}>
        <HeaderBlock />
        <SectionTitle>Research interests / summary</SectionTitle>
        <div>{resume.summary}</div>
        <SectionTitle>Education</SectionTitle>
        <EducationBlock />
        {resume.publications && <><SectionTitle>Publications & grants</SectionTitle><PublicationsBlock /></>}
        <SectionTitle>Experience & teaching</SectionTitle>
        <ExperienceBlock />
        {resume.projects && <><SectionTitle>Projects</SectionTitle><ProjectsBlock /></>}
        <SectionTitle>Skills</SectionTitle>
        <SkillsBlock />
        {resume.certifications && <><SectionTitle>Certifications</SectionTitle><div>{resume.certifications}</div></>}
      </div>
    );
  }

  // classic default
  return (
    <div style={{ ...bodyStyle, background: "#fff", padding: "24px 26px" }}>
      <HeaderBlock />
      <SectionTitle>Summary</SectionTitle>
      <div>{resume.summary}</div>
      <SectionTitle>Experience</SectionTitle>
      <ExperienceBlock />
      {resume.projects && <><SectionTitle>Projects</SectionTitle><ProjectsBlock /></>}
      <SectionTitle>Education</SectionTitle>
      <EducationBlock />
      {resume.publications && <><SectionTitle>Publications</SectionTitle><PublicationsBlock /></>}
      <SectionTitle>Skills</SectionTitle>
      <SkillsBlock />
      {resume.certifications && <><SectionTitle>Certifications</SectionTitle><div>{resume.certifications}</div></>}
    </div>
  );
}
