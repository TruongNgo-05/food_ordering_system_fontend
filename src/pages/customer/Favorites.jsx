// // const CustomerFavorites = () => {
// //   return <div>Yêu Thích</div>;
// // };
// // export default CustomerFavorites;
// import React from "react";
// import { useOutletContext, useNavigate } from "react-router-dom";
// import { T, fmt } from "../../constants/customerTheme";
// import { mockMenuItems } from "../../data/mockData";
// import { SectionTitle, EmptyState } from "../../components/customer/SharedUI";

// const Favorites = () => {
//   const { favorites, setFavorites, setCart, setDetailItem } =
//     useOutletContext();
//   const navigate = useNavigate();

//   const items = mockMenuItems.filter((m) => favorites.includes(m.id));

//   const addToCart = (item) =>
//     setCart((prev) => {
//       const ex = prev.find((c) => c.item_id === item.id);
//       if (ex)
//         return prev.map((c) =>
//           c.item_id === item.id ? { ...c, qty: c.qty + 1 } : c,
//         );
//       return [
//         ...prev,
//         {
//           item_id: item.id,
//           name: item.name,
//           price: item.price,
//           image: item.image,
//           qty: 1,
//         },
//       ];
//     });

//   return (
//     <div style={{ overflowY: "auto", height: "100%", background: T.bg }}>
//       <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px" }}>
//         <SectionTitle count={items.length}>Món yêu thích</SectionTitle>

//         {items.length === 0 ? (
//           <EmptyState
//             icon="❤️"
//             title="Chưa có món yêu thích"
//             desc="Nhấn ♡ trên bất kỳ món nào để lưu vào đây"
//             btnLabel="Khám phá thực đơn"
//             onBtn={() => navigate("/customer")}
//           />
//         ) : (
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//               gap: 18,
//             }}
//           >
//             {items.map((item) => (
//               <div
//                 key={item.id}
//                 style={{
//                   background: T.card,
//                   borderRadius: 18,
//                   border: `1px solid ${T.border}`,
//                   overflow: "hidden",
//                 }}
//               >
//                 <div
//                   onClick={() => setDetailItem(item)}
//                   style={{
//                     background: T.primaryLight,
//                     height: 130,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: 64,
//                     cursor: "pointer",
//                   }}
//                 >
//                   {item.image}
//                 </div>
//                 <div style={{ padding: "16px 18px" }}>
//                   <p
//                     style={{
//                       margin: "0 0 4px",
//                       fontWeight: 800,
//                       fontSize: 15,
//                       color: T.text,
//                     }}
//                   >
//                     {item.name}
//                   </p>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 6,
//                       marginBottom: 12,
//                     }}
//                   >
//                     <span style={{ color: "#FBBF24" }}>★</span>
//                     <span style={{ fontSize: 12, color: T.sub }}>
//                       {item.rating} · {item.sold} bán
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <span
//                       style={{
//                         fontWeight: 900,
//                         color: T.primary,
//                         fontSize: 17,
//                       }}
//                     >
//                       {fmt(item.price)}
//                     </span>
//                     <div style={{ display: "flex", gap: 8 }}>
//                       <button
//                         onClick={() => addToCart(item)}
//                         style={{
//                           background: T.primary,
//                           color: "#fff",
//                           border: "none",
//                           borderRadius: 9,
//                           padding: "7px 14px",
//                           fontWeight: 700,
//                           cursor: "pointer",
//                           fontSize: 13,
//                         }}
//                       >
//                         + Giỏ
//                       </button>
//                       <button
//                         onClick={() =>
//                           setFavorites((prev) =>
//                             prev.filter((f) => f !== item.id),
//                           )
//                         }
//                         style={{
//                           background: T.redBg,
//                           color: T.red,
//                           border: "none",
//                           borderRadius: 9,
//                           width: 34,
//                           height: 34,
//                           cursor: "pointer",
//                           fontSize: 14,
//                         }}
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Favorites;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { T, fmt } from "../../constants/customerTheme";
import { mockMenuItems } from "../../data/mockData";
import { SectionTitle, EmptyState } from "../../components/customer/SharedUI";

const Favorites = () => {
  const navigate = useNavigate();

  // ✅ FAVORITES
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ✅ CART
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // FILTER
  const items = mockMenuItems.filter((m) => favorites.includes(m.id));

  // ADD CART
  const addToCart = (item) => {
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
  };

  return (
    <div style={{ overflowY: "auto", height: "100%", background: T.bg }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px" }}>
        <SectionTitle count={items.length}>Món yêu thích</SectionTitle>

        {items.length === 0 ? (
          <EmptyState
            icon="❤️"
            title="Chưa có món yêu thích"
            desc="Nhấn ♡ để lưu món"
            btnLabel="Khám phá"
            onBtn={() => navigate("/customer")}
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 18,
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  background: T.card,
                  borderRadius: 18,
                  border: `1px solid ${T.border}`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: T.primaryLight,
                    height: 130,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 64,
                  }}
                >
                  {item.image}
                </div>

                <div style={{ padding: "16px 18px" }}>
                  <p style={{ fontWeight: 800 }}>{item.name}</p>

                  <p style={{ color: T.primary }}>{fmt(item.price)}</p>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => addToCart(item)}
                      style={{
                        background: T.primary,
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      + Giỏ
                    </button>

                    <button
                      onClick={() =>
                        setFavorites((prev) =>
                          prev.filter((f) => f !== item.id),
                        )
                      }
                      style={{
                        background: "red",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "6px 10px",
                        cursor: "pointer",
                      }}
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
