import React, { useState, useEffect } from "react";
import { X, Send, Loader2, CheckCircle2, AlertCircle, Zap, CreditCard } from "lucide-react";
import { submitWeb3FormsContact } from "../../utils/web3forms";

function getOrCreateDeviceId() {
  if (typeof window === "undefined" || !window.localStorage) return "WEB-CLIENT-ANON";
  let devId = window.localStorage.getItem("myresume_device_id");
  if (!devId) {
    devId = "DEV-" + Math.random().toString(36).substring(2, 9).toUpperCase();
    try {
      window.localStorage.setItem("myresume_device_id", devId);
    } catch (e) {
      // fallback
    }
  }
  return devId;
}

export function ActivationModal({ isOpen, onClose, resume }) {
  const [name, setName] = useState(resume?.name || "");
  const [email, setEmail] = useState(resume?.email || "");
  const [message, setMessage] = useState("I would like to request paid device activation for AI Resume Review on my account/device.");
  const [deviceId, setDeviceId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setDeviceId(getOrCreateDeviceId());
      if (resume?.name && !name) setName(resume.name);
      if (resume?.email && !email) setEmail(resume.email);
    }
  }, [isOpen, resume]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const res = await submitWeb3FormsContact({
      name,
      email,
      inquiryType: "Device Activation Request (Paid)",
      message,
      deviceId
    });

    setIsSubmitting(false);
    setResult(res);
  }

  function handleResetAndClose() {
    setResult(null);
    onClose();
  }

  return (
    <div
      className="no-print"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          maxWidth: 460,
          width: "100%",
          padding: 24,
          position: "relative",
          animation: "rb-fadeIn 0.2s ease-out"
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            color: "#64748b",
            cursor: "pointer",
            padding: 4,
            borderRadius: 6
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {result?.success ? (
          <div style={{ textAlign: "center", padding: "16px 8px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <CheckCircle2 size={48} color="#16a34a" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
              Activation Request Sent!
            </h3>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
              {result.message}
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              style={{
                background: "#1e3a5f",
                color: "#ffffff",
                border: "none",
                borderRadius: 7,
                padding: "9px 20px",
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Zap size={20} color="#1e3a5f" />
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                Device Activation Request
              </h3>
            </div>
            <p style={{ fontSize: 12.5, color: "#64748b", margin: "0 0 14px 0" }}>
              Submit your details below to request device activation for AI Resume Review.
            </p>

            {/* Note that device activation is paid and locked to 1 device */}
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 6,
              padding: "10px 12px",
              fontSize: 12,
              color: "#1e40af",
              marginBottom: 16,
              lineHeight: 1.45
            }}>
              <CreditCard size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span><strong>Paid Service Notice:</strong> Device activation is a paid service. Subscription is valid for <strong>1 device only</strong> and cannot be transferred or switched once registered.</span>
            </div>

            {result && !result.success && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", padding: "8px 12px", borderRadius: 6, fontSize: 12, color: "#991b1b", marginBottom: 14 }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{result.message}</span>
              </div>
            )}

            {/* Contact Details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div>
                <label htmlFor="act-name" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Your Name
                </label>
                <input
                  id="act-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  style={{ width: "100%", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 12.5, fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label htmlFor="act-email" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Email Address
                </label>
                <input
                  id="act-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  style={{ width: "100%", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 12.5, fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* Written Message */}
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="act-message" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                Message / Notes (optional)
              </label>
              <textarea
                id="act-message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                placeholder="Include any specific notes or questions about device activation..."
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 12.5, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                type="button"
                onClick={onClose}
                style={{ background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 7, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#1e3a5f",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 7,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: isSubmitting ? "wait" : "pointer",
                  opacity: isSubmitting ? 0.75 : 1
                }}
              >
                {isSubmitting ? <Loader2 size={15} style={{ animation: "rb-spin 1s linear infinite" }} /> : <Send size={14} />}
                {isSubmitting ? "Submitting..." : "Send Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
