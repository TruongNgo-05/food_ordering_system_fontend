// import React, { useEffect, useRef, useState } from "react";
// import { T } from "../../constants/customerTheme";
// import {
//   loadSharedCategories,
//   loadSharedFoods,
//   SHARED_DATA_UPDATED_EVENT,
// } from "../../utils/sharedData";
// import "../../assets/styles/CustomerChatWidget.css";

// const THINKING_DOTS = [".", "..", "..."];

// const buildSystemPrompt = (categories, foods) => {
//   const categoryList = categories
//     .filter((c) => c.name !== "Tất cả")
//     .map((c) => `- ${c.name} (id: ${c.id})`)
//     .join("\n");

//   const foodList = foods
//     .map(
//       (f) =>
//         `- ${f.name} | Giá: ${f.price.toLocaleString("vi-VN")}đ | Rating: ${f.rating}/5 | Đã bán: ${f.sold || 0} | Danh mục id: ${f.category_id}`,
//     )
//     .join("\n");

//   return `Bạn là trợ lý AI của một nhà hàng/quán ăn. Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt. Dùng emoji phù hợp.

// DANH MỤC:
// ${categoryList}

// THỰC ĐƠN:
// ${foodList}

// Hãy giúp khách hàng tìm món ăn phù hợp, tư vấn theo sở thích, ngân sách, hoặc trả lời các câu hỏi về món ăn. Không bịa ra món không có trong thực đơn. Trả lời tối đa 3-4 câu.`;
// };

// const CustomerChatWidget = () => {
//   const [showAIChat, setShowAIChat] = useState(false);
//   const [chatInput, setChatInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [thinkingFrame, setThinkingFrame] = useState(0);
//   const [chatMessages, setChatMessages] = useState([
//     {
//       id: 1,
//       role: "ai",
//       text: "Xin chào! Mình là trợ lý AI 👋 Mình có thể giúp bạn tìm món ngon, gợi ý theo ngân sách, hoặc tư vấn theo khẩu vị nhé!",
//     },
//   ]);
//   const [categories, setCategories] = useState(() => loadSharedCategories());
//   const [foods, setFoods] = useState(() => loadSharedFoods());

//   const messagesEndRef = useRef(null);
//   const thinkingIntervalRef = useRef(null);
//   const conversationHistoryRef = useRef([]);

//   useEffect(() => {
//     const syncSharedData = () => {
//       setCategories(loadSharedCategories());
//       setFoods(loadSharedFoods());
//     };
//     syncSharedData();
//     window.addEventListener("focus", syncSharedData);
//     window.addEventListener("storage", syncSharedData);
//     window.addEventListener(SHARED_DATA_UPDATED_EVENT, syncSharedData);
//     return () => {
//       window.removeEventListener("focus", syncSharedData);
//       window.removeEventListener("storage", syncSharedData);
//       window.removeEventListener(SHARED_DATA_UPDATED_EVENT, syncSharedData);
//     };
//   }, []);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [chatMessages, isLoading]);

//   useEffect(() => {
//     if (isLoading) {
//       thinkingIntervalRef.current = setInterval(() => {
//         setThinkingFrame((f) => (f + 1) % THINKING_DOTS.length);
//       }, 400);
//     } else {
//       clearInterval(thinkingIntervalRef.current);
//     }
//     return () => clearInterval(thinkingIntervalRef.current);
//   }, [isLoading]);

//   const getAIReply = async (question) => {
//     conversationHistoryRef.current = [
//       ...conversationHistoryRef.current,
//       { role: "user", content: question },
//     ];

//     const response = await fetch("https://api.anthropic.com/v1/messages", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         model: "claude-sonnet-4-20250514",
//         max_tokens: 1000,
//         system: buildSystemPrompt(categories, foods),
//         messages: conversationHistoryRef.current,
//       }),
//     });

//     const data = await response.json();
//     const replyText =
//       data?.content?.[0]?.text ||
//       "Xin lỗi, mình chưa hiểu câu hỏi. Bạn thử hỏi lại nhé 😊";

