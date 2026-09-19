import React from "react";

export function Footer() {
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
          justify: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          © {currentYear} <strong style={{ color: "#1e3a5f" }}>GhostByte</strong>. All rights reserved.
        </div>
        <div style={{ color: "#94a3b8", fontSize: 12 }}>
          MyResume Builder
        </div>
      </div>
    </footer>
  );
}
