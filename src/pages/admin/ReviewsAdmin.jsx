import React, { useMemo, useState } from "react";
import { Input, Modal } from "antd";

import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import AppPagination from "../../components/common/AppPagination";
import BaseTable from "../../components/common/BaseTable";
import TableActions from "../../components/common/TableActions";

import { mockFoodReviews } from "../../data/mockData";
import { loadSharedFoods } from "../../utils/sharedData";

import "../../assets/styles/AdminPages.css";

const pageSize = 5;

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

  // ================= MAP DATA =================
  const rows = useMemo(() => {
    const sharedRows = Object.entries(mockFoodReviews).flatMap(
      ([foodId, list]) =>
        (Array.isArray(list) ? list : []).map((r) => ({
          id: `${foodId}-${r.id}`,
          foodId: Number(foodId),
          foodName:
            foods.find((f) => f.id === Number(foodId))?.name ||
            `Món #${foodId}`,
          user: r.user,
          rating: r.rating,
          comment: r.comment,
          source: "mock",
        })),
    );

    const localRows = Object.entries(customReviews || {}).flatMap(
      ([foodId, list]) =>
        (Array.isArray(list) ? list : []).map((r) => ({
          id: `${foodId}-${r.id}`,
          foodId: Number(foodId),
          foodName:
            foods.find((f) => f.id === Number(foodId))?.name ||
            `Món #${foodId}`,
          user: r.user,
          rating: r.rating,
          comment: r.comment,
          source: "local",
        })),
    );

    return [...localRows, ...sharedRows];
  }, [foods, customReviews]);

  // ================= FILTER =================
  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchKeyword =
        !keyword ||
        row.foodName.toLowerCase().includes(keyword) ||
        row.user.toLowerCase().includes(keyword) ||
        row.comment.toLowerCase().includes(keyword);

      if (ratingFilter === "all") return matchKeyword;
      if (ratingFilter === "low") return matchKeyword && row.rating <= 2;
      if (ratingFilter === "mid") return matchKeyword && row.rating === 3;

      return matchKeyword && row.rating >= 4;
    });
  }, [rows, search, ratingFilter]);

  // ================= PAGINATION =================
  const pageData = useMemo(
    () => filteredRows.slice(page * pageSize, page * pageSize + pageSize),
    [filteredRows, page],
  );

  // ================= DELETE =================
  const handleDelete = () => {
    if (!editingRecord || editingRecord.source !== "local") {
      setOpenDelete(false);
      setEditingRecord(null);
      return;
    }

    const { foodId, id } = editingRecord;
    const reviewId = id.split("-").slice(1).join("-");

    const next = { ...(customReviews || {}) };
    const current = next[foodId] || [];

    next[foodId] = current.filter((r) => String(r.id) !== String(reviewId));

    setCustomReviews(next);
    localStorage.setItem("food-reviews", JSON.stringify(next));

    setOpenDelete(false);
    setEditingRecord(null);
  };

  // ================= TABLE =================
  const columns = [
    { title: "Món ăn", dataIndex: "foodName" },
    { title: "Người dùng", dataIndex: "user" },
    {
      title: "Điểm",
      dataIndex: "rating",
      render: (v) => `${v}★`,
    },
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

  return (
    <>
      {/* HEADER */}
      <UserHeader
        title="Quản lý đánh giá"
        description="Theo dõi phản hồi và xử lý bình luận"
        buttonText={null}
      />

      {/* STATS */}
      <StatsCards
        items={[
          { title: "Tổng đánh giá", value: rows.length },
          {
            title: "Đánh giá user",
            value: rows.filter((r) => r.source === "local").length,
          },
          {
            title: "Điểm TB",
            value: rows.length
              ? (rows.reduce((s, r) => s + r.rating, 0) / rows.length).toFixed(
                  1,
                )
              : "0.0",
          },
          {
            title: "Cần xử lý",
            value: rows.filter((r) => r.rating <= 2).length,
          },
        ]}
      />

      {/* FILTER */}
      <div className="filter-bar">
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Tìm món, user, nội dung..."
            allowClear
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>

        <select
          className="admin-control"
          value={ratingFilter}
          onChange={(e) => {
            setRatingFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="all">Tất cả</option>
          <option value="high">4-5 sao</option>
          <option value="mid">3 sao</option>
          <option value="low">1-2 sao</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="admin-table-wrapper">
        <BaseTable columns={columns} data={pageData} />
      </div>

      {/* PAGINATION */}
      <AppPagination
        page={page}
        size={pageSize}
        total={filteredRows.length}
        onChange={(p) => setPage(p)}
      />

      {/* DELETE MODAL */}
      <Modal
        title="Xác nhận xóa"
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        onOk={handleDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
      >
        <p>
          {editingRecord?.source === "mock"
            ? "Không thể xóa đánh giá hệ thống"
            : "Bạn chắc chắn muốn xóa đánh giá này?"}
        </p>
      </Modal>
    </>
  );
};

export default AdminReviews;
