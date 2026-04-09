import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Sider from "./Sider";
const CustomerLayout = () => {
  return (
    <div className="layout">
      <Sider />
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
