import { Modal } from "antd";

let isLoginModalOpen = false;

export const confirmLoginWithModal = (navigate, onDecline) => {

  if (isLoginModalOpen) return;

  isLoginModalOpen = true;

  Modal.confirm({
    title: "Yêu cầu đăng nhập",
    content: "Bạn cần đăng nhập để sử dụng chức năng này.",
    okText: "Đăng nhập",
    cancelText: "Để sau",

    centered: true,
    maskClosable: false,

    onOk: () => {
      isLoginModalOpen = false;
      navigate("/login");
    },

    onCancel: () => {
      isLoginModalOpen = false;
      if (typeof onDecline === "function") {
        onDecline();
      }
    },
  });
};
