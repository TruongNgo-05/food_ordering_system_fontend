import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Sider from "./Sider";
import "../../assets/styles/Layouts.css";
const CustomerLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="layout">
      <Sider
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      {mobileMenuOpen ? (
        <button
          className="layout-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Đóng menu"
        />
      ) : null}
      <div className="main-content">
        <Header onMenuToggle={() => setMobileMenuOpen((prev) => !prev)} />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
