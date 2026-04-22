import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Dropdown, Modal, message } from "antd";
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
import "../../assets/styles/Header.css";
import { toast } from "react-toastify";
import Capnhatthongtin from "../../components/modal/auth/Capnhatthongtin";
import Capnhatmatkhau from "../../components/modal/auth/Capnhatmatkhau";
import CartModal from "../../components/user/CartModal";
import { confirmLoginWithModal } from "../../utils/authGuards";
import { fmt } from "../../constants/customerTheme";
import logo from "../../assets/images/logo.png";

const navItems = [
  { to: "/customer", label: "Thực đơn", icon: faHouse, end: true },
  { to: "/customer/orders", label: "Đơn hàng", icon: faClipboardList },
  { to: "/customer/favorites", label: "Yêu thích", icon: faHeart },
  { to: "/customer/blog", label: "Blog", icon: faNewspaper },
  { to: "/customer/support", label: "Hỗ trợ", icon: faHeadset },
  { to: "/customer/table-qr-samples", label: "QR Bàn", icon: faQrcode },
];

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, userFullName, refreshUser, user } =
    useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);

  const handleProfileUpdate = async (values) => {
    try {
      const firstName = values.firstName || "";
      const lastName = values.lastName || "";
      const updateData = {
        firstName,
        lastName,
        email: values.email,
      };
      await updateProfileApi(updateData);
      if (values.avatar) {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : {};
        const nextUser = { ...parsedUser, avatar: values.avatar };
        localStorage.setItem("user", JSON.stringify(nextUser));
        localStorage.setItem("userInfo", JSON.stringify(nextUser));
      }
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
    // Xóa tất cả thông tin user trong localStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");

    // Gọi logout từ AuthContext để cập nhật state
    logout();

    message.success("Đăng xuất thành công!");
    // Chuyển về trang customer
    navigate("/customer");
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
  const avatarSrc = user?.avatar || "";
  const requireAuthPaths = new Set(["/customer/orders", "/customer/favorites"]);
  const CUSTOMER_DATA_UPDATED_EVENT = "customer-data-updated";

  const [cartOpen, setCartOpen] = React.useState(false);
  const [cart, setCart] = React.useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = React.useState(() => {
    try {
      const saved = localStorage.getItem("favorites");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    const syncCart = () => {
      try {
        const saved = localStorage.getItem("cart");
        const parsed = saved ? JSON.parse(saved) : [];
        setCart(Array.isArray(parsed) ? parsed : []);
      } catch {
        setCart([]);
      }
    };
    syncCart();
    window.addEventListener("focus", syncCart);
    window.addEventListener("storage", syncCart);
    window.addEventListener(CUSTOMER_DATA_UPDATED_EVENT, syncCart);
    return () => {
      window.removeEventListener("focus", syncCart);
      window.removeEventListener("storage", syncCart);
      window.removeEventListener(CUSTOMER_DATA_UPDATED_EVENT, syncCart);
    };
  }, []);

  React.useEffect(() => {
    const syncFav = () => {
      try {
        const saved = localStorage.getItem("favorites");
        const parsed = saved ? JSON.parse(saved) : [];
        setFavorites(Array.isArray(parsed) ? parsed : []);
      } catch {
        setFavorites([]);
      }
    };
    syncFav();
    window.addEventListener("focus", syncFav);
    window.addEventListener("storage", syncFav);
    window.addEventListener(CUSTOMER_DATA_UPDATED_EVENT, syncFav);
    return () => {
      window.removeEventListener("focus", syncFav);
      window.removeEventListener("storage", syncFav);
      window.removeEventListener(CUSTOMER_DATA_UPDATED_EVENT, syncFav);
    };
  }, []);

  const cartCount = React.useMemo(() => {
    return cart.reduce((s, c) => s + (c?.qty || 0), 0);
  }, [cart]);

  const favCount = React.useMemo(() => {
    return Array.isArray(favorites) ? favorites.length : 0;
  }, [favorites]);

  const cartSubtotal = React.useMemo(() => {
    return cart.reduce(
      (s, c) => s + (Number(c?.price) || 0) * (c?.qty || 0),
      0,
    );
  }, [cart]);

  const persistCart = (nextCart) => {
    setCart(nextCart);
    localStorage.setItem("cart", JSON.stringify(nextCart));
    window.dispatchEvent(new Event(CUSTOMER_DATA_UPDATED_EVENT));
  };

  const updateQty = (id, delta) => {
    const next = cart
      .map((c) =>
        c.item_id === id ? { ...c, qty: Math.max(0, (c.qty || 0) + delta) } : c,
      )
      .filter((c) => (c?.qty || 0) > 0);
    persistCart(next);
  };

  const removeItem = (id) => {
    const next = cart.filter((c) => c.item_id !== id);
    persistCart(next);
  };

  return (
    <header className="header header--customer">
      <div className="header-left">
        <div
          className="header-brand"
          role="button"
          tabIndex={0}
          onClick={() => navigate("/customer")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate("/customer");
          }}
          aria-label="Về trang Thực đơn"
        >
          <div className="header-brand-mark">
            <img src={logo} alt="logo" />
          </div>
          <div className="header-brand-text">
            <div className="header-brand-title">Nhà Hàng NT</div>
            <div className="header-brand-sub">Food ordering</div>
          </div>
        </div>

        <nav className="header-nav" aria-label="Điều hướng">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={Boolean(it.end)}
              className={({ isActive }) =>
                `header-nav-item ${isActive ? "active" : ""}`
              }
              onClick={(e) => {
                if (requireAuthPaths.has(it.to) && !isLoggedIn) {
                  e.preventDefault();
                  confirmLoginWithModal(
                    (path) => navigate(path),
                    () => {},
                  );
                }
              }}
            >
              <span className="header-nav-icon-wrap">
                <FontAwesomeIcon icon={it.icon} />
                {it.to === "/customer/favorites" && favCount > 0 && (
                  <span className="header-nav-badge">{favCount}</span>
                )}
              </span>
              <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="header-right">
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
              className="user-login-btn"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
            <button
              className="user-register-btn"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </button>
          </div>
        )}
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

      <CartModal
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        updateQty={updateQty}
        removeItem={removeItem}
        isLoggedIn={isLoggedIn}
      />
    </header>
  );
};
export default Header;
