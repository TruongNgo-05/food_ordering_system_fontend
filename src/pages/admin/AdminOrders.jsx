import React, { useEffect, useMemo, useState } from "react";
import { Button, Modal } from "antd";
import { toast } from "react-toastify";
import AdminPageSection from "../../components/admin/AdminPageSection";
import BaseTable from "../../components/common/BaseTable";
import AppPagination from "../../components/common/AppPagination";
import { mockOrders } from "../../data/mockData";

const pageSize = 4;
const CUSTOMER_DATA_UPDATED_EVENT = "customer-data-updated";

const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "PENDING", className: "warn" },
  { value: "preparing", label: "PREPARING", className: "warn" },
  { value: "delivering", label: "DELIVERING", className: "ok" },
  { value: "completed", label: "COMPLETED", className: "ok" },
  { value: "canceled", label: "CANCELED", className: "danger" },
];

const normalizeStatus = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "processing") return "preparing";
  if (s === "cancelled") return "canceled";
  return ORDER_STATUS_OPTIONS.some((o) => o.value === s) ? s : "pending";
};

const ALLOWED_NEXT_STATUS = {
  pending: ["preparing", "canceled"],
  preparing: ["delivering", "canceled"],
  delivering: ["completed", "canceled"],
  completed: [],
  canceled: [],
};

const formatMoney = (v) => `${Number(v || 0).toLocaleString("vi-VN")}đ`;

const getStatusMeta = (status) =>
  ORDER_STATUS_OPTIONS.find((o) => o.value === normalizeStatus(status)) ||
  ORDER_STATUS_OPTIONS[0];

const getNextStatus = (status) => {
  const normalized = normalizeStatus(status);
  const next = (ALLOWED_NEXT_STATUS[normalized] || [])[0];
  return next || null;
};

const canCancelOrder = (status) => {
  const normalized = normalizeStatus(status);
  return !["completed", "canceled"].includes(normalized);
};

const mapMockOrder = (order) => ({
  ...order,
  code: order.id,
  customer: "Khách hàng",
});

const isTableOrder = (order) =>
  String(order?.source || "").toLowerCase() === "dine_in_qr" ||
  String(order?.id || "").startsWith("TBL-");

const readOrdersFromStorage = () => {
  const saved = localStorage.getItem("orders");
  const parsed = saved ? JSON.parse(saved) : [];
  const baseOrders =
    Array.isArray(parsed) && parsed.length > 0 ? parsed : mockOrders.map(mapMockOrder);

  const tableOrdersRaw = localStorage.getItem("table-orders");
  const tableOrdersParsed = tableOrdersRaw ? JSON.parse(tableOrdersRaw) : [];
  const tableOrders = Array.isArray(tableOrdersParsed)
    ? tableOrdersParsed.map((order) => ({
        ...order,
        code: order.code || order.id,
        customer: `Bàn ${order.tableNumber || "N/A"}`,
        created_at: order.createdAt || order.created_at,
        payment_method: "AT_TABLE",
        payment_status: "pending",
      }))
    : [];

  return [...tableOrders, ...baseOrders];
};

