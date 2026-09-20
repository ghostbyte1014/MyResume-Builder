import React, { useState } from "react";
import { Star, X, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { submitWeb3FormsReview } from "../../utils/web3forms";

const CATEGORIES = [
  "User Experience",
  "Feature Enhancement",
  "Issue Report",
  "Template & Design Feedback"
];

const RATING_LABELS = {
  1: "Needs Improvement",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent"
};

export function FeedbackModal({ isOpen, onClose, resume }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("User Experience");
  const [name, setName] = useState(resume?.name || "");
  const [email, setEmail] = useState(resume?.email || "");
  const [review, setReview] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const res = await submitWeb3FormsReview({
      name,
      email,
      rating,
      category,
      review
    });

    setIsSubmitting(false);
    setResult(res);
  }

  function handleResetAndClose() {
    setResult(null);
    setReview("");
    onClose();
  }

  const activeRating = hoverRating || rating;

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
          maxWidth: 480,
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
              Feedback Submitted!
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
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>
              Rate & Review Application
            </h3>
            <p style={{ fontSize: 12.5, color: "#64748b", margin: "0 0 16px 0" }}>
              Your evaluation helps improve MyResume Builder for open-source users worldwide.
            </p>

            {result && !result.success && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", padding: "8px 12px", borderRadius: 6, fontSize: 12, color: "#991b1b", marginBottom: 14 }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{result.message}</span>
              </div>
            )}

            {/* Star Rating Selector */}
            <div style={{ marginBottom: 16, textAlign: "center", background: "#f8fafc", padding: "12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                Overall Rating
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 4 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 2,
                      transition: "transform 0.1s"
                    }}
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      size={28}
                      fill={star <= activeRating ? "#f59e0b" : "none"}
                      color={star <= activeRating ? "#f59e0b" : "#cbd5e1"}
                    />
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1e3a5f" }}>
                {RATING_LABELS[activeRating]}
              </div>
            </div>

            {/* Category Selector */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Category
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: "7px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: category === cat ? 600 : 400,
                      cursor: "pointer",
                      textAlign: "center",
                      border: "1px solid " + (category === cat ? "#1e3a5f" : "#cbd5e1"),
                      background: category === cat ? "#eaf0f7" : "#ffffff",
                      color: category === cat ? "#1e3a5f" : "#475569"
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div>
                <label htmlFor="fb-name" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Name (optional)
                </label>
                <input
                  id="fb-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your Name"
                  style={{ width: "100%", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 12.5, fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label htmlFor="fb-email" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Email (optional)
                </label>
                <input
                  id="fb-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ width: "100%", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 12.5, fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* Written Comments */}
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="fb-review" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                Review Comments / Feedback
              </label>
              <textarea
                id="fb-review"
                value={review}
                onChange={e => setReview(e.target.value)}
                rows={3}
                placeholder="Share your experience, suggest features, or report issues..."
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
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
