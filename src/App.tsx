import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import VerifyPage from "./pages/auth/VerifyPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Sign in LoginPage */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/users" element={<RegisterPage />} />
        <Route path="/auth/verify" element={<VerifyPage />} />
        <Route element={<ProtectedRoute />}>
          {/* <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
          </Route> */}
        </Route>
        {/* Redirect default */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
