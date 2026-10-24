/**
 * Exports full resume state (data + configuration) as a formatted JSON file.
 */
export function exportResumeJSON(payload, filename = "resume_backup.json") {
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Validates and parses imported JSON resume payload.
 */
export function parseResumeJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== "object") {
      throw new Error("Invalid JSON structure");
    }
    
    // Support either direct resume object or full package payload with metadata
    const resumeObj = data.resume ? data.resume : data;
    
    if (typeof resumeObj.name === "undefined" && typeof resumeObj.experience === "undefined") {
      throw new Error("JSON file does not contain valid resume fields");
    }

    return {
      resume: {
        name: resumeObj.name || "",
        title: resumeObj.title || "",
        email: resumeObj.email || "",
        phone: resumeObj.phone || "",
        location: resumeObj.location || "",
        links: resumeObj.links || "",
        summary: resumeObj.summary || "",
        // Normalize experience entries — older backups may omit the `bullets` array,
        // which causes analyzeResume to throw "Cannot read properties of undefined".
        experience: Array.isArray(resumeObj.experience)
          ? resumeObj.experience.map(e => ({ ...e, bullets: Array.isArray(e.bullets) ? e.bullets : [] }))
          : [],
        education: Array.isArray(resumeObj.education) ? resumeObj.education : [],
        skills: resumeObj.skills || "",
        projects: resumeObj.projects || "",
        publications: resumeObj.publications || "",
        certifications: resumeObj.certifications || "",
        languages: resumeObj.languages || "",
        references: resumeObj.references || "",
        profileDetails: {
          specialization: resumeObj.profileDetails?.specialization || "",
          experienceLevel: resumeObj.profileDetails?.experienceLevel || "",
          availability: resumeObj.profileDetails?.availability || "",
          additional: resumeObj.profileDetails?.additional || ""
        },
        photo: resumeObj.photo || "",
        photoPosition: resumeObj.photoPosition || { x: 50, y: 50 },
        photoAlign: resumeObj.photoAlign || "center",
        dob: resumeObj.dob || "",
        // Preserve custom section order — was silently dropped on every JSON round-trip
        sectionOrder: Array.isArray(resumeObj.sectionOrder) ? resumeObj.sectionOrder
          : ["summary", "experience", "projects", "education", "skills",
             "certifications", "publications", "languages", "references"]
      },
      layoutId: data.layoutId || undefined,
      colorId: data.colorId || undefined,
      fontId: data.fontId || undefined,
      categoryId: data.categoryId || undefined,
      documentStyle: data.documentStyle || undefined,
      pageSize: data.pageSize || undefined
    };
  } catch (err) {
    throw new Error("Failed to parse JSON file: " + err.message);
  }
}
