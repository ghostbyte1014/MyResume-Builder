import React from "react";
import { Info } from "lucide-react";

export function TabInfoBanner({ title, description }) {
  return (
    <div
      className="no-print"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        background: "#f0f4f9",
        border: "1px solid #d0dbe7",
        borderRadius: 8,
        padding: "10px 14px",
        marginBottom: 16,
      }}
    >
      <Info size={18} color="#1e3a5f" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
      <div>
        {title && <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{title}</div>}
        <div style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.45 }}>{description}</div>
      </div>
    </div>
  );
}
