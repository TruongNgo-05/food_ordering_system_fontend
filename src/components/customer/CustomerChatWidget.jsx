import React, { useEffect, useRef, useState } from "react";
import { T } from "../../constants/customerTheme";
import {
  loadSharedCategories,
  loadSharedFoods,
  SHARED_DATA_UPDATED_EVENT,
} from "../../utils/sharedData";
import "../../assets/styles/CustomerChatWidget.css";

const THINKING_DOTS = [".", "..", "..."];

const buildSystemPrompt = (categories, foods) => {
  const categoryList = categories
    .filter((c) => c.name !== "Tất cả")
    .map((c) => `- ${c.name} (id: ${c.id})`)
    .join("\n");

  const foodList = foods
    .map(
      (f) =>
        `- ${f.name} | Giá: ${f.price.toLocaleString("vi-VN")}đ | Rating: ${f.rating}/5 | Đã bán: ${f.sold || 0} | Danh mục id: ${f.category_id}`,
    )
    .join("\n");

  return `Bạn là trợ lý AI của một nhà hàng/quán ăn. Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt. Dùng emoji phù hợp.

DANH MỤC:
${categoryList}

THỰC ĐƠN:
${foodList}

Hãy giúp khách hàng tìm món ăn phù hợp, tư vấn theo sở thích, ngân sách, hoặc trả lời các câu hỏi về món ăn. Không bịa ra món không có trong thực đơn. Trả lời tối đa 3-4 câu.`;
};

const CustomerChatWidget = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingFrame, setThinkingFrame] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "Xin chào! Mình là trợ lý AI 👋 Mình có thể giúp bạn tìm món ngon, gợi ý theo ngân sách, hoặc tư vấn theo khẩu vị nhé!",
    },
  ]);
  const [categories, setCategories] = useState(() => loadSharedCategories());
  const [foods, setFoods] = useState(() => loadSharedFoods());

  const messagesEndRef = useRef(null);
  const thinkingIntervalRef = useRef(null);
  const conversationHistoryRef = useRef([]);

  useEffect(() => {
    const syncSharedData = () => {
      setCategories(loadSharedCategories());
      setFoods(loadSharedFoods());
    };
    syncSharedData();
    window.addEventListener("focus", syncSharedData);
    window.addEventListener("storage", syncSharedData);
    window.addEventListener(SHARED_DATA_UPDATED_EVENT, syncSharedData);
    return () => {
      window.removeEventListener("focus", syncSharedData);
      window.removeEventListener("storage", syncSharedData);
      window.removeEventListener(SHARED_DATA_UPDATED_EVENT, syncSharedData);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isLoading]);

  useEffect(() => {
    if (isLoading) {
      thinkingIntervalRef.current = setInterval(() => {
        setThinkingFrame((f) => (f + 1) % THINKING_DOTS.length);
      }, 400);
    } else {
      clearInterval(thinkingIntervalRef.current);
    }
    return () => clearInterval(thinkingIntervalRef.current);
  }, [isLoading]);

  const getAIReply = async (question) => {
    conversationHistoryRef.current = [
      ...conversationHistoryRef.current,
      { role: "user", content: question },
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: buildSystemPrompt(categories, foods),
        messages: conversationHistoryRef.current,
      }),
    });

    const data = await response.json();
    const replyText =
      data?.content?.[0]?.text ||
      "Xin lỗi, mình chưa hiểu câu hỏi. Bạn thử hỏi lại nhé 😊";

    conversationHistoryRef.current = [
      ...conversationHistoryRef.current,
      { role: "assistant", content: replyText },
    ];

    if (conversationHistoryRef.current.length > 20) {
      conversationHistoryRef.current =
        conversationHistoryRef.current.slice(-20);
    }

    return replyText;
  };

  const handleSendAIChat = async () => {
    const content = chatInput.trim();
    if (!content || isLoading) return;

    const userMessage = { id: Date.now(), role: "user", text: content };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsLoading(true);

    try {
      const replyText = await getAIReply(content);
      const aiMessage = { id: Date.now() + 1, role: "ai", text: replyText };
      setChatMessages((prev) => [...prev, aiMessage]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "Mình đang gặp sự cố kết nối. Bạn thử lại sau nhé 🙏",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Trợ lý AI</div>
                <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 400 }}>
                  {isLoading ? "Đang trả lời..." : "Trực tuyến"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAIChat(false)}
              style={{
                border: "none",
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                cursor: "pointer",
                fontSize: 14,
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
              }
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              height: 300,
              overflowY: "auto",
              padding: "12px 12px 8px",
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
                  flexDirection: m.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: 6,
                }}
              >
                {m.role === "ai" && (
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: T.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      flexShrink: 0,
                    }}
                  >
                    🤖
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "78%",
                    background: m.role === "user" ? T.primary : "#fff",
                    color: m.role === "user" ? "#fff" : "#1a1a2e",
                    border:
                      m.role === "user" ? "none" : `1px solid ${T.border}`,
                    padding: "8px 11px",
                    borderRadius:
                      m.role === "user"
                        ? "14px 14px 4px 14px"
                        : "14px 14px 14px 4px",
                    fontSize: 13,
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    boxShadow:
                      m.role === "ai" ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: T.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    flexShrink: 0,
                  }}
                >
                  🤖
                </div>
                <div
                  style={{
                    background: "#fff",
                    border: `1px solid ${T.border}`,
                    padding: "8px 14px",
                    borderRadius: "14px 14px 14px 4px",
                    fontSize: 13,
                    color: "#999",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    minWidth: 48,
                  }}
                >
                  {THINKING_DOTS[thinkingFrame]}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div
            style={{
              padding: "8px 10px 0",
              display: "flex",
              gap: 6,
              overflowX: "auto",
              background: "#fff",
              scrollbarWidth: "none",
            }}
          >
            {["Món bán chạy nhất?", "Món dưới 40k?", "Gợi ý cho tôi"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => {
                    setChatInput(s);
                  }}
                  style={{
                    whiteSpace: "nowrap",
                    border: `1px solid ${T.border}`,
                    borderRadius: 20,
                    background: "#F7F8FA",
                    color: T.primary,
                    fontSize: 11,
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {s}
                </button>
              ),
            )}
          </div>

          {/* Input */}
          <div
            style={{
              padding: "8px 10px 10px",
              display: "flex",
              gap: 8,
              background: "#fff",
              borderTop: `1px solid ${T.border}`,
              marginTop: 8,
            }}
          >
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendAIChat();
                }
              }}
              placeholder="Nhập câu hỏi..."
              disabled={isLoading}
              style={{
                flex: 1,
                border: `1px solid ${T.border}`,
                borderRadius: 22,
                padding: "9px 14px",
                outline: "none",
                fontSize: 13,
                background: isLoading ? "#f5f5f5" : "#fff",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = T.primary)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
            <button
              onClick={handleSendAIChat}
              disabled={isLoading || !chatInput.trim()}
              style={{
                border: "none",
                borderRadius: 22,
                background:
                  isLoading || !chatInput.trim() ? "#e0e0e0" : T.primary,
                color: "#fff",
                padding: "0 16px",
                cursor:
                  isLoading || !chatInput.trim() ? "not-allowed" : "pointer",
                fontWeight: 700,
                fontSize: 13,
                transition: "background 0.15s",
                minWidth: 52,
              }}
            >
              {isLoading ? "..." : "Gửi"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerChatWidget;
