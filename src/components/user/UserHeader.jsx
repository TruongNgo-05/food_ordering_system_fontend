import React from "react";
import { Button, Space } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const UserHeader = ({ title, description, buttonText, handleAdd, extra }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <div>
        <h1 style={{ marginBottom: 4 }}>{title}</h1>

        <p style={{ margin: 0, color: "#666" }}>{description}</p>
      </div>

      <Space>
        {extra}

        {handleAdd && (
          <Button
            type="primary"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={handleAdd}
          >
            {buttonText || "Thêm"}
          </Button>
        )}
      </Space>
    </div>
  );
};

export default UserHeader;
