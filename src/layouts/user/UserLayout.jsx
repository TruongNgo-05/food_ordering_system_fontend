import React from "react";
import Header from "../Header";
import Sider from "./Sider";
import { Outlet } from "react-router-dom";
const UserLayout = () => {
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
export default UserLayout;