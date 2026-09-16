import React from "react";

export function Field({ label, value, onChange, textarea, placeholder }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ fontSize: 12.5, color: "#6b7280", display: "block", marginBottom: 4 }}>{label}</span>
      {textarea ? (
        <textarea
          value={value || ""}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: "8px 10px", border: "1px solid #d7dbe0", borderRadius: 6, fontSize: 14, fontFamily: "inherit", resize: "vertical" }}
        />
      ) : (
        <input
          value={value || ""}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          style={{ width: "100%", padding: "8px 10px", border: "1px solid #d7dbe0", borderRadius: 6, fontSize: 14, fontFamily: "inherit" }}
        />
      )}
    </label>
  );
}
