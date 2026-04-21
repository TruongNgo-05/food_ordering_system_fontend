import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import "../../assets/styles/Layouts.css";
const CustomerLayout = () => {
  return (
    <div className="layout layout--no-sider">
      <div className="main-content">
        <Header />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
