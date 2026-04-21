import React, { useMemo } from "react";
import UserHeader from "../../components/user/UserHeader";
import { fmt } from "../../constants/customerTheme";

const INVENTORY_ITEMS = [
  { id: 1, name: "Bò Mỹ thái lát", unit: "kg", inStock: 24, minStock: 12, cost: 185000 },
  { id: 2, name: "Cá hồi Nauy", unit: "kg", inStock: 8, minStock: 10, cost: 320000 },
  { id: 3, name: "Tôm sú", unit: "kg", inStock: 15, minStock: 8, cost: 210000 },
  { id: 4, name: "Rau xà lách", unit: "kg", inStock: 11, minStock: 6, cost: 32000 },
  { id: 5, name: "Nước ngọt lon", unit: "thùng", inStock: 19, minStock: 10, cost: 145000 },
  { id: 6, name: "Bún tươi", unit: "kg", inStock: 5, minStock: 7, cost: 18000 },
];

const InventoryAdmin = () => {
  const stats = useMemo(() => {
    const lowStock = INVENTORY_ITEMS.filter((i) => i.inStock < i.minStock).length;
    const normalStock = INVENTORY_ITEMS.length - lowStock;
    const stockValue = INVENTORY_ITEMS.reduce((sum, i) => sum + i.inStock * i.cost, 0);
    return { lowStock, normalStock, stockValue };
  }, []);

  return (
    <section className="admin-page">
      <UserHeader
        title="Quản lý kho"
        description="Theo dõi tồn kho nguyên liệu và cảnh báo mặt hàng sắp hết"
      />

      <div className="admin-grid">
        <div className="admin-stat">
          <p className="admin-stat-label">Tổng mặt hàng</p>
          <p className="admin-stat-value">{INVENTORY_ITEMS.length}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-label">Tồn kho bình thường</p>
          <p className="admin-stat-value">{stats.normalStock}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-label">Sắp hết hàng</p>
          <p className="admin-stat-value">{stats.lowStock}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-label">Giá trị tồn kho</p>
          <p className="admin-stat-value">{fmt(stats.stockValue)}</p>
        </div>
      </div>

      <div className="admin-dashboard-card">
        <div className="admin-toolbar">
          <div>
            <h3 className="admin-toolbar-title">Danh sách kho hiện tại</h3>
            <p className="admin-toolbar-subtitle">Các mặt hàng dưới định mức sẽ được đánh dấu</p>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên hàng</th>
                <th>Đơn vị</th>
                <th>Tồn hiện tại</th>
                <th>Định mức tối thiểu</th>
                <th>Giá nhập</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {INVENTORY_ITEMS.map((item) => {
                const isLow = item.inStock < item.minStock;
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.unit}</td>
                    <td>{item.inStock}</td>
                    <td>{item.minStock}</td>
                    <td>{fmt(item.cost)}</td>
                    <td>
                      <span className={`admin-status ${isLow ? "danger" : "ok"}`}>
                        {isLow ? "Sắp hết" : "Ổn định"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default InventoryAdmin;
