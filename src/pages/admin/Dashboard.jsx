import React, { useEffect, useState } from "react";

import "../../assets/styles/Dashboard.css";
import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import adminDashboardService from "../../services/admin/adminDashboardService";
import CurrentDateTime from "../../components/common/CurrentDateTime";

const formatRevenue = (value) => {
  const number = Number(value || 0);

  if (number >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toLocaleString("vi-VN", {
      maximumFractionDigits: 2,
    })} tỷ`;
  }

  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toLocaleString("vi-VN", {
      maximumFractionDigits: 2,
    })} triệu`;
  }

  return `${number.toLocaleString("vi-VN")}đ`;
};

const formatFullPrice = (value) => {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
};

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalOrders: 0,
    completedOrders: 0,
    failedOrders: 0,

    todayRevenue: 0,

    totalRevenueThisWeek: 0,
    totalRevenueThisMonth: 0,

    bestDay: {
      day: "",
      date: "",
      revenue: 0,
    },

    revenueByDay: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await adminDashboardService.getDashboard();

        setDashboard(res.data);
      } catch (error) {
        console.error("Không tải được admin dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const revenueByDay = dashboard.revenueByDay || [];

  const bestDay = dashboard.bestDay || {
    day: "",
    date: "",
    revenue: 0,
  };

  const maxRevenue = Math.max(
    ...revenueByDay.map((item) => Number(item.revenue || 0)),
    1,
  );

  const statCards = [
    {
      title: "Đơn hàng hôm nay",
      value: loading ? "..." : dashboard.totalOrders,
      suffix: "đơn",
    },

    {
      title: "Doanh thu hôm nay",
      value: loading ? "..." : formatRevenue(dashboard.todayRevenue),
      suffix: "",
    },

    {
      title: "Đơn thất bại",
      value: loading ? "..." : dashboard.failedOrders,
      suffix: "đơn",
    },
  ];

  return (
    <>
      <UserHeader
        title="Dashboard quản lý nhà hàng"
        description="Tổng quan vận hành theo thời gian thực: doanh thu, đơn hàng và hiệu suất phục vụ."
      />

      <CurrentDateTime />

      <StatsCards items={statCards} />
      <div className="admin-dashboard-grid">
        <div className="admin-dashboard-card">
          <div className="admin-toolbar">
            <div>
              <h3 className="admin-toolbar-title">Doanh thu 7 ngày gần nhất</h3>

              <p className="admin-toolbar-subtitle">Doanh thu thực tế · VNĐ</p>
            </div>
          </div>

          <div className="admin-revenue-chart">
            {loading ? (
              <div className="admin-dashboard-empty">Đang tải dữ liệu...</div>
            ) : revenueByDay.length === 0 ? (
              <div className="admin-dashboard-empty">
                Chưa có dữ liệu doanh thu
              </div>
            ) : (
              revenueByDay.map((item) => {
                const revenue = Number(item.revenue || 0);

                const height =
                  revenue === 0 ? 4 : Math.max((revenue / maxRevenue) * 100, 8);

                return (
                  <div key={item.date} className="admin-revenue-col">
                    <span className="admin-revenue-value">
                      {formatRevenue(revenue)}
                    </span>

                    <div className="admin-revenue-track">
                      <div
                        className="admin-revenue-bar"
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    </div>

                    {/* THỨ */}
                    <span className="admin-revenue-day">{item.day}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="admin-dashboard-side">
          <div className="admin-dashboard-card">
            <p className="admin-side-label">Doanh thu tuần này</p>

            <p className="admin-side-value">
              {loading ? "..." : formatRevenue(dashboard.totalRevenueThisWeek)}
            </p>

            <p className="admin-side-sub">
              {loading
                ? "Đang tải..."
                : `Từ thứ 2 · ${formatFullPrice(
                    dashboard.totalRevenueThisWeek,
                  )}`}
            </p>
          </div>

          <div className="admin-dashboard-card">
            <p className="admin-side-label">Doanh thu tháng này</p>

            <p className="admin-side-value">
              {loading ? "..." : formatRevenue(dashboard.totalRevenueThisMonth)}
            </p>

            <p className="admin-side-sub">
              {loading
                ? "Đang tải..."
                : `Từ ngày 1 · ${formatFullPrice(
                    dashboard.totalRevenueThisMonth,
                  )}`}
            </p>
          </div>

          <div className="admin-dashboard-card">
            <p className="admin-side-label">Ngày hiệu quả nhất</p>

            <p className="admin-side-value">
              {loading
                ? "..."
                : bestDay.date
                  ? `${bestDay.day} - ${formatRevenue(bestDay.revenue)}`
                  : "Chưa có dữ liệu"}
            </p>

            <p className="admin-side-sub">
              {loading
                ? ""
                : bestDay.date
                  ? `${bestDay.date} · ${formatFullPrice(bestDay.revenue)}`
                  : ""}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
