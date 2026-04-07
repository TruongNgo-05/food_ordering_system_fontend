import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/login/Login";
import AdminLayouts from "./layouts/admin/AdminLayout";
import UserLayout from "./layouts/user/UserLayout";
import ResetPassword from "./pages/login/ResetPassword";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./routers/ProtectedRoute";
import PublicRoute from "./routers/PublicRoute";
import NotFound from "./errors/NotFound";
import UserDashboard from "./pages/user/Dashboard";
import Register from "./pages/login/Register";

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
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

        {/* Protected Routes */}
        {/* User */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          {/* <Route path="exams" element={<TeacherExams />} /> */}
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
          {/* <Route path="users" element={<User />} /> */}
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
