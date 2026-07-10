import React, { useEffect, useRef, useState } from "react";
import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import "../../../assets/styles/staff/StaffChatDetail.css";
import chatService from "../../../services/chatService";

const PAGE_SIZE = 5;

const StaffChatDetail = ({ chat, onBack }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const bodyRef = useRef(null);
  const endRef = useRef(null);

  // ===============================
  // Load lần đầu khi mở chat
  // ===============================

useEffect(() => {
  if (!chat?.id) return;

  firstLoad.current = true;

  loadMessages();

  const interval = setInterval(refreshLatest, 2000);

  return () => clearInterval(interval);
}, [chat?.id]);
  // ===============================
  // Scroll xuống cuối khi mở chat
  // ===============================
const firstLoad = useRef(true);

useEffect(() => {
  if (!bodyRef.current || messages.length === 0) return;

  if (firstLoad.current) {
    firstLoad.current = false;

    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({
        behavior: "auto",
      });
    });

    return;
  }

  const body = bodyRef.current;

  const isBottom =
    body.scrollHeight - body.scrollTop - body.clientHeight < 50;

  if (isBottom) {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }
}, [messages]);

  // ===============================
  // Load message
  // ===============================
 const loadMessages = async (beforeId = null) => {
  try {
    if (beforeId) setLoadingMore(true);

    const res = await chatService.getStaffMessages(
      chat.id,
      beforeId,
      PAGE_SIZE
    );

    const list = res.data;

   if (beforeId == null) {
  setMessages((prev) => {
    if (prev.length === 0) return list;

    const ids = new Set(prev.map((m) => m.id));
    const newMessages = list.filter((m) => !ids.has(m.id));

    return [...prev, ...newMessages];
  });

  setHasMore(list.length === PAGE_SIZE);

  requestAnimationFrame(() => {
    endRef.current?.scrollIntoView({
      behavior: "auto",
    });
  });
} else {
      // Load tin nhắn cũ
      const oldHeight = bodyRef.current.scrollHeight;

      setMessages((prev) => [...list, ...prev]);

      setTimeout(() => {
        const newHeight = bodyRef.current.scrollHeight;

        bodyRef.current.scrollTop = newHeight - oldHeight;
      }, 0);

      if (list.length < PAGE_SIZE) {
        setHasMore(false);
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    setLoadingMore(false);
  }
};

  // ===============================
  // Refresh tin nhắn mới
  // ===============================
  const refreshLatest = async () => {
  try {
    const res = await chatService.getStaffMessages(chat.id, null, PAGE_SIZE);

    const latest = res.data;

    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id));

      const newMessages = latest.filter((m) => !ids.has(m.id));

      return [...prev, ...newMessages];
    });
  } catch (err) {
    console.log(err);
  }
};

  // ===============================
  // Scroll lên đầu -> load cũ
  // ===============================
  const handleScroll = () => {
    if (!bodyRef.current) return;

    if (loadingMore) return;

    if (!hasMore) return;

    if (messages.length === 0) return;

    if (bodyRef.current.scrollTop <= 5) {
      loadMessages(messages[0].id);
    }
  };

  // ===============================
  // Send
  // ===============================
const handleSend = async () => {
  if (!message.trim()) return;

  try {
    await chatService.sendStaffMessage({
      conversationId: chat.id,
      content: message.trim(),
    });

    setMessage("");

    await refreshLatest();

    setTimeout(() => {
      endRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  } catch (err) {
    console.log(err);
  }
};

  const formatTime = (time) => {
    if (!time) return "";

    return new Date(time).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* HEADER */}
      <div className="staff-chat-detail-header">
        <button onClick={onBack}>
          <ArrowLeftOutlined />
        </button>

        <div className="staff-chat-detail-user">
          {chat.customer}
        </div>
      </div>

      {/* BODY */}
      <div
        ref={bodyRef}
        className="staff-chat-detail-body"
        onScroll={handleScroll}
      >
        {loadingMore && (
          <div
            style={{
              textAlign: "center",
              padding: 8,
              color: "#888",
              fontSize: 12,
            }}
          >
            Đang tải...
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`staff-message-row ${
              msg.senderType === "STAFF"
                ? "staff"
                : "customer"
            }`}
          >
            <div
              className={`staff-message-bubble ${
                msg.senderType === "STAFF"
                  ? "staff"
                  : "customer"
              }`}
            >
              <div>{msg.content}</div>

              <small>{formatTime(msg.createdAt)}</small>
            </div>
          </div>
        ))}

        <div ref={endRef} />
      </div>

      {/* FOOTER */}
      <div className="staff-chat-detail-input">
        <input
          value={message}
          placeholder="Nhập tin nhắn..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button onClick={handleSend}>
          <SendOutlined />
        </button>
      </div>
    </>
  );
};

export default StaffChatDetail;