//     conversationHistoryRef.current = [
//       ...conversationHistoryRef.current,
//       { role: "assistant", content: replyText },
//     ];

//     if (conversationHistoryRef.current.length > 20) {
//       conversationHistoryRef.current =
//         conversationHistoryRef.current.slice(-20);
//     }

//     return replyText;
//   };

//   const handleSendAIChat = async () => {
//     const content = chatInput.trim();
//     if (!content || isLoading) return;

//     const userMessage = { id: Date.now(), role: "user", text: content };
//     setChatMessages((prev) => [...prev, userMessage]);
//     setChatInput("");
//     setIsLoading(true);

//     try {
//       const replyText = await getAIReply(content);
//       const aiMessage = { id: Date.now() + 1, role: "ai", text: replyText };
//       setChatMessages((prev) => [...prev, aiMessage]);
//     } catch {
//       setChatMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now() + 1,
//           role: "ai",
//           text: "Mình đang gặp sự cố kết nối. Bạn thử lại sau nhé 🙏",
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="floating-contact-widget">
//         <button
//           className="floating-btn floating-btn-chat"
//           onClick={() => setShowAIChat((prev) => !prev)}
//         >
//           <span className="floating-btn-ping" />
//           <span className="floating-btn-icon">💬</span>
//           <span className="floating-btn-label">Chat AI</span>
//         </button>

//         <button
//           className="floating-btn floating-btn-zalo"
//           onClick={() =>
//             window.open(
//               "https://zalo.me/0389582843",
//               "_blank",
//               "noopener,noreferrer",
//             )
//           }
//         >
//           <span className="floating-btn-ping" />
//           <span className="floating-btn-icon">
//             <img
//               src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
//               alt="Zalo"
//               style={{ width: 20 }}
//             />
//           </span>
//           <span className="floating-btn-label">Zalo</span>
//         </button>
//       </div>

//       {showAIChat && (
//         <div
//           style={{
//             position: "fixed",
//             right: 24,
//             bottom: 92,
//             width: 360,
//             maxWidth: "calc(100vw - 24px)",
//             background: "#fff",
//             border: `1px solid ${T.border}`,
//             borderRadius: 16,
//             boxShadow: "0 16px 48px rgba(0,0,0,.18), 0 2px 8px rgba(0,0,0,.08)",
//             overflow: "hidden",
//             zIndex: 1000,
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           {/* Header */}
//           <div
//             style={{
//               background: T.primary,
//               color: "#fff",
//               padding: "12px 14px",
//               fontWeight: 700,
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               gap: 8,
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <div
//                 style={{
//                   width: 32,
//                   height: 32,
//                   borderRadius: "50%",
//                   background: "rgba(255,255,255,0.2)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 16,
//                 }}
//               >
//                 🤖
//               </div>
//               <div>
//                 <div style={{ fontSize: 14, fontWeight: 700 }}>Trợ lý AI</div>
//                 <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 400 }}>
//                   {isLoading ? "Đang trả lời..." : "Trực tuyến"}
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowAIChat(false)}
//               style={{
//                 border: "none",
//                 background: "rgba(255,255,255,0.15)",
//                 color: "#fff",
//                 cursor: "pointer",
//                 fontSize: 14,
//                 width: 28,
//                 height: 28,
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 transition: "background 0.15s",
//               }}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
//               }
//               onMouseLeave={(e) =>
//                 (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
//               }
//             >
//               ✕
//             </button>
//           </div>

