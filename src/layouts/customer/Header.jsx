// import React, { useContext, useState } from "react";
// import { NavLink } from "react-router-dom";
// import { Dropdown, message } from "antd";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faHouse,
//   faCartShopping,
//   faClipboardList,
//   faHeart,
//   faHeadset,
//   faUser,
//   faCog,
//   faKey,
//   faSignOutAlt,
// } from "@fortawesome/free-solid-svg-icons";
// import { faSearch } from "@fortawesome/free-solid-svg-icons";

// // Context & Services
// import { AuthContext } from "../../context/AuthContext";
// import {
//   updateProfileApi,
//   changePasswordApi,
// } from "../../services/userService";

// // Components
// import Capnhatthongtin from "../../components/modal/auth/Capnhatthongtin";
// import Capnhatmatkhau from "../../components/modal/auth/Capnhatmatkhau";
// import { toast } from "react-toastify";

// // Assets
// import "../../assets/styles/HeaderCustomer.css";
// import logo from "../../assets/images/logo.png";

// const Header = () => {
//   const { logout, userFullName, refreshUser, user } = useContext(AuthContext);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

//   // Danh sách menu điều hướng bên trái
//   const navMenuItems = [
//     { title: "Trang chủ", path: "/customer", icon: faHouse },
//     { title: "Giỏ hàng", path: "/customer/carts", icon: faCartShopping },
//     { title: "Đơn hàng", path: "/customer/orders", icon: faClipboardList },
//     { title: "Yêu thích", path: "/customer/favorites", icon: faHeart },
//     { title: "Hỗ trợ", path: "/customer/support", icon: faHeadset },
//   ];

//   // Logic xử lý Profile/Password/Logout
//   const handleProfileUpdate = async (values) => {
//     try {
//       const [firstName, ...lastNameParts] = values.fullName.trim().split(" ");
//       const lastName = lastNameParts.join(" ") || "";
//       const updateData = { firstName, lastName, email: values.email };
//       await updateProfileApi(updateData);
//       toast.success("Cập nhật thông tin thành công!");
//       await refreshUser();
//     } catch (error) {
//       const msg = error.response?.data?.message || "Cập nhật thất bại!";
//       toast.error(msg);
//       throw new Error(msg);
//     }
//   };

//   const handleChangePassword = async (values) => {
//     try {
//       await changePasswordApi({
//         password: values.currentPassword,
//         newPassword: values.newPassword,
//       });
//       toast.success("Đổi mật khẩu thành công!");
//       setIsPasswordModalOpen(false);
//     } catch (error) {
//       const msg = error.response?.data?.message || "Đổi mật khẩu thất bại!";
//       toast.error(msg);
//       throw new Error(msg);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("userInfo");
//     localStorage.removeItem("accessToken");
//     logout();
//     message.success("Đăng xuất thành công!");
//     window.location.href = "/";
//   };

//   // Menu cho Dropdown Ant Design
//   const userDropdownItems = [
//     {
//       key: "profile",
//       icon: <FontAwesomeIcon icon={faUser} />,
//       label: "Cập nhật thông tin",
//       onClick: () => setIsModalOpen(true),
//     },
//     {
//       key: "password",
//       icon: <FontAwesomeIcon icon={faKey} />,
//       label: "Đổi mật khẩu",
//       onClick: () => setIsPasswordModalOpen(true),
//     },
//     { type: "divider" },
//     {
//       key: "logout",
//       icon: <FontAwesomeIcon icon={faSignOutAlt} />,
//       label: "Đăng xuất",
//       danger: true,
//       onClick: handleLogout,
//     },
//   ];

//   const displayName = userFullName || "Khách hàng";

//   return (
//     <header className="customer-header">
//       {/* Logo */}
//       <div className="customer-header-logo">
//         <img src={logo} alt="logo" />
//         <span>Nhà Hàng NQT</span>
//       </div>

//       {/* SEARCH */}
//       <div className="customer-header-search">
//         <FontAwesomeIcon icon={faSearch} />
//         <input placeholder="Tìm món ăn, nhà hàng..." />
//       </div>

//       {/* MENU */}
//       <nav className="customer-header-menu">
//         {navMenuItems.map((item, index) => (
//           <NavLink
//             key={index}
//             to={item.path}
//             className={({ isActive }) =>
//               isActive ? "customer-menu-item active" : "customer-menu-item"
//             }
//           >
//             <FontAwesomeIcon icon={item.icon} />
//             <span>{item.title}</span>
//           </NavLink>
//         ))}
//       </nav>

//       {/* USER */}
//       <div className="customer-header-right">
//         <Dropdown
//           menu={{ items: userDropdownItems }}
//           trigger={["click"]}
//           placement="bottomRight"
//         >
//           <div className="customer-user-info" style={{ cursor: "pointer" }}>
//             <div className="customer-user-avatar">
//               <FontAwesomeIcon icon={faUser} />
//             </div>

//             <span className="customer-user-name">{displayName}</span>

