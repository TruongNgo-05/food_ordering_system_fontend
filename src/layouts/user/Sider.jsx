import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/Sider.css";
import logo from "../../assets/images/logo.png";

const userMenuItems = [
  {
    id: 1,
    title: "Dashboard",
    path: "/user",
    icon: faChartLine,
  },
  {
    id: 2,
    title: "1",
    path: "/user/1",
    icon: faClipboardList,
  },
  {
    id: 3,
    title: "2",
    path: "/user/2",
    icon: faClipboardList,
  },
  {
    id: 4,
    title: "3",
    path: "/user/3",
    icon: faClipboardList,
  },
  {
    id: 5,
    title: "4",
    path: "/user4",
    icon: faClipboardList,
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
          {userMenuItems.map((item) => (
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
