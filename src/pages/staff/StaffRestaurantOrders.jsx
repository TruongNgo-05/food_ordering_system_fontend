import React, { useState, useEffect, useCallback } from "react";
import { Input, Select, message, DatePicker } from "antd";
import UserHeader from "../../components/user/UserHeader";
import AppPagination from "../../components/common/AppPagination";
import OfflineTable from "../../components/staff/OfflineTable";
import OrderDetailModal from "../../components/modal/staff/OrderDetailModal";
import OfflineOrderEditModal from "../../components/modal/staff/OfflineOrderEditModal";
import orderStaffService from "../../services/staff/orderStaffService";
import dayjs from "dayjs";

const pageSize = 5;

const statusOptions = [
  { label: "Xác nhận", value: "CONFIRMED" },
  { label: "Đang chuẩn bị", value: "PREPARING" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Hủy đơn", value: "CANCELED" },
];

const StaffRestaurantOrders = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // =========================
  // LOAD DANH SÁCH ĐƠN
  // =========================
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page,
        size: pageSize,
      };

      // Tìm theo mã đơn
      if (search.trim()) {
        params.orderCode = search.trim();
      }

      // Từ ngày
      if (minDate) {
        params.minDate = dayjs(minDate).format("YYYY-MM-DD");
      }

      // Đến ngày
      if (maxDate) {
        params.maxDate = dayjs(maxDate).format("YYYY-MM-DD");
      }

      // Filter trạng thái
      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }

      const res = await orderStaffService.getAllOrderOffline(params);

      const data = res.data || {};

      setItems(
        (data.content || []).map((item) => ({
          id: item.orderId,
          orderCode: item.orderCode,
          customerName: item.customerName,
          customerPhone: item.customerPhone,
          tableNumber: item.tableNumber,
          totalPrice: item.totalPrice,
          paymentMethod: item.paymentMethod,
          paymentStatus: item.paymentStatus,
          status: item.status,
          createdAt: item.createdAt,
        })),
      );

      setTotal(data.totalElements || 0);
    } catch (error) {
      console.error("get offline orders error:", error);
      message.error("Không tải được danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, minDate, maxDate]);

  // =========================
  // XEM CHI TIẾT
  // =========================
  const fetchOrderDetail = async (id) => {
    try {
      const res = await orderStaffService.getOrderDetail(id);

      const data = res.data;

      setEditingRecord({
        id: data.orderId,
        orderCode: data.orderCode,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        totalPrice: data.totalPrice,
        tableNumber: data.tableNumber,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        status: data.status,
        createdAt: data.createdAt,
        note: data.note,
        items: data.items,
      });

      setModalOpen(true);
      setEditMode(false);
    } catch (error) {
      console.error("get order detail error:", error);
      message.error("Không load được chi tiết đơn hàng");
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const updateOrderStatus = async (id, status) => {
    try {
      await orderStaffService.updateOrderStatus(id, status);

      message.success("Cập nhật trạng thái thành công");

      // Load lại danh sách
      await fetchOrders();
    } catch (error) {
      console.error("update order status error:", error);

      const errorMessage =
        error?.response?.data?.message || "Cập nhật trạng thái thất bại";

      message.error(errorMessage);

      throw error;
    }
  };

  // =========================
  // LOAD KHI FILTER THAY ĐỔI
  // =========================
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <>
      <UserHeader
        title="Quản lý đơn hàng tại nhà hàng"
        description="Theo dõi và xử lý các đơn tại bàn"
      />

      {/* =========================
          FILTER
      ========================= */}
      <div className="filter-bar">
        <div
          style={{
            flex: 1,
            minWidth: 220,
          }}
        >
          <Input
            placeholder="Tìm mã đơn..."
            allowClear
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
          />
        </div>

        <DatePicker
          placeholder="Từ ngày"
          value={minDate}
          onChange={(value) => {
            setPage(0);
            setMinDate(value);
          }}
        />

        <DatePicker
          placeholder="Đến ngày"
          value={maxDate}
          onChange={(value) => {
            setPage(0);
            setMaxDate(value);
          }}
        />

        <div className="filter-divider" />

        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 150 }}
          value={statusFilter === "all" ? undefined : statusFilter}
          onChange={(value) => {
            setPage(0);
            setStatusFilter(value || "all");
          }}
        >
          {statusOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* =========================
          TABLE
      ========================= */}
      <div className="admin-table-wrapper">
        <OfflineTable
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

      {/* =========================
          PAGINATION
      ========================= */}
      <AppPagination
        page={page}
        size={pageSize}
        total={total}
        onChange={(newPage) => {
          setPage(newPage);
        }}
      />

      {/* =========================
          DETAIL MODAL
      ========================= */}
      <OrderDetailModal
        open={modalOpen && !editMode}
        record={editingRecord}
        type="offline"
        onClose={() => {
          setModalOpen(false);
          setEditingRecord(null);
        }}
      />

      {/* =========================
          EDIT STATUS MODAL
      ========================= */}
      <OfflineOrderEditModal
        open={modalOpen && editMode}
        record={editingRecord}
        statusOptions={statusOptions}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        onSave={async () => {
          try {
            await updateOrderStatus(editingRecord.id, newStatus);

            setModalOpen(false);
            setEditingRecord(null);
            setNewStatus("");
          } catch (error) {
            // Giữ modal mở nếu update thất bại
          }
        }}
        onClose={() => {
          setModalOpen(false);
          setEditingRecord(null);
          setNewStatus("");
        }}
      />
    </>
  );
};

export default StaffRestaurantOrders;