//             <FontAwesomeIcon icon={faCog} className="customer-dropdown-icon" />
//           </div>
//         </Dropdown>
//       </div>
//     </header>
//   );
// };
// export default Header;
// //monie
// import React, { useContext } from "react";
// import { Dropdown, message } from "antd";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faCog,
//   faKey,
//   faSignOutAlt,
// } from "@fortawesome/free-solid-svg-icons";
// import { AuthContext } from "../../context/AuthContext";
// import {
//   updateProfileApi,
//   changePasswordApi,
// } from "../../services/userService";
// import "../../assets/styles/Header.css";
// import { toast } from "react-toastify";
// import Capnhatthongtin from "../../components/modal/auth/Capnhatthongtin";
// import Capnhatmatkhau from "../../components/modal/auth/Capnhatmatkhau";

// const Header = () => {
//   const { logout, userFullName, refreshUser, user } = useContext(AuthContext);
//   const [isModalOpen, setIsModalOpen] = React.useState(false);
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);

//   const handleProfileUpdate = async (values) => {
//     try {
//       const [firstName, ...lastNameParts] = values.fullName.trim().split(" ");
//       const lastName = lastNameParts.join(" ") || "";
//       const updateData = {
//         firstName,
//         lastName,
//         email: values.email,
//       };
//       await updateProfileApi(updateData);
//       toast.success("Cập nhật thông tin thành công!");
//       await refreshUser();
//     } catch (error) {
//       const msg = error.response?.data?.message || "Email đã tồn tại!";
//       toast.error(msg);
//       throw new Error(msg);
//     }
//   };

//   const handleChangePassword = async (values) => {
//     try {
//       await changePasswordApi({
//         password: values.currentPassword,
//         newPassword: values.newPassword,
//       });
//     } catch (error) {
//       const msg = error.response?.data?.message || "Đổi mật khẩu thất bại!";

//       throw new Error(msg);
//     }
//   };

//   const handleLogout = () => {
//     // Xóa tất cả thông tin user trong localStorage
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("userInfo");
//     localStorage.removeItem("accessToken");

//     // Gọi logout từ AuthContext để cập nhật state
//     logout();

//     message.success("Đăng xuất thành công!");
//     // Chuyển về trang login
//     window.location.href = "/";
//   };

//   const menuItems = [
//     {
//       key: "profile",
//       icon: <FontAwesomeIcon icon={faUser} />,
//       label: "Cập nhật thông tin",
//       onClick: () => setIsModalOpen(true),
//     },
//     {
//       key: "password",
//       icon: <FontAwesomeIcon icon={faKey} />,
//       label: "Đổi mật khẩu",
//       onClick: () => setIsPasswordModalOpen(true),
//     },
//     {
//       type: "divider",
//     },
//     {
//       key: "logout",
//       icon: <FontAwesomeIcon icon={faSignOutAlt} />,
//       label: "Đăng xuất",
//       danger: true,
//       onClick: handleLogout,
//     },
//   ];

//   const displayName = userFullName || "Admin";

//   return (
//     <header className="header">
//       <div className="header-left"></div>

//       <div className="header-right">
//         <Dropdown
//           menu={{ items: menuItems }}
//           trigger={["click"]}
//           placement="bottomRight"
//         >
//           <div className="user-info">
//             <div className="user-avatar">
//               <FontAwesomeIcon icon={faUser} />
//             </div>
//             <span className="user-name">{displayName}</span>
//             <FontAwesomeIcon icon={faCog} className="dropdown-icon" />
//           </div>
//         </Dropdown>
//         <Capnhatthongtin
//           open={isModalOpen}
//           onCancel={() => setIsModalOpen(false)}
//           onUpdate={handleProfileUpdate}
//           user={user}
//         />
//         <Capnhatmatkhau
//           open={isPasswordModalOpen}
//           onCancel={() => setIsPasswordModalOpen(false)}
//           onChangePassword={handleChangePassword}
//         />
//       </div>
//     </header>
//   );
// };
// export default Header;
import React, { useContext } from "react";
import { Dropdown, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCog,
  faKey,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import {
  updateProfileApi,
  changePasswordApi,
} from "../../services/userService";
import "../../assets/styles/Header.css";
import { toast } from "react-toastify";
import Capnhatthongtin from "../../components/modal/auth/Capnhatthongtin";
import Capnhatmatkhau from "../../components/modal/auth/Capnhatmatkhau";

const Header = () => {
  const { logout, userFullName, refreshUser, user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);

  const handleProfileUpdate = async (values) => {
    try {
      const [firstName, ...lastNameParts] = values.fullName.trim().split(" ");
      const lastName = lastNameParts.join(" ") || "";
      const updateData = {
        firstName,
        lastName,
        email: values.email,
      };
      await updateProfileApi(updateData);
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
    // Chuyển về trang login
    window.location.href = "/";
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

  const displayName = userFullName || "Admin";

  return (
    <header className="header">
      <div className="header-left"></div>

      <div className="header-right">
        <Dropdown
          menu={{ items: menuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="user-info">
            <div className="user-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <span className="user-name">{displayName}</span>
            <FontAwesomeIcon icon={faCog} className="dropdown-icon" />
          </div>
        </Dropdown>
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
    </header>
  );
};
export default Header;
