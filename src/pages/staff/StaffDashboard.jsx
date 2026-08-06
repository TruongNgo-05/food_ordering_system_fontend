import React from "react";
import "../../assets/styles/staff/StaffDashboard.css";
import UserHeader from "../../components/user/UserHeader";
import { mockStaffDashboard } from "../../data/mockStaffData";
import StaffChatButton from "../../components/staff/StaffChatButton";

const StaffDashboard = () => {
  const { statCards, revenueByDay, recentActivities } = mockStaffDashboard;

  // Doanh thu hôm nay = phần tử cuối cùng trong mảng revenueByDay
  const todayRevenue = revenueByDay[revenueByDay.length - 1];

  return (
    <>
      <section className="staff-page">
        <div className="staff-hero">
          <UserHeader
            title="Dashboard nhân viên"
            description="Tổng quan công việc hôm nay: đơn hàng, kho hàng và bàn đặt"
          />
        </div>

        <div className="staff-grid">
          {statCards.map((item) => (
            <div className="staff-stat" key={item.label}>
              <p className="staff-stat-label">{item.label}</p>
              <p className="staff-stat-value">{item.value}</p>
              <p className="staff-stat-sub">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="staff-dashboard-grid">
          <div className="staff-dashboard-card">
            <div className="staff-toolbar">
              <div>
                <h3 className="staff-toolbar-title">Doanh thu hôm nay</h3>
                <p className="staff-toolbar-subtitle">
                  {todayRevenue.day} · Đơn vị: triệu đồng
                </p>
              </div>
            </div>

            <div className="staff-today-revenue">
              <p className="staff-today-revenue-value">
                {todayRevenue.revenue}M
              </p>
              <p className="staff-today-revenue-label">Doanh thu trong ngày</p>
            </div>
          </div>

          <div className="staff-dashboard-card">
            <div className="staff-toolbar">
              <h3 className="staff-toolbar-title">Hoạt động gần đây</h3>
            </div>

            <div className="staff-activity-list">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="staff-activity-item">
                  <div className="staff-activity-dot" />
                  <p className="staff-activity-text">{activity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <StaffChatButton
        onClick={() => {
          console.log("Open Staff Chat");
          // navigate("/staff/chat");
        }}
      />
    </>
  );
};

export default StaffDashboard;
