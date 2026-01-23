import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { GuestRoute, ProtectedRoute } from "./components/layout/AuthGuard";
import RegisterPage from "./pages/RegisterPage";
import VerifyPage from "./pages/auth/VerifyPage";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProductPage from "./pages/ProductPage";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Halaman yang dibungkus MainLayout */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />

          {/* Services (jika ada nanti) */}
          {/* <Route path="/services" element={<ServicePage />} /> */}
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/verify" element={<VerifyPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}></Route>

        {/* Redirect default */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
