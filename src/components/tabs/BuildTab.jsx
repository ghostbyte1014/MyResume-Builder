import React from "react";
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Zap, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Field } from "../common/Field";
import { WEAK_VERB_MAP } from "../../constants/dictionary";
import { TabInfoBanner } from "../common/TabInfoBanner";
import { parseReferencesSection } from "../../utils/parser";
import { CATEGORY_EXAMPLES } from "../../constants/categoryExamples";

export function BuildTab({ resume, setResume, documentStyle, categoryId = "tech" }) {
  const ex = CATEGORY_EXAMPLES[categoryId] || CATEGORY_EXAMPLES.tech;
  function updateExp(id, field, value) {
    setResume(r => ({ ...r, experience: r.experience.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  }
  function addExp() {
    setResume(r => ({ ...r, experience: [...r.experience, { id: Date.now(), role: "", company: "", dates: "", bullets: [{ id: Date.now() + 1, text: "", included: true }] }] }));
  }
  function removeExp(id) {
    setResume(r => ({ ...r, experience: r.experience.filter(e => e.id !== id) }));
  }
  function reorderArray(arr, fromIndex, toIndex) {
    const copy = [...arr];
    const [moved] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, moved);
    return copy;
  }
  function moveExperience(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    setResume(r => ({ ...r, experience: reorderArray(r.experience, fromIndex, toIndex) }));
  }
  function updateBulletText(expId, bulletId, text) {
    setResume(r => ({ ...r, experience: r.experience.map(e => e.id === expId ? { ...e, bullets: e.bullets.map(b => b.id === bulletId ? { ...b, text } : b) } : e) }));
  }
  function toggleBulletIncluded(expId, bulletId) {
    setResume(r => ({ ...r, experience: r.experience.map(e => e.id === expId ? { ...e, bullets: e.bullets.map(b => b.id === bulletId ? { ...b, included: !b.included } : b) } : e) }));
  }
  function addBullet(expId) {
    setResume(r => ({ ...r, experience: r.experience.map(e => e.id === expId ? { ...e, bullets: [...e.bullets, { id: Date.now(), text: "", included: true }] } : e) }));
  }
  function removeBullet(expId, bulletId) {
    setResume(r => ({ ...r, experience: r.experience.map(e => e.id === expId ? { ...e, bullets: e.bullets.filter(b => b.id !== bulletId) } : e) }));
  }
  function moveBullet(expId, fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    setResume(r => ({ ...r, experience: r.experience.map(e => e.id === expId ? { ...e, bullets: reorderArray(e.bullets, fromIndex, toIndex) } : e) }));
  }
  function replaceWeakVerb(expId, bulletId, currentText, weakPhrase, replacement) {
    const regex = new RegExp(weakPhrase, "i");
    const updated = currentText.replace(regex, replacement.charAt(0).toUpperCase() + replacement.slice(1));
    updateBulletText(expId, bulletId, updated);
  }

  function updateEdu(id, field, value) {
    setResume(r => ({ ...r, education: r.education.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  }
  function addEdu() {
    setResume(r => ({ ...r, education: [...r.education, { id: Date.now(), school: "", degree: "", dates: "" }] }));
  }
  function removeEdu(id) {
    setResume(r => ({ ...r, education: r.education.filter(e => e.id !== id) }));
  }
  function moveEducation(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    setResume(r => ({ ...r, education: reorderArray(r.education, fromIndex, toIndex) }));
  }
  function moveListItem(fieldKey, fromIndex, toIndex, delimiter = "\n") {
    if (fromIndex === toIndex) return;
    const current = parseListItems(resume[fieldKey], delimiter);
    const updated = reorderArray(current, fromIndex, toIndex);
    updateListField(fieldKey, updated, delimiter);
  }

  function handlePhotoUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setResume(r => ({ ...r, photo: reader.result, photoPosition: { x: 50, y: 50 }, photoAlign: r.photoAlign || "center" }));
    reader.readAsDataURL(file);
  }
  function removePhoto() {
    setResume(r => ({ ...r, photo: "", photoPosition: { x: 50, y: 50 } }));
  }
  function updatePhotoPosition(axis, value) {
    setResume(r => ({ ...r, photoPosition: { ...(r.photoPosition || { x: 50, y: 50 }), [axis]: Number(value) } }));
  }
  function setPhotoAlign(align) {
    setResume(r => ({ ...r, photoAlign: align }));
  }

  function getWeakVerbMatch(text) {
    if (!text) return null;
    const lower = text.toLowerCase();
    for (const [weak, suggestions] of Object.entries(WEAK_VERB_MAP)) {
      if (lower.startsWith(weak) || lower.includes(" " + weak)) {
        return { weak, suggestions };
      }
    }
    return null;
  }

  function parseListItems(val, delimiter = "\n") {
    if (Array.isArray(val)) {
      return val.map((item, idx) => typeof item === "string" ? { id: idx + 1, text: item } : (item.id ? item : { ...item, id: idx + 1 }));
    }
    if (!val && val !== "") return [];
    let text = typeof val === "string" ? val : "";
    if (delimiter === "\n\n" && text && !text.includes("\n\n") && text.includes("\n")) {
      text = parseReferencesSection(text);
    }
    if (!text && text !== "") return [];

    let parts = [];
    if (delimiter === "," || delimiter === ", ") {
      parts = text.split(",");
    } else {
      parts = text.split(delimiter);
    }

    return parts
      .map(line => line.replace(/^[•\-*●▪]\s*/, "").trim())
      .map((text, idx) => ({ id: idx + 1, text }));
  }

  function updateListField(fieldKey, items, joinDelimiter = "\n") {
    const textValue = items
      .map(it => (typeof it === "string" ? it : (it.text !== undefined ? it.text : "")))
      .join(joinDelimiter === ", " || joinDelimiter === "," ? ", " : joinDelimiter);

    let result = textValue;
    if (items.length > 0 && items[items.length - 1].text === "") {
      if (!result.endsWith(" ") && !result.endsWith("\n")) {
        result += (joinDelimiter === ", " || joinDelimiter === "," ? " " : "\n");
      }
    }
    setResume(r => ({ ...r, [fieldKey]: result }));
  }

  function addListItem(fieldKey, defaultText = "", delimiter = "\n") {
    const current = parseListItems(resume[fieldKey], delimiter);
    const updated = [...current, { id: Date.now(), text: defaultText }];
    updateListField(fieldKey, updated, delimiter);
  }

  function updateListItem(fieldKey, id, newText, delimiter = "\n") {
    const current = parseListItems(resume[fieldKey], delimiter);
    const updated = current.map(it => it.id === id ? { ...it, text: newText } : it);
    updateListField(fieldKey, updated, delimiter);
  }

  function removeListItem(fieldKey, id, delimiter = "\n") {
    const current = parseListItems(resume[fieldKey], delimiter);
    const updated = current.filter(it => it.id !== id);
    updateListField(fieldKey, updated, delimiter);
  }

  return (
    <div>
      <TabInfoBanner
        title="Build Purpose"
        description="Enter, edit, and organize your contact details, work experience bullets, action verb enhancements, education, skills, projects, certifications, and photo alignment settings."
      />
      <h3 style={{ marginTop: 0, fontSize: 15 }}>Your details</h3>
      <div className="rb-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
        <Field label="Full name" value={resume.name} onChange={v => setResume(r => ({ ...r, name: v }))} />
        <Field label="Target job title" value={resume.title} onChange={v => setResume(r => ({ ...r, title: v }))} />
        <Field label="Email" value={resume.email} onChange={v => setResume(r => ({ ...r, email: v }))} />
        <Field label="Phone" value={resume.phone} onChange={v => setResume(r => ({ ...r, phone: v }))} />
        <Field label="Location" value={resume.location} onChange={v => setResume(r => ({ ...r, location: v }))} />
        <Field label="Links (LinkedIn/portfolio)" value={resume.links} onChange={v => setResume(r => ({ ...r, links: v }))} />
      </div>

      <div style={{ border: "1px dashed #d7dbe0", borderRadius: 8, padding: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 8 }}>
          Optional headshot photo. Most US/UK/Canadian ATS parsers auto-flag resumes with photos. Note: side-by-side header alignments (left/right) carry higher layout ATS extraction risk.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {resume.photo ? (
            <img src={resume.photo} alt="Your uploaded photo" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", objectPosition: `${(resume.photoPosition || { x: 50, y: 50 }).x}% ${(resume.photoPosition || { x: 50, y: 50 }).y}%` }} />
          ) : (
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#eef1f4" }} aria-hidden="true" />
          )}
          <label style={{ fontSize: 13, background: "#eef1f4", border: "none", borderRadius: 6, padding: "7px 12px", cursor: "pointer" }}>
            {resume.photo ? "Replace photo" : "Upload photo"}
            <input type="file" accept="image/*" onChange={ev => handlePhotoUpload(ev.target.files && ev.target.files[0])} style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }} />
          </label>
          {resume.photo && (
            <button type="button" onClick={removePhoto} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#b0392f", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={13} aria-hidden="true" /> Remove</button>
          )}
        </div>

        {resume.photo && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f2f4" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Photo Header Alignment</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[
                { id: "left", label: "Left Inline", icon: AlignLeft },
                { id: "center", label: "Centered", icon: AlignCenter },
                { id: "right", label: "Right Inline", icon: AlignRight }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPhotoAlign(opt.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                    border: "1px solid " + ((resume.photoAlign || "center") === opt.id ? "#1e3a5f" : "#d7dbe0"),
                    background: (resume.photoAlign || "center") === opt.id ? "#eaf0f7" : "#fff",
                    fontWeight: (resume.photoAlign || "center") === opt.id ? 600 : 400
                  }}
                >
                  <opt.icon size={14} /> {opt.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1px solid #e5e7eb" }}>
                <img src={resume.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${(resume.photoPosition || { x: 50, y: 50 }).x}% ${(resume.photoPosition || { x: 50, y: 50 }).y}%` }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <label htmlFor="rb-photo-x" style={{ display: "block", fontSize: 11.5, color: "#6b7280", marginBottom: 2 }}>Reframe — horizontal</label>
                <input id="rb-photo-x" type="range" min="0" max="100" value={(resume.photoPosition || { x: 50, y: 50 }).x} onChange={e => updatePhotoPosition("x", e.target.value)} style={{ width: "100%" }} aria-label="Photo horizontal position" />
                <label htmlFor="rb-photo-y" style={{ display: "block", fontSize: 11.5, color: "#6b7280", marginTop: 4, marginBottom: 2 }}>Reframe — vertical</label>
                <input id="rb-photo-y" type="range" min="0" max="100" value={(resume.photoPosition || { x: 50, y: 50 }).y} onChange={e => updatePhotoPosition("y", e.target.value)} style={{ width: "100%" }} aria-label="Photo vertical position" />
              </div>
              <button type="button" onClick={() => setResume(r => ({ ...r, photoPosition: { x: 50, y: 50 } }))}
                style={{ fontSize: 12, background: "#eef1f4", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", flexShrink: 0, alignSelf: "center" }}>Center</button>
            </div>
          </div>
        )}
      </div>

      {documentStyle === "intl" && (
        <div style={{ border: "1px dashed #d7dbe0", borderRadius: 8, padding: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 8 }}>Optional — date of birth is sometimes expected on CVs outside North America. Leave blank if you're not sure it's expected where you're applying.</div>
          <Field label="Date of birth (optional)" value={resume.dob} onChange={v => setResume(r => ({ ...r, dob: v }))} placeholder="YYYY-MM-DD — unambiguous across countries, unlike DD/MM vs MM/DD" />
        </div>
      )}

      <Field label="Professional summary" value={resume.summary} onChange={v => setResume(r => ({ ...r, summary: v }))} textarea />

      <h3 style={{ fontSize: 15, marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Experience
        <button type="button" onClick={addExp} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, background: "#eef1f4", border: "none", borderRadius: 6, padding: "5px 9px", cursor: "pointer" }}><Plus size={13} /> Add role</button>
      </h3>
      {(resume.experience || []).map((e, expIndex) => (
        <div key={e.id}
          draggable
          onDragStart={ev => {
            if (!ev.target.closest(".rb-drag-handle")) { ev.preventDefault(); return; }
            ev.dataTransfer.setData("application/x-exp-index", String(expIndex));
          }}
          onDragOver={ev => ev.preventDefault()}
          onDrop={ev => {
            const raw = ev.dataTransfer.getData("application/x-exp-index");
            if (raw === "") return;
            moveExperience(Number(raw), expIndex);
          }}
          style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 6 }}>
              <span className="rb-drag-handle" aria-hidden="true" title="Drag to reorder" style={{ cursor: "grab", color: "#9aa1ab" }}><GripVertical size={16} /></span>
              <button type="button" onClick={() => moveExperience(expIndex, expIndex - 1)} disabled={expIndex === 0}
                aria-label={`Move ${e.role || "this role"} up`}
                style={{ background: "none", border: "none", padding: 1, cursor: expIndex === 0 ? "default" : "pointer", color: expIndex === 0 ? "#d1d5db" : "#6b7280" }}><ChevronUp size={14} /></button>
              <button type="button" onClick={() => moveExperience(expIndex, expIndex + 1)} disabled={expIndex === resume.experience.length - 1}
                aria-label={`Move ${e.role || "this role"} down`}
                style={{ background: "none", border: "none", padding: 1, cursor: expIndex === resume.experience.length - 1 ? "default" : "pointer", color: expIndex === resume.experience.length - 1 ? "#d1d5db" : "#6b7280" }}><ChevronDown size={14} /></button>
            </div>
            <div style={{ flex: 1 }}>
              <div className="rb-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
                <Field label="Role" value={e.role} onChange={v => updateExp(e.id, "role", v)} />
                <Field label="Company" value={e.company} onChange={v => updateExp(e.id, "company", v)} />
              </div>
              <Field label="Dates" value={e.dates} onChange={v => updateExp(e.id, "dates", v)} placeholder={documentStyle === "intl" ? "e.g. 03/2022 - Present (month/year, or DD/MM/YYYY for exact dates)" : "e.g. Mar 2022 - Present"} />

              <span style={{ fontSize: 12.5, color: "#6b7280", display: "block", marginBottom: 4 }}>Bullet points — drag or use arrows to reorder, uncheck to exclude</span>
              {(e.bullets || []).map((b, bulletIndex) => {
                const weakMatch = getWeakVerbMatch(b.text);
                return (
                  <div key={b.id} style={{ marginBottom: 8 }}>
                    <div
                      draggable
                      onDragStart={ev => {
                        ev.stopPropagation();
                        if (!ev.target.closest(".rb-bullet-handle")) { ev.preventDefault(); return; }
                        ev.dataTransfer.setData("application/x-bullet-index", String(bulletIndex));
                      }}
                      onDragOver={ev => ev.preventDefault()}
                      onDrop={ev => {
                        ev.stopPropagation();
                        const raw = ev.dataTransfer.getData("application/x-bullet-index");
                        if (raw === "") return;
                        moveBullet(e.id, Number(raw), bulletIndex);
                      }}
                      style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span className="rb-bullet-handle" aria-hidden="true" title="Drag to reorder" style={{ cursor: "grab", color: "#9aa1ab" }}><GripVertical size={14} /></span>
                      <button type="button" onClick={() => moveBullet(e.id, bulletIndex, bulletIndex - 1)} disabled={bulletIndex === 0}
                        aria-label="Move bullet up" style={{ background: "none", border: "none", padding: 1, cursor: bulletIndex === 0 ? "default" : "pointer", color: bulletIndex === 0 ? "#d1d5db" : "#6b7280" }}><ChevronUp size={13} /></button>
                      <button type="button" onClick={() => moveBullet(e.id, bulletIndex, bulletIndex + 1)} disabled={bulletIndex === e.bullets.length - 1}
                        aria-label="Move bullet down" style={{ background: "none", border: "none", padding: 1, cursor: bulletIndex === e.bullets.length - 1 ? "default" : "pointer", color: bulletIndex === e.bullets.length - 1 ? "#d1d5db" : "#6b7280" }}><ChevronDown size={13} /></button>
                      <input type="checkbox" checked={b.included} onChange={() => toggleBulletIncluded(e.id, b.id)} aria-label={b.included ? "Included in resume, click to exclude" : "Excluded from resume, click to include"} title="Include in resume" />
                      <input value={b.text} onChange={ev => updateBulletText(e.id, b.id, ev.target.value)} aria-label="Bullet text"
                        style={{ flex: 1, padding: "6px 8px", border: "1px solid #d7dbe0", borderRadius: 6, fontSize: 13.5, fontFamily: "inherit", opacity: b.included ? 1 : 0.5 }} />
                      <button type="button" onClick={() => removeBullet(e.id, b.id)} aria-label="Remove bullet" style={{ background: "none", border: "none", cursor: "pointer", color: "#b0392f", padding: 2 }}><Trash2 size={13} /></button>
                    </div>

                    {weakMatch && (
                      <div style={{ marginLeft: 62, marginTop: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 11.5, color: "#1e3a5f", background: "#f1f5f9", padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1" }}>
                        <Zap size={12} color="#1e3a5f" />
                        <span>Action verb suggestion for "{weakMatch.weak}":</span>
                        {weakMatch.suggestions.map((rep, ri) => (
                          <button
                            key={ri}
                            type="button"
                            onClick={() => replaceWeakVerb(e.id, b.id, b.text, weakMatch.weak, rep)}
                            style={{ background: "#fff", border: "1px solid #94a3b8", borderRadius: 4, padding: "2px 6px", fontSize: 11, cursor: "pointer", color: "#0f172a", fontWeight: 500 }}
                          >
                            +{rep}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <button type="button" onClick={() => addBullet(e.id)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, background: "#eef1f4", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", marginBottom: 8 }}><Plus size={12} aria-hidden="true" /> Add bullet</button>

              <div>
                <button type="button" onClick={() => removeExp(e.id)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#b0392f", background: "none", border: "none", cursor: "pointer", padding: 0 }}><Trash2 size={13} aria-hidden="true" /> Remove role</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* EDUCATION */}
      <h3 style={{ fontSize: 15, marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Education
        <button type="button" onClick={addEdu} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, background: "#eef1f4", border: "none", borderRadius: 6, padding: "5px 9px", cursor: "pointer" }}><Plus size={13} /> Add</button>
      </h3>
      {(resume.education || []).map((e, eduIndex) => (
        <div key={e.id}
          draggable
          onDragStart={ev => {
            if (!ev.target.closest(".rb-drag-handle")) { ev.preventDefault(); return; }
            ev.dataTransfer.setData("application/x-edu-index", String(eduIndex));
          }}
          onDragOver={ev => ev.preventDefault()}
          onDrop={ev => {
            const raw = ev.dataTransfer.getData("application/x-edu-index");
            if (raw === "") return;
            moveEducation(Number(raw), eduIndex);
          }}
          style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 6 }}>
              <span className="rb-drag-handle" aria-hidden="true" title="Drag to reorder" style={{ cursor: "grab", color: "#9aa1ab" }}><GripVertical size={16} /></span>
              <button type="button" onClick={() => moveEducation(eduIndex, eduIndex - 1)} disabled={eduIndex === 0} style={{ background: "none", border: "none", padding: 1, cursor: eduIndex === 0 ? "default" : "pointer", color: eduIndex === 0 ? "#d1d5db" : "#6b7280" }}><ChevronUp size={14} /></button>
              <button type="button" onClick={() => moveEducation(eduIndex, eduIndex + 1)} disabled={eduIndex === resume.education.length - 1} style={{ background: "none", border: "none", padding: 1, cursor: eduIndex === resume.education.length - 1 ? "default" : "pointer", color: eduIndex === resume.education.length - 1 ? "#d1d5db" : "#6b7280" }}><ChevronDown size={14} /></button>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="Degree" value={e.degree} onChange={v => updateEdu(e.id, "degree", v)} />
              <div className="rb-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
                <Field label="School" value={e.school} onChange={v => updateEdu(e.id, "school", v)} />
                <Field label="Dates" value={e.dates} onChange={v => updateEdu(e.id, "dates", v)} placeholder="e.g. 2015 - 2019" />
              </div>
              <button type="button" onClick={() => removeEdu(e.id)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#b0392f", background: "none", border: "none", cursor: "pointer", padding: 0 }}><Trash2 size={13} /> Remove</button>
            </div>
          </div>
        </div>
      ))}

      {/* SKILLS */}
      <h3 style={{ fontSize: 15, marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Skills & Competencies
        <button type="button" onClick={() => addListItem("skills", "", resume.skills?.includes("\n") ? "\n" : ", ")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, background: "#eef1f4", border: "none", borderRadius: 6, padding: "5px 9px", cursor: "pointer" }}>
          <Plus size={13} /> Add skill
        </button>
      </h3>
      {parseListItems(resume.skills, resume.skills?.includes("\n") ? "\n" : ", ").map((item, idx, arr) => (
        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <button type="button" onClick={() => moveListItem("skills", idx, idx - 1, resume.skills?.includes("\n") ? "\n" : ", ")} disabled={idx === 0} style={{ background: "none", border: "none", padding: 1, cursor: idx === 0 ? "default" : "pointer", color: idx === 0 ? "#d1d5db" : "#6b7280" }}><ChevronUp size={13} /></button>
          <button type="button" onClick={() => moveListItem("skills", idx, idx + 1, resume.skills?.includes("\n") ? "\n" : ", ")} disabled={idx === arr.length - 1} style={{ background: "none", border: "none", padding: 1, cursor: idx === arr.length - 1 ? "default" : "pointer", color: idx === arr.length - 1 ? "#d1d5db" : "#6b7280" }}><ChevronDown size={13} /></button>
          <input
            value={item.text}
            onChange={e => updateListItem("skills", item.id, e.target.value, resume.skills?.includes("\n") ? "\n" : ", ")}
            placeholder={ex.skillsPlaceholder}
            style={{ flex: 1, padding: "7px 10px", border: "1px solid #d7dbe0", borderRadius: 6, fontSize: 13, fontFamily: "inherit" }}
          />
          <button type="button" onClick={() => removeListItem("skills", item.id, resume.skills?.includes("\n") ? "\n" : ", ")} aria-label="Remove skill" style={{ background: "none", border: "none", cursor: "pointer", color: "#b0392f", padding: 4 }}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {/* PROJECTS */}
      <h3 style={{ fontSize: 15, marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Projects
        <button type="button" onClick={() => addListItem("projects", "", "\n\n")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, background: "#eef1f4", border: "none", borderRadius: 6, padding: "5px 9px", cursor: "pointer" }}>
          <Plus size={13} /> Add project
        </button>
      </h3>
      {parseListItems(resume.projects, "\n\n").map((item, projIndex, arr) => (
        <div key={item.id}
          draggable
          onDragStart={ev => {
            if (!ev.target.closest(".rb-drag-handle")) { ev.preventDefault(); return; }
            ev.dataTransfer.setData("application/x-proj-index", String(projIndex));
          }}
          onDragOver={ev => ev.preventDefault()}
          onDrop={ev => {
            const raw = ev.dataTransfer.getData("application/x-proj-index");
            if (raw === "") return;
            moveListItem("projects", Number(raw), projIndex, "\n\n");
          }}
          style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 10, marginBottom: 10, background: "#fafbfc" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 4 }}>
              <span className="rb-drag-handle" aria-hidden="true" title="Drag to reorder" style={{ cursor: "grab", color: "#9aa1ab" }}><GripVertical size={16} /></span>
              <button type="button" onClick={() => moveListItem("projects", projIndex, projIndex - 1, "\n\n")} disabled={projIndex === 0} style={{ background: "none", border: "none", padding: 1, cursor: projIndex === 0 ? "default" : "pointer", color: projIndex === 0 ? "#d1d5db" : "#6b7280" }}><ChevronUp size={14} /></button>
              <button type="button" onClick={() => moveListItem("projects", projIndex, projIndex + 1, "\n\n")} disabled={projIndex === arr.length - 1} style={{ background: "none", border: "none", padding: 1, cursor: projIndex === arr.length - 1 ? "default" : "pointer", color: projIndex === arr.length - 1 ? "#d1d5db" : "#6b7280" }}><ChevronDown size={14} /></button>
            </div>
            <textarea
              value={item.text}
              onChange={e => updateListItem("projects", item.id, e.target.value, "\n\n")}
              rows={4}
              placeholder={ex.projectsPlaceholder}
              style={{ flex: 1, padding: "7px 10px", border: "1px solid #d7dbe0", borderRadius: 6, fontSize: 13, fontFamily: "inherit", resize: "vertical" }}
            />
            <button type="button" onClick={() => removeListItem("projects", item.id, "\n\n")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#b0392f", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <Trash2 size={14} /> Remove
            </button>
          </div>
        </div>
      ))}

      {/* PUBLICATIONS */}
      <h3 style={{ fontSize: 15, marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Publications & Grants
        <button type="button" onClick={() => addListItem("publications", "", "\n")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, background: "#eef1f4", border: "none", borderRadius: 6, padding: "5px 9px", cursor: "pointer" }}>
          <Plus size={13} /> Add publication
        </button>
      </h3>
      {parseListItems(resume.publications, "\n").map((item, idx, arr) => (
        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <button type="button" onClick={() => moveListItem("publications", idx, idx - 1, "\n")} disabled={idx === 0} style={{ background: "none", border: "none", padding: 1, cursor: idx === 0 ? "default" : "pointer", color: idx === 0 ? "#d1d5db" : "#6b7280" }}><ChevronUp size={13} /></button>
          <button type="button" onClick={() => moveListItem("publications", idx, idx + 1, "\n")} disabled={idx === arr.length - 1} style={{ background: "none", border: "none", padding: 1, cursor: idx === arr.length - 1 ? "default" : "pointer", color: idx === arr.length - 1 ? "#d1d5db" : "#6b7280" }}><ChevronDown size={13} /></button>
          <input
            value={item.text}
            onChange={e => updateListItem("publications", item.id, e.target.value, "\n")}
            placeholder={ex.publicationsPlaceholder}
            style={{ flex: 1, padding: "7px 10px", border: "1px solid #d7dbe0", borderRadius: 6, fontSize: 13, fontFamily: "inherit" }}
          />
          <button type="button" onClick={() => removeListItem("publications", item.id, "\n")} aria-label="Remove publication" style={{ background: "none", border: "none", cursor: "pointer", color: "#b0392f", padding: 4 }}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {/* CERTIFICATIONS */}
      <h3 style={{ fontSize: 15, marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Certifications & Credentials
        <button type="button" onClick={() => addListItem("certifications", "", "\n")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, background: "#eef1f4", border: "none", borderRadius: 6, padding: "5px 9px", cursor: "pointer" }}>
          <Plus size={13} /> Add certification
        </button>
      </h3>
      {parseListItems(resume.certifications, "\n").map((item, idx, arr) => (
        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <button type="button" onClick={() => moveListItem("certifications", idx, idx - 1, "\n")} disabled={idx === 0} style={{ background: "none", border: "none", padding: 1, cursor: idx === 0 ? "default" : "pointer", color: idx === 0 ? "#d1d5db" : "#6b7280" }}><ChevronUp size={13} /></button>
          <button type="button" onClick={() => moveListItem("certifications", idx, idx + 1, "\n")} disabled={idx === arr.length - 1} style={{ background: "none", border: "none", padding: 1, cursor: idx === arr.length - 1 ? "default" : "pointer", color: idx === arr.length - 1 ? "#d1d5db" : "#6b7280" }}><ChevronDown size={13} /></button>
          <input
            value={item.text}
            onChange={e => updateListItem("certifications", item.id, e.target.value, "\n")}
            placeholder={ex.certificationsPlaceholder}
            style={{ flex: 1, padding: "7px 10px", border: "1px solid #d7dbe0", borderRadius: 6, fontSize: 13, fontFamily: "inherit" }}
          />
          <button type="button" onClick={() => removeListItem("certifications", item.id, "\n")} aria-label="Remove certification" style={{ background: "none", border: "none", cursor: "pointer", color: "#b0392f", padding: 4 }}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {/* LANGUAGES */}
      <h3 style={{ fontSize: 15, marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Languages
        <button type="button" onClick={() => addListItem("languages", "", "\n")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, background: "#eef1f4", border: "none", borderRadius: 6, padding: "5px 9px", cursor: "pointer" }}>
          <Plus size={13} /> Add language
        </button>
      </h3>
      {parseListItems(resume.languages, "\n").map((item, idx, arr) => (
        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <button type="button" onClick={() => moveListItem("languages", idx, idx - 1, "\n")} disabled={idx === 0} style={{ background: "none", border: "none", padding: 1, cursor: idx === 0 ? "default" : "pointer", color: idx === 0 ? "#d1d5db" : "#6b7280" }}><ChevronUp size={13} /></button>
          <button type="button" onClick={() => moveListItem("languages", idx, idx + 1, "\n")} disabled={idx === arr.length - 1} style={{ background: "none", border: "none", padding: 1, cursor: idx === arr.length - 1 ? "default" : "pointer", color: idx === arr.length - 1 ? "#d1d5db" : "#6b7280" }}><ChevronDown size={13} /></button>
          <input
            value={item.text}
            onChange={e => updateListItem("languages", item.id, e.target.value, "\n")}
            placeholder={ex.languagesPlaceholder}
            style={{ flex: 1, padding: "7px 10px", border: "1px solid #d7dbe0", borderRadius: 6, fontSize: 13, fontFamily: "inherit" }}
          />
          <button type="button" onClick={() => removeListItem("languages", item.id, "\n")} aria-label="Remove language" style={{ background: "none", border: "none", cursor: "pointer", color: "#b0392f", padding: 4 }}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {/* REFERENCES */}
      <h3 style={{ fontSize: 15, marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        References
        <button type="button" onClick={() => addListItem("references", "", "\n\n")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, background: "#eef1f4", border: "none", borderRadius: 6, padding: "5px 9px", cursor: "pointer" }}>
          <Plus size={13} /> Add reference
        </button>
      </h3>
      {parseListItems(resume.references, "\n\n").map((item, refIndex, arr) => (
        <div key={item.id}
          draggable
          onDragStart={ev => {
            if (!ev.target.closest(".rb-drag-handle")) { ev.preventDefault(); return; }
            ev.dataTransfer.setData("application/x-ref-index", String(refIndex));
          }}
          onDragOver={ev => ev.preventDefault()}
          onDrop={ev => {
            const raw = ev.dataTransfer.getData("application/x-ref-index");
            if (raw === "") return;
            moveListItem("references", Number(raw), refIndex, "\n\n");
          }}
          style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 10, marginBottom: 10, background: "#fafbfc" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 4 }}>
              <span className="rb-drag-handle" aria-hidden="true" title="Drag to reorder" style={{ cursor: "grab", color: "#9aa1ab" }}><GripVertical size={16} /></span>
              <button type="button" onClick={() => moveListItem("references", refIndex, refIndex - 1, "\n\n")} disabled={refIndex === 0} style={{ background: "none", border: "none", padding: 1, cursor: refIndex === 0 ? "default" : "pointer", color: refIndex === 0 ? "#d1d5db" : "#6b7280" }}><ChevronUp size={14} /></button>
              <button type="button" onClick={() => moveListItem("references", refIndex, refIndex + 1, "\n\n")} disabled={refIndex === arr.length - 1} style={{ background: "none", border: "none", padding: 1, cursor: refIndex === arr.length - 1 ? "default" : "pointer", color: refIndex === arr.length - 1 ? "#d1d5db" : "#6b7280" }}><ChevronDown size={14} /></button>
            </div>
            <textarea
              value={item.text}
              onChange={e => updateListItem("references", item.id, e.target.value, "\n\n")}
              rows={4}
              placeholder={ex.referencesPlaceholder}
              style={{ flex: 1, padding: "7px 10px", border: "1px solid #d7dbe0", borderRadius: 6, fontSize: 13, fontFamily: "inherit", resize: "vertical" }}
            />
            <button type="button" onClick={() => removeListItem("references", item.id, "\n\n")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#b0392f", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <Trash2 size={14} /> Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
