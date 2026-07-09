import React, { useEffect, useRef, useState } from "react";
import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import "../../../assets/styles/staff/StaffChatDetail.css";

const StaffChatDetail = ({ chat, onBack, onSend }) => {
  const [message, setMessage] = useState("");

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat.messages]);

  const formatTime = (time) => {
    if (!time) return "";

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  };

  return (
    <>
      <div className="staff-chat-detail-header">
        <button onClick={onBack}>
          <ArrowLeftOutlined />
        </button>

        <div className="staff-chat-detail-user">{chat.customer}</div>
      </div>

      <div className="staff-chat-detail-body">
        {chat.messages?.map((msg) => (
          <div
            key={msg.id}
            className={`staff-message-row ${
              msg.senderType === "STAFF" ? "staff" : "customer"
            }`}
          >
            <div
              className={`staff-message-bubble ${
                msg.senderType === "STAFF" ? "staff" : "customer"
              }`}
            >
              <div>{msg.content}</div>

              <small>{formatTime(msg.createdAt)}</small>
            </div>
          </div>
        ))}

        <div ref={endRef} />
      </div>

      <div className="staff-chat-detail-input">
        <input
          value={message}
          placeholder="Nhập tin nhắn..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
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
