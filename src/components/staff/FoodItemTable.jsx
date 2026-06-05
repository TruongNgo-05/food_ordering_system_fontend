import React from "react";
import BaseTable from "../common/BaseTable";
import { fmt } from "../../constants/customerTheme";

const FoodItemTable = ({ data = [], loading = false }) => {
  const columns = [
    {
      title: "Món ăn",
      dataIndex: "foodName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      align: "center",
    },
    {
      title: "Giá",
      dataIndex: "price",
      align: "right",
      render: (v) => fmt(v),
    },
    {
      title: "Thành tiền",
      align: "right",
      render: (_, r) => fmt(r.price * r.quantity),
    },
  ];

  const tableData = data.map((it, index) => ({
    id: index,
    ...it,
  }));

  return <BaseTable columns={columns} data={tableData} loading={loading} />;
};

export default FoodItemTable;
