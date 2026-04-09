import React, { useMemo, useState } from "react";
import { Modal } from "antd";
import AdminPageSection from "../../components/admin/AdminPageSection";
import BaseTable from "../../components/common/BaseTable";
import TableActions from "../../components/common/TableActions";
import AppPagination from "../../components/common/AppPagination";
import { mockFoodReviews } from "../../data/mockData";
import { loadSharedFoods } from "../../utils/sharedData";

const pageSize = 4;

const AdminReviews = () => {
  const [foods] = useState(() => loadSharedFoods());
  const [customReviews, setCustomReviews] = useState(() => {
    const saved = localStorage.getItem("food-reviews");
    return saved ? JSON.parse(saved) : {};
  });
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [openDelete, setOpenDelete] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const rows = useMemo(() => {
    const sharedRows = Object.entries(mockFoodReviews).flatMap(([foodId, list]) =>
      (Array.isArray(list) ? list : []).map((r) => ({
        id: `${foodId}-${r.id}`,
        foodId: Number(foodId),
        foodName: foods.find((f) => f.id === Number(foodId))?.name || `Món #${foodId}`,
        user: r.user,
        rating: r.rating,
        comment: r.comment,
        source: "mock",
      })),
    );
    const localRows = Object.entries(customReviews || {}).flatMap(([foodId, list]) =>
      (Array.isArray(list) ? list : []).map((r) => ({
        id: `${foodId}-${r.id}`,
        foodId: Number(foodId),
        foodName: foods.find((f) => f.id === Number(foodId))?.name || `Món #${foodId}`,
        user: r.user,
        rating: r.rating,
        comment: r.comment,
        source: "local",
      })),
    );
    return [...localRows, ...sharedRows];
  }, [foods, customReviews]);

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchKeyword =
        !keyword ||
        String(row.foodName).toLowerCase().includes(keyword) ||
        String(row.user).toLowerCase().includes(keyword) ||
        String(row.comment).toLowerCase().includes(keyword);
      if (ratingFilter === "all") return matchKeyword;
      if (ratingFilter === "low") return matchKeyword && Number(row.rating || 0) <= 2;
      if (ratingFilter === "mid") return matchKeyword && Number(row.rating || 0) === 3;
      return matchKeyword && Number(row.rating || 0) >= 4;
    });
  }, [ratingFilter, rows, search]);

  const pageData = useMemo(
    () => filteredRows.slice(page * pageSize, page * pageSize + pageSize),
    [filteredRows, page],
  );

  const columns = [
    { title: "Món ăn", dataIndex: "foodName" },
    { title: "Người dùng", dataIndex: "user" },
    { title: "Điểm", dataIndex: "rating", render: (v) => `${v}★` },
    { title: "Nội dung", dataIndex: "comment" },
    {
      title: "Thao tác",
      render: (_, record) => (
        <TableActions
          record={record}
          showView={false}
          showEdit={false}
          onDelete={() => {
            setEditingRecord(record);
            setOpenDelete(true);
          }}
        />
      ),
    },
  ];

  const handleDelete = () => {
    if (!editingRecord || editingRecord.source !== "local") {
      setOpenDelete(false);
      setEditingRecord(null);
      return;
    }
    const { foodId, id } = editingRecord;
    const reviewId = id.split("-").slice(1).join("-");
    const next = { ...(customReviews || {}) };
    const current = Array.isArray(next[foodId]) ? next[foodId] : [];
    next[foodId] = current.filter((r) => String(r.id) !== String(reviewId));
    setCustomReviews(next);
    localStorage.setItem("food-reviews", JSON.stringify(next));
    setOpenDelete(false);
    setEditingRecord(null);
  };

  return (
    <>
      <AdminPageSection
        title="Quản lý đánh giá"
        subtitle="Theo dõi phản hồi món ăn và xử lý bình luận không phù hợp."
        stats={[
          { label: "Tổng đánh giá", value: rows.length },
          { label: "Đánh giá người dùng", value: rows.filter((r) => r.source === "local").length },
          { label: "Điểm trung bình", value: rows.length ? (rows.reduce((s, r) => s + r.rating, 0) / rows.length).toFixed(1) : "0.0" },
          { label: "Cần kiểm duyệt", value: rows.filter((r) => r.rating <= 2).length },
        ]}
        topControls={
          <>
            <input
              className="admin-control search"
              placeholder="Tìm món, user, nội dung..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
            <select
              className="admin-control"
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="all">Tất cả điểm</option>
              <option value="high">4-5 sao</option>
              <option value="mid">3 sao</option>
              <option value="low">1-2 sao</option>
            </select>
          </>
        }
        table={<BaseTable columns={columns} data={pageData} />}
        pagination={
          <AppPagination
            page={page}
            size={pageSize}
            total={filteredRows.length}
            onChange={(p) => setPage(p)}
          />
        }
      />

      <Modal
        title="Xác nhận xóa đánh giá"
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        onOk={handleDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
      >
        <p>
          {editingRecord?.source === "mock"
            ? "Đánh giá mock không thể xóa. Chỉ xóa được đánh giá do người dùng tạo."
            : "Bạn chắc chắn muốn xóa đánh giá này?"}
        </p>
      </Modal>
    </>
  );
};

export default AdminReviews;
