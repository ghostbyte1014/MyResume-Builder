import React from "react";
import { Star } from "lucide-react";

export function Footer({ onOpenFeedback }) {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      className="no-print"
      style={{
        borderTop: "1px solid #e2e8f0",
        background: "#ffffff",
        padding: "16px 24px",
        marginTop: 40,
        textAlign: "center",
        fontSize: 12.5,
        color: "#64748b",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          © {currentYear} <strong style={{ color: "#1e3a5f" }}>GhostByte</strong>. All rights reserved.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {onOpenFeedback && (
            <button
              type="button"
              onClick={onOpenFeedback}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "#fff",
                border: "1px solid #d7dbe0",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 12,
                color: "#1e3a5f",
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              <Star size={13} fill="#f59e0b" color="#f59e0b" /> Submit Rating & Review
            </button>
          )}
          <span style={{ color: "#94a3b8", fontSize: 12 }}>
            MyResume Builder
          </span>
        </div>
      </div>
    </footer>
  );
}
