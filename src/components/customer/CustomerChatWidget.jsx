import React, { useEffect, useState } from "react";
import { T } from "../../constants/customerTheme";
import {
  loadSharedCategories,
  loadSharedFoods,
  SHARED_DATA_UPDATED_EVENT,
} from "../../utils/sharedData";
import "../../assets/styles/CustomerChatWidget.css";

const CustomerChatWidget = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "Xin chào ! Mình là trợ lý AI 👋",
    },
  ]);
  const [categories, setCategories] = useState(() => loadSharedCategories());
  const [foods, setFoods] = useState(() => loadSharedFoods());

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

  const getAIReply = (question) => {
    const q = question.toLowerCase();

    if (q.includes("bán chạy") || q.includes("best")) {
      const top = [...foods]
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 3)
        .map((m) => `${m.name} (${m.sold} lượt bán)`);
      return `🔥 Top món bán chạy: ${top.join(", ")}`;
    }

    if (q.includes("giá rẻ") || q.includes("rẻ") || q.includes("dưới")) {
      const budgetItems = foods.filter((m) => m.price <= 40000).slice(0, 4);
      if (budgetItems.length === 0) return "Hiện chưa có món phù hợp 😢";
      return `💸 Giá tốt: ${budgetItems.map((m) => m.name).join(", ")}`;
    }

    const foundCategory = categories.find(
      (c) =>
        c.name !== "Tất cả" &&
        (q.includes(c.name.toLowerCase()) || q.includes(c.icon)),
    );
    if (foundCategory) {
      const itemsByCat = foods
        .filter((m) => m.category_id === foundCategory.id)
        .slice(0, 4)
        .map((m) => m.name);
      return `📂 ${foundCategory.name}: ${itemsByCat.join(", ")}`;
    }

    const foundFood = foods.find((m) => q.includes(m.name.toLowerCase()));
    if (foundFood) {
      return `🍽 ${foundFood.name}\n💰 ${foundFood.price.toLocaleString(
        "vi-VN",
      )}đ\n⭐ ${foundFood.rating}/5\n🔥 ${foundFood.sold} lượt bán`;
    }

    return "Bạn thử hỏi: 'món bán chạy', 'giá rẻ', hoặc tên món nhé 😉";
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
      <div className="floating-contact-widget">
        {/* CHAT AI */}
        <button
          className="floating-btn floating-btn-chat"
          onClick={() => setShowAIChat((prev) => !prev)}
        >
          <span className="floating-btn-ping" />
          <span className="floating-btn-icon">💬</span>
          <span className="floating-btn-label">Chat AI</span>
        </button>

        {/* ZALO */}
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

          <div
            style={{
              padding: 10,
              display: "flex",
              gap: 8,
              borderTop: `1px solid ${T.border}`,
            }}
          >
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
