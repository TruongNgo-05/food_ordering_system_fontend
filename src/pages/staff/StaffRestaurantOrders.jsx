import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Button, Modal, Input, Select, message, DatePicker } from "antd";
import UserHeader from "../../components/user/UserHeader";
import AppPagination from "../../components/common/AppPagination";
import { T, fmt } from "../../constants/customerTheme";
import OfflineTable from "../../components/staff/OfflineTable";
import OrderDetailModal from "../../components/modal/staff/OrderDetailModal";
import OfflineOrderEditModal from "../../components/modal/staff/OfflineOrderEditModal";
import orderStaffService from "../../services/staff/orderStaffService";
import dayjs from "dayjs";

const pageSize = 5;
const statusOptions = [
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đang chuẩn bị", value: "PREPARING" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Từ chối", value: "REJECTED" },
];
const StaffRestaurantOrders = () => {
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

      // search theo orderCode
      if (search.trim()) {
        params.orderCode = search.trim();
      }
      if (minDate) {
        params.minDate = dayjs(minDate).format("YYYY-MM-DD");
      }

      if (maxDate) {
        params.maxDate = dayjs(maxDate).format("YYYY-MM-DD");
      }
      // filter status
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
    } catch (e) {
      console.log(e);
      message.error("Không tải được danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, minDate, maxDate]);

  const fetchOrderDetail = async (id) => {
    try {
      setDetailLoading(true);

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
    } catch (e) {
      message.error("Không load được chi tiết đơn hàng");
    } finally {
      setDetailLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const res = await orderStaffService.updateOrderStatus(id, newStatus);
      message.success("Cập nhật trạng thái thành công");
      fetchOrders();
    } catch (e) {
      message.error("Cập nhật thất bại");
    }
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
        title="Quản lý đơn hàng tại nhà hàng"
        description="Theo dõi và xử lý các đơn tại bàn"
      />

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
        <div className="filter-divider" />
        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => {
            setPage(0);
            setStatusFilter(v || "all");
          }}
        >
          {statusOptions.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      </div>
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

      <AppPagination
        page={page}
        size={pageSize}
        total={total}
        onChange={(p) => {
          setPage(p);
        }}
      />

      <OrderDetailModal
        open={modalOpen && !editMode}
        record={editingRecord}
        type="offline"
        onClose={() => {
          setModalOpen(false);
          setEditingRecord(null);
        }}
      />
      <OfflineOrderEditModal
        open={modalOpen && editMode}
        record={editingRecord}
        statusOptions={statusOptions}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        onSave={async () => {
          await updateOrderStatus(editingRecord.id, newStatus);
          setModalOpen(false);
          setEditingRecord(null);
          setNewStatus("");
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
