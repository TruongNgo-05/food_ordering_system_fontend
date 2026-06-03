import React from "react";
import "../../assets/styles/Dashboard.css";
import UserHeader from "../../components/user/UserHeader";
import { mockStaffDashboard } from "../../data/mockStaffData";
import { fmt } from "../../constants/customerTheme";

const StaffDashboard = () => {
  const { statCards, revenueByDay, recentActivities } = mockStaffDashboard;

  const maxRevenue = Math.max(...revenueByDay.map((item) => item.revenue), 1);
  const totalRevenue = revenueByDay
    .reduce((sum, item) => sum + item.revenue, 0)
    .toFixed(1);
  const avgRevenue = (Number(totalRevenue) / revenueByDay.length).toFixed(1);
  const bestDay = revenueByDay.reduce((best, current) =>
    current.revenue > best.revenue ? current : best,
  );

  return (
    <section className="admin-page">
      <div className="admin-hero">
        <UserHeader
          title="Dashboard nhân viên"
          description="Tổng quan công việc hôm nay: đơn hàng, kho hàng và bàn đặt"
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
              <h3 className="admin-toolbar-title">Doanh thu 7 ngày</h3>
              <p className="admin-toolbar-subtitle">Đơn vị: triệu đồng</p>
            </div>
          </div>

          <div className="admin-chart-bars">
            {revenueByDay.map((item) => {
              const percentage = (item.revenue / maxRevenue) * 100;
              return (
                <div key={item.day} className="admin-chart-bar-wrapper">
                  <div className="admin-chart-bar">
                    <div
                      className="admin-chart-bar-fill"
                      style={{ height: `${percentage}%` }}
                    />
                  </div>
                  <p className="admin-chart-bar-label">{item.day}</p>
                  <p className="admin-chart-bar-value">{item.revenue}M</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="admin-dashboard-card">
          <div className="admin-toolbar">
            <h3 className="admin-toolbar-title">Hoạt động gần đây</h3>
          </div>

          <div className="admin-activity-list">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="admin-activity-item">
                <div className="admin-activity-dot" />
                <p className="admin-activity-text">{activity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-dashboard-card">
          <div className="admin-toolbar">
            <h3 className="admin-toolbar-title">Thống kê doanh thu</h3>
          </div>

          <div className="admin-stats-summary">
            <div className="admin-stats-item">
              <p className="admin-stats-label">Tổng doanh thu 7 ngày</p>
              <p className="admin-stats-value">
                {fmt(Number(totalRevenue) * 1000000)}
              </p>
            </div>
            <div className="admin-stats-item">
              <p className="admin-stats-label">Doanh thu trung bình</p>
              <p className="admin-stats-value">
                {fmt(Number(avgRevenue) * 1000000)}
              </p>
            </div>
            <div className="admin-stats-item">
              <p className="admin-stats-label">Ngày doanh thu cao nhất</p>
              <p className="admin-stats-value">{bestDay.day}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaffDashboard;
