import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Cập nhật lại danh sách import các icon phù hợp
import {
  faHouse,
  faCartShopping,
  faClipboardList,
  faHeart,
  faHeadset,
  faUser,
  faCog,
  faKey,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/Sider.css";
import logo from "../../assets/images/logo.png";

const adminMenuItems = [
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

  return (
    <aside className="sider">
      <div className="sider-content">
        <div className="sider-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">Nhà Hàng NQT</span>
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
// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faHouse,
//   faCartShopping,
//   faClipboardList,
//   faHeart,
//   faHeadset,
// } from "@fortawesome/free-solid-svg-icons";
// import logo from "../../assets/images/logo.png";
// import "../../assets/styles/Sider.css";

// const menuItems = [
//   { id: 1, title: "Thực Đơn", path: "/customer", icon: faHouse },
//   { id: 2, title: "Giỏ hàng", path: "/customer/carts", icon: faCartShopping },
//   { id: 3, title: "Đơn hàng", path: "/customer/orders", icon: faClipboardList },
//   { id: 4, title: "Yêu Thích", path: "/customer/favorites", icon: faHeart },
//   { id: 5, title: "Hỗ Trợ", path: "/customer/support", icon: faHeadset },
// ];

// const Sider = ({ cartCount }) => {
//   const location = useLocation();

//   return (
//     <aside className="sider">
//       <div className="sider-content">
//         {/* Logo */}
//         <div className="sider-logo">
//           <img src={logo} alt="Logo" className="logo-img" />
//           <span className="logo-text">Nhà Hàng NQT</span>
//         </div>

//         {/* Nav */}
//         <nav className="sider-menu">
//           {menuItems.map((item) => (
//             <Link
//               key={item.id}
//               to={item.path}
//               className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
//             >
//               <span className="menu-icon" style={{ position: "relative" }}>
//                 <FontAwesomeIcon icon={item.icon} />
//                 {/* Badge số lượng giỏ hàng */}
//                 {item.id === 2 && cartCount > 0 && (
//                   <span
//                     style={{
//                       position: "absolute",
//                       top: -6,
//                       right: -8,
//                       background: "#FF6B35",
//                       color: "#fff",
//                       fontSize: 9,
//                       fontWeight: 800,
//                       minWidth: 15,
//                       height: 15,
//                       borderRadius: 99,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       padding: "0 2px",
//                     }}
//                   >
//                     {cartCount}
//                   </span>
//                 )}
//               </span>
//               <span className="menu-text">{item.title}</span>
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default Sider;