//           {/* Messages */}
//           <div
//             style={{
//               height: 300,
//               overflowY: "auto",
//               padding: "12px 12px 8px",
//               background: "#F7F8FA",
//               display: "flex",
//               flexDirection: "column",
//               gap: 8,
//             }}
//           >
//             {chatMessages.map((m) => (
//               <div
//                 key={m.id}
//                 style={{
//                   display: "flex",
//                   flexDirection: m.role === "user" ? "row-reverse" : "row",
//                   alignItems: "flex-end",
//                   gap: 6,
//                 }}
//               >
//                 {m.role === "ai" && (
//                   <div
//                     style={{
//                       width: 26,
//                       height: 26,
//                       borderRadius: "50%",
//                       background: T.primary,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: 12,
//                       flexShrink: 0,
//                     }}
//                   >
//                     🤖
//                   </div>
//                 )}
//                 <div
//                   style={{
//                     maxWidth: "78%",
//                     background: m.role === "user" ? T.primary : "#fff",
//                     color: m.role === "user" ? "#fff" : "#1a1a2e",
//                     border:
//                       m.role === "user" ? "none" : `1px solid ${T.border}`,
//                     padding: "8px 11px",
//                     borderRadius:
//                       m.role === "user"
//                         ? "14px 14px 4px 14px"
//                         : "14px 14px 14px 4px",
//                     fontSize: 13,
//                     lineHeight: 1.55,
//                     whiteSpace: "pre-wrap",
//                     boxShadow:
//                       m.role === "ai" ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
//                   }}
//                 >
//                   {m.text}
//                 </div>
//               </div>
//             ))}

//             {isLoading && (
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   alignItems: "flex-end",
//                   gap: 6,
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 26,
//                     height: 26,
//                     borderRadius: "50%",
//                     background: T.primary,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: 12,
//                     flexShrink: 0,
//                   }}
//                 >
//                   🤖
//                 </div>
//                 <div
//                   style={{
//                     background: "#fff",
//                     border: `1px solid ${T.border}`,
//                     padding: "8px 14px",
//                     borderRadius: "14px 14px 14px 4px",
//                     fontSize: 13,
//                     color: "#999",
//                     boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//                     minWidth: 48,
//                   }}
//                 >
//                   {THINKING_DOTS[thinkingFrame]}
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>

//           {/* Quick suggestions */}
//           <div
//             style={{
//               padding: "8px 10px 0",
//               display: "flex",
//               gap: 6,
//               overflowX: "auto",
//               background: "#fff",
//               scrollbarWidth: "none",
//             }}
//           >
//             {["Món bán chạy nhất?", "Món dưới 40k?", "Gợi ý cho tôi"].map(
//               (s) => (
//                 <button
//                   key={s}
//                   onClick={() => {
//                     setChatInput(s);
//                   }}
//                   style={{
//                     whiteSpace: "nowrap",
//                     border: `1px solid ${T.border}`,
//                     borderRadius: 20,
//                     background: "#F7F8FA",
//                     color: T.primary,
//                     fontSize: 11,
//                     padding: "4px 10px",
//                     cursor: "pointer",
//                     fontWeight: 500,
//                     flexShrink: 0,
//                   }}
//                 >
//                   {s}
//                 </button>
//               ),
//             )}
//           </div>

//           {/* Input */}
//           <div
//             style={{
//               padding: "8px 10px 10px",
//               display: "flex",
//               gap: 8,
//               background: "#fff",
//               borderTop: `1px solid ${T.border}`,
//               marginTop: 8,
//             }}
//           >
//             <input
//               value={chatInput}
//               onChange={(e) => setChatInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   handleSendAIChat();
//                 }
//               }}
//               placeholder="Nhập câu hỏi..."
//               disabled={isLoading}
//               style={{
//                 flex: 1,
//                 border: `1px solid ${T.border}`,
//                 borderRadius: 22,
//                 padding: "9px 14px",
//                 outline: "none",
//                 fontSize: 13,
//                 background: isLoading ? "#f5f5f5" : "#fff",
//                 transition: "border-color 0.15s",
//               }}
//               onFocus={(e) => (e.target.style.borderColor = T.primary)}
//               onBlur={(e) => (e.target.style.borderColor = T.border)}
//             />
//             <button
//               onClick={handleSendAIChat}
//               disabled={isLoading || !chatInput.trim()}
//               style={{
//                 border: "none",
//                 borderRadius: 22,
//                 background:
//                   isLoading || !chatInput.trim() ? "#e0e0e0" : T.primary,
//                 color: "#fff",
//                 padding: "0 16px",
//                 cursor:
//                   isLoading || !chatInput.trim() ? "not-allowed" : "pointer",
//                 fontWeight: 700,
//                 fontSize: 13,
//                 transition: "background 0.15s",
//                 minWidth: 52,
//               }}
//             >
//               {isLoading ? "..." : "Gửi"}
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CustomerChatWidget;
import React, { useEffect, useRef, useState, useCallback } from "react";
import { T } from "../../constants/customerTheme";
import {
  loadSharedCategories,
  loadSharedFoods,
  SHARED_DATA_UPDATED_EVENT,
} from "../../utils/sharedData";
import "../../assets/styles/CustomerChatWidget.css";

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (price) => price.toLocaleString("vi-VN") + "đ";

