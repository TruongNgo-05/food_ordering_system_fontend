import React, { useState } from "react";
import { T } from "../../constants/customerTheme";
import { mockFAQTopics, FAQ_ANSWERS } from "../../data/mockData";
import UserHeader from "../../components/user/UserHeader";
import "../../assets/styles/CustomerSupport.css";
const Support = () => {
  const [activeTopic, setActiveTopic] = useState(null);
  const [openQ, setOpenQ] = useState(null);

  const topic = activeTopic !== null ? mockFAQTopics[activeTopic] : null;
  const filteredTopics = mockFAQTopics;

  return (
    <div className="customer-support-page" style={{ background: T.bg }}>
      <div className="customer-support-container">
        {topic ? (
          <>
            <UserHeader
              title={`Hỗ trợ: ${topic.topic}`}
              description="Danh sách câu hỏi thường gặp"
            />
            <button
              onClick={() => {
                setActiveTopic(null);
                setOpenQ(null);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: T.sub,
                fontWeight: 600,
                fontSize: 14,
                marginBottom: 14,
                padding: 0,
              }}
            >
              ← Quay lại
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: T.primaryLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                }}
              >
                {topic.icon}
              </div>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 900,
                    color: T.text,
                  }}
                >
                  {topic.topic}
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: T.sub }}>
                  {topic.questions.length} câu hỏi thường gặp
                </p>
              </div>
            </div>

            {topic.questions.map((q, i) => {
              const isOpen = openQ === i;
              return (
                <div
                  key={i}
                  style={{
                    background: T.card,
                    borderRadius: 14,
                    border: `1.5px solid ${isOpen ? T.primary + "55" : T.border}`,
                    marginBottom: 12,
                    overflow: "hidden",
                    transition: "border-color .2s",
                  }}
                >
                  <button
                    onClick={() => setOpenQ(isOpen ? null : i)}
                    style={{
                      width: "100%",
                      padding: "18px 22px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 14,
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{ fontSize: 15, fontWeight: 700, color: T.text }}
                    >
                      {q}
                    </span>
                    <span
                      style={{
                        color: T.primary,
                        fontSize: 22,
                        flexShrink: 0,
                        transform: isOpen ? "rotate(45deg)" : "none",
                        transition: "transform .2s",
                        display: "block",
                      }}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: "0 22px 18px",
                        borderTop: `1px solid ${T.border}`,
                      }}
                    >
                      <p
                        style={{
                          margin: "14px 0 0",
                          fontSize: 14,
                          color: T.sub,
                          lineHeight: 1.8,
                        }}
                      >
                        {FAQ_ANSWERS[q] ||
                          "Vui lòng liên hệ hotline 0389-582-843 để được hỗ trợ trực tiếp."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <>
            <UserHeader
              title="Hỗ trợ & Thắc mắc"
              description="Tìm câu trả lời nhanh hoặc liên hệ trực tiếp"
            />
            <div
              style={{
                background: T.primaryLight,
                borderRadius: 18,
                padding: "22px 28px",
                marginBottom: 28,
                display: "flex",
                gap: 18,
                alignItems: "center",
                border: `1px solid ${T.primary}22`,
              }}
            >
              <span style={{ fontSize: 44 }}>🤝</span>
              <div>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontWeight: 800,
                    fontSize: 17,
                    color: T.text,
                  }}
                >
                  Chúng tôi luôn sẵn sàng hỗ trợ!
                </p>
                <p style={{ margin: 0, fontSize: 14, color: T.sub }}>
                  Chọn chủ đề phù hợp hoặc gọi hotline{" "}
                  <strong style={{ color: T.primary }}>1800-1234</strong>
                </p>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 18,
              }}
            >
              {[
                ["☎️ Hotline", "0389-582-843", T.primaryLight, T.primary],
                ["💬 Chat", "8:00 - 22:00", T.blueBg, T.blue],
                [
                  "📧 Email",
                  "ngoquangtruongwork05@gmail.com",
                  T.greenBg,
                  T.green,
                ],
              ].map(([title, value, bg, color]) => (
                <div
                  key={title}
                  style={{
                    background: bg,
                    borderRadius: 12,
                    border: `1px solid ${color}22`,
                    padding: "10px 12px",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 12, color: T.sub }}>
                    {title}
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontWeight: 900,
                      color,
                      fontSize: 14,
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {filteredTopics.map((t) => {
                const originalIndex = mockFAQTopics.findIndex(
                  (x) => x.id === t.id,
                );
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTopic(originalIndex)}
                    style={{
                      background: T.card,
                      borderRadius: 16,
                      border: `1.5px solid ${T.border}`,
                      padding: "20px 22px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      transition: "all .15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = T.primary;
                      e.currentTarget.style.background = T.primaryLight;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.background = T.card;
                    }}
                  >
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 16,
                        background: T.primaryLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        flexShrink: 0,
                      }}
                    >
                      {t.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontWeight: 800,
                          fontSize: 16,
                          color: T.text,
                        }}
                      >
                        {t.topic}
                      </p>
                      <p style={{ margin: 0, fontSize: 13, color: T.sub }}>
                        {t.questions.length} câu hỏi
                      </p>
                    </div>
                    <span style={{ color: T.muted, fontSize: 20 }}>›</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Support;
