import React, { useEffect, useRef, useState } from "react";
import { T } from "../../constants/customerTheme";
import "../../assets/styles/CustomerChatWidget.css";

const THINKING_DOTS = [".", "..", "..."];

const CustomerChatWidget = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingFrame, setThinkingFrame] = useState(0);

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "👋 Xin chào! Bạn cần hỗ trợ gì?",
    },
  ]);

  const messagesEndRef = useRef(null);
  const thinkingIntervalRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages, isThinking]);

  // Thinking animation
  useEffect(() => {
    if (isThinking) {
      thinkingIntervalRef.current = setInterval(() => {
        setThinkingFrame((prev) => (prev + 1) % THINKING_DOTS.length);
      }, 400);
    } else {
      clearInterval(thinkingIntervalRef.current);
    }

    return () => clearInterval(thinkingIntervalRef.current);
  }, [isThinking]);

  // Send message
  const handleSend = () => {
    const content = chatInput.trim();

    if (!content || isThinking) return;

    // User message
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        text: content,
      },
    ]);

    setChatInput("");
    setIsThinking(true);

    // TODO: Sau này thay bằng API
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "Đã nhận câu hỏi của bạn. Hệ thống sẽ phản hồi trong giây lát.",
        },
      ]);

      setIsThinking(false);
    }, 500);
  };

  return (
    <>
      {/* Floating Buttons */}
      <div className="floating-contact-widget">
        <button
          className="floating-btn floating-btn-chat"
          onClick={() => setShowAIChat((prev) => !prev)}
        >
          <span className="floating-btn-ping" />
          <span className="floating-btn-icon">💬</span>
          <span className="floating-btn-label">Chat AI</span>
        </button>

        <button
          className="floating-btn floating-btn-zalo"
          onClick={() =>
            window.open(
              "https://zalo.me/0389582843",
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          <span className="floating-btn-ping" />
          <span className="floating-btn-icon">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
              alt="Zalo"
              style={{ width: 20 }}
            />
          </span>
          <span className="floating-btn-label">Zalo</span>
        </button>
      </div>

      {/* Chat Window */}
      {showAIChat && (
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 92,
            width: 360,
            maxWidth: "calc(100vw - 24px)",
            background: "#fff",
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            boxShadow: "0 16px 48px rgba(0,0,0,.18), 0 2px 8px rgba(0,0,0,.08)",
            overflow: "hidden",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: T.primary,
              color: "#fff",
              padding: "12px 14px",
              fontWeight: 700,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🤖
              </div>

              <div>
                <div style={{ fontSize: 14 }}>Trợ lý AI</div>

                <div
                  style={{
                    fontSize: 11,
                    opacity: 0.8,
                    fontWeight: 400,
                  }}
                >
                  {isThinking ? "Đang trả lời..." : "Trực tuyến"}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAIChat(false)}
              style={{
                border: "none",
                background: "rgba(255,255,255,.15)",
                color: "#fff",
                width: 28,
                height: 28,
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              height: 340,
              overflowY: "auto",
              padding: 12,
              background: "#F7F8FA",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {chatMessages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "9px 12px",
                    borderRadius: 14,
                    background: m.role === "user" ? T.primary : "#fff",
                    color: m.role === "user" ? "#fff" : "#222",
                    border: m.role === "ai" ? `1px solid ${T.border}` : "none",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    border: `1px solid ${T.border}`,
                    padding: "9px 14px",
                    borderRadius: 14,
                    color: "#888",
                    minWidth: 48,
                  }}
                >
                  {THINKING_DOTS[thinkingFrame]}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: 10,
              display: "flex",
              gap: 8,
              borderTop: `1px solid ${T.border}`,
              background: "#fff",
            }}
          >
            <input
              value={chatInput}
              disabled={isThinking}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Nhập câu hỏi..."
              style={{
                flex: 1,
                border: `1px solid ${T.border}`,
                borderRadius: 22,
                padding: "9px 14px",
                outline: "none",
              }}
            />

            <button
              onClick={handleSend}
              disabled={isThinking || !chatInput.trim()}
              style={{
                border: "none",
                borderRadius: 22,
                padding: "0 18px",
                background:
                  isThinking || !chatInput.trim() ? "#d9d9d9" : T.primary,
                color: "#fff",
                cursor:
                  isThinking || !chatInput.trim() ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {isThinking ? "..." : "Gửi"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerChatWidget;
