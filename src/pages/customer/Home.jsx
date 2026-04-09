// import React, { useState } from "react";
// import Banner from "../../components/customer/Banner";
// import "../../assets/styles/HomeCustomer.css";
// import AppPagination from "../../components/common/AppPagination";
// // MOCK DATA
// const foods = [
//   {
//     id: 1,
//     name: "Cơm gà xối mỡ",
//     price: 45000,
//     category: "Cơm",
//     image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
//   },
//   {
//     id: 2,
//     name: "Trà sữa trân châu",
//     price: 30000,
//     category: "Trà sữa",
//     image: "https://images.unsplash.com/photo-1558857563-b371033873b8",
//   },
//   {
//     id: 3,
//     name: "Burger bò",
//     price: 55000,
//     category: "FastFood",
//     image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
//   },
//   {
//     id: 4,
//     name: "Pizza hải sản",
//     price: 120000,
//     category: "FastFood",
//     image: "https://images.unsplash.com/photo-1594007654729-407eedc4fe24",
//   },
//   {
//     id: 5,
//     name: "Bún bò Huế",
//     price: 50000,
//     category: "Món nước",
//     image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d",
//   },
// ];

// // CATEGORY
// const categories = ["Tất cả", "Cơm", "Trà sữa", "FastFood", "Món nước"];
// const CustomerHome = () => {
//   const [selectedCategory, setSelectedCategory] = useState("Tất cả");

//   const [page, setPage] = useState(0);
//   const [size, setSize] = useState(4);

//   const filteredFoods =
//     selectedCategory === "Tất cả"
//       ? foods
//       : foods.filter((f) => f.category === selectedCategory);

//   const total = filteredFoods.length;

//   // paginate
//   const start = (page - 1) * size;
//   const paginatedFoods = filteredFoods.slice(start, start + size);

//   return (
//     <div className="home-container">
//       <Banner />

//       <div className="home-content">
//         {/* FILTER */}
//         <div className="categories">
//           {categories.map((cat, index) => (
//             <button
//               key={index}
//               className={selectedCategory === cat ? "active" : ""}
//               onClick={() => {
//                 setSelectedCategory(cat);
//                 setPage(1); // reset page khi đổi category
//               }}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {/* FOOD GRID */}
//         <div className="food-grid">
//           {paginatedFoods.map((food) => (
//             <div className="food-card" key={food.id}>
//               <img
//                 src={`${food.image}?auto=format&fit=crop&w=800&q=60`}
//                 alt={food.name}
//               />
//               <div className="food-info">
//                 <h3>{food.name}</h3>
//                 <p>{food.price.toLocaleString()}đ</p>
//                 <button>+ Thêm</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* PAGINATION */}
//       <AppPagination
//         page={page}
//         size={size}
//         total={total}
//         onChange={(p, s) => {
//           setPage(p);
//           setSize(s);
//         }}
//       />
//     </div>
//   );
// };
// export default CustomerHome;
import React, { useState, useCallback } from "react";
import { T } from "../../constants/customerTheme";
import { EmptyState } from "../../components/customer/SharedUI";
import MenuItemCard from "../../components/customer/MenuItemCard";
import Banner from "../../components/customer/Banner";
import UserHeader from "../../components/user/UserHeader";
export const mockCategories = [
  { id: 1, name: "Tất cả", icon: "🍽️" },
  { id: 2, name: "Cơm", icon: "🍚" },
  { id: 3, name: "Phở & Bún", icon: "🍜" },
  { id: 4, name: "Bánh mì", icon: "🥖" },
  { id: 5, name: "Đồ uống", icon: "🧋" },
  { id: 6, name: "Tráng miệng", icon: "🍮" },
];

