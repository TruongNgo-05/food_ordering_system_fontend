import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/login/Login";
import AdminLayouts from "./layouts/admin/AdminLayout";
import ResetPassword from "./pages/login/ResetPassword";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./routers/ProtectedRoute";
import PublicRoute from "./routers/PublicRoute";
import NotFound from "./errors/NotFound";
import Register from "./pages/login/Register";
import AdminUsers from "./pages/admin/UsersAdmin";
import AdminFoods from "./pages/admin/FoodsAdmin";
import AdminCategories from "./pages/admin/CategoriesAdmin";
import AdminVouchers from "./pages/admin/VouchersAdmin";
import AdminOrders from "./pages/admin/OrdersAdmin";
import AdminTableBookings from "./pages/admin/TableBookingsAdmin";
import AdminBanners from "./pages/admin/BannersAdmin";
import AdminReviews from "./pages/admin/ReviewsAdmin";
import CustomerHome from "./pages/customer/Home";
import CustomerCart from "./pages/customer/Cart";
import CustomerOrders from "./pages/customer/Orders";
import CustomerFavorites from "./pages/customer/Favorites";
import CustomerSupport from "./pages/customer/Support";
import CustomerFoodDetail from "./pages/customer/FoodDetail";
import CustomerTableOrder from "./pages/customer/TableOrder";
import CustomerTableQrSamples from "./pages/customer/TableQrSamples";
import CustomerLayout from "./layouts/customer/UserLayout";
import FoodDetail from "./pages/customer/FoodDetail";

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/customer" replace />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
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
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Customer routes (public) */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerHome />} />
          <Route path="foods/:id" element={<FoodDetail />} />
          <Route path="carts" element={<CustomerCart />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="favorites" element={<CustomerFavorites />} />
          <Route path="support" element={<CustomerSupport />} />
          <Route path="table-order" element={<CustomerTableOrder />} />
          <Route path="table-qr-samples" element={<CustomerTableQrSamples />} />
        </Route>

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
          <Route path="orders" element={<AdminOrders />} />
          <Route path="table-bookings" element={<AdminTableBookings />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>

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
