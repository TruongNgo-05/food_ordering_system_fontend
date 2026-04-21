import React from "react";
import "../../assets/styles/Dashboard.css";
import UserHeader from "../../components/user/UserHeader";

const revenueByDay = [
  { day: "T2", revenue: 12.4 },
  { day: "T3", revenue: 15.8 },
  { day: "T4", revenue: 11.2 },
  { day: "T5", revenue: 18.6 },
  { day: "T6", revenue: 21.4 },
  { day: "T7", revenue: 24.6 },
  { day: "CN", revenue: 19.1 },
];

const Dashboard = () => {
  const maxRevenue = Math.max(...revenueByDay.map((item) => item.revenue), 1);
  const totalRevenue = revenueByDay.reduce((sum, item) => sum + item.revenue, 0).toFixed(1);
  const avgRevenue = (Number(totalRevenue) / revenueByDay.length).toFixed(1);
  const bestDay = revenueByDay.reduce((best, current) =>
    current.revenue > best.revenue ? current : best,
  );
  const statCards = [
    { label: "Đơn hàng hôm nay", value: "128", sub: "+18 so với hôm qua" },
    { label: "Doanh thu hôm nay", value: "24.6M", sub: "Đạt 92% mục tiêu ngày" },
    { label: "Khách hàng mới", value: "36", sub: "Tập trung khung giờ 18h - 21h" },
    { label: "Món sắp hết", value: "7", sub: "Cần bổ sung trong ca tối" },
  ];
  const recentActivities = [
    "Đơn #DH2381 vừa thanh toán thành công",
    "Bàn B12 vừa tạo yêu cầu gọi món QR",
    "Voucher FESTIVE20 được áp dụng 5 lần hôm nay",
    "Món “Cá hồi sốt bơ tỏi” sắp hết kho",
  ];

  return (
    <section className="admin-page">
      <div className="admin-hero">
        <UserHeader
          title="Dashboard quản lý nhà hàng"
          description="Tổng quan vận hành theo thời gian thực: doanh thu, đơn hàng và hiệu suất phục vụ."
        />
      </div>

      <div className="admin-grid">
        {statCards.map((item) => (
          <div className="admin-stat" key={item.label}>
            <p className="admin-stat-label">{item.label}</p>
            <p className="admin-stat-value">{item.value}</p>
            <p className="admin-stat-sub">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-dashboard-card">
          <div className="admin-toolbar">
            <div>
              <h3 className="admin-toolbar-title">Doanh thu 7 ngày gần nhất</h3>
              <p className="admin-toolbar-subtitle">Đơn vị: triệu đồng</p>
            </div>
          </div>

          <div className="admin-revenue-chart">
            {revenueByDay.map((item) => (
              <div key={item.day} className="admin-revenue-col">
                <span className="admin-revenue-value">{item.revenue}M</span>
                <div className="admin-revenue-track">
                  <div
                    className="admin-revenue-bar"
                    style={{ height: `${Math.max((item.revenue / maxRevenue) * 100, 8)}%` }}
                  />
                </div>
                <span className="admin-revenue-day">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-dashboard-side">
          <div className="admin-dashboard-card">
            <p className="admin-side-label">Tổng doanh thu 7 ngày</p>
            <p className="admin-side-value">{totalRevenue}M</p>
            <p className="admin-side-sub">+12.4% so với tuần trước</p>
          </div>

          <div className="admin-dashboard-card">
            <p className="admin-side-label">Trung bình mỗi ngày</p>
            <p className="admin-side-value">{avgRevenue}M</p>
            <p className="admin-side-sub">Mục tiêu tuần: 140M</p>
          </div>

          <div className="admin-dashboard-card">
            <p className="admin-side-label">Ngày hiệu quả nhất</p>
            <p className="admin-side-value">
              {bestDay.day} - {bestDay.revenue}M
            </p>
            <div className="admin-side-progress">
              <span>Tỷ lệ đạt mục tiêu</span>
              <strong>{Math.round((bestDay.revenue / 25) * 100)}%</strong>
            </div>
            <div className="admin-side-progress-bar">
              <div
                className="admin-side-progress-value"
                style={{ width: `${Math.min((bestDay.revenue / 25) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="admin-dashboard-card">
            <p className="admin-side-label">Hoạt động gần đây</p>
            <ul className="admin-activity-list">
              {recentActivities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;