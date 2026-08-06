import React, { useRef, useState, useEffect } from "react";
import {
  MessageOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import "../../assets/styles/staff/StaffChatButton.css";
import StaffChatDetail from "../modal/staff/StaffChatDetail";
import chatService from "../../services/chatService";

const IMG_BASE_URL = import.meta.env.VITE_IMG_URL || "";

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }
  return `${IMG_BASE_URL}${avatar}`;
};

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

      const data = res.data
        .sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime))
        .map((item) => ({
          id: item.conversationId,
          customer: item.customerName,
          avatar: getAvatarUrl(item.customerAvatar),
          lastMessage: item.lastMessage || "",
          time: formatTime(item.lastTime),
          unread: item.unreadCount,
          status: item.status,
        }));

      setConversations(data);
    } catch (error) {
      console.log("Load conversation error:", error);
    }
  };

  useEffect(() => {
    if (!open) return;

    // load ngay khi mở
    loadConversations();

    // sau đó tự động cập nhật mỗi 2 giây
    const interval = setInterval(() => {
      loadConversations();
    }, 2000);

    return () => clearInterval(interval);
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
      setSelectedChat(item);

      await chatService.staffMarkAsRead(item.id);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === item.id
            ? {
                ...c,
                unread: 0,
              }
            : c
        )
      );
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
                      <img
                        src={item.avatar}
                        alt={item.customer}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <span
                      className="staff-chat-avatar-fallback"
                      style={{ display: item.avatar ? "none" : "flex" }}
                    >
                      {item.customer.charAt(0)}
                    </span>
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