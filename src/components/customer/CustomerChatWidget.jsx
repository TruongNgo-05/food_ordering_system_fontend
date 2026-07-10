import React, { useEffect, useState } from "react";

import FloatingIcon from "../common/FloatingIcon";
import ChatModal from "./ChatModal";

import "../../assets/styles/user/ChatWidget.css";

const CustomerChatWidget = ({
  enableChat = false,
  showZaloButton = true,
  chatLabel = "Chat với nhà hàng",
  zaloLabel = "Zalo",
}) => {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <div className="floating-contact-widget">
        {enableChat && (
          <FloatingIcon
            type="chat"
            label={chatLabel}
            onClick={() => setShowChat(!showChat)}
          />
        )}

        {showZaloButton && <FloatingIcon type="zalo" label={zaloLabel} />}
      </div>

      {showChat && (
        <ChatModal title="Nhà hàng" onClose={() => setShowChat(false)} />
      )}
    </>
  );
};

export default CustomerChatWidget;
