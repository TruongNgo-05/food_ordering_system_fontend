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
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600",
    images: [
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
      "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600",
    ],
    rating: 4.9,
    sold: 320,
    desc: "Nước dùng hầm 12 tiếng từ xương bò, thơm ngon đậm đà.",
  },
  {
    id: 2,
    name: "Cơm Tấm Sườn Bì",
    category_id: 2,
    price: 55000,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600",
    images: [
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600",
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600",
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600",
    ],
    rating: 4.7,
    sold: 210,
    desc: "Sườn nướng than hoa, bì sợi, chả hấp mềm mịn.",
  },
  {
    id: 3,
    name: "Bánh Mì Thịt Nướng",
    category_id: 4,
    price: 35000,
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600",
    images: [
      "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600",
      "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600",
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600",
    ],
    rating: 4.8,
    sold: 450,
    desc: "Bánh mì vỏ giòn, thịt nướng sả ớt thơm lừng.",
  },
  {
    id: 4,
    name: "Bún Bò Huế",
    category_id: 3,
    price: 60000,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600",
    images: [
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600",
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600",
      "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600",
    ],
    rating: 4.6,
    sold: 180,
    desc: "Cay đậm đà phong vị miền Trung, chả cua, giò heo.",
  },
  {
    id: 5,
    name: "Cơm Chiên Dương Châu",
    category_id: 2,
    price: 50000,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600",
    images: [
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600",
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600",
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600",
    ],
    rating: 4.5,
    sold: 290,
    desc: "Cơm chiên tơi, tôm, xúc xích, trứng rán giòn.",
  },
  {
    id: 6,
    name: "Trà Sữa Trân Châu",
    category_id: 5,
    price: 35000,
    image: "https://images.unsplash.com/photo-1558857563-b371033873b8?w=600",
    images: [
      "https://images.unsplash.com/photo-1558857563-b371033873b8?w=600",
      "https://images.unsplash.com/photo-1546173159-315724a31696?w=600",
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600",
    ],
    rating: 4.9,
    sold: 600,
    desc: "Trà sữa Đài Loan, trân châu đen dẻo thơm bơ.",
  },
  {
    id: 7,
    name: "Cà Phê Sữa Đá",
    category_id: 5,
    price: 25000,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600",
    images: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600",
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
    ],
    rating: 4.8,
    sold: 800,
    desc: "Cà phê phin Robusta, sữa đặc Ông Thọ.",
  },
  {
    id: 8,
    name: "Chè Ba Màu",
    category_id: 6,
    price: 30000,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600",
    images: [
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600",
    ],
    rating: 4.7,
    sold: 150,
    desc: "Đậu xanh, đậu đỏ, thạch pandan, nước cốt dừa.",
  },
  {
    id: 9,
    name: "Gỏi Cuốn Tôm Thịt",
    category_id: 6,
    price: 40000,
    image: "https://images.unsplash.com/photo-1627308595171-d1b5d67129c4?w=600",
    images: [
      "https://images.unsplash.com/photo-1627308595171-d1b5d67129c4?w=600",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
    ],
    rating: 4.6,
    sold: 200,
    desc: "Bánh tráng mềm, tôm sú, thịt ba chỉ luộc chín.",
  },
  {
    id: 10,
    name: "Bún Chả Hà Nội",
    category_id: 3,
    price: 58000,
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=600",
    images: [
      "https://images.unsplash.com/photo-1555126634-323283e090fa?w=600",
      "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600",
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600",
    ],
    rating: 4.8,
    sold: 340,
    desc: "Chả miếng & chả viên nướng than, bún tươi.",
  },
  {
    id: 11,
    name: "Sinh Tố Bơ",
    category_id: 5,
    price: 45000,
    image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600",
    images: [
      "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600",
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600",
      "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=600",
    ],
    rating: 4.7,
    sold: 120,
    desc: "Bơ Đắk Lắk chín mềm, sữa đặc, đá xay.",
  },
  {
    id: 12,
    name: "Cơm Gà Xối Mỡ",
    category_id: 2,
    price: 60000,
    image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=600",
    images: [
      "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=600",
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600",
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600",
    ],
    rating: 4.8,
    sold: 260,
    desc: "Gà xối mỡ giòn rụm, cơm trắng, salad cà chua.",
  },
];

export const mockVouchers = [
  {
    id: 1,
    code: "WELCOME20",
    discount_type: "percent",
    discount_value: 20,
    min_order: 100000,
    max_discount: 50000,
    description: "Giảm 20% tối đa 50k",
  },
  {
    id: 2,
    code: "FREESHIP",
    discount_type: "flat",
    discount_value: 15000,
    min_order: 50000,
    max_discount: 15000,
    description: "Miễn phí giao hàng",
  },
  {
    id: 3,
    code: "SUMMER30",
    discount_type: "percent",
    discount_value: 30,
    min_order: 200000,
    max_discount: 80000,
    description: "Giảm 30% tối đa 80k",
  },
];

