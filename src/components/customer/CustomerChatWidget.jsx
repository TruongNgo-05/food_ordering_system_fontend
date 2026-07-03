import React, { useEffect, useRef, useState } from "react";
import { T } from "../../constants/customerTheme";
import FloatingIcon from "../common/FloatingIcon";
import "../../assets/styles/user/ChatWidget.css";

const THINKING_DOTS = [".", "..", "..."];

const CustomerChatWidget = ({
  showChatButton = true,
  showZaloButton = true,
  chatLabel = "Chat với nhà hàng",
  zaloLabel = "Zalo",
  chatTitle = "Nhà hàng",
  chatPlaceholder = "Nhập tin nhắn cho nhà hàng...",
  initialMessage = "👋 Xin chào! Nhà hàng có thể hỗ trợ gì cho bạn ạ?",
  enableChat = true,
}) => {
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingFrame, setThinkingFrame] = useState(0);

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: initialMessage,
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
          text: "Nhà hàng đã nhận được tin nhắn của bạn, sẽ phản hồi trong giây lát ạ.",
        },
      ]);

      setIsThinking(false);
    }, 500);
  };

  return (
    <>
      {/* Floating Buttons */}
      <div className="floating-contact-widget">
        {enableChat && showChatButton && (
          <FloatingIcon
            type="chat"
            label={chatLabel}
            onClick={() => setShowChat((prev) => !prev)}
          />
        )}
        {showZaloButton && <FloatingIcon type="zalo" label={zaloLabel} />}
      </div>

      {/* Chat Window */}
      {showChat && (
        <div className="chat-window-wrapper" style={{ borderColor: T.border }}>
          {/* Header */}
          <div className="chat-header" style={{ background: T.primary }}>
            <div className="chat-header-info">
              <div className="chat-header-avatar">🍽️</div>

              <div>
                <div className="chat-header-title">{chatTitle}</div>

                <div className="chat-header-status">
                  {isThinking ? "Đang trả lời..." : "Trực tuyến"}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowChat(false)}
              className="chat-header-close"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {chatMessages.map((m) => (
              <div key={m.id} className={`chat-message-row ${m.role}`}>
                <div
                  className={`chat-message-bubble ${m.role}`}
                  style={{
                    background: m.role === "user" ? T.primary : "#fff",
                    borderColor: m.role === "ai" ? T.border : undefined,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="chat-message-thinking">
                <div
                  className="chat-message-dots"
                  style={{ borderColor: T.border }}
                >
                  {THINKING_DOTS[thinkingFrame]}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="chat-input-wrapper"
            style={{ borderTopColor: T.border }}
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
              placeholder={chatPlaceholder}
              className="chat-input-field"
              style={{ borderColor: T.border }}
            />

            <button
              onClick={handleSend}
              disabled={isThinking || !chatInput.trim()}
              className="chat-send-btn"
              style={{
                background:
                  isThinking || !chatInput.trim() ? "#d9d9d9" : T.primary,
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