// ─── Menu chính (luôn dùng lại) ─────────────────────────────────────────────
const MAIN_MENU = [
  { label: "📋 Xem thực đơn theo danh mục", action: "menu_cat" },
  { label: "🏆 Món bán chạy nhất", action: "top_sold" },
  { label: "💰 Gợi ý theo ngân sách", action: "budget_menu" },
  { label: "😋 Tư vấn theo khẩu vị", action: "taste_menu" },
  { label: "🕐 Giờ mở cửa & liên hệ", action: "info" },
];

const BACK_MAIN = [{ label: "↩ Quay lại menu chính", action: "main" }];

// ─── Xử lý logic chatbot (if/else thuần) ────────────────────────────────────
const getBotResponse = (action, foods, categories) => {
  // --- Menu danh mục ---
  if (action === "menu_cat") {
    const cats = categories.filter((c) => c.name !== "Tất cả");
    return {
      text: "Bạn muốn xem danh mục nào? 🍜",
      options: [
        ...cats.map((c) => ({ label: c.name, action: `cat_${c.id}` })),
        ...BACK_MAIN,
      ],
    };
  }

  if (action.startsWith("cat_")) {
    const catId = action.replace("cat_", "");
    // Tìm category theo id hoặc theo name (fallback)
    const cat = categories.find(
      (c) => String(c.id) === catId || c.name === catId,
    );
    const items = foods.filter((f) => String(f.category_id) === catId);

    if (!items.length) {
      return {
        text: `Danh mục "${cat?.name || catId}" hiện chưa có món nào 😅`,
        options: [
          { label: "📋 Xem danh mục khác", action: "menu_cat" },
          ...BACK_MAIN,
        ],
      };
    }

    const list = items
      .map((f) => `• <b>${f.name}</b> — ${fmt(f.price)} ⭐${f.rating}/5`)
      .join("<br>");

    return {
      text: `Danh mục <b>${cat?.name || catId}</b>:<br>${list}`,
      options: [
        { label: "📋 Xem danh mục khác", action: "menu_cat" },
        ...BACK_MAIN,
      ],
    };
  }

  // --- Top bán chạy ---
  if (action === "top_sold") {
    const sorted = [...foods]
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5);

    if (!sorted.length) {
      return { text: "Chưa có dữ liệu bán hàng bạn nhé!", options: BACK_MAIN };
    }

    const list = sorted
      .map(
        (f, i) =>
          `${i + 1}. <b>${f.name}</b> — ${fmt(f.price)} (đã bán: ${f.sold || 0} suất)`,
      )
      .join("<br>");

    return {
      text: `Top ${sorted.length} món bán chạy nhất 🏆:<br>${list}`,
      options: [
        { label: "💰 Xem theo ngân sách", action: "budget_menu" },
        ...BACK_MAIN,
      ],
    };
  }

  // --- Ngân sách ---
  if (action === "budget_menu") {
    return {
      text: "Ngân sách của bạn khoảng bao nhiêu?",
      options: [
        { label: "Dưới 25k", action: "budget_0_25000" },
        { label: "25k – 40k", action: "budget_25000_40000" },
        { label: "40k – 55k", action: "budget_40000_55000" },
        { label: "Trên 55k", action: "budget_55000_99999999" },
        ...BACK_MAIN,
      ],
    };
  }

  if (action.startsWith("budget_")) {
    const parts = action.replace("budget_", "").split("_");
    const min = parseInt(parts[0]);
    const max = parseInt(parts[1]);
    const items = foods.filter((f) => f.price >= min && f.price <= max);

    const label =
      max > 9000000 ? `trên ${fmt(min)}` : `${fmt(min)} – ${fmt(max)}`;

    if (!items.length) {
      return {
        text: `Hiện chưa có món trong khoảng ${label} bạn nhé 😅`,
        options: [
          { label: "💰 Xem ngân sách khác", action: "budget_menu" },
          ...BACK_MAIN,
        ],
      };
    }

    const list = items
      .map((f) => `• <b>${f.name}</b> — ${fmt(f.price)} ⭐${f.rating}/5`)
      .join("<br>");

    return {
      text: `Món trong khoảng <b>${label}</b>:<br>${list}`,
      options: [
        { label: "💰 Xem ngân sách khác", action: "budget_menu" },
        ...BACK_MAIN,
      ],
    };
  }

  // --- Khẩu vị ---
  if (action === "taste_menu") {
    return {
      text: "Bạn đang thèm ăn gì? 😋",
      options: [
        { label: "🍜 Món nước (phở, bún...)", action: "taste_soup" },
        { label: "🍚 Món cơm", action: "taste_rice" },
        { label: "🥖 Ăn nhẹ / bánh mì", action: "taste_light" },
        { label: "🧋 Đồ uống", action: "taste_drink" },
        { label: "⭐ Món được đánh giá cao nhất", action: "taste_top_rated" },
        ...BACK_MAIN,
      ],
    };
  }

  if (action === "taste_soup") {
    // Lấy các món có từ khóa nước: phở, bún, hủ tiếu, canh, súp...
    const keywords = ["phở", "bún", "hủ tiếu", "canh", "súp", "mì", "miến"];
    const items = foods.filter((f) =>
      keywords.some((k) => f.name.toLowerCase().includes(k)),
    );
    if (!items.length) {
      return {
        text: "Hiện chưa có món nước bạn nhé!",
        options: [
          { label: "😋 Xem khẩu vị khác", action: "taste_menu" },
          ...BACK_MAIN,
        ],
      };
    }
    const best = [...items].sort((a, b) => b.rating - a.rating)[0];
    const list = items
      .map((f) => `• <b>${f.name}</b> — ${fmt(f.price)} ⭐${f.rating}`)
      .join("<br>");
    return {
      text: `Các món nước:<br>${list}<br><br>💡 Gợi ý: <b>${best.name}</b> được đánh giá cao nhất ⭐${best.rating}!`,
      options: [
        { label: "😋 Xem khẩu vị khác", action: "taste_menu" },
        ...BACK_MAIN,
      ],
    };
  }

  if (action === "taste_rice") {
    const keywords = ["cơm", "rice", "chiên"];
    const items = foods.filter((f) =>
      keywords.some((k) => f.name.toLowerCase().includes(k)),
    );
    if (!items.length) {
      return {
        text: "Hiện chưa có món cơm bạn nhé!",
        options: [
          { label: "😋 Xem khẩu vị khác", action: "taste_menu" },
          ...BACK_MAIN,
        ],
      };
    }
    const list = items
      .map((f) => `• <b>${f.name}</b> — ${fmt(f.price)} ⭐${f.rating}`)
      .join("<br>");
    return {
      text: `Các món cơm:<br>${list}`,
      options: [
        { label: "😋 Xem khẩu vị khác", action: "taste_menu" },
        ...BACK_MAIN,
      ],
    };
  }

  if (action === "taste_light") {
    const keywords = ["bánh", "cuốn", "nem", "chả", "gỏi"];
    const items = foods.filter((f) =>
      keywords.some((k) => f.name.toLowerCase().includes(k)),
    );
    if (!items.length) {
      return {
        text: "Hiện chưa có món ăn nhẹ bạn nhé!",
        options: [
          { label: "😋 Xem khẩu vị khác", action: "taste_menu" },
          ...BACK_MAIN,
        ],
      };
    }
    const list = items
      .map((f) => `• <b>${f.name}</b> — ${fmt(f.price)} ⭐${f.rating}`)
      .join("<br>");
    return {
      text: `Ăn nhẹ / bánh:<br>${list}`,
      options: [
        { label: "😋 Xem khẩu vị khác", action: "taste_menu" },
        ...BACK_MAIN,
      ],
    };
  }

  if (action === "taste_drink") {
    const keywords = [
      "nước",
      "trà",
      "cà phê",
      "coffee",
      "juice",
      "sinh tố",
      "sữa",
      "bia",
      "rượu",
    ];
    const items = foods.filter((f) =>
      keywords.some((k) => f.name.toLowerCase().includes(k)),
    );
    // Fallback: tìm theo category name "đồ uống"
    const drinkCat = categories.find(
      (c) =>
        c.name.toLowerCase().includes("uống") ||
        c.name.toLowerCase().includes("drink"),
    );
    const itemsFromCat = drinkCat
      ? foods.filter((f) => String(f.category_id) === String(drinkCat.id))
      : [];
    const merged = [
      ...new Map([...items, ...itemsFromCat].map((f) => [f.name, f])).values(),
    ];

    if (!merged.length) {
      return {
        text: "Hiện chưa có đồ uống bạn nhé!",
        options: [
          { label: "😋 Xem khẩu vị khác", action: "taste_menu" },
          ...BACK_MAIN,
        ],
      };
    }
    const list = merged
      .map((f) => `• <b>${f.name}</b> — ${fmt(f.price)} ⭐${f.rating}`)
      .join("<br>");
    return {
      text: `Đồ uống:<br>${list}`,
      options: [
        { label: "😋 Xem khẩu vị khác", action: "taste_menu" },
        ...BACK_MAIN,
      ],
    };
  }

  if (action === "taste_top_rated") {
    const sorted = [...foods].sort((a, b) => b.rating - a.rating).slice(0, 5);
    const list = sorted
      .map(
        (f, i) =>
          `${i + 1}. <b>${f.name}</b> — ${fmt(f.price)} ⭐${f.rating}/5`,
      )
      .join("<br>");
    return {
      text: `Top 5 món được đánh giá cao nhất ⭐:<br>${list}`,
      options: [
        { label: "😋 Xem khẩu vị khác", action: "taste_menu" },
        ...BACK_MAIN,
      ],
    };
  }

  // --- Thông tin ---
  if (action === "info") {
    return {
      text: "Giờ mở cửa: <b>6:00 – 22:00</b> hàng ngày 🕕<br>Địa chỉ: 123 Đường Ngon, Q.1<br>Điện thoại / Zalo: <b>0389 582 843</b>",
      options: BACK_MAIN,
    };
  }

  // --- Tìm theo tên món cụ thể ---
  if (action.startsWith("dish_")) {
    const dishName = action.replace("dish_", "");
    const food = foods.find((f) => f.name === dishName);
    if (!food) {
      return {
        text: `Không tìm thấy món "${dishName}" 😅`,
        options: BACK_MAIN,
      };
    }
    const cat = categories.find(
      (c) => String(c.id) === String(food.category_id),
    );
    return {
      text: `<b>${food.name}</b><br>Giá: ${fmt(food.price)}<br>Đánh giá: ⭐${food.rating}/5<br>Đã bán: ${food.sold || 0} suất<br>Danh mục: ${cat?.name || "—"}`,
      options: [
        cat
          ? { label: `📋 Xem thêm món ${cat.name}`, action: `cat_${cat.id}` }
          : null,
        ...BACK_MAIN,
      ].filter(Boolean),
    };
  }

  // --- Menu chính ---
  if (action === "main") {
    return {
      text: "Mình có thể giúp gì tiếp cho bạn? 😊",
      options: MAIN_MENU,
    };
  }

  // Fallback
  return {
    text: "Mình chưa hiểu câu hỏi 😅 Bạn thử chọn một mục dưới đây nhé!",
    options: MAIN_MENU,
  };
};

