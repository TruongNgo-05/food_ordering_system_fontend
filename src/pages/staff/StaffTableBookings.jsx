import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Button, Modal, Input, Select, message, DatePicker } from "antd";
import UserHeader from "../../components/user/UserHeader";
import AppPagination from "../../components/common/AppPagination";
import { T, fmt } from "../../constants/customerTheme";
import BookingTable from "../../components/staff/BookingTable";
import bookingStaffService from "../../services/staff/bookingStaffService";
import dayjs from "dayjs";

const pageSize = 5;

const StaffTableBookings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingRecord, setEditingRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page,
        size: pageSize,
      };

      if (search.trim()) {
        params.reservationCode = search.trim();
      }

      if (search.trim()) {
        params.customerPhone = search.trim();
      }
      if (minDate) {
        params.minDate = dayjs(minDate).format("YYYY-MM-DD");
      }

      if (maxDate) {
        params.maxDate = dayjs(maxDate).format("YYYY-MM-DD");
      }

      const res = await bookingStaffService.getAllBooking(params);

      const pageData = res?.data?.data || {};

      setItems(
        (pageData.content || []).map((item) => ({
          id: item.id,
          reservationCode: item.reservationCode,
          customerName: item.customerName,
          customerPhone: item.customerPhone,
          tableNumber: item.tableNumber,
          reservationTime: item.reservationTime,
          status: item.status,
        })),
      );

      setTotal(pageData.totalElements || 0);
    } catch (e) {
      message.error("Không tải được danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, minDate, maxDate]);

  const fetchBookingDetail = async (id) => {
    console.log(id);
  };

  const updateBookingStatus = async (id, newStatus) => {
    console.log(id, newStatus);
  };
  const handleStatusChange = (newStatus) => {
    setEditingRecord((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <>
      <UserHeader
        title="Quản lý đặt bàn"
        description="Theo dõi các yêu cầu đặt bàn và xác nhận"
      />

      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            placeholder="Tìm kiếm mã hoặc số điện thoại..."
            allowClear
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
          />
        </div>
        <DatePicker
          placeholder="Từ ngày"
          onChange={(v) => {
            setPage(0);
            setMinDate(v);
          }}
        />

        <DatePicker
          placeholder="Đến ngày"
          onChange={(v) => {
            setPage(0);
            setMaxDate(v);
          }}
        />
        <div className="filter-divider" />

        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => {
            setPage(0);
            setStatusFilter(v || "all");
          }}
        ></Select>
      </div>
      <div className="admin-table-wrapper">
        <BookingTable
          data={items}
          loading={loading}
          onView={(record) => {
            fetchOrderDetail(record.id);
          }}
          onEdit={(record) => {
            setEditingRecord(record);
            setNewStatus(record.status);
            setEditMode(true);
            setModalOpen(true);
          }}
        />
      </div>

      <AppPagination
        page={page}
        size={pageSize}
        total={total}
        onChange={(p) => {
          setPage(p);
        }}
      />
    </>
  );
};

export default StaffTableBookings;
