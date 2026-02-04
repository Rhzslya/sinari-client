import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import {
  AdminRoute,
  GuestRoute,
  ProtectedRoute,
} from "./components/layout/AuthGuard";
import RegisterPage from "./pages/RegisterPage";
import VerifyPage from "./pages/auth/VerifyPage";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProductPage from "./pages/ProductPage";
import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import SidebarLayout from "./components/layout/SidebarLayout";
import DashboardProductPage from "./pages/DashboardProductPage";
import { Toaster } from "./components/ui/sonner";
import DetailProductPage from "./pages/DetailProductPage";
import DashboardServicePage from "./pages/DashboardServicePage";
import DetailServicePage from "./pages/DetailServicePage";
import TrackServicePage from "./pages/TrackServicePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/services/track/:identifier"
          element={<TrackServicePage />}
        />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/verify" element={<VerifyPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}></Route>

        <Route element={<AdminRoute />}>
          <Route
            element={
              <SidebarLayout>
                <Outlet />
              </SidebarLayout>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route
              path="/dashboard/products"
              element={<DashboardProductPage />}
            />

            <Route
              path="/dashboard/products/detail/:productId"
              element={<DetailProductPage />}
            />

            <Route
              path="/dashboard/services"
              element={<DashboardServicePage />}
            />

            <Route
              path="/dashboard/services/detail/:serviceId"
              element={<DetailServicePage />}
            />
          </Route>
        </Route>

        {/* Redirect default */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

export default App;
