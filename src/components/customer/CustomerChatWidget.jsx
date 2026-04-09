import React, { useState } from "react";
import { T } from "../../constants/customerTheme";
import { mockCategories, mockMenuItems } from "../../data/mockData";

const CustomerChatWidget = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "Xin chào! Mình là trợ lý AI. Bạn có thể hỏi món bán chạy, món theo danh mục, hoặc mức giá phù hợp nhé.",
    },
  ]);

  const getAIReply = (question) => {
    const q = question.toLowerCase();

    if (q.includes("bán chạy") || q.includes("best")) {
      const top = [...mockMenuItems]
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 3)
        .map((m) => `${m.name} (${m.sold} lượt bán)`);
      return `Top món bán chạy hiện tại: ${top.join(", ")}.`;
    }

    if (q.includes("giá rẻ") || q.includes("rẻ") || q.includes("dưới")) {
      const budgetItems = mockMenuItems.filter((m) => m.price <= 40000).slice(0, 4);
      if (budgetItems.length === 0) return "Hiện chưa có món dưới mức giá bạn muốn.";
      return `Một số món giá tốt: ${budgetItems.map((m) => m.name).join(", ")}.`;
    }

    const foundCategory = mockCategories.find(
      (c) => c.name !== "Tất cả" && (q.includes(c.name.toLowerCase()) || q.includes(c.icon)),
    );
    if (foundCategory) {
      const itemsByCat = mockMenuItems
        .filter((m) => m.category_id === foundCategory.id)
        .slice(0, 4)
        .map((m) => m.name);
      return `Danh mục ${foundCategory.name} gợi ý: ${itemsByCat.join(", ")}.`;
    }

    const foundFood = mockMenuItems.find((m) => q.includes(m.name.toLowerCase()));
    if (foundFood) {
      return `${foundFood.name} có giá ${foundFood.price.toLocaleString("vi-VN")}đ, đánh giá ${foundFood.rating}/5 và đã bán ${foundFood.sold}.`;
    }

    return "Mình gợi ý bạn thử hỏi: 'món bán chạy', 'món giá rẻ', 'gợi ý đồ uống', hoặc tên món cụ thể nhé.";
  };

  const handleSendAIChat = () => {
    const content = chatInput.trim();
    if (!content) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: content,
    };
    const aiMessage = {
      id: Date.now() + 1,
      role: "ai",
      text: getAIReply(content),
    };

    setChatMessages((prev) => [...prev, userMessage, aiMessage]);
    setChatInput("");
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <button
          onClick={() => setShowAIChat((prev) => !prev)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "none",
            background: T.primary,
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            fontSize: 22,
          }}
          title="Chat AI"
        >
          💬
        </button>

        <button
          onClick={() => window.open("https://zalo.me", "_blank", "noopener,noreferrer")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "none",
            background: "#0068FF",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            fontSize: 16,
            fontWeight: 900,
          }}
          title="Liên hệ Zalo"
        >
          Zalo
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
            borderRadius: 14,
            boxShadow: "0 14px 38px rgba(0,0,0,.22)",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: T.primary,
              color: "#fff",
              padding: "10px 12px",
              fontWeight: 800,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Trợ lý AI</span>
            <button
              onClick={() => setShowAIChat(false)}
              style={{
                border: "none",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              maxHeight: 280,
              overflowY: "auto",
              padding: 12,
              background: "#FAFAFA",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {chatMessages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  background: m.role === "user" ? T.primary : "#fff",
                  color: m.role === "user" ? "#fff" : T.text,
                  border: m.role === "user" ? "none" : `1px solid ${T.border}`,
                  padding: "8px 10px",
                  borderRadius: 10,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div style={{ padding: 10, display: "flex", gap: 8, borderTop: `1px solid ${T.border}` }}>
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendAIChat();
              }}
              placeholder="Nhập câu hỏi cho AI..."
              style={{
                flex: 1,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "9px 10px",
                outline: "none",
              }}
            />
            <button
              onClick={handleSendAIChat}
              style={{
                border: "none",
                borderRadius: 10,
                background: T.primary,
                color: "#fff",
                padding: "0 14px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerChatWidget;
