import React, { useEffect, useState } from "react";

import FloatingIcon from "../common/FloatingIcon";
import ChatModal from "./ChatModal";

import "../../assets/styles/user/ChatWidget.css";

const CustomerChatWidget = ({
  showChatButton = true,
  showZaloButton = true,
  chatLabel = "Chat với nhà hàng",
  zaloLabel = "Zalo",
}) => {
  const [showChat, setShowChat] = useState(false);

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  // Load lịch sử chat khi mở popup
  useEffect(() => {
    if (!showChat) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:8080/api/customer/chat/messages",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Không lấy được tin nhắn");
        }

        const data = await response.json();

        setMessages(data);
      } catch (error) {
        console.error("Load chat error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [showChat]);

  return (
    <>
      <div className="floating-contact-widget">
        {showChatButton && (
          <FloatingIcon
            type="chat"
            label={chatLabel}
            onClick={() => setShowChat(!showChat)}
          />
        )}

        {showZaloButton && <FloatingIcon type="zalo" label={zaloLabel} />}
      </div>

      {showChat && (
        <ChatModal
          title="Nhà hàng"
          messages={messages}
          setMessages={setMessages}
          loading={loading}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
};

export default CustomerChatWidget;
