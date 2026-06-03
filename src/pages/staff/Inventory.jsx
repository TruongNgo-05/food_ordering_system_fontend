import React, { useMemo, useState } from "react";
import UserHeader from "../../components/user/UserHeader";
import BaseTable from "../../components/common/BaseTable";
import { mockStaffInventory } from "../../data/mockStaffData";
import { fmt } from "../../constants/customerTheme";
import { T } from "../../constants/customerTheme";

const StaffInventory = () => {
  const [inventory, setInventory] = useState(
    mockStaffInventory.map((item) => ({
      ...item,
      key: item.id,
    })),
  );

  const stats = useMemo(() => {
    const lowStock = inventory.filter((i) => i.status === "low").length;
    const normalStock = inventory.length - lowStock;
    const stockValue = inventory.reduce(
      (sum, i) => sum + i.inStock * i.cost,
      0,
    );
    return { lowStock, normalStock, stockValue };
  }, [inventory]);

  const columns = [
    {
      title: "Tên hàng",
      dataIndex: "name",
      render: (name, record) => {
        const isLow = record.status === "low";
        return (
          <span
            style={{
              color: isLow ? T.red : T.text,
              fontWeight: isLow ? 600 : 400,
            }}
          >
            {name}
          </span>
        );
      },
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      width: 80,
    },
    {
      title: "Tồn hiện tại",
      dataIndex: "inStock",
      align: "center",
      width: 120,
    },
    {
      title: "Định mức tối thiểu",
      dataIndex: "minStock",
      align: "center",
      width: 140,
    },
    {
      title: "Giá nhập",
      dataIndex: "cost",
      render: (cost) => fmt(cost),
      align: "right",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status, record) => {
        const isLow = status === "low";
        return (
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              background: isLow ? T.redBg : T.primaryLight,
              color: isLow ? T.red : T.primary,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {isLow ? "Sắp hết" : "Ổn định"}
          </span>
        );
      },
      width: 100,
    },
  ];

  return (
    <section className="admin-page">
      <UserHeader
        title="Quản lý kho"
        description="Theo dõi tồn kho nguyên liệu và cảnh báo mặt hàng sắp hết"
      />

      <div className="admin-grid">
        <div className="admin-stat">
          <p className="admin-stat-label">Tổng mặt hàng</p>
          <p className="admin-stat-value">{inventory.length}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-label">Tồn kho bình thường</p>
          <p className="admin-stat-value">{stats.normalStock}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-label">Sắp hết hàng</p>
          <p className="admin-stat-value" style={{ color: T.red }}>
            {stats.lowStock}
          </p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-label">Giá trị tồn kho</p>
          <p className="admin-stat-value">{fmt(stats.stockValue)}</p>
        </div>
      </div>

      <div
        className="admin-dashboard-card"
        style={{ background: T.card, border: `1px solid ${T.border}` }}
      >
        <div className="admin-toolbar">
          <div>
            <h3 className="admin-toolbar-title">Danh sách kho hiện tại</h3>
            <p className="admin-toolbar-subtitle">
              Các mặt hàng dưới định mức sẽ được đánh dấu
            </p>
          </div>
        </div>

        <div className="admin-table-box">
          <BaseTable columns={columns} data={inventory} loading={false} />
        </div>
      </div>
    </section>
  );
};

export default StaffInventory;
