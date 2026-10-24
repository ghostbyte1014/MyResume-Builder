export const FAQ_KNOWLEDGE_BASE = [
  {
    id: "reset-resume",
    question: "How do I reset the builder for another resume or user?",
    category: "Drafts & Reset",
    keywords: ["reset", "clear", "cache", "cached", "new", "resume", "another", "user", "mock", "sample", "start over", "draft"],
    answer: "Click Reset in the top navigation and confirm the warning. Reset removes the active auto-saved draft and unsaved edits, then loads the default General mock resume so the builder is ready to use again. Saved Versions and files you previously exported are not deleted. To start from a different field, choose its template and click 'Use this example data'.",
    actionLabel: "Reset to General Mock Resume",
    actionModal: "reset"
  },
  {
    id: "export-formats",
    question: "How do I export my resume to Word (.docx) or PDF?",
    category: "Exporting & Download",
    keywords: ["export", "download", "word", "docx", "pdf", "print", "save", "file", "format"],
    answer: "You can export your resume cleanly in two ways on the Preview tab:\n1. Click 'Export to Word (.docx)' for an editable Word document with ATS-optimized formatting.\n2. Click 'Print / Save as PDF' to save a pixel-perfect PDF file.",
    actionLabel: "Go to Preview Tab to Export",
    actionTab: "preview"
  },
  {
    id: "ats-score",
    question: "How is my ATS Optimization Score calculated?",
    category: "ATS Optimization",
    keywords: ["ats", "score", "audit", "quantify", "metrics", "calculate", "analyze", "keywords", "readiness"],
    answer: "Your ATS score is calculated in real time based on 4 criteria:\n• Standard section titles (Experience, Education, Skills)\n• Contact details completeness (Email & Phone)\n• Quantified bullet points (percentages %, metrics $, numbers)\n• Requirement coverage against target job descriptions.",
    actionLabel: "Open ATS Audit Tab",
    actionTab: "analyze"
  },
  {
    id: "import-resume",
    question: "What file formats can I import (.pdf, .docx, .txt)?",
    category: "Resume Import",
    keywords: ["import", "upload", "parse", "pdf", "docx", "word", "txt", "text", "existing", "file"],
    answer: "You can upload existing PDF (.pdf), Word (.docx), or plain text (.txt) files on the Import tab. Our 100% client-side parser extracts your name, contact info, experience, education, and skills directly in your browser without uploading your files to any server.",
    actionLabel: "Go to Import Tab",
    actionTab: "import"
  },
  {
    id: "ai-advisor",
    question: "How does the AI Career Advisor evaluate my resume?",
    category: "AI Evaluation",
    keywords: ["ai", "advisor", "evaluate", "gpt", "review", "missing", "skills", "star", "interview", "cover", "letter"],
    answer: "The AI Career Advisor analyzes your resume against target job postings to:\n• Calculate multi-dimension candidate fit scores\n• Detect missing industry keywords and offer 1-click additions\n• Generate STAR behavioral interview preparation Q&A\n• Draft custom-tailored cover letters for target companies.",
    actionLabel: "Open AI Career Advisor",
    actionTab: "ai"
  },
  {
    id: "device-activation",
    question: "How do I request paid AI device activation?",
    category: "Device Activation",
    keywords: ["activate", "activation", "subscription", "pay", "paid", "device", "offline", "unconfigured", "request", "license"],
    answer: "AI Resume Review is a paid feature valid for 1 device once registered. If AI Review is offline or unconfigured on your deployment, click below to submit a Device Activation Request.",
    actionLabel: "Request Device Activation",
    actionModal: "activation"
  },
  {
    id: "templates-styling",
    question: "How do I change resume templates, fonts, and colors?",
    category: "Design & Styling",
    keywords: ["template", "templates", "design", "font", "fonts", "color", "colors", "theme", "style", "layout", "spacing"],
    answer: "On the Design & Templates tab, you can select career-tailored presets (Technology, Business, Healthcare, Creative, etc.), choose Google Fonts (Inter, Roboto, Outfit), adjust line height, section spacing, and switch between US Letter and A4 sizes.",
    actionLabel: "Customize Templates & Design",
    actionTab: "design"
  },
  {
    id: "reorder-sections",
    question: "How do I reorder resume sections (e.g. Projects above Education)?",
    category: "Layout Control",
    keywords: ["reorder", "order", "drag", "move", "sections", "position", "sequence", "swap"],
    answer: "You can easily customize section sequence:\n1. On the Build tab, use the drag handles (⋮⋮) or Up/Down arrows inside individual sections.\n2. On the Preview tab, open the 'Reorder Sections' panel to rearrange entire sections live.",
    actionLabel: "Go to Section Order Manager",
    actionTab: "preview"
  },
  {
    id: "page-breaks",
    question: "How do A4 / US Letter page break guidelines work?",
    category: "Page Boundaries",
    keywords: ["page", "break", "guidelines", "a4", "letter", "overflow", "margin", "boundary", "lines", "pages"],
    answer: "On the Preview tab, toggle 'Show Page Breaks'. Dashed red lines will overlay on your resume preview to show exactly where Page 1 and Page 2 end, helping you adjust font size or spacing to fit a clean 1-page or 2-page target.",
    actionLabel: "View Page Break Guidelines",
    actionTab: "preview"
  },
  {
    id: "references-formatting",
    question: "How do I format professional References & Projects?",
    category: "Section Formatting",
    keywords: ["reference", "references", "project", "projects", "card", "item", "container", "add", "format"],
    answer: "Projects and References are organized as individual card containers. Each reference entry cleanly groups Reference Name, Title/Position, Organization/Company, Email, and Phone into a single box with dedicated Add, Remove, and Drag controls.",
    actionLabel: "Go to Build Tab",
    actionTab: "build"
  },
  {
    id: "privacy-security",
    question: "Is my resume data private and saved locally?",
    category: "Privacy & Security",
    keywords: ["privacy", "private", "secure", "security", "data", "save", "localStorage", "draft", "server"],
    answer: "Yes! 100% of your resume editing, formatting, and file parsing happens strictly inside your browser's local storage (`localStorage`). No personal resume data is ever sent to or saved on a remote server.",
    actionLabel: "Review Draft in Build Tab",
    actionTab: "build"
  }
];
