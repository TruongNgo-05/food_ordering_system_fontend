import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/Header.css";
import UserProfileMenu from "../../components/common/UserProfileMenu";

const Header = ({ onMenuToggle }) => {
  return (
    <header className="header header--admin">
      <div className="header-left">
        <button
          className="menu-toggle-btn"
          onClick={onMenuToggle}
          aria-label="Mở menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <div className="header-right">
        <UserProfileMenu fallbackName="Admin" />
      </div>
    </header>
  );
};

export default Header;
