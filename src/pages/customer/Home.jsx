import React, { useState, useCallback, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { T } from "../../constants/customerTheme";
import { EmptyState } from "../../components/customer/SharedUI";
import MenuItemCard from "../../components/customer/MenuItemCard";
import Banner from "../../components/customer/Banner";
import CustomerChatWidget from "../../components/customer/CustomerChatWidget";
import SectionHeader from "../../components/common/SectionHeader";
import Categories from "../../components/common/Categories";
import Header from "../../layouts/customer/Header";
import AppPagination from "../../components/common/AppPagination";
import BackToTopButton from "../../components/common/BackToTopButton";

import { getBanner, getCategories, getFoods } from "../../services/userService";

import { useCustomerData } from "../../context/CustomerDataContext";
import { confirmLoginWithModal } from "../../utils/authGuards";
import { useAuth } from "../../hooks/useAuth";

import "../../assets/styles/CustomerHome.css";

import Footer from "../../layouts/Footer";
import CustomerSearch from "../../components/common/CustomerSearch";

const Home = () => {
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();

  const { favorites, cartMap, addToCart, updateCart, toggleFavorite } =
    useCustomerData();

  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(0);

  const [foods, setFoods] = useState([]);
  const [totalFoods, setTotalFoods] = useState(0);
  const [loadingFoods, setLoadingFoods] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(0);

  const pageSize = 10;

  const [greetingName, setGreetingName] = useState(
    () => localStorage.getItem("userFullName") || "Khách",
  );
  const requireLoginAction = useCallback(() => {
    confirmLoginWithModal(navigate);
  }, [navigate]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await getBanner();

        const mapped = (res.data.data || []).map((b) => ({
          id: b.id,
          title: b.title,
          desc: b.description,
          image: b.imageUrl,
        }));

        setBanners(mapped);
      } catch (err) {
        console.error("Lỗi load banner:", err);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();

        const list = res.data?.data?.content || [];

        setCategories([
          { id: 0, name: "Tất cả" },
          ...list.map((c) => ({
            id: c.id,
            name: c.name,
          })),
        ]);
      } catch (err) {
        console.error("Lỗi load categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchFoods = async () => {
      setLoadingFoods(true);

      try {
        const params = {
          page,
          size: pageSize,

          ...(activeCat !== 0 && {
            categoryId: activeCat,
          }),

          ...(debouncedSearch && {
            name: debouncedSearch,
          }),
        };

        const res = await getFoods(params);

        const data = res.data?.data;

        const list = data?.content || [];

        const total = data?.totalElements ?? 0;

        const mapped = list.map((f) => ({
          id: f.id,
          name: f.name,
          price: f.price,
          image: f.image || null,
          category_id: f.categoryId,
          description: f.description ?? "",
          rating: f.rating,
          soldCount: f.soldCount,
        }));

        setFoods(mapped);
        setTotalFoods(total);
      } catch (err) {
        console.error("Lỗi load foods:", err);

        setFoods([]);
        setTotalFoods(0);
      } finally {
        setLoadingFoods(false);
      }
    };

    fetchFoods();
  }, [page, activeCat, debouncedSearch]);

  const handleAddToCart = useCallback(
    async (item) => {
      if (!isLoggedIn) {
        requireLoginAction();
        return;
      }

      const success = await addToCart(item, 1);

      if (success) {
        toast.success("Thêm vào giỏ hàng thành công");
      } else {
        toast.error("Thêm vào giỏ hàng thất bại");
      }
    },
    [isLoggedIn, requireLoginAction, addToCart],
  );

  const decCart = useCallback(
    async (item) => {
      const success = await updateCart(item.item_id, -1);

      if (!success) {
        toast.error("Cập nhật giỏ hàng thất bại");
      }
    },
    [updateCart],
  );

  const handleToggleFav = useCallback(
    async (id) => {
      if (!isLoggedIn) {
        requireLoginAction();
        return;
      }

      const wasFavorite = favorites.includes(id);

      const success = await toggleFavorite(id);

      if (success) {
        if (wasFavorite) {
          toast.info("Đã xóa khỏi yêu thích");
        } else {
          toast.success("Đã thêm vào yêu thích");
        }
      } else {
        toast.error("Không thể cập nhật yêu thích");
      }
    },
    [isLoggedIn, requireLoginAction, toggleFavorite, favorites],
  );

  useEffect(() => {
    const sync = () => {
      setGreetingName(localStorage.getItem("userFullName") || "Khách");
    };

    sync();

    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const scrollToMenu = () => {
    const bannerEl = document.querySelector(".customer-hero");

    if (!bannerEl) return;

    const bottom = bannerEl.getBoundingClientRect().bottom + window.scrollY;

    window.scrollTo({
      top: Math.max(0, bottom - 35),
      behavior: "smooth",
    });
  };

  return (
    <div className="customer-home-page" style={{ background: T.bg }}>
      <Banner data={banners} onViewMenu={scrollToMenu} header={<Header />} />

      <div id="customer-menu-header" className="customer-home-header-wrap">
        <SectionHeader
          title="Thực đơn"
          description={`Xin chào ${greetingName} 👋`}
        />

        <Categories
          categories={categories}
          activeCategoryId={activeCat}
          onChange={(id) => {
            setActiveCat(id);
            setPage(0);
          }}
        />

        <CustomerSearch
          keyword={search}
          onKeywordChange={setSearch}
          placeholder="Tìm món ăn..."
        />
      </div>

      <div id="customer-menu-section" className="customer-home-content-wrap">
        {loadingFoods ? (
          <div className="customer-loading" style={{ color: T.textSub }}>
            Đang tải...
          </div>
        ) : foods.length === 0 ? (
          <EmptyState title="Không có món" desc="Thử lại nhé" />
        ) : (
          <div className="customer-home-menu-grid">
            {foods.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                isFav={favorites.includes(item.id)}
                inCart={cartMap[item.id] || 0}
                onToggleFav={handleToggleFav}
                onAdd={handleAddToCart}
                onDec={decCart}
                onClick={() => navigate(`/foods/${item.id}`)}
              />
            ))}
          </div>
        )}

        {totalFoods > 0 && (
          <AppPagination
            page={page}
            size={pageSize}
            total={totalFoods}
            onChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      <Footer />

      <CustomerChatWidget enableChat={isLoggedIn} />

      <BackToTopButton />
    </div>
  );
};

export default Home;
