import React, {
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

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

import cartService from "../../services/customer/cartService";

import favoriteService from "../../services/customer/favoriteService";

import "../../assets/styles/Header.css";

import { toast } from "react-toastify";

import Capnhatthongtin from "../../components/modal/auth/Capnhatthongtin";

import Capnhatmatkhau from "../../components/modal/auth/Capnhatmatkhau";

import CartModal from "../../components/user/CartModal";
import BrandLogo from "../../components/common/BrandLogo";

import { confirmLoginWithModal } from "../../utils/authGuards";

const CART_UPDATED_EVENT = "cart-updated-event";

const navItems = [
  { to: "/customer", label: "Thực đơn", icon: faHouse, end: true },

  { to: "/customer/orders", label: "Đơn hàng", icon: faClipboardList },

  { to: "/customer/favorites", label: "Yêu thích", icon: faHeart },

  {
    to: "/nhahangnqt",

    label: "Blog nhà hàng",

    icon: faNewspaper,

    newTab: true,
  },

  { to: "/customer/support", label: "Hỗ trợ", icon: faHeadset },

  { to: "/customer/table-qr-samples", label: "QR Bàn", icon: faQrcode },
];

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/customer" || pathname === "/customer/";

  const { isLoggedIn, logout, userFullName, refreshUser, user } =
    useContext(AuthContext);

  const IMG_URL = import.meta.env.VITE_IMG_URL;

  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${IMG_URL}${user.avatar}`
    : "";
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);

    window.addEventListener("scroll", fn);

    return () => window.removeEventListener("scroll", fn);
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

  const displayName = userFullName || "Khách hàng";

  const requireAuthPaths = new Set(["/customer/orders", "/customer/favorites"]);

  const [cartOpen, setCartOpen] = useState(false);

  const [cart, setCart] = useState([]);

  const [loadingCart, setLoadingCart] = useState(false);

  const [favorites, setFavorites] = useState([]);

  const [loadingFavorites, setLoadingFavorites] = useState(false);
  useEffect(() => {
    const loadCart = async () => {
      // Chưa đăng nhập không gọi API cart
      if (!isLoggedIn) {
        setCart([]);
        return;
      }

      try {
        setLoadingCart(true);

        const res = await cartService.getCart();

        const data = res.data?.data;

        const mapped = (data?.items || []).map((i) => ({
          item_id: i.itemId,
          name: i.foodName,
          price: i.price,
          image: i.image,
          qty: i.quantity,
        }));

        setCart(mapped);
      } catch (err) {
        console.error("Load cart error:", err);

        setCart([]);
      } finally {
        setLoadingCart(false);
      }
    };

    loadCart();

    window.addEventListener(CART_UPDATED_EVENT, loadCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, loadCart);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoadingFavorites(true);

        const res = await favoriteService.getMyFavorite();

        const data = res.data?.data;

        const favIds = Array.isArray(data)
          ? data.map((item) => item.foodId || item.id)
          : [];

        setFavorites(favIds);
      } catch (err) {
        console.error("Load favorites error:", err);

        setFavorites([]);
      } finally {
        setLoadingFavorites(false);
      }
    };

    if (isLoggedIn) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [isLoggedIn]);

  const cartCount = useMemo(() => {
    return cart.reduce((s, c) => s + (c?.qty || 0), 0);
  }, [cart]);

  const favCount = useMemo(() => {
    return Array.isArray(favorites) ? favorites.length : 0;
  }, [favorites]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce(
      (s, c) => s + (Number(c?.price) || 0) * (c?.qty || 0),

      0,
    );
  }, [cart]);

  const updateCart = useCallback(
    async (id, delta) => {
      if (!isLoggedIn) {
        return;
      }
      try {
        const item = cart.find((c) => c.item_id === id);

        if (!item) return;

        const newQty = Math.max(0, (item.qty || 0) + delta);

        if (newQty <= 0) {
          await cartService.deleteCart(id);
        } else {
          await cartService.updateCart(id, { quantity: newQty });
        }

        const res = await cartService.getCart();

        const data = res.data?.data;

        const mapped = (data?.items || []).map((i) => ({
          item_id: i.itemId,

          name: i.foodName,

          price: i.price,

          image: i.image,

          qty: i.quantity,
        }));

        setCart(mapped);
      } catch (err) {
        console.error("Update cart error:", err);

        toast.error("Cập nhật giỏ hàng thất bại");
      }
    },

    [cart, , isLoggedIn],
  );

  const removeItem = useCallback(
    async (id) => {
      if (!isLoggedIn) {
        return;
      }
      try {
        await cartService.deleteCart(id);

        const res = await cartService.getCart();

        const data = res.data?.data;

        const mapped = (data?.items || []).map((i) => ({
          item_id: i.itemId,

          name: i.foodName,

          price: i.price,

          image: i.image,

          qty: i.quantity,
        }));

        setCart(mapped);
      } catch (err) {
        console.error("Remove cart item error:", err);

        toast.error("Xóa món thất bại");
      }
    },
    [isLoggedIn],
  );

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
    <header
      id="customer_navbar"
      className={`header header--customer ${scrolled || !isHome ? "header--scrolled" : ""}`}
    >
      <div className="header-brand">
        <BrandLogo
          as="button"
          className="header-logo-text"
          onClick={() => navigate("/customer")}
          ariaLabel="Về trang Thực đơn"
        />
      </div>

      <ul className={`header-nav ${menuOpen ? "header-nav--open" : ""}`}>
        {navItems.map((it) => (
          <li key={it.to}>
            {it.newTab ? (
              <a
                href={it.to}
                target="_blank"
                rel="noopener noreferrer"
                className="header-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {it.label}
              </a>
            ) : (
              <NavLink
                to={it.to}
                end={Boolean(it.end)}
                className={({ isActive }) =>
                  `header-nav-link ${isActive ? "header-nav-link--active" : ""}`
                }
                onClick={(e) => handleNavClick(e, it.to)}
              >
                {it.label}

                {it.to === "/customer/favorites" && favCount > 0 && (
                  <span className="header-nav-count">{favCount}</span>
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
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )}
              </div>

              <span className="user-name">{displayName}</span>

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
        className={`header-burger ${menuOpen ? "header-burger--open" : ""}`}
        onClick={() => setMenuOpen((v) => !v)}
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
  );
};

export default Header;
