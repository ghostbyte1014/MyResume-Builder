export const CATEGORIES = [
  { id: "general", label: "General / All Industries", description: "Flexible wording for any role or career stage.", layout: "classic", color: "slate", font: "sans" },
  { id: "trades", label: "Skilled Trades & Operations", description: "Highlights hands-on experience, tools, safety, licences, and training.", layout: "compact", color: "forest", font: "sans" },
  { id: "food", label: "Food Service & Hospitality", description: "For culinary, restaurant, catering, hotel, and guest-service roles.", layout: "executive", color: "bronze", font: "serifSans" },
  { id: "tech", label: "Technology & Engineering", description: "For software, data, IT, and engineering roles.", layout: "portfolio", color: "slate", font: "sans" },
  { id: "business", label: "Business, Finance & Consulting", description: "For commercial, finance, strategy, and management roles.", layout: "executive", color: "navy", font: "serifSans" },
  { id: "creative", label: "Creative, Design & Media", description: "For portfolio-led creative and media roles.", layout: "sidebar", color: "terracotta", font: "sansSerif" },
  { id: "healthcare", label: "Healthcare & Clinical", description: "For patient care, clinical, and health-service roles.", layout: "classic", color: "teal", font: "sans" },
  { id: "academic", label: "Academic, Research & Education", description: "For teaching, research, grants, and publications.", layout: "academic", color: "charcoal", font: "serifSans" },
  { id: "legal", label: "Legal & Government", description: "For legal, policy, compliance, and public-sector roles.", layout: "executive", color: "charcoal", font: "serifSans" },
  { id: "sales", label: "Sales & Marketing", description: "For revenue, growth, communications, and marketing roles.", layout: "sidebar", color: "burgundy", font: "sans" },
];

export const LAYOUTS = [
  { id: "classic", label: "Classic single-column", atsRisk: "low", desc: "Stacked sections, top header. Safest for ATS parsers." },
  { id: "executive", label: "Executive centered", atsRisk: "low", desc: "Centered header with rule lines, formal tone." },
  { id: "sidebar", label: "Two-column sidebar", atsRisk: "medium", desc: "Left rail for contact/skills. Some parsers misread columns." },
  { id: "compact", label: "Compact dense", atsRisk: "low", desc: "Small type, tight spacing — fits more onto one page." },
  { id: "portfolio", label: "Project-first portfolio", atsRisk: "low", desc: "Leads with featured projects and links, for engineers and designers with a portfolio to show." },
  { id: "academic", label: "Academic & research CV", atsRisk: "low", desc: "Education leads, with a dedicated publications & grants section for long CVs." },
];

export const THEMES = {
  slate: { accent: "#3d4a5c", accentSoft: "#eef1f4", text: "#1f2937" },
  navy: { accent: "#1e3a5f", accentSoft: "#eaf0f7", text: "#1a1a2e" },
  terracotta: { accent: "#b0553a", accentSoft: "#fbeee9", text: "#2b2320" },
  teal: { accent: "#166b6b", accentSoft: "#e7f4f3", text: "#1c2b2b" },
  charcoal: { accent: "#2b2b2b", accentSoft: "#eeeeee", text: "#1a1a1a" },
  burgundy: { accent: "#7a2e3a", accentSoft: "#f7eaec", text: "#2a1c1f" },
  forest: { accent: "#33513f", accentSoft: "#eaf1ec", text: "#1c261f" },
  bronze: { accent: "#8a6a3a", accentSoft: "#f6f0e6", text: "#2a2318" },
};

export const FONTS = {
  sans: { heading: "'Segoe UI', system-ui, sans-serif", body: "'Segoe UI', system-ui, sans-serif" },
  serifSans: { heading: "Georgia, 'Times New Roman', serif", body: "'Segoe UI', system-ui, sans-serif" },
  sansSerif: { heading: "'Segoe UI', system-ui, sans-serif", body: "Georgia, 'Times New Roman', serif" },
};
