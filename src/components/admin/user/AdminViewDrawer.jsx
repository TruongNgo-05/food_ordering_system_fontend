import React from "react";
import { Drawer } from "antd";

const AdminViewDrawer = ({ title, open, onClose, fields, width = 420 }) => {
  return (
    <Drawer
      title={title}
      placement="right"
      size="default"
      styles={{ body: { width } }}
      open={open}
      onClose={onClose}
      className="admin-view-drawer"
    >
      <div className="admin-view-drawer-body">
        {(fields || []).map((field) => (
          <div className="admin-view-item" key={field.label}>
            <p className="admin-view-label">{field.label}</p>
            <p className="admin-view-value">{field.value ?? "-"}</p>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default AdminViewDrawer;
