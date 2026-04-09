import React, { useState } from "react";
import Banner from "../../components/customer/Banner";
import "../../assets/styles/HomeCustomer.css";
import AppPagination from "../../components/common/AppPagination";
// MOCK DATA
const foods = [
  {
    id: 1,
    name: "Cơm gà xối mỡ",
    price: 45000,
    category: "Cơm",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
  },
  {
    id: 2,
    name: "Trà sữa trân châu",
    price: 30000,
    category: "Trà sữa",
    image: "https://images.unsplash.com/photo-1558857563-b371033873b8",
  },
  {
    id: 3,
    name: "Burger bò",
    price: 55000,
    category: "FastFood",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },
  {
    id: 4,
    name: "Pizza hải sản",
    price: 120000,
    category: "FastFood",
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4fe24",
  },
  {
    id: 5,
    name: "Bún bò Huế",
    price: 50000,
    category: "Món nước",
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d",
  },
];

// CATEGORY
const categories = ["Tất cả", "Cơm", "Trà sữa", "FastFood", "Món nước"];
const CustomerHome = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);

  const filteredFoods =
    selectedCategory === "Tất cả"
      ? foods
      : foods.filter((f) => f.category === selectedCategory);

  const total = filteredFoods.length;

  // paginate
  const start = (page - 1) * size;
  const paginatedFoods = filteredFoods.slice(start, start + size);

  return (
    <div className="home-container">
      <Banner />

      <div className="home-content">
        {/* FILTER */}
        <div className="categories">
          {categories.map((cat, index) => (
            <button
              key={index}
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1); // reset page khi đổi category
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FOOD GRID */}
        <div className="food-grid">
          {paginatedFoods.map((food) => (
            <div className="food-card" key={food.id}>
              <img
                src={`${food.image}?auto=format&fit=crop&w=800&q=60`}
                alt={food.name}
              />
              <div className="food-info">
                <h3>{food.name}</h3>
                <p>{food.price.toLocaleString()}đ</p>
                <button>+ Thêm</button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
};
export default CustomerHome;
