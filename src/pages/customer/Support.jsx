// const CustomerSupport = () => {
//   return <div>CustomerSupport</div>;
// };
// export default CustomerSupport;
import React, { useState } from "react";
import { T } from "../../constants/customerTheme";
import { mockFAQTopics, FAQ_ANSWERS } from "../../data/mockData";
import { SectionTitle } from "../../components/customer/SharedUI";
import UserHeader from "../../components/user/UserHeader";
const Support = () => {
  const [activeTopic, setActiveTopic] = useState(null);
  const [openQ, setOpenQ] = useState(null);

  const topic = activeTopic !== null ? mockFAQTopics[activeTopic] : null;

  return (
    <div style={{ overflowY: "auto", height: "100%", background: T.bg }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "36px" }}>
        {topic ? (
          <>
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
                marginBottom: 24,
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
                          "Vui lòng liên hệ hotline 1800-1234 để được hỗ trợ trực tiếp."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <>
            {/* <SectionTitle>Hỗ trợ & FAQ</SectionTitle> */}
            <UserHeader title="Hỗ trợ & FAQ" />
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
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {mockFAQTopics.map((t, i) => (
                <div
                  key={t.id}
                  onClick={() => setActiveTopic(i)}
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
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Support;
