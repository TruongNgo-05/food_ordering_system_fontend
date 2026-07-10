import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/customer/ChatModal.css";
import chatService from "../../services/chatService";

const PAGE_SIZE = 5;

const ChatModal = ({
  title = "Nhà hàng",
  placeholder = "Nhập tin nhắn cho nhà hàng...",
  onClose,
}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingOld, setLoadingOld] = useState(false);

  const chatBodyRef = useRef(null);
  const messagesEndRef = useRef(null);
  const firstLoad = useRef(true);

  // ===============================
  // Load lần đầu
  // ===============================
  useEffect(() => {
    firstLoad.current = true;

    loadMessages();

    const interval = setInterval(refreshLatest, 2000);

    return () => clearInterval(interval);
  }, []);

  // ===============================
  // Scroll
  // ===============================
 useEffect(() => {
  if (!chatBodyRef.current || messages.length === 0) return;

  if (firstLoad.current) {
    firstLoad.current = false;

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    }, 0);

    return;
  }

  const body = chatBodyRef.current;

  const isBottom =
    body.scrollHeight - body.scrollTop - body.clientHeight < 50;

  if (isBottom) {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }
}, [messages]);

  // ===============================
  // Load message
  // ===============================
  const loadMessages = async (beforeId = null) => {
    try {
      if (beforeId) setLoadingOld(true);

      const res = await chatService.getCustomerMessages(
        beforeId,
        PAGE_SIZE
      );

      const list = res.data.map((item) => ({
        id: item.id,
        role: item.senderType === "CUSTOMER" ? "customer" : "staff",
        text: item.content,
        time: new Date(item.createdAt).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      if (beforeId == null) {
        setMessages((prev) => {
          if (prev.length === 0) return list;

          const ids = new Set(prev.map((m) => m.id));

          const newMessages = list.filter((m) => !ids.has(m.id));

          return [...prev, ...newMessages];
        });

        setHasMore(list.length === PAGE_SIZE);

        
      } else {
        const oldHeight = chatBodyRef.current.scrollHeight;

        setMessages((prev) => [...list, ...prev]);

        setTimeout(() => {
          const newHeight = chatBodyRef.current.scrollHeight;

          chatBodyRef.current.scrollTop = newHeight - oldHeight;
        }, 0);

        if (list.length < PAGE_SIZE) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingOld(false);
    }
  };

  // ===============================
  // Refresh tin mới
  // ===============================
  const refreshLatest = async () => {
    try {
      const res = await chatService.getCustomerMessages(
        null,
        PAGE_SIZE
      );

      const latest = res.data.map((item) => ({
        id: item.id,
        role: item.senderType === "CUSTOMER" ? "customer" : "staff",
        text: item.content,
        time: new Date(item.createdAt).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

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
  // Scroll lên đầu
  // ===============================
  const handleScroll = () => {
    if (!chatBodyRef.current) return;
    if (loadingOld) return;
    if (!hasMore) return;
    if (messages.length === 0) return;

    if (chatBodyRef.current.scrollTop <= 5) {
      loadMessages(messages[0].id);
    }
  };

  // ===============================
  // Send
  // ===============================
  const handleSend = async () => {
    const content = input.trim();

    if (!content) return;

    try {
      await chatService.sendCustomerMessage({
        content,
      });

      setInput("");

      await refreshLatest();

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 50);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chat-modal">
      {/* HEADER */}
      <div className="chat-header">
        <div className="chat-info">
          <div className="chat-avatar">🍽️</div>

          <div>
            <div className="chat-title">{title}</div>
            <div className="chat-status">Trực tuyến</div>
          </div>
        </div>

        <button className="chat-close" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* BODY */}
      <div
        ref={chatBodyRef}
        className="chat-body"
        onScroll={handleScroll}
      >
        {loadingOld && (
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

        {messages.map((m) => (
          <div key={m.id} className={`message-row ${m.role}`}>
            <div className={`message ${m.role}`}>
              <div>{m.text}</div>

              <small>{m.time}</small>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER */}
      <div className="chat-footer">
        <input
          value={input}
          placeholder={placeholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          disabled={!input.trim()}
          onClick={handleSend}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatModal;