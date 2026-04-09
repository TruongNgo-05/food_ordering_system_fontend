import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCartShopping,
  faClipboardList,
  faHeart,
  faHeadset,
  faQrcode,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/Sider.css";
import logo from "../../assets/images/logo.png";
import { confirmLoginWithToast } from "../../utils/authGuards";
import { useAuth } from "../../hooks/useAuth";

const CUSTOMER_DATA_UPDATED_EVENT = "customer-data-updated";

const menuItems = [
  {
    id: 1,
    title: "Thực Đơn",
    path: "/customer",
    icon: faHouse,
  },
  {
    id: 2,
    title: "Giỏ hàng",
    path: "/customer/carts",
    icon: faCartShopping,
  },
  {
    id: 3,
    title: "Đơn hàng",
    path: "/customer/orders",
    icon: faClipboardList,
  },
  {
    id: 4,
    title: "Yêu Thích",
    path: "/customer/favorites",
    icon: faHeart,
  },
  {
    id: 5,
    title: "Hỗ Trợ",
    path: "/customer/support",
    icon: faHeadset,
  },
  {
    id: 6,
    title: "QR Bàn",
    path: "/customer/table-qr-samples",
    icon: faQrcode,
  },
];
const Sider = ({ mobileOpen = false, onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [cartCount, setCartCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    const syncBadges = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        const cart = savedCart ? JSON.parse(savedCart) : [];
        const nextCartCount = Array.isArray(cart)
          ? cart.reduce((s, c) => s + (c?.qty || 0), 0)
          : 0;
        setCartCount(nextCartCount);
      } catch {
        setCartCount(0);
      }

      try {
        const savedFav = localStorage.getItem("favorites");
        const favorites = savedFav ? JSON.parse(savedFav) : [];
        setFavoriteCount(Array.isArray(favorites) ? favorites.length : 0);
      } catch {
        setFavoriteCount(0);
      }
    };

    syncBadges();
    window.addEventListener("focus", syncBadges);
    window.addEventListener("storage", syncBadges);
    window.addEventListener(CUSTOMER_DATA_UPDATED_EVENT, syncBadges);
    return () => {
      window.removeEventListener("focus", syncBadges);
      window.removeEventListener("storage", syncBadges);
      window.removeEventListener(CUSTOMER_DATA_UPDATED_EVENT, syncBadges);
    };
  }, [location.pathname]);

  const handleMenuClick = (event, item) => {
    const requireAuth = [2, 3, 4].includes(item.id); // cart, orders, favorites
    if (requireAuth && !isLoggedIn) {
      event.preventDefault();
      if (window.innerWidth <= 1024) onCloseMobile?.();
      confirmLoginWithToast(
        (path) => navigate(path),
        () => {},
      );
      return;
    }

    if (window.innerWidth <= 1024) onCloseMobile?.();
    if (location.pathname === item.path) return;
    navigate(item.path);
  };

  return (
    <aside className={`sider ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="sider-content">
        <div className="sider-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">Nhà Hàng NQT</span>
        </div>

        <nav className="sider-menu">
          {menuItems.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={(event) => handleMenuClick(event, item)}
            >
              <span className="menu-icon" style={{ position: "relative" }}>
                <FontAwesomeIcon icon={item.icon} />
                {item.id === 2 && cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -10,
                      background: "#FF6B35",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 800,
                      minWidth: 16,
                      height: 16,
                      borderRadius: 99,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 4px",
                      boxShadow: "0 6px 14px rgba(0,0,0,.14)",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
                {item.id === 4 && favoriteCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -10,
                      background: "#EC4899",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 800,
                      minWidth: 16,
                      height: 16,
                      borderRadius: 99,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 4px",
                      boxShadow: "0 6px 14px rgba(0,0,0,.14)",
                    }}
                  >
                    {favoriteCount}
                  </span>
                )}
              </span>
              <span className="menu-text">{item.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sider;
