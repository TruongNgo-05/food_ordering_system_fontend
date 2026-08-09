import React from "react";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import "../../assets/styles/Layouts.css";
const CustomerLayout = () => {
  const location = useLocation();
  const isHomeRoute =
    location.pathname === "/home" || location.pathname === "/home/";

  return (
    <div className="layout layout--no-sider layout--customer">
      <div className="main-content">
        {!isHomeRoute && <Header />}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
