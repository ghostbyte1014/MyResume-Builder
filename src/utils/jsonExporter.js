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
        experience: Array.isArray(resumeObj.experience) ? resumeObj.experience : [],
        education: Array.isArray(resumeObj.education) ? resumeObj.education : [],
        skills: resumeObj.skills || "",
        projects: resumeObj.projects || "",
        publications: resumeObj.publications || "",
        certifications: resumeObj.certifications || "",
        languages: resumeObj.languages || "",
        references: resumeObj.references || "",
        photo: resumeObj.photo || "",
        photoPosition: resumeObj.photoPosition || { x: 50, y: 50 },
        photoAlign: resumeObj.photoAlign || "center",
        dob: resumeObj.dob || ""
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
