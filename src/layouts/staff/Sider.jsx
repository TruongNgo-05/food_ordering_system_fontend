import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Cập nhật lại danh sách import các icon phù hợp
import {
  faChartLine,
  faUsers,
  faUtensils,
  faBoxesStacked,
  faLayerGroup,
  faTicketAlt,
  faClipboardList,
  faCalendarCheck,
  faImages,
  faTruck,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/Sider.css";
import logo from "../../assets/images/logo.png";

const staffMenuItems = [
  {
    id: 1,
    title: "Dashboard",
    path: "/staff",
    icon: faChartLine,
  },
  {
    id: 2,
    title: "Quản lý kho",
    path: "/staff/inventory",
    icon: faBoxesStacked,
  },
  {
    id: 3,
    title: "Đơn hàng online",
    path: "/staff/orders/online",
    icon: faTruck,
  },
  {
    id: 4,
    title: "Đơn hàng tại nhà hàng",
    path: "/staff/orders/restaurant",
    icon: faStore,
  },
  {
    id: 5,
    title: "Quản lý đặt bàn",
    path: "/staff/table-bookings",
    icon: faCalendarCheck,
  },
];

const Sider = ({ mobileOpen = false, onCloseMobile }) => {
  const location = useLocation();

  return (
    <aside className={`sider ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="sider-content">
        <div className="sider-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">Nhà Hàng NT</span>
        </div>

        <nav className="sider-menu">
          {staffMenuItems.map((item) => (
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
