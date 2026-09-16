import React from "react";
import { CATEGORIES, LAYOUTS, THEMES } from "../../constants/templatesData";
import { Sliders } from "lucide-react";
import { TabInfoBanner } from "../common/TabInfoBanner";

export function TemplatesTab({
  documentStyle, pickDocumentStyle,
  categoryId, pickCategory,
  layoutId, setLayoutId,
  colorId, setColorId,
  fontId, setFontId,
  fontSize, setFontSize,
  lineHeight, setLineHeight,
  sectionSpacing, setSectionSpacing
}) {
  return (
    <div>
      <TabInfoBanner
        title="Templates Purpose"
        description="Select document styles (US Resume vs International CV), job category presets, visual layouts, color themes, font families, and precise element spacing."
      />
      <h3 style={{ marginTop: 0, fontSize: 15 }}>1. Resume or CV?</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button type="button" onClick={() => pickDocumentStyle("us")} aria-pressed={documentStyle === "us"}
          style={{ flex: 1, textAlign: "left", padding: "10px 12px", borderRadius: 8, cursor: "pointer", border: "1.5px solid " + (documentStyle === "us" ? "#1e3a5f" : "#e5e7eb"), background: documentStyle === "us" ? "#eaf0f7" : "#fff" }}>
          <div style={{ fontSize: 13.5, fontWeight: 500 }}>US-style resume</div>
          <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>One page, Letter size. No photo or birth date — standard US/Canada hiring practice.</div>
        </button>
        <button type="button" onClick={() => pickDocumentStyle("intl")} aria-pressed={documentStyle === "intl"}
          style={{ flex: 1, textAlign: "left", padding: "10px 12px", borderRadius: 8, cursor: "pointer", border: "1.5px solid " + (documentStyle === "intl" ? "#1e3a5f" : "#e5e7eb"), background: documentStyle === "intl" ? "#eaf0f7" : "#fff" }}>
          <div style={{ fontSize: 13.5, fontWeight: 500 }}>International CV</div>
          <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>Can run longer, A4 size. Offers optional photo and date-of-birth fields common outside North America.</div>
        </button>
      </div>
      <p style={{ fontSize: 11.5, color: "#9aa1ab", marginTop: 0, marginBottom: 20 }}>
        This is general guidance, not legal advice — norms vary by country and even by employer. In the US, UK, and Canada, including a photo or birth date is unusual and can actually work against you under anti-discrimination hiring practices.
      </p>

      <h3 style={{ fontSize: 15 }}>2. Pick your field</h3>
      <div className="rb-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button key={c.id} type="button" onClick={() => pickCategory(c.id)} aria-pressed={categoryId === c.id}
            style={{
              textAlign: "left", padding: "10px 12px", borderRadius: 8, cursor: "pointer",
              border: "1.5px solid " + (categoryId === c.id ? THEMES[c.color].accent : "#e5e7eb"),
              background: categoryId === c.id ? THEMES[c.color].accentSoft : "#fff",
              fontSize: 13
            }}>
            {c.label}
          </button>
        ))}
      </div>

      <h3 style={{ fontSize: 15 }}>3. Choose a layout</h3>
      <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
        {LAYOUTS.map(l => (
          <button key={l.id} type="button" onClick={() => setLayoutId(l.id)} aria-pressed={layoutId === l.id}
            style={{
              textAlign: "left", padding: "10px 12px", borderRadius: 8, cursor: "pointer",
              border: "1.5px solid " + (layoutId === l.id ? "#1e3a5f" : "#e5e7eb"),
              background: layoutId === l.id ? "#eaf0f7" : "#fff",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, fontWeight: 500 }}>
              {l.label}
              <span style={{ fontSize: 11, color: l.atsRisk === "low" ? "#1a7f4b" : "#b8860b" }}>{l.atsRisk === "low" ? "ATS-safe" : "medium ATS risk"}</span>
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{l.desc}</div>
          </button>
        ))}
      </div>

      <h3 style={{ fontSize: 15 }}>4. Color theme & Font pairing</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {Object.entries(THEMES).map(([id, val]) => (
          <button key={id} type="button" onClick={() => setColorId(id)} aria-label={`${id} color theme`} aria-pressed={colorId === id}
            style={{
              width: 30, height: 30, borderRadius: "50%", background: val.accent, cursor: "pointer",
              border: colorId === id ? "3px solid #111" : "3px solid #fff", boxShadow: "0 0 0 1px #d7dbe0"
            }} />
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["sans", "Modern sans"], ["serifSans", "Serif headings"], ["sansSerif", "Editorial serif body"]].map(([id, label]) => (
          <button key={id} type="button" onClick={() => setFontId(id)} aria-pressed={fontId === id}
            style={{
              padding: "8px 12px", borderRadius: 7, fontSize: 13, cursor: "pointer",
              border: "1.5px solid " + (fontId === id ? "#1e3a5f" : "#e5e7eb"),
              background: fontId === id ? "#eaf0f7" : "#fff",
            }}>{label}</button>
        ))}
      </div>

      {/* 5. FINE-TUNING TYPOGRAPHY & PAGE-FIT SPACING */}
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: "#1e293b", marginBottom: 10 }}>
          <Sliders size={16} /> Page-Fit Fine-Tuning Spacing Controls
        </div>
        <p style={{ fontSize: 11.5, color: "#64748b", marginTop: 0, marginBottom: 12 }}>
          Micro-adjust font size, line height, and section margins so your content fits onto exactly 1 or 2 pages without awkward spillovers.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <label htmlFor="rb-font-size" style={{ display: "block", fontSize: 11.5, color: "#475569", marginBottom: 2 }}>
              Body font size ({fontSize}px)
            </label>
            <input id="rb-font-size" type="range" min="10" max="14" step="0.5" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ width: "100%" }} />
          </div>
          <div>
            <label htmlFor="rb-line-height" style={{ display: "block", fontSize: 11.5, color: "#475569", marginBottom: 2 }}>
              Line height ({lineHeight})
            </label>
            <input id="rb-line-height" type="range" min="1.2" max="1.8" step="0.05" value={lineHeight} onChange={e => setLineHeight(Number(e.target.value))} style={{ width: "100%" }} />
          </div>
          <div>
            <label htmlFor="rb-section-margin" style={{ display: "block", fontSize: 11.5, color: "#475569", marginBottom: 2 }}>
              Section gap ({sectionSpacing}px)
            </label>
            <input id="rb-section-margin" type="range" min="4" max="24" step="2" value={sectionSpacing} onChange={e => setSectionSpacing(Number(e.target.value))} style={{ width: "100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
