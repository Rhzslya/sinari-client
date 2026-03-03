import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
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
import DashboardUserPage from "./pages/DashboardUserPage";
import DashboardTechnicianPage from "./pages/DashboardTechnicianPage";
import NotFoundPage from "./pages/NotFoundPage";
import DetailUserPage from "./pages/DetailUserPage";
import DashboardSettingPage from "./pages/DashboardSettingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FaqPage from "./pages/FaqPage";
import WarrantyPage from "./pages/WarrantyPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";

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
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/warranty" element={<WarrantyPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          <Route
            path="*"
            element={
              <NotFoundPage
                variant="minimal"
                entityName="Page"
                isDashboard={false}
              />
            }
          />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/verify" element={<VerifyPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

          <Route
            path="*"
            element={
              <NotFoundPage
                variant="minimal"
                entityName="Page"
                isDashboard={false}
              />
            }
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

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

            <Route path="/dashboard/users" element={<DashboardUserPage />} />

            <Route
              path="/dashboard/users/detail/:userId"
              element={<DetailUserPage />}
            />

            <Route
              path="/dashboard/technicians"
              element={<DashboardTechnicianPage />}
            />

            <Route
              path="/dashboard/settings"
              element={<DashboardSettingPage />}
            />

            <Route
              path="*"
              element={
                <NotFoundPage
                  variant="glass"
                  entityName="Page"
                  isDashboard={true}
                />
              }
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <NotFoundPage
              variant="minimal"
              entityName="Page"
              isDashboard={false}
            />
          }
        />
      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

export default App;
