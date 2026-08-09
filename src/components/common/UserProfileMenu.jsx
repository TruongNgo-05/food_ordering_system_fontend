import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faKey,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import {
  updateProfileApi,
  changePasswordApi,
} from "../../services/userService";
import Capnhatthongtin from "../modal/auth/Capnhatthongtin";
import Capnhatmatkhau from "../modal/auth/Capnhatmatkhau";

const UserProfileMenu = ({
  fallbackName = "User",
  className = "",
  dropdownPlacement = "bottomRight",
}) => {
  const navigate = useNavigate();
  const { logout, userFullName, refreshUser, user } = useContext(AuthContext);
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${IMG_URL}${user.avatar}`
    : "";

  const handleProfileUpdate = async (values) => {
    try {
      await updateProfileApi(
        {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          avatar: values.avatar,
        },
        values.avatarFile,
      );

      toast.success("Cập nhật thông tin thành công!");
      await refreshUser();
      setIsModalOpen(false);
    } catch (error) {
      const msg = error.response?.data?.message || "Cập nhật thất bại!";
      toast.error(msg);
      throw error;
    }
  };

  const handleChangePassword = async (values) => {
    try {
      await changePasswordApi({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      });

      toast.success("Đổi mật khẩu thành công!");
      setIsPasswordModalOpen(false);
    } catch (error) {
      const msg = error.response?.data?.message || "Đổi mật khẩu thất bại!";
      toast.error(msg);
      throw new Error(msg);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("userRole");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("accessToken");

      await logout();
      message.success("Đăng xuất thành công!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    {
      key: "profile",
      icon: <FontAwesomeIcon icon={faUser} />,
      label: "Cập nhật thông tin",
      onClick: () => setIsModalOpen(true),
    },
    {
      key: "password",
      icon: <FontAwesomeIcon icon={faKey} />,
      label: "Đổi mật khẩu",
      onClick: () => setIsPasswordModalOpen(true),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <FontAwesomeIcon icon={faSignOutAlt} />,
      label: "Đăng xuất",
      danger: true,
      onClick: handleLogout,
    },
  ];

  const displayName = userFullName || fallbackName;

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={["click"]}
        placement={dropdownPlacement}
      >
        <div className={`user-info ${className}`.trim()}>
          <div className="user-avatar">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="avatar"
                className="user-avatar-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement?.setAttribute(
                    "data-fallback",
                    "true",
                  );
                }}
              />
            ) : null}
            {!avatarSrc && <FontAwesomeIcon icon={faUser} />}
          </div>
          <span className="user-name">{displayName}</span>
          <FontAwesomeIcon icon={faCog} className="dropdown-icon" />
        </div>
      </Dropdown>

      <Capnhatthongtin
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onUpdate={handleProfileUpdate}
        user={user}
      />
      <Capnhatmatkhau
        open={isPasswordModalOpen}
        onCancel={() => setIsPasswordModalOpen(false)}
        onChangePassword={handleChangePassword}
      />
    </>
  );
};

export default UserProfileMenu;
