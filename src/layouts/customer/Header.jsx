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
import { confirmLoginWithModal } from "../../utils/authGuards";
import { fmt } from "../../constants/customerTheme";

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
  const requireAuthPaths = new Set([
    "/customer/orders",
    "/customer/favorites",
  ]);
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
    return cart.reduce((s, c) => s + (Number(c?.price) || 0) * (c?.qty || 0), 0);
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
          <div className="header-brand-mark">NQT</div>
          <div className="header-brand-text">
            <div className="header-brand-title">Nhà Hàng NQT</div>
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
          {cartCount > 0 && <span className="header-cart-badge">{cartCount}</span>}
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
                  <img src={avatarSrc} alt="avatar" className="user-avatar-img" />
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
            <button className="user-login-btn" onClick={() => navigate("/login")}>
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

      <Modal
        title="Giỏ hàng"
        open={cartOpen}
        onCancel={() => setCartOpen(false)}
        footer={null}
        width={560}
      >
        {cart.length === 0 ? (
          <div style={{ padding: "18px 2px", color: "var(--muted)" }}>
            Giỏ hàng trống. Hãy thêm món bạn thích.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "var(--muted)",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <span>{cartCount} sản phẩm</span>
              <span>Tạm tính: {fmt(cartSubtotal)}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cart.map((it) => (
                <div
                  key={it.item_id}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: 12,
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    background: "var(--surface)",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "var(--primary-100)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      color: "var(--primary-600)",
                      flex: "0 0 auto",
                      overflow: "hidden",
                    }}
                    aria-hidden
                  >
                    {it?.image ? (
                      <img
                        src={it.image}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      "🍽️"
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 900,
                        color: "var(--text)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={it?.name}
                    >
                      {it?.name}
                    </div>
                    <div style={{ color: "var(--muted-2)", fontWeight: 700, fontSize: 13 }}>
                      {fmt(Number(it?.price) || 0)}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => updateQty(it.item_id, -1)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        cursor: "pointer",
                        fontWeight: 900,
                      }}
                      aria-label="Giảm số lượng"
                    >
                      −
                    </button>
                    <span style={{ minWidth: 18, textAlign: "center", fontWeight: 900 }}>
                      {it?.qty || 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(it.item_id, 1)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 10,
                        border: "none",
                        background: "var(--primary)",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 900,
                      }}
                      aria-label="Tăng số lượng"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(it.item_id)}
                      style={{
                        marginLeft: 4,
                        width: 30,
                        height: 30,
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        color: "var(--muted)",
                        cursor: "pointer",
                        fontWeight: 900,
                      }}
                      aria-label="Xóa sản phẩm"
                      title="Xóa"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  navigate("/customer");
                }}
                style={{
                  height: 40,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Tiếp tục chọn món
              </button>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  if (!isLoggedIn) {
                    confirmLoginWithModal(
                      (path) => navigate(path),
                      () => {},
                    );
                    return;
                  }
                  navigate("/customer/carts");
                }}
                style={{
                  height: 40,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: "none",
                  background: "var(--primary)",
                  color: "#fff",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Đặt hàng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </header>
  );
};
export default Header;
