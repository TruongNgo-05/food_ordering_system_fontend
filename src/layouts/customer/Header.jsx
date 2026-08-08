import React, { useContext, useState, useEffect } from "react";

import { NavLink, useNavigate, useLocation } from "react-router-dom";

import { Dropdown, message } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUser,
  faCog,
  faKey,
  faSignOutAlt,
  faHouse,
  faClipboardList,
  faHeart,
  faNewspaper,
  faHeadset,
  faQrcode,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../../context/authContext";

import {
  updateProfileApi,
  changePasswordApi,
} from "../../services/userService";

import { useCustomerData } from "../../context/CustomerDataContext";

import "../../assets/styles/Header.css";

import { toast } from "react-toastify";

import Capnhatthongtin from "../../components/modal/auth/Capnhatthongtin";
import Capnhatmatkhau from "../../components/modal/auth/Capnhatmatkhau";

import CartModal from "../../components/user/CartModal";
import BrandLogo from "../../components/common/BrandLogo";

import { confirmLoginWithModal } from "../../utils/authGuards";

const navItems = [
  {
    to: "/customer",
    label: "Thực đơn",
    icon: faHouse,
    end: true,
  },

  {
    to: "/customer/orders",
    label: "Đơn hàng",
    icon: faClipboardList,
  },

  {
    to: "/customer/favorites",
    label: "Yêu thích",
    icon: faHeart,
  },

  {
    to: "/nhahangnqt",
    label: "Blog nhà hàng",
    icon: faNewspaper,
    newTab: true,
  },

  {
    to: "/customer/support",
    label: "Hỗ trợ",
    icon: faHeadset,
  },

  {
    to: "/customer/table-qr-samples",
    label: "QR Bàn",
    icon: faQrcode,
  },
];

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isHome = pathname === "/customer" || pathname === "/customer/";

  const { isLoggedIn, logout, userFullName, refreshUser, user } =
    useContext(AuthContext);

  const {
    cart,
    cartCount,
    favoriteCount,
    cartSubtotal,
    updateCart,
    removeItem,
  } = useCustomerData();

  const IMG_URL = import.meta.env.VITE_IMG_URL;

  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${IMG_URL}${user.avatar}`
    : "";

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
      await logout();

      message.success("Đăng xuất thành công!");
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

  const displayName = userFullName || "Khách hàng";

  const requireAuthPaths = new Set(["/customer/orders", "/customer/favorites"]);

  const handleNavClick = (e, to) => {
    if (requireAuthPaths.has(to) && !isLoggedIn) {
      e.preventDefault();

      confirmLoginWithModal(
        (path) => navigate(path),
        () => {},
      );
    }

    setMenuOpen(false);
  };

  return (
    <>
      <header
        id="customer_navbar"
        className={`
          header
          header--customer
          ${scrolled || !isHome ? "header--scrolled" : ""}
        `}
      >
        <div className="header-brand">
          <BrandLogo
            as="button"
            className="header-logo-text"
            onClick={() => navigate("/customer")}
            ariaLabel="Về trang Thực đơn"
          />
        </div>

        <ul
          className={`
            header-nav
            ${menuOpen ? "header-nav--open" : ""}
          `}
        >
          {navItems.map((item) => (
            <li key={item.to}>
              {item.newTab ? (
                <a
                  href={item.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  to={item.to}
                  end={Boolean(item.end)}
                  className={({ isActive }) =>
                    `
                    header-nav-link
                    ${isActive ? "header-nav-link--active" : ""}
                  `
                  }
                  onClick={(e) => handleNavClick(e, item.to)}
                >
                  {item.label}

                  {item.to === "/customer/favorites" && favoriteCount > 0 && (
                    <span className="header-nav-count">{favoriteCount}</span>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        <div className="header-actions">
          <button
            type="button"
            className="header-cart-btn"
            onClick={() => setCartOpen(true)}
            aria-label="Giỏ hàng"
            title="Giỏ hàng"
          >
            <FontAwesomeIcon icon={faCartShopping} />

            {cartCount > 0 && (
              <span className="header-cart-badge">{cartCount}</span>
            )}
          </button>

          {isLoggedIn ? (
            <Dropdown
              menu={{
                items: menuItems,
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="user-info">
                {/* Avatar */}

                <div className="user-avatar">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="avatar"
                      className="user-avatar-img"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} />
                  )}
                </div>

                {/* Name */}

                <span className="user-name">{displayName}</span>

                {/* Setting icon */}

                <FontAwesomeIcon icon={faCog} className="dropdown-icon" />
              </div>
            </Dropdown>
          ) : (
            <div className="header-auth-actions">
              <button
                type="button"
                className="user-login-btn"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </button>

              <button
                type="button"
                className="user-register-btn"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className={`
            header-burger
            ${menuOpen ? "header-burger--open" : ""}
          `}
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="menu"
        >
          <span />
          <span />
          <span />
        </button>

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

        <CartModal
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          cartCount={cartCount}
          cartSubtotal={cartSubtotal}
          updateQty={updateCart}
          removeItem={removeItem}
          isLoggedIn={isLoggedIn}
        />
      </header>
    </>
  );
};

export default Header;