export const mockMenuItems = [
  {
    id: 1,
    name: "Phở Bò Đặc Biệt",
    category_id: 3,
    price: 65000,
    image: "🍜",
    rating: 4.9,
    sold: 320,
    desc: "Nước dùng hầm 12 tiếng từ xương bò, thơm ngon đậm đà.",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Cơm Tấm Sườn Bì",
    category_id: 2,
    price: 55000,
    image: "🍚",
    rating: 4.7,
    sold: 210,
    desc: "Sườn nướng than hoa, bì sợi, chả hấp mềm mịn.",
    badge: null,
  },
  {
    id: 3,
    name: "Bánh Mì Thịt Nướng",
    category_id: 4,
    price: 35000,
    image: "🥖",
    rating: 4.8,
    sold: 450,
    desc: "Bánh mì vỏ giòn, thịt nướng sả ớt thơm lừng.",
    badge: "Mới",
  },
  {
    id: 4,
    name: "Bún Bò Huế",
    category_id: 3,
    price: 60000,
    image: "🫕",
    rating: 4.6,
    sold: 180,
    desc: "Cay đậm đà phong vị miền Trung, chả cua, giò heo.",
    badge: null,
  },
  {
    id: 5,
    name: "Cơm Chiên Dương Châu",
    category_id: 2,
    price: 50000,
    image: "🍳",
    rating: 4.5,
    sold: 290,
    desc: "Cơm chiên tơi, tôm, xúc xích, trứng rán giòn.",
    badge: null,
  },
  {
    id: 6,
    name: "Trà Sữa Trân Châu",
    category_id: 5,
    price: 35000,
    image: "🧋",
    rating: 4.9,
    sold: 600,
    desc: "Trà sữa Đài Loan, trân châu đen dẻo thơm bơ.",
    badge: "Hot",
  },
  {
    id: 7,
    name: "Cà Phê Sữa Đá",
    category_id: 5,
    price: 25000,
    image: "☕",
    rating: 4.8,
    sold: 800,
    desc: "Cà phê phin Robusta, sữa đặc Ông Thọ.",
    badge: null,
  },
  {
    id: 8,
    name: "Chè Ba Màu",
    category_id: 6,
    price: 30000,
    image: "🍮",
    rating: 4.7,
    sold: 150,
    desc: "Đậu xanh, đậu đỏ, thạch pandan, nước cốt dừa.",
    badge: null,
  },
  {
    id: 9,
    name: "Gỏi Cuốn Tôm Thịt",
    category_id: 6,
    price: 40000,
    image: "🥗",
    rating: 4.6,
    sold: 200,
    desc: "Bánh tráng mềm, tôm sú, thịt ba chỉ luộc chín.",
    badge: null,
  },
  {
    id: 10,
    name: "Bún Chả Hà Nội",
    category_id: 3,
    price: 58000,
    image: "🍲",
    rating: 4.8,
    sold: 340,
    desc: "Chả miếng & chả viên nướng than, bún tươi.",
    badge: "Bestseller",
  },
  {
    id: 11,
    name: "Sinh Tố Bơ",
    category_id: 5,
    price: 45000,
    image: "🥑",
    rating: 4.7,
    sold: 120,
    desc: "Bơ Đắk Lắk chín mềm, sữa đặc, đá xay.",
    badge: null,
  },
  {
    id: 12,
    name: "Cơm Gà Xối Mỡ",
    category_id: 2,
    price: 60000,
    image: "🍗",
    rating: 4.8,
    sold: 260,
    desc: "Gà xối mỡ giòn rụm, cơm trắng, salad cà chua.",
    badge: "Mới",
  },
];
const Home = () => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [activeCat, setActiveCat] = useState(1);
  const [search, setSearch] = useState("");

  // FILTER
  const filtered = mockMenuItems.filter(
    (m) =>
      (activeCat === 1 || m.category_id === activeCat) &&
      m.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ADD CART
  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.item_id === item.id);
      if (ex)
        return prev.map((c) =>
          c.item_id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );

      return [
        ...prev,
        {
          item_id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          qty: 1,
        },
      ];
    });
  }, []);

  // GIẢM SỐ LƯỢNG
  const decCart = useCallback((item_id) => {
    setCart((prev) =>
      prev
        .map((c) => (c.item_id === item_id ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0),
    );
  }, []);

  // FAVORITE
  const toggleFav = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }, []);

  const cartMap = Object.fromEntries(cart.map((c) => [c.item_id, c.qty]));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Banner />
      <div style={{ padding: "28px 36px 0", background: T.bg }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          {/* HEADER */}
          <UserHeader title="Thực đơn" description="Xin chào 👋" />

          {/* SEARCH */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "8px 12px",
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm món..."
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
              }}
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div style={{ display: "flex", gap: 8 }}>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border:
                  activeCat === cat.id
                    ? `1px solid ${T.primary}`
                    : `1px solid ${T.border}`,
                background: activeCat === cat.id ? T.primary : T.card,
                color: activeCat === cat.id ? "#fff" : T.text,
                cursor: "pointer",
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <div style={{ padding: 20 }}>
        {filtered.length === 0 ? (
          <EmptyState title="Không có món" desc="Thử lại nhé" />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {filtered.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                isFav={favorites.includes(item.id)}
                inCart={cartMap[item.id] || 0}
                onToggleFav={toggleFav}
                onAdd={addToCart}
                onDec={decCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
