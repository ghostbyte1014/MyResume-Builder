import React, { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel
}) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll("button:not([disabled])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isDanger = tone === "danger";
  const accent = isDanger ? "#b42318" : "#1e3a5f";
  const accentSoft = isDanger ? "#fef3f2" : "#eaf0f7";

  return (
    <div
      className="no-print"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(15, 23, 42, 0.62)",
        backdropFilter: "blur(4px)"
      }}
      onMouseDown={event => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="rb-confirm-title"
        aria-describedby="rb-confirm-description"
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 14,
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.24)",
          overflow: "hidden",
          animation: "rb-fadeIn 0.18s ease-out"
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "20px 20px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", color: accent, background: accentSoft, flexShrink: 0 }}>
            <AlertTriangle size={20} aria-hidden="true" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 id="rb-confirm-title" style={{ margin: "1px 28px 6px 0", fontSize: 17, lineHeight: 1.3, color: "#0f172a" }}>{title}</h2>
            <p id="rb-confirm-description" style={{ margin: 0, color: "#64748b", fontSize: 13, lineHeight: 1.55 }}>{description}</p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close confirmation dialog"
            style={{ marginLeft: -28, padding: 4, border: "none", borderRadius: 6, background: "transparent", color: "#64748b", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 20px 20px" }}>
          <button ref={cancelRef} type="button" onClick={onCancel}
            style={{ padding: "8px 14px", border: "1px solid #cbd5e1", borderRadius: 7, background: "#fff", color: "#334155", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm}
            style={{ padding: "8px 15px", border: "1px solid transparent", borderRadius: 7, background: accent, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
