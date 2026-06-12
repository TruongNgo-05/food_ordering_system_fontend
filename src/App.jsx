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
import AdminUsers from "./pages/admin/AdminUsers";
import AdminFoods from "./pages/admin/AdminFoods";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminVouchers from "./pages/admin/AdminVouchers";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminTable from "./pages/admin/AdminTable";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminOrder from "./pages/admin/AdminOrder";

import StaffLayout from "./layouts/staff/StaffLayout";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffOnlineOrders from "./pages/staff/StaffOnlineOrders";
import StaffRestaurantOrders from "./pages/staff/StaffRestaurantOrders";
import StaffTableBookings from "./pages/staff/StaffTableBookings";
import StaffTableRestaurant from "./pages/staff/StaffTableRestaurant";

import CustomerHome from "./pages/customer/Home";
import CustomerCart from "./pages/customer/Cart";
import CustomerOrders from "./pages/customer/Orders";
import OrderDetail from "./pages/customer/OrderDetail";
import CustomerFavorites from "./pages/customer/Favorites";
import CustomerSupport from "./pages/customer/Support";
import CustomerTableOrder from "./pages/user/TableOrder";
import CustomerTableQrSamples from "./pages/user/TableQrSamples";
import CustomerBlog from "./pages/user/Blog";
import CustomerLayout from "./layouts/customer/UserLayout";
import FoodDetail from "./pages/customer/FoodDetail";

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/customer" replace />} />
        <Route path="/nhahangnqt" element={<CustomerBlog />} />
        <Route path="/table-order" element={<CustomerTableOrder />} />

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
          <Route path="/customer/orders/:id" element={<OrderDetail />} />
          <Route path="favorites" element={<CustomerFavorites />} />
          <Route path="blog" element={<CustomerBlog />} />
          <Route path="support" element={<CustomerSupport />} />
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
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="tables" element={<AdminTable />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="orders" element={<AdminOrder />} />
        </Route>

        {/* Staff Routes */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["STAFF"]}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StaffDashboard />} />
          <Route path="orders/online" element={<StaffOnlineOrders />} />
          <Route path="orders/restaurant" element={<StaffRestaurantOrders />} />
          <Route path="table-bookings" element={<StaffTableBookings />} />
          <Route path="table-restaurant" element={<StaffTableRestaurant />} />
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
