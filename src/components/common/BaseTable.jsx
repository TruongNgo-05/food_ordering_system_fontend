import React from "react";
import { Table } from "antd";

const BaseTable = ({ columns, data, loading }) => {
  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
      bordered
    />
  );
};

export default BaseTable;
