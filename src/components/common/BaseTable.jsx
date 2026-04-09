import React from "react";
import { Table } from "antd";

const BaseTable = ({ columns, data, loading }) => {
  const normalizedColumns = React.useMemo(
    () =>
      (columns || []).map((col) =>
        col?.title === "Thao tác"
          ? { ...col, align: col.align || "center" }
          : col,
      ),
    [columns],
  );

  return (
    <Table
      rowKey="id"
      columns={normalizedColumns}
      dataSource={data}
      loading={loading}
      size="small"
      pagination={false}
      bordered
      scroll={{ x: "max-content" }}
    />
  );
};

export default BaseTable;
