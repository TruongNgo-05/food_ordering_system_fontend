import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
const CustomerLayout = () => {
  return (
    <div className="customer-layout">
      <Header />
      <div className="customer-content">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerLayout;
