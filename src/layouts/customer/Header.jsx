import React, { useContext, useState, useEffect } from "react";

import { NavLink, useNavigate, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHouse,
  faClipboardList,
  faHeart,
  faNewspaper,
  faHeadset,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../../context/authContext";

import { useCustomerData } from "../../context/CustomerDataContext";

import "../../assets/styles/Header.css";

import CartModal from "../../components/user/CartModal";
import BrandLogo from "../../components/common/BrandLogo";
import UserProfileMenu from "../../components/common/UserProfileMenu";

import { confirmLoginWithModal } from "../../utils/authGuards";

const navItems = [
  {
    to: "/home",
    label: "Trang chủ",
    icon: faHouse,
    end: true,
  },

  {
    to: "/orders",
    label: "Đơn hàng",
    icon: faClipboardList,
  },

  {
    to: "/favorites",
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
    to: "/support",
    label: "Hỗ trợ",
    icon: faHeadset,
  },
];

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isHome = pathname === "/home" || pathname === "/home/";

  const { isLoggedIn } = useContext(AuthContext);

  const {
    cart,
    cartCount,
    favoriteCount,
    cartSubtotal,
    updateCart,
    removeItem,
  } = useCustomerData();

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

  const requireAuthPaths = new Set(["/orders", "/favorites"]);

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
        {/* Logo */}
        <BrandLogo
          as="button"
          className="header-logo-text"
          onClick={() => navigate("/home")}
        />

        {/* Navigation */}
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
                  <FontAwesomeIcon icon={item.icon} />

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
                  <FontAwesomeIcon icon={item.icon} />

                  {item.label}

                  {item.to === "/favorites" && favoriteCount > 0 && (
                    <span className="header-nav-count">{favoriteCount}</span>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="header-actions">
          {/* Cart */}
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

          {/* User */}
          {isLoggedIn ? (
            <UserProfileMenu
              fallbackName="Khách hàng"
              className="header-user-menu"
            />
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

        {/* Mobile menu */}
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

        {/* Cart Modal */}
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
