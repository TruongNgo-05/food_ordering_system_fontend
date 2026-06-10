import React, { useState, useEffect, useCallback } from "react";
import { Input, message, DatePicker } from "antd";
import UserHeader from "../../components/user/UserHeader";
import AppPagination from "../../components/common/AppPagination";
import OrderTable from "../../components/admin/OrderTable";
import OrderDetailModal from "../../components/modal/staff/OrderDetailModal";
import adminOrderService from "../../services/admin/adminOrderService";
import orderStaffService from "../../services/staff/orderStaffService";
import dayjs from "dayjs";
import { getOrderType } from "../../utils/orderUtils";

const pageSize = 5;

const AdminOrder = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingRecord, setEditingRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  // ================= LIST =================
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page,
        size: pageSize,
      };

      if (search.trim()) params.orderCode = search.trim();
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;
      if (minDate) params.minDate = dayjs(minDate).format("YYYY-MM-DD");
      if (maxDate) params.maxDate = dayjs(maxDate).format("YYYY-MM-DD");

      const res = await adminOrderService.getAllOrder(params);
      const data = res.data?.data || {};

      setItems(
        (data.content || []).map((item) => ({
          id: item.orderId,
          orderCode: item.orderCode,
          customerName: item.customerName,
          totalPrice: item.totalPrice,
          paymentMethod: item.paymentMethod,
          paymentStatus: item.paymentStatus,
          status: item.status,
          type: getOrderType(item.orderCode),
        })),
      );

      setTotal(data.totalElements || 0);
    } catch (e) {
      message.error("Không tải được danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, minDate, maxDate]);

  // ================= DETAIL =================
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
        discount: data.discount,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        status: data.status,
        createdAt: data.createdAt,
        address: data.address,
        note: data.note,
        items: data.items,
        tableNumber: data.tableNumber,

        // 🔥 SAME LOGIC AS LIST
        type: getOrderType(data.orderCode),
      });

      setModalOpen(true);
    } catch (e) {
      message.error("Không load được chi tiết đơn hàng");
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <>
      <UserHeader
        title="Quản lý đơn hàng online"
        description="Theo dõi và xử lý các đơn giao hàng"
      />

      {/* FILTER */}
      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            placeholder="Tìm mã đơn ..."
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
      </div>

      {/* TABLE */}
      <div className="admin-table-wrapper">
        <OrderTable
          data={items}
          loading={loading}
          onView={(record) => fetchOrderDetail(record.id)}
        />
      </div>

      {/* PAGINATION */}
      <AppPagination
        page={page}
        size={pageSize}
        total={total}
        onChange={setPage}
      />

      {/* DETAIL MODAL */}
      <OrderDetailModal
        open={modalOpen}
        record={editingRecord}
        type={editingRecord?.type || "online"}
        onClose={() => {
          setModalOpen(false);
          setEditingRecord(null);
        }}
      />
    </>
  );
};

export default AdminOrder;
