import React from "react";
import { AlertTriangle, RefreshCw, RotateCcw } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env && !import.meta.env.PROD) {
      console.error("Application Error caught by ErrorBoundary:", error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetDraft = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.removeItem("myresume_builder_auto_draft");
      } catch (e) {
        // ignore
      }
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          fontFamily: "'Segoe UI', system-ui, sans-serif"
        }}>
          <div style={{
            background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "36px 32px",
            maxWidth: 520, width: "100%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.08)", textAlign: "center"
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: 14, borderRadius: "50%" }}>
                <AlertTriangle size={38} color="#b0392f" />
              </div>
            </div>
            
            <h2 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
              Something went wrong
            </h2>
            
            <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 20px 0", lineHeight: 1.5 }}>
              Don't worry — your resume data is safe! An unexpected issue occurred while rendering the page. Click below to reload your resume builder.
            </p>

            <div style={{
              background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px",
              fontSize: 12.5, color: "#475569", marginBottom: 24, textAlign: "left", lineHeight: 1.4
            }}>
              <strong style={{ color: "#1e3a5f" }}>Helpful Tip:</strong> Reloading will restore your latest auto-saved draft. If you still encounter an issue, you can start fresh by resetting your draft.
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8, background: "#1e3a5f", color: "#fff",
                  border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13.5, fontWeight: 500, cursor: "pointer"
                }}
              >
                <RefreshCw size={15} /> Reload Application
              </button>

              <button
                type="button"
                onClick={this.handleResetDraft}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#64748b",
                  border: "1px solid #cbd5e1", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer"
                }}
              >
                <RotateCcw size={15} /> Reset Draft
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
