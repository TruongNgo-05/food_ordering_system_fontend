import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faKey,
  faSignOutAlt,
  faBars,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/authContext";
import {
  updateProfileApi,
  changePasswordApi,
} from "../../services/userService";
import "../../assets/styles/Header.css";
import { toast } from "react-toastify";
import Capnhatthongtin from "../../components/modal/auth/Capnhatthongtin";
import Capnhatmatkhau from "../../components/modal/auth/Capnhatmatkhau";

const Header = ({ onMenuToggle }) => {
  const { logout, userFullName, refreshUser, user } = useContext(AuthContext);
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${IMG_URL}${user.avatar}`
    : "";
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);

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

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");

    logout();
    message.success("Đăng xuất thành công!");
    navigate("/login");
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

  const displayName = userFullName || "Admin";

  return (
    <header className="header header--admin">
      <div className="header-left">
        <button
          className="menu-toggle-btn"
          onClick={onMenuToggle}
          aria-label="Mở menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <div className="header-right">
        <Dropdown
          menu={{ items: menuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="user-info">
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
      </div>
    </header>
  );
};
export default Header;
