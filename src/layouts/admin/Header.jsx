import React, { useContext } from "react";
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
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);

  const handleProfileUpdate = async (values) => {
    try {
      const [firstName, ...lastNameParts] = values.fullName.trim().split(" ");
      const lastName = lastNameParts.join(" ") || "";
      const updateData = {
        firstName,
        lastName,
        email: values.email,
      };
      await updateProfileApi(updateData);
      toast.success("Cập nhật thông tin thành công!");
      await refreshUser();
    } catch (error) {
      const msg = error.response?.data?.message || "Email đã tồn tại!";
      toast.error(msg);
      throw new Error(msg);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      await changePasswordApi({
        password: values.currentPassword,
        newPassword: values.newPassword,
      });
    } catch (error) {
      const msg = error.response?.data?.message || "Đổi mật khẩu thất bại!";
      throw new Error(msg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");
    logout();
    message.success("Đăng xuất thành công!");
    window.location.href = "/";
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
              <img
                src={
                  user?.avatar ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(displayName) +
                    "&background=4f46e5&color=fff&size=128"
                }
                alt="avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(displayName) +
                    "&background=4f46e5&color=fff&size=128";
                }}
              />
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
