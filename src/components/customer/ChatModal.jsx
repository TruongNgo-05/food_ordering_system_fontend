import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/customer/ChatModal.css";
import chatService from "../../services/chatService";

const T = {
  primary: "#f4c542",
  border: "#ececec",
  surface: "#ffffff",
};

const ChatModal = ({
  title = "Nhà hàng",
  placeholder = "Nhập tin nhắn cho nhà hàng...",
  messages,
  setMessages,
  onClose,
}) => {
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await chatService.getCustomerMessages();

      const messages = res.data.map((item) => ({
        id: item.id,

        role: item.senderType === "CUSTOMER" ? "customer" : "staff",

        text: item.content,

        time: new Date(item.createdAt).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setMessages(messages);
    } catch (error) {
      console.log("Load messages error:", error);
    }
  };
  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    const content = input.trim();

    if (!content) return;

    setInput("");

    try {
      const res = await chatService.sendCustomerMessage({
        content,
      });

      const message = res.data;

      const newMessage = {
        id: message.id,

        role: message.senderType === "CUSTOMER" ? "customer" : "staff",

        text: message.content,

        time: new Date(message.createdAt).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.log("Send message error:", error);
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

      <div className="chat-body">
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

        <button disabled={!input.trim()} onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatModal;
