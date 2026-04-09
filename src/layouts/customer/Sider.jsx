import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCartShopping,
  faClipboardList,
  faHeart,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/Sider.css";
import logo from "../../assets/images/logo.png";

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
];
const Sider = () => {
  const location = useLocation();

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

    // Initial sync + keep badges live without forcing page clicks
    syncBadges();
    const timer = setInterval(syncBadges, 500);
    window.addEventListener("focus", syncBadges);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", syncBadges);
    };
  }, [location.pathname]);

  return (
    <aside className="sider">
      <div className="sider-content">
        <div className="sider-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">Nhà Hàng NQT</span>
        </div>

        <nav className="sider-menu">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
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
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sider;
