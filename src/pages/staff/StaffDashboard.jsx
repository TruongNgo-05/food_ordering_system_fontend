import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";

import "../../assets/styles/staff/StaffDashboard.css";

import UserHeader from "../../components/user/UserHeader";
import StaffChatButton from "../../components/staff/StaffChatButton";
import StatsCards from "../../components/common/StatsCards";
import staffDashboardService from "../../services/staff/staffDashboardService";
import CurrentDateTime from "../../components/common/CurrentDateTime";

const formatPrice = (value) => {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
};

const StaffDashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalOrders: 0,
    completedOrders: 0,
    failedOrders: 0,
    todayRevenue: 0,
    recentActivities: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await staffDashboardService.getDashboard();

        setDashboard({
          totalOrders: res.data?.totalOrders || 0,
          completedOrders: res.data?.completedOrders || 0,
          failedOrders: res.data?.failedOrders || 0,
          todayRevenue: res.data?.todayRevenue || 0,
          recentActivities: res.data?.recentActivities || [],
        });
      } catch (error) {
        console.error("Không tải được dashboard staff:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const statItems = [
    {
      title: "Tổng số đơn",
      value: loading ? 0 : dashboard.totalOrders,
      suffix: "đơn",
    },
    {
      title: "Đơn hoàn thành",
      value: loading ? 0 : dashboard.completedOrders,
      suffix: "đơn",
    },
    {
      title: "Đơn thất bại",
      value: loading ? 0 : dashboard.failedOrders,
      suffix: "đơn",
    },
  ];

  return (
    <>
      <UserHeader
        title="Dashboard nhân viên"
        description="Tổng quan công việc hôm nay: đơn hàng, doanh thu và hoạt động phục vụ"
        extra={
          <Button
            className="staff-print-button no-print"
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            In báo cáo
          </Button>
        }
      />

      <CurrentDateTime />

      <StatsCards items={statItems} />

      <div className="staff-dashboard-grid">
        <div className="staff-dashboard-card">
          <div className="staff-toolbar">
            <div>
              <h3 className="staff-toolbar-title">Doanh thu hôm nay</h3>

              <p className="staff-toolbar-subtitle">Hôm nay · Đơn vị: VNĐ</p>
            </div>
          </div>

          <div className="staff-today-revenue">
            <p className="staff-today-revenue-value">
              {loading ? "..." : formatPrice(dashboard.todayRevenue)}
            </p>

            <p className="staff-today-revenue-label">Doanh thu trong ngày</p>
          </div>
        </div>

        <div className="staff-dashboard-card no-print">
          <div className="staff-toolbar">
            <div>
              <h3 className="staff-toolbar-title">Hoạt động gần đây</h3>

              <p className="staff-toolbar-subtitle">Các đơn hàng mới nhất</p>
            </div>
          </div>

          <div className="staff-activity-list">
            {loading ? (
              <div className="staff-activity-item">
                <div className="staff-activity-dot" />

                <p className="staff-activity-text">Đang tải hoạt động...</p>
              </div>
            ) : dashboard.recentActivities?.length > 0 ? (
              dashboard.recentActivities.map((activity, index) => (
                <div
                  className="staff-activity-item"
                  key={`${activity}-${index}`}
                >
                  <div className="staff-activity-dot" />

                  <p className="staff-activity-text">{activity}</p>
                </div>
              ))
            ) : (
              <div className="staff-activity-item">
                <div className="staff-activity-dot" />

                <p className="staff-activity-text">Chưa có hoạt động gần đây</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="no-print">
        <StaffChatButton
          onClick={() => {
            console.log("Open Staff Chat");
          }}
        />
      </div>
    </>
  );
};

export default StaffDashboard;
