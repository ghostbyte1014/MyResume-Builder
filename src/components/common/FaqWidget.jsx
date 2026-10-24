import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Search, Send, ArrowRight, Bot, HelpCircle, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { FAQ_KNOWLEDGE_BASE } from "../../constants/faqKnowledgeBase";
import { matchFaqQuery } from "../../utils/faqMatcher";

export function FaqWidget({ setTab, onResetResume, onOpenActivation, onOpenFeedback }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your MyResume Assistant. How can I help you format, optimize, export, or activate your resume today?",
      quickChips: true
    }
  ]);

  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isOpen]);

  function handleSelectKnowledgeItem(item) {
    const userMsg = { sender: "user", text: item.question };
    const botMsg = {
      sender: "bot",
      text: item.answer,
      actionLabel: item.actionLabel,
      actionTab: item.actionTab,
      actionModal: item.actionModal,
      category: item.category
    };

    setChatHistory(prev => [...prev, userMsg, botMsg]);
  }

  function handleSendMessage(e) {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const userText = searchQuery.trim();
    setSearchQuery("");

    const userMsg = { sender: "user", text: userText };
    const matched = matchFaqQuery(userText, FAQ_KNOWLEDGE_BASE);

    let botMsg;
    if (matched) {
      botMsg = {
        sender: "bot",
        text: matched.answer,
        actionLabel: matched.actionLabel,
        actionTab: matched.actionTab,
        actionModal: matched.actionModal,
        category: matched.category
      };
    } else {
      botMsg = {
        sender: "bot",
        text: "I couldn't find an exact answer for that query. You can request AI device activation or send us a message directly!",
        fallback: true
      };
    }

    setChatHistory(prev => [...prev, userMsg, botMsg]);
  }

  function handleTriggerAction(actionTab, actionModal) {
    if (actionTab && setTab) {
      setTab(actionTab);
      setIsOpen(false);
    } else if (actionModal === "activation" && onOpenActivation) {
      onOpenActivation();
      setIsOpen(false);
    } else if (actionModal === "feedback" && onOpenFeedback) {
      onOpenFeedback();
      setIsOpen(false);
    } else if (actionModal === "reset" && onResetResume) {
      const didReset = onResetResume();
      if (didReset) setIsOpen(false);
    }
  }

  return (
    <div className="no-print" style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9998, fontFamily: "inherit" }}>
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#1e3a5f",
            color: "#ffffff",
            border: "none",
            borderRadius: 30,
            padding: "10px 18px",
            fontSize: 13.5,
            fontWeight: 600,
            boxShadow: "0 10px 15px -3px rgba(30, 58, 95, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            cursor: "pointer",
            transition: "transform 0.15s ease-out"
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          <HelpCircle size={18} />
          <span>Help & FAQ</span>
        </button>
      )}

      {/* CHAT / FAQ DRAWER WINDOW */}
      {isOpen && (
        <div
          style={{
            width: 380,
            maxWidth: "calc(100vw - 32px)",
            height: 520,
            maxHeight: "calc(100vh - 40px)",
            background: "#ffffff",
            borderRadius: 14,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "rb-fadeIn 0.2s ease-out"
          }}
        >
          {/* HEADER */}
          <div style={{ background: "#1e3a5f", color: "#ffffff", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Bot size={20} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>Resume Assistant & FAQ</div>
                <div style={{ fontSize: 11, color: "#93c5fd", marginTop: 2 }}>Instant guidance & feature shortcuts</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", padding: 4, borderRadius: 4, opacity: 0.8 }}
            >
              <X size={18} />
            </button>
          </div>

          {/* CHAT MESSAGES BODY */}
          <div style={{ flex: 1, padding: 14, overflowY: "auto", background: "#f8fafc", display: "flex", flexDirection: "column", gap: 12 }}>
            {chatHistory.map((msg, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    maxWidth: "88%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    fontSize: 12.5,
                    lineHeight: 1.45,
                    background: msg.sender === "user" ? "#1e3a5f" : "#ffffff",
                    color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                    border: msg.sender === "user" ? "none" : "1px solid #e2e8f0",
                    boxShadow: msg.sender === "user" ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
                    whiteSpace: "pre-line"
                  }}
                >
                  {msg.category && (
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: "#2563eb", marginBottom: 4, textTransform: "uppercase" }}>
                      {msg.category}
                    </div>
                  )}
                  {msg.text}
                </div>

                {/* 1-CLICK ACTION BUTTON INSIDE BOT RESPONSE */}
                {msg.actionLabel && (
                  <button
                    type="button"
                    onClick={() => handleTriggerAction(msg.actionTab, msg.actionModal)}
                    style={{
                      marginTop: 6,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#eff6ff",
                      color: "#1e40af",
                      border: "1px solid #bfdbfe",
                      borderRadius: 6,
                      padding: "6px 12px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <span>{msg.actionLabel}</span> <ArrowRight size={13} />
                  </button>
                )}

                {/* FALLBACK BUTTONS */}
                {msg.fallback && (
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    {onOpenActivation && (
                      <button
                        type="button"
                        onClick={() => handleTriggerAction(null, "activation")}
                        style={{ background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}
                      >
                        Request AI Activation
                      </button>
                    )}
                    {onOpenFeedback && (
                      <button
                        type="button"
                        onClick={() => handleTriggerAction(null, "feedback")}
                        style={{ background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", borderRadius: 6, padding: "6px 10px", fontSize: 11.5, fontWeight: 500, cursor: "pointer" }}
                      >
                        Contact Support
                      </button>
                    )}
                  </div>
                )}

                {/* 10 QUICK PROMPT CHIPS (Initial State) */}
                {msg.quickChips && (
                  <div style={{ marginTop: 10, width: "100%" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>Suggested Questions:</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {FAQ_KNOWLEDGE_BASE.map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectKnowledgeItem(item)}
                          style={{
                            textAlign: "left",
                            background: "#ffffff",
                            border: "1px solid #cbd5e1",
                            borderRadius: 6,
                            padding: "7px 10px",
                            fontSize: 12,
                            color: "#1e293b",
                            cursor: "pointer",
                            transition: "background 0.1s"
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
                          onMouseLeave={e => (e.currentTarget.style.background = "#ffffff")}
                        >
                          {item.question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* CHAT INPUT FORM */}
          <form onSubmit={handleSendMessage} style={{ padding: 10, background: "#ffffff", borderTop: "1px solid #e2e8f0", display: "flex", gap: 6 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Ask a question (e.g. export, ats, pdf)..."
              style={{ flex: 1, padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 12.5, fontFamily: "inherit" }}
            />
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              style={{
                background: "#1e3a5f",
                color: "#ffffff",
                border: "none",
                borderRadius: 6,
                padding: "8px 12px",
                cursor: searchQuery.trim() ? "pointer" : "default",
                opacity: searchQuery.trim() ? 1 : 0.5
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