export const mockOrders = [
  {
    id: "ORD-2041",
    created_at: "06/04/2025 12:30",
    status: "completed",
    payment_method: "COD",
    payment_status: "paid",
    items: [
      { name: "Phở Bò Đặc Biệt", image: "🍜", qty: 2, price: 65000 },
      { name: "Cà Phê Sữa Đá", image: "☕", qty: 2, price: 25000 },
    ],
    subtotal: 180000,
    discount: 36000,
    shipping: 15000,
    total: 159000,
    voucher: "WELCOME20",
    address: "123 Nguyễn Huệ, Q.1",
  },
  {
    id: "ORD-2039",
    created_at: "07/04/2025 18:45",
    status: "delivering",
    payment_method: "ONLINE",
    payment_status: "paid",
    items: [
      { name: "Cơm Tấm Sườn Bì", image: "🍚", qty: 1, price: 55000 },
      { name: "Trà Sữa Trân Châu", image: "🧋", qty: 2, price: 35000 },
    ],
    subtotal: 125000,
    discount: 0,
    shipping: 15000,
    total: 140000,
    voucher: null,
    address: "45 Lê Lợi, Q.3",
  },
  {
    id: "ORD-2040",
    created_at: "08/04/2025 09:10",
    status: "processing",
    payment_method: "COD",
    payment_status: "pending",
    items: [{ name: "Bánh Mì Thịt Nướng", image: "🥖", qty: 3, price: 35000 }],
    subtotal: 105000,
    discount: 21000,
    shipping: 0,
    total: 84000,
    voucher: "WELCOME20",
    address: "78 Đinh Tiên Hoàng, BT",
  },
];

export const mockFAQTopics = [
  {
    id: 1,
    topic: "Thanh toán",
    icon: "💳",
    questions: [
      "Tôi có thể thanh toán bằng những hình thức nào?",
      "Tiền có bị trừ ngay khi đặt không?",
      "Hoàn tiền mất bao lâu?",
    ],
  },
  {
    id: 2,
    topic: "Giao hàng",
    icon: "🛵",
    questions: [
      "Thời gian giao hàng là bao lâu?",
      "Phạm vi giao hàng ở đâu?",
      "Tôi có thể đặt giao giờ hẹn không?",
    ],
  },
  {
    id: 3,
    topic: "Đơn hàng",
    icon: "📦",
    questions: [
      "Tôi có thể hủy đơn không?",
      "Làm thế nào để theo dõi đơn hàng?",
      "Đơn hàng sai thì xử lý thế nào?",
    ],
  },
  {
    id: 4,
    topic: "Tài khoản",
    icon: "👤",
    questions: [
      "Cách đổi mật khẩu?",
      "Làm sao để xóa tài khoản?",
      "Thông tin cá nhân có được bảo mật không?",
    ],
  },
];

export const FAQ_ANSWERS = {
  "Tôi có thể thanh toán bằng những hình thức nào?":
    "Chúng tôi hỗ trợ thanh toán tiền mặt khi nhận hàng (COD) và thanh toán online qua VNPay, Momo, ZaloPay.",
  "Tiền có bị trừ ngay khi đặt không?":
    "Với thanh toán online, tiền sẽ được giữ tạm và xác nhận sau khi đơn hàng hoàn thành. Với COD, bạn trả khi nhận hàng.",
  "Hoàn tiền mất bao lâu?":
    "Thông thường 3–5 ngày làm việc tùy theo ngân hàng hoặc ví điện tử của bạn.",
  "Thời gian giao hàng là bao lâu?":
    "Từ 20–45 phút tùy khoảng cách và thời điểm. Giờ cao điểm có thể lâu hơn.",
  "Phạm vi giao hàng ở đâu?":
    "Hiện tại chúng tôi giao hàng trong bán kính 10km từ các chi nhánh tại Q.1, Q.3 và Bình Thạnh.",
  "Tôi có thể đặt giao giờ hẹn không?":
    "Hiện tại chưa hỗ trợ. Tính năng đặt trước theo giờ sẽ ra mắt trong phiên bản tiếp theo.",
};

export const mockFoodReviews = {
  1: [
    {
      id: "r-1",
      user: "Minh Anh",
      rating: 5,
      comment: "Nước dùng thơm, thịt mềm. Giao còn nóng rất ngon.",
      created_at: "2 ngày trước",
    },
    {
      id: "r-2",
      user: "Quốc Bảo",
      rating: 4,
      comment: "Khẩu phần đầy đặn, hợp vị. Sẽ gọi lại lần sau.",
      created_at: "5 ngày trước",
    },
  ],
  3: [
    {
      id: "r-3",
      user: "Thảo Vy",
      rating: 5,
      comment: "Bánh giòn, nhân đậm đà. Rất đáng tiền.",
      created_at: "1 tuần trước",
    },
  ],
  6: [
    {
      id: "r-4",
      user: "Nam Khánh",
      rating: 5,
      comment: "Trà sữa béo vừa phải, trân châu dẻo.",
      created_at: "3 ngày trước",
    },
    {
      id: "r-5",
      user: "Hồng Hạnh",
      rating: 4,
      comment: "Ngon, nhưng mình thích ít đá hơn.",
      created_at: "4 ngày trước",
    },
  ],
  10: [
    {
      id: "r-6",
      user: "Tuấn Kiệt",
      rating: 5,
      comment: "Chả nướng thơm, nước mắm pha vừa miệng.",
      created_at: "2 tuần trước",
    },
  ],
};
