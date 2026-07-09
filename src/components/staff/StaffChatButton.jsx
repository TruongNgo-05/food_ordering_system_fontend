import React, { useRef, useState, useEffect } from "react";
import {
  MessageOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import "../../assets/styles/staff/StaffChatButton.css";
import StaffChatDetail from "../modal/staff/StaffChatDetail";
import chatService from "../../services/chatService";

const StaffChatButton = () => {
  const [open, setOpen] = useState(false);

  const [selectedChat, setSelectedChat] = useState(null);

  const [conversations, setConversations] = useState([]);

  const messageEndRef = useRef(null);

  // ===============================
  // LẤY DANH SÁCH CONVERSATION STAFF
  // ===============================
  const loadConversations = async () => {
    try {
      const res = await chatService.getConversations();

      console.log("conversation:", res.data);

      const data = res.data.map((item) => ({
        id: item.conversationId,

        customer: item.customerName,

        avatar: item.customerAvatar,

        lastMessage: item.lastMessage || "",

        time: formatTime(item.lastTime),

        unread: item.unreadCount,

        status: item.status,

        messages: [],
      }));

      setConversations(data);
    } catch (error) {
      console.log("Load conversation error:", error);
    }
  };

  useEffect(() => {
    if (open) {
      loadConversations();
    }
  }, [open]);

  // format thời gian
  const formatTime = (time) => {
    if (!time) return "";

    const date = new Date(time);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ===============================
  // CLICK VÀO 1 CUSTOMER
  // ===============================
  const handleSelectChat = async (item) => {
    try {
      const res = await chatService.getStaffMessages(item.id);

      setSelectedChat({
        ...item,

        messages: res.data,
      });

      // đánh dấu đã đọc
      await chatService.staffMarkAsRead(item.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button className="staff-chat-button" onClick={() => setOpen(!open)}>
        <MessageOutlined />

        <span>Chat</span>
      </button>

      {open && (
        <div className="staff-chat-modal">
          <div className="staff-chat-header">
            {selectedChat ? (
              <>
                <button
                  className="staff-chat-back"
                  onClick={() => setSelectedChat(null)}
                >
                  <ArrowLeftOutlined />
                </button>

                <span>Tin nhắn khách hàng</span>
              </>
            ) : (
              <span>Tin nhắn khách hàng</span>
            )}

            <button
              className="staff-chat-close"
              onClick={() => {
                setOpen(false);

                setSelectedChat(null);
              }}
            >
              <CloseOutlined />
            </button>
          </div>

          {!selectedChat ? (
            <div className="staff-chat-list">
              {conversations.map((item) => (
                <div
                  key={item.id}
                  className="staff-chat-item"
                  onClick={() => handleSelectChat(item)}
                >
                  <div className="staff-chat-avatar">
                    {item.avatar ? (
                      <img src={item.avatar} />
                    ) : (
                      item.customer.charAt(0)
                    )}
                  </div>

                  <div className="staff-chat-info">
                    <div className="staff-chat-top">
                      <strong>{item.customer}</strong>

                      <span>{item.time}</span>
                    </div>

                    <div className="staff-chat-message">{item.lastMessage}</div>
                  </div>

                  {item.unread > 0 && (
                    <div className="staff-chat-unread">{item.unread}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <StaffChatDetail
              chat={selectedChat}
              onBack={() => setSelectedChat(null)}
              onSend={async (text) => {
                try {
                  const res = await chatService.sendStaffMessage({
                    conversationId: selectedChat.id,

                    content: text,
                  });

                  setSelectedChat((prev) => ({
                    ...prev,

                    messages: [...prev.messages, res.data],

                    lastMessage: text,
                  }));

                  setConversations((prev) =>
                    prev.map((item) =>
                      item.id === selectedChat.id
                        ? {
                            ...item,
                            lastMessage: text,
                          }
                        : item,
                    ),
                  );
                } catch (error) {
                  console.log("send message error", error);
                }
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default StaffChatButton;