const AdminOrders = () => {
  const [items, setItems] = useState(() => readOrdersFromStorage());
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openCancel, setOpenCancel] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    const syncOrders = () => setItems(readOrdersFromStorage());
    window.addEventListener("focus", syncOrders);
    window.addEventListener("storage", syncOrders);
    window.addEventListener(CUSTOMER_DATA_UPDATED_EVENT, syncOrders);
    return () => {
      window.removeEventListener("focus", syncOrders);
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener(CUSTOMER_DATA_UPDATED_EVENT, syncOrders);
    };
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      const orderCode = String(item.code || item.id || "").toLowerCase();
      const customerName = String(item.customer || item.customer_name || "").toLowerCase();
      const matchKeyword = !keyword || orderCode.includes(keyword) || customerName.includes(keyword);
      const matchStatus = statusFilter === "all" || normalizeStatus(item.status) === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [items, search, statusFilter]);

  const pageData = useMemo(
    () => filteredItems.slice(page * pageSize, page * pageSize + pageSize),
    [filteredItems, page],
  );
  const columns = [
    { title: "Mã đơn", dataIndex: "code", render: (_, r) => r.code || r.id },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      render: (_, r) => r.customer || r.customer_name || "Khách lẻ",
    },
    { title: "Thời gian", dataIndex: "created_at" },
    { title: "Tổng tiền", dataIndex: "total", render: (v) => formatMoney(v) },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, r) => {
        const status = normalizeStatus(r.status);
        const option = getStatusMeta(status);
        const nextStatus = getNextStatus(status);
        const nextLabel = nextStatus ? getStatusMeta(nextStatus).label : null;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className={`admin-status ${option.className || "warn"}`}>
              {option.label || "PENDING"}
            </span>
            <Button
              size="small"
              type="primary"
              ghost
              disabled={!nextStatus}
              onClick={() => {
                if (nextStatus) updateOrderStatus(r.id, nextStatus);
              }}
            >
              {nextLabel ? "Tiếp tục tiến trình" : "Hoàn tất"}
            </Button>
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            danger
            size="small"
            disabled={!canCancelOrder(record.status)}
            onClick={() => {
              setEditingRecord(record);
              setOpenCancel(true);
            }}
          >
            Hủy đơn
          </Button>
        </div>
      ),
    },
  ];

  const updateOrderStatus = (orderId, nextStatus) => {
    const normalized = normalizeStatus(nextStatus);
    setItems((prev) => {
      const currentOrder = prev.find((it) => it.id === orderId);
      const currentStatus = normalizeStatus(currentOrder?.status);
      if (!currentOrder) return prev;
      if (currentStatus === normalized) return prev;

      const allowList = ALLOWED_NEXT_STATUS[currentStatus] || [];
      if (!allowList.includes(normalized)) {
        toast.warning(
          `Không thể chuyển từ ${currentStatus.toUpperCase()} sang ${normalized.toUpperCase()}.`,
        );
        return prev;
      }

      const next = prev.map((it) =>
        it.id === orderId ? { ...it, status: normalized } : it,
      );
      const nextNormalOrders = next.filter((order) => !isTableOrder(order));
      const nextTableOrders = next.filter((order) => isTableOrder(order));
      localStorage.setItem("orders", JSON.stringify(nextNormalOrders));
      localStorage.setItem("table-orders", JSON.stringify(nextTableOrders));
      window.dispatchEvent(new Event(CUSTOMER_DATA_UPDATED_EVENT));
      toast.success(
        `Đã chuyển trạng thái đơn sang ${normalized.toUpperCase()}.`,
      );
      return next;
    });
  };

  const exportOrdersToExcel = () => {
    const rows = filteredItems.map((order) => {
      const status = getStatusMeta(order.status).label;
      return [
        order.code || order.id || "",
        order.customer || order.customer_name || "Khách lẻ",
        order.created_at || "",
        Number(order.total || 0),
        status,
        order.payment_method || "",
        order.payment_status || "",
      ];
    });
    const headers = [
      "Mã đơn",
      "Khách hàng",
      "Thời gian",
      "Tổng tiền",
      "Trạng thái",
      "Phương thức thanh toán",
      "Thanh toán",
    ];
    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bao-cao-don-hang-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Đã xuất báo cáo đơn hàng.");
  };

  return (
    <>
      <AdminPageSection
        title="Quản lý đơn hàng"
        subtitle="Theo dõi trạng thái xử lý đơn để tối ưu tốc độ vận hành bếp và giao hàng."
        stats={[
          { label: "Đơn mới", value: "24" },
          { label: "Đang chuẩn bị", value: "19" },
          { label: "Đang giao", value: "13" },
          { label: "Hoàn thành hôm nay", value: "112" },
        ]}
        actionLabel="Xuất báo cáo"
        onAddClick={exportOrdersToExcel}
        topControls={
          <>
            <input
              className="admin-control search"
              placeholder="Tìm mã đơn hoặc khách hàng..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
            <select
              className="admin-control"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">PENDING</option>
              <option value="preparing">PREPARING</option>
              <option value="delivering">DELIVERING</option>
              <option value="completed">COMPLETED</option>
              <option value="canceled">CANCELED</option>
            </select>
          </>
        }
        table={<BaseTable columns={columns} data={pageData} />}
        pagination={
          <AppPagination
            page={page}
            size={pageSize}
            total={filteredItems.length}
            onChange={(p) => setPage(p)}
          />
        }
      />
      <Modal
        open={openCancel}
        title="Xác nhận hủy đơn"
        onCancel={() => {
          setOpenCancel(false);
          setEditingRecord(null);
        }}
        onOk={() => {
          if (editingRecord?.id)
            updateOrderStatus(editingRecord.id, "canceled");
          setOpenCancel(false);
          setEditingRecord(null);
        }}
        okText="Xác nhận CANCELED"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn chắc chắn muốn chuyển đơn này sang trạng thái CANCELED?</p>
      </Modal>
    </>
  );
};
export default AdminOrders;
