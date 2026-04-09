import { mockCategories, mockMenuItems, mockVouchers } from "../data/mockData";

export const SHARED_DATA_UPDATED_EVENT = "shared-data-updated";

const KEYS = {
  categories: "shared-categories",
  foods: "shared-foods",
  vouchers: "shared-vouchers",
  banners: "shared-banners",
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const normalizeCategories = (categories) => {
  const fallback = clone(mockCategories);
  if (!Array.isArray(categories) || categories.length === 0) return fallback;

  const filtered = categories
    .filter((c) => c && typeof c.id === "number" && c.name)
    .map((c) => ({ id: c.id, name: c.name, icon: c.icon || "🍽️" }));

  if (!filtered.some((c) => c.id === 1)) {
    filtered.unshift({ id: 1, name: "Tất cả", icon: "🍽️" });
  }
  return filtered;
};

const normalizeFoods = (foods) => {
  const fallback = clone(mockMenuItems);
  if (!Array.isArray(foods) || foods.length === 0) return fallback;

  return foods
    .filter((f) => f && typeof f.id === "number" && f.name)
    .map((f) => {
      const primaryImage = f.image || "🍽️";
      const images = Array.isArray(f.images)
        ? f.images.filter(Boolean)
        : [];
      const normalizedImages = images.length > 0 ? images : [primaryImage];
      return {
        id: f.id,
        name: f.name,
        category_id: Number(f.category_id) || 1,
        price: Number(f.price) || 0,
        image: primaryImage,
        images: normalizedImages,
        rating: Number(f.rating) || 4.5,
        sold: Number(f.sold) || 0,
        desc: f.desc || "",
        badge: f.badge ?? null,
        status: f.status || "active",
      };
    });
};

const normalizeVouchers = (vouchers) => {
  const fallback = clone(mockVouchers);
  if (!Array.isArray(vouchers) || vouchers.length === 0) return fallback;

  return vouchers
    .filter((v) => v && v.code)
    .map((v, idx) => ({
      id: v.id || Date.now() + idx,
      code: String(v.code).toUpperCase(),
      discount_type: v.discount_type || "percent",
      discount_value: Number(v.discount_value) || 0,
      min_order: Number(v.min_order) || 0,
      max_discount: Number(v.max_discount) || 0,
      description: v.description || "",
      expired: v.expired || "",
      start_at: v.start_at || "",
      end_at: v.end_at || "",
      used: Number(v.used) || 0,
      status: v.status || "active",
      statusClass: v.statusClass || "ok",
    }));
};

const defaultBanners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1920&auto=format&fit=crop",
    title: "Ăn gì hôm nay?",
    desc: "Khám phá thực đơn món Việt đa dạng, giao tận nơi chỉ trong vài phút.",
    active: true,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1920&auto=format&fit=crop",
    title: "Món ngon mỗi ngày",
    desc: "Từ bữa sáng đến bữa tối, luôn có món hợp vị cho bạn.",
    active: true,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1920&auto=format&fit=crop",
    title: "Đặt nhanh trong 1 chạm",
    desc: "Ưu đãi hấp dẫn, thanh toán tiện lợi, giao hàng siêu tốc.",
    active: true,
  },
];

const normalizeBanners = (banners) => {
  if (!Array.isArray(banners) || banners.length === 0) return clone(defaultBanners);
  return banners
    .filter((b) => b && b.image && b.title)
    .map((b, idx) => ({
      id: b.id || Date.now() + idx,
      image: b.image,
      title: b.title,
      desc: b.desc || "",
      active: b.active !== false,
    }));
};

const read = (key, fallback, normalize) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return normalize(fallback);
    return normalize(JSON.parse(raw));
  } catch {
    return normalize(fallback);
  }
};

const write = (key, value, normalize) => {
  const normalized = normalize(value);
  localStorage.setItem(key, JSON.stringify(normalized));
  window.dispatchEvent(new Event(SHARED_DATA_UPDATED_EVENT));
  return normalized;
};

export const loadSharedCategories = () => read(KEYS.categories, mockCategories, normalizeCategories);
export const saveSharedCategories = (categories) =>
  write(KEYS.categories, categories, normalizeCategories);

export const loadSharedFoods = () => read(KEYS.foods, mockMenuItems, normalizeFoods);
export const saveSharedFoods = (foods) => write(KEYS.foods, foods, normalizeFoods);

export const loadSharedVouchers = () => read(KEYS.vouchers, mockVouchers, normalizeVouchers);
export const saveSharedVouchers = (vouchers) =>
  write(KEYS.vouchers, vouchers, normalizeVouchers);

export const loadSharedBanners = () => read(KEYS.banners, defaultBanners, normalizeBanners);
export const saveSharedBanners = (banners) => write(KEYS.banners, banners, normalizeBanners);