// ─── Keyword matching khi người dùng gõ tự do ────────────────────────────────
const matchKeyword = (text, foods, categories) => {
  const t = text.toLowerCase().trim();

  // Tìm chính xác tên món trong thực đơn
  const dishMatch = foods.find((f) => t.includes(f.name.toLowerCase()));
  if (dishMatch) return `dish_${dishMatch.name}`;

  // Top bán chạy
  if (/bán chạy|phổ biến|nhiều người|best seller|hot nhất/.test(t))
    return "top_sold";

  // Đánh giá cao
  if (/ngon nhất|đánh giá cao|rating|điểm cao|5 sao/.test(t))
    return "taste_top_rated";

  // Ngân sách
  if (/ngân sách|dưới|giá rẻ|rẻ nhất|bao nhiêu tiền|giá cả/.test(t))
    return "budget_menu";
  if (/dưới 25|<\s*25/.test(t)) return "budget_0_25000";
  if (/dưới 40|<\s*40|25.*40|40k/.test(t)) return "budget_25000_40000";
  if (/dưới 55|<\s*55|40.*55|55k/.test(t)) return "budget_40000_55000";
  if (/trên 55|>\s*55|đắt/.test(t)) return "budget_55000_99999999";

  // Thực đơn / danh mục
  if (/thực đơn|menu|danh mục|có gì|xem món/.test(t)) return "menu_cat";

  // Tư vấn
  if (
    /tư vấn|gợi ý|recommend|không biết chọn|không biết ăn gì|giúp tôi chọn/.test(
      t,
    )
  )
    return "taste_menu";

  // Khẩu vị cụ thể
  if (/phở|bún|hủ tiếu|miến|mì|canh|súp/.test(t)) return "taste_soup";
  if (/cơm|rice/.test(t)) return "taste_rice";
  if (/bánh mì|ăn nhẹ|snack/.test(t)) return "taste_light";
  if (/nước uống|trà|cà phê|coffee|sinh tố|nước ép|sữa/.test(t))
    return "taste_drink";

  // Tìm tên danh mục khớp
  const catMatch = categories.find(
    (c) => c.name !== "Tất cả" && t.includes(c.name.toLowerCase()),
  );
  if (catMatch) return `cat_${catMatch.id}`;

  // Giờ giấc / liên hệ
  if (/giờ|mở cửa|đóng cửa|địa chỉ|liên hệ|số điện thoại|zalo|ở đâu/.test(t))
    return "info";

  return null;
};

