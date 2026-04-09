import React from "react";
import "../../assets/styles/AdminPages.css";
import UserHeader from "../user/UserHeader";
import CommonStats from "../common/CommonStats";

const AdminPageSection = ({
  title,
  subtitle,
  stats = [],
  actionLabel,
  onAddClick,
  topControls,
  table,
  pagination,
}) => {
  return (
    <section className="admin-page">
      <div className="admin-hero">
        <UserHeader title={title} description={subtitle} />
      </div>

      <CommonStats stats={stats} />

      <div className="admin-topbar">
        <div className="admin-topbar-controls">{topControls}</div>
        {actionLabel ? (
          <button className="admin-button" onClick={onAddClick}>
            {actionLabel}
          </button>
        ) : null}
      </div>

      <div className="admin-table-wrap">{table}</div>
      {pagination}
    </section>
  );
};

export default AdminPageSection;
