import html2pdf from "html2pdf.js";

/**
 * Direct PDF Export from rendered DOM node using html2pdf.js
 * @param {HTMLElement} element - The preview DOM element to render
 * @param {string} filename - Output filename (e.g. "john_doe_resume.pdf")
 * @param {string} pageSize - "letter" or "a4"
 */
export async function exportResumePDF(element, filename = "resume.pdf", pageSize = "letter") {
  if (!element) {
    throw new Error("No preview element available for export");
  }

  const options = {
    margin: 0,
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth || 800,
    },
    jsPDF: {
      unit: "in",
      format: pageSize === "a4" ? "a4" : "letter",
      orientation: "portrait"
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] }
  };

  return html2pdf().set(options).from(element).save();
}
