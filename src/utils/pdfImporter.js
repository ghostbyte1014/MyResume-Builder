import * as pdfjsLib from "pdfjs-dist";

// Configure pdfjs worker using Vite ESM URL resolver with CDN fallback
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
} catch (e) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export async function extractTextFromPdf(file) {
  if (!file) throw new Error("No PDF file provided.");
  const arrayBuffer = await file.arrayBuffer();
  
  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    useSystemFonts: true,
    disableFontFace: false
  });
  
  const pdf = await loadingTask.promise;
  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const items = (content.items || []).map(item => {
      const transform = item.transform || [];
      const x = transform[4] || 0;
      const y = transform[5] || 0;
      return { text: item.str || "", x, y, hasEOL: item.hasEOL };
    });

    // Sort items vertically (top to bottom) then horizontally (left to right)
    items.sort((a, b) => {
      if (Math.abs(a.y - b.y) > 5) {
        return b.y - a.y;
      }
      return a.x - b.x;
    });

    let pageText = "";
    let lastY = null;

    for (const item of items) {
      if (!item.text.trim() && !item.hasEOL) continue;
      if (lastY !== null && Math.abs(lastY - item.y) > 5) {
        pageText += "\n";
      } else if (pageText && !pageText.endsWith("\n") && !pageText.endsWith(" ")) {
        pageText += " ";
      }
      pageText += item.text;
      lastY = item.y;
    }

    fullText += (fullText ? "\n\n" : "") + pageText;
  }

  return fullText;
}
