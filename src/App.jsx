import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// ==============================
// AUTH CONTEXT
// ==============================
import { AuthContext } from "./context/authContext";

// ==============================
// LOGIN
// ==============================
import Login from "./pages/login/Login";
import ResetPassword from "./pages/login/ResetPassword";
import Register from "./pages/login/Register";
import OAuthSuccess from "./components/modal/auth/OAuthSuccess";

// ==============================
// ROUTER
// ==============================
import ProtectedRoute from "./routers/ProtectedRoute";
import PublicRoute from "./routers/PublicRoute";

// ==============================
// ERROR
// ==============================
import NotFound from "./errors/NotFound";

// ==============================
// ADMIN
// ==============================
import AdminLayouts from "./layouts/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminFoods from "./pages/admin/AdminFoods";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminVouchers from "./pages/admin/AdminVouchers";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminTable from "./pages/admin/AdminTable";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminOrder from "./pages/admin/AdminOrder";
import AdminSupport from "./pages/admin/AdminSupport";

// ==============================
// STAFF
// ==============================
import StaffLayout from "./layouts/staff/StaffLayout";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffOnlineOrders from "./pages/staff/StaffOnlineOrders";
import StaffRestaurantOrders from "./pages/staff/StaffRestaurantOrders";
import StaffTableBookings from "./pages/staff/StaffTableBookings";
import StaffTableRestaurant from "./pages/staff/StaffTableRestaurant";

// ==============================
// CUSTOMER
// ==============================
import CustomerLayout from "./layouts/customer/UserLayout";
import CustomerHome from "./pages/customer/Home";
import CustomerCart from "./pages/customer/Cart";
import CustomerOrders from "./pages/customer/Orders";
import OrderDetail from "./pages/customer/OrderDetail";
import CustomerFavorites from "./pages/customer/Favorites";
import CustomerSupport from "./pages/customer/Support";
import CustomerBlog from "./pages/user/Blog";
import FoodDetail from "./pages/customer/FoodDetail";
import MySupport from "./pages/customer/MySupport";
import CustomerTableOrder from "./pages/user/TableOrder";
import TableQrSamples from "./pages/user/TableQrSamples";

const HomeRedirect = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const role = localStorage.getItem("role");

  // ADMIN
  if (role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  // STAFF
  if (role === "STAFF") {
    return <Navigate to="/staff" replace />;
  }

  // CUSTOMER hoặc chưa đăng nhập
  return <Navigate to="/home" replace />;
};

// ==============================
// APP
// ==============================
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        {/* =========================
            CUSTOMER
        ========================= */}
        <Route element={<CustomerLayout />}>
          <Route path="/home" element={<CustomerHome />} />

          <Route path="/foods/:id" element={<FoodDetail />} />

          <Route path="/carts" element={<CustomerCart />} />

          <Route path="/orders" element={<CustomerOrders />} />

          <Route path="/orders/:id" element={<OrderDetail />} />

          <Route path="/favorites" element={<CustomerFavorites />} />

          <Route path="/blog" element={<CustomerBlog />} />

          <Route path="/support" element={<CustomerSupport />} />

          <Route path="/my-support" element={<MySupport />} />
        </Route>

        {/* =========================
            PUBLIC
        ========================= */}
        <Route path="/nhahangnqt" element={<CustomerBlog />} />

        <Route path="/table-order" element={<CustomerTableOrder />} />

        <Route path="/table-qr" element={<TableQrSamples />} />

        {/* =========================
            AUTH
        ========================= */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* OAuth2 */}
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* =========================
            ADMIN
        ========================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayouts />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="user" element={<AdminUsers />} />

          <Route path="foods" element={<AdminFoods />} />

          <Route path="categories" element={<AdminCategories />} />

          <Route path="vouchers" element={<AdminVouchers />} />

          <Route path="reviews" element={<AdminReviews />} />

          <Route path="banners" element={<AdminBanners />} />

          <Route path="tables" element={<AdminTable />} />

          <Route path="blog" element={<AdminBlog />} />

          <Route path="orders" element={<AdminOrder />} />

          <Route path="support" element={<AdminSupport />} />
        </Route>

        {/* =========================
            STAFF
        ========================= */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["STAFF"]}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StaffDashboard />} />

          <Route path="orders-online" element={<StaffOnlineOrders />} />

          <Route path="orders-restaurant" element={<StaffRestaurantOrders />} />

          <Route path="table-bookings" element={<StaffTableBookings />} />

          <Route path="table-restaurant" element={<StaffTableRestaurant />} />
        </Route>

        {/* =========================
            404
        ========================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* =========================
          TOAST
      ========================= */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
};

export default App;