// ─── Component chính ─────────────────────────────────────────────────────────
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
      text: "Xin chào! Mình là trợ lý nhà hàng 👋 Mình có thể giúp bạn tìm món ngon, gợi ý theo ngân sách, hoặc xem thực đơn nhé!",
      options: MAIN_MENU,
    },
  ]);
  const [categories, setCategories] = useState(() => loadSharedCategories());
  const [foods, setFoods] = useState(() => loadSharedFoods());

  const messagesEndRef = useRef(null);
  const thinkingIntervalRef = useRef(null);

  // Sync dữ liệu khi admin cập nhật
  useEffect(() => {
    const sync = () => {
      setCategories(loadSharedCategories());
      setFoods(loadSharedFoods());
    };
    sync();
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    window.addEventListener(SHARED_DATA_UPDATED_EVENT, sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener(SHARED_DATA_UPDATED_EVENT, sync);
    };
  }, []);

  // Auto scroll xuống cuối
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isThinking]);

  // Animation chấm chờ
  useEffect(() => {
    if (isThinking) {
      thinkingIntervalRef.current = setInterval(() => {
        setThinkingFrame((f) => (f + 1) % THINKING_DOTS.length);
      }, 400);
    } else {
      clearInterval(thinkingIntervalRef.current);
    }
    return () => clearInterval(thinkingIntervalRef.current);
  }, [isThinking]);

  // Thêm tin nhắn người dùng
  const addUserMessage = useCallback((text) => {
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text },
    ]);
  }, []);

  // Bot trả lời (giả lập delay ngắn cho tự nhiên)
  const addBotResponse = useCallback(
    (action) => {
      setIsThinking(true);
      setTimeout(() => {
        const response = getBotResponse(action, foods, categories);
        setChatMessages((prev) => [
          ...prev,
          { id: Date.now(), role: "ai", ...response },
        ]);
        setIsThinking(false);
      }, 350);
    },
    [foods, categories],
  );

  // Xử lý khi bấm option button
  const handleOptionClick = useCallback(
    (action, label) => {
      addUserMessage(label);
      addBotResponse(action);
    },
    [addUserMessage, addBotResponse],
  );

  // Xử lý khi gửi tin nhắn gõ tay
  const handleSend = useCallback(() => {
    const content = chatInput.trim();
    if (!content || isThinking) return;

    addUserMessage(content);
    setChatInput("");

    const action = matchKeyword(content, foods, categories);
    if (action) {
      addBotResponse(action);
    } else {
      setIsThinking(true);
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "ai",
            text: "Mình chưa hiểu câu hỏi 😅 Bạn thử chọn một mục dưới đây nhé!",
            options: MAIN_MENU,
          },
        ]);
        setIsThinking(false);
      }, 350);
    }
  }, [
    chatInput,
    isThinking,
    foods,
    categories,
    addUserMessage,
    addBotResponse,
  ]);

  // Xử lý quick suggestions
  const handleSuggestion = useCallback(
    (text) => {
      setChatInput(text);
      addUserMessage(text);
      const action = matchKeyword(text, foods, categories);
      addBotResponse(action || "main");
    },
    [foods, categories, addUserMessage, addBotResponse],
  );

  return (
    <>
      {/* Floating buttons */}
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

      {/* Chat window */}
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
                  {isThinking ? "Đang trả lời..." : "Trực tuyến"}
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
              height: 340,
              overflowY: "auto",
              padding: "12px 12px 8px",
              background: "#F7F8FA",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {chatMessages.map((m) => (
              <div key={m.id}>
                {/* Bubble */}
                <div
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
                      maxWidth: "82%",
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
                      boxShadow:
                        m.role === "ai" ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                    }}
                    dangerouslySetInnerHTML={{ __html: m.text }}
                  />
                </div>

                {/* Option buttons dưới tin nhắn bot */}
                {m.role === "ai" && m.options && m.options.length > 0 && (
                  <div
                    style={{
                      marginTop: 6,
                      marginLeft: 32,
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                    }}
                  >
                    {m.options.map((opt) => (
                      <button
                        key={opt.action}
                        onClick={() => handleOptionClick(opt.action, opt.label)}
                        style={{
                          border: `1px solid ${T.primary}`,
                          borderRadius: 10,
                          background: "#fdecea",
                          color: T.primary,
                          padding: "6px 12px",
                          fontSize: 12,
                          cursor: "pointer",
                          textAlign: "left",
                          fontWeight: 500,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#fbd5d0")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#fdecea")
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div
                style={{
                  display: "flex",
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
            {[
              "Món bán chạy nhất?",
              "Món dưới 40k?",
              "Tư vấn cho tôi",
              "Xem thực đơn",
            ].map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
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
            ))}
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
                  handleSend();
                }
              }}
              placeholder="Nhập câu hỏi..."
              disabled={isThinking}
              style={{
                flex: 1,
                border: `1px solid ${T.border}`,
                borderRadius: 22,
                padding: "9px 14px",
                outline: "none",
                fontSize: 13,
                background: isThinking ? "#f5f5f5" : "#fff",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = T.primary)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
            <button
              onClick={handleSend}
              disabled={isThinking || !chatInput.trim()}
              style={{
                border: "none",
                borderRadius: 22,
                background:
                  isThinking || !chatInput.trim() ? "#e0e0e0" : T.primary,
                color: "#fff",
                padding: "0 16px",
                cursor:
                  isThinking || !chatInput.trim() ? "not-allowed" : "pointer",
                fontWeight: 700,
                fontSize: 13,
                transition: "background 0.15s",
                minWidth: 52,
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
