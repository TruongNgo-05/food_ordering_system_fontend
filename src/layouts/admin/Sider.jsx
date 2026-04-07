import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faUsers } from "@fortawesome/free-solid-svg-icons";
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
    title: "Quản lý ",
    path: "/admin/1",
    icon: faUsers,
  },
];

const Sider = () => {
  const location = useLocation();

  return (
    <aside className="sider">
      <div className="sider-content">
        <div className="sider-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">Project</span>
        </div>

        <nav className="sider-menu">
          {adminMenuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
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
