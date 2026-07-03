import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUsers,
  faUtensils,
  faLayerGroup,
  faTicketAlt,
  faClipboardList,
  faImages,
  faStar,
  faTable,
  faNewspaper,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/Sider.css";
import logo from "../../assets/images/logo.png";

const adminMenuItems = [
  {
    id: 1,
    title: "Dashboard",
    path: "/admin",
    icon: faChartLine,
  },
  {
    id: 2,
    title: "Quản lý người dùng",
    path: "/admin/user",
    icon: faUsers,
  },
  {
    id: 3,
    title: "Quản lý món ăn",
    path: "/admin/foods",
    icon: faUtensils,
  },
  {
    id: 4,
    title: "Quản lý danh mục",
    path: "/admin/categories",
    icon: faLayerGroup,
  },
  {
    id: 5,
    title: "Quản lý khuyến mãi",
    path: "/admin/vouchers",
    icon: faTicketAlt,
  },
  {
    id: 6,
    title: "Quản lý banner",
    path: "/admin/banners",
    icon: faImages,
  },
  {
    id: 7,
    title: "Quản lý Bàn",
    path: "/admin/tables",
    icon: faTable,
  },
  {
    id: 8,
    title: "Quản lý đánh giá",
    path: "/admin/reviews",
    icon: faStar,
  },
  {
    id: 9,
    title: "Quản lý Blog",
    path: "/admin/blog",
    icon: faNewspaper,
  },
  {
    id: 10,
    title: "Quản lý hỗ trợ",
    path: "/admin/support",
    icon: faHeadset,
  },
  {
    id: 11,
    title: "Xem đơn hàng",
    path: "/admin/orders",
    icon: faClipboardList,
  },
];

const Sider = ({ mobileOpen = false, onCloseMobile }) => {
  const location = useLocation();

  return (
    <aside className={`sider ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="sider-content">
        <div className="sider-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">Jler Sky Restaurant</span>
        </div>

        <nav className="sider-menu">
          {adminMenuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => {
                if (window.innerWidth <= 1024) onCloseMobile?.();
              }}
            >
              <span className="menu-icon">
                <FontAwesomeIcon icon={item.icon} />
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
