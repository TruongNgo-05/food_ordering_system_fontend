import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";

import { Input, Select, message } from "antd";

import adminReviewService from "../../services/admin/adminReviewService";
import { getCategories } from "../../services/userService";
import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import AppPagination from "../../components/common/AppPagination";
import ReviewDetail from "../../components/modal/admin/ReviewDetail";
import reviewService from "../../services/customer/reviewService";

const pageSize = 10;
// ===================== HELPERS =====================
const renderStars = (n, size = 14) => {
  const full = Math.round(n || 0);

  return (
    <span style={{ fontSize: size, color: "#EF9F27" }}>
      {"★".repeat(full)}
      <span style={{ color: "#D3D1C7" }}>{"★".repeat(5 - full)}</span>
    </span>
  );
};

// ===================== FOOD CARD =====================
const FoodCardGrid = ({ foods, onSelect }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
        gap: 16,
      }}
    >
      {foods.map((food) => (
        <div
          key={food.foodId}
          onClick={() => onSelect(food)}
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 16,
            cursor: "pointer",
          }}
        >
          {food.image ? (
            <img
              src={food.image}
              alt={food.foodName}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: 10,
                marginBottom: 12,
              }}
            />
          ) : null}

          <div
            style={{
              width: "100%",
              height: 160,
              borderRadius: 10,
              marginBottom: 12,
              background: "#f5f5f5",
              display: food.image ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 50,
            }}
          >
            🍽️
          </div>

          <h4>{food.foodName}</h4>

          <div>
            {renderStars(food.averageRating)}

            <span style={{ marginLeft: 6 }}>
              {(food.averageRating || 0).toFixed(1)}
            </span>
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: "#777",
            }}
          >
            {food.reviewCount} đánh giá
          </div>
        </div>
      ))}
    </div>
  );
};

// ===================== MAIN =====================
const AdminReviews = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFood, setSelectedFood] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(null);

  const searchTimeout = useRef(null);

  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState([]);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(pageSize);
  const [total, setTotal] = useState(0);

  const handleSelectFood = async (food) => {
    try {
      const res = await reviewService.getReviewByFood(food.foodId);

      setReviews(res.data?.data?.content || []);

      setSelectedFood(food);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải đánh giá");
    }
  };

  const handleDeleteReview = async (review) => {
    try {
      await reviewService.deleteReview(review.id);

      setReviews((prev) => prev.filter((item) => item.id !== review.id));

      message.success("Xóa đánh giá thành công");
    } catch (error) {
      console.error(error);
      message.error("Xóa đánh giá thất bại");
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const fetchFoods = async (keyword = "", categoryId = null, page = 0) => {
    try {
      setLoading(true);

      const params = {
        page,
        size,
      };

      if (keyword?.trim()) {
        params.name = keyword;
      }

      if (categoryId) {
        params.categoryId = categoryId;
      }

      const res = await adminReviewService.getAllFoodReview(params);

      setFoods(res.data.data.content || []);
      setTotal(res.data.data.totalElements || 0);
    } catch (error) {
      console.error("Load foods error:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      const data = res.data?.data || {};
      const content = Array.isArray(data.content) ? data.content : [];
      setCategories(content);
    } catch {
      message.error("Không thể tải danh mục");
    }
  }, []);

  useEffect(() => {
    fetchFoods(search, categoryFilter, page);
  }, [page, size]);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <UserHeader
        title="Quản lý đánh giá"
        description="Theo dõi phản hồi và xử lý bình luận"
      />

      <StatsCards
        items={[
          {
            title: "Tổng đánh giá",
            value: foods.reduce((sum, item) => sum + item.reviewCount, 0),
          },
          {
            title: "Số món ăn",
            value: foods.length,
          },
        ]}
      />

      {selectedFood ? (
        <ReviewDetail
          food={selectedFood}
          rows={reviews}
          onBack={() => {
            setSelectedFood(null);
            setReviews([]);
          }}
          onDelete={handleDeleteReview}
        />
      ) : (
        <>
          <div className="filter-bar">
            <div style={{ flex: 1, minWidth: 220 }}>
              <Input
                placeholder="Tìm tên món..."
                allowClear
                onChange={(e) => {
                  const val = e.target.value;

                  clearTimeout(searchTimeout.current);

                  searchTimeout.current = setTimeout(() => {
                    setSearch(val);
                    setPage(0);
                    fetchFoods(val, categoryFilter, 0);
                  }, 300);
                }}
              />
            </div>
            <div className="filter-divider" />
            <Select
              placeholder="Danh mục"
              allowClear
              style={{ width: 150 }}
              onChange={(v) => {
                setCategoryFilter(v);
                setPage(0);
                fetchFoods(search, v, 0);
              }}
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />
          </div>

          <FoodCardGrid foods={foods} onSelect={handleSelectFood} />

          {/* PAGINATION */}
          <AppPagination
            page={page}
            size={size}
            total={total}
            onChange={(p, s) => {
              setPage(p);
              setSize(s);
            }}
          />
        </>
      )}
    </div>
  );
};

export default AdminReviews;
