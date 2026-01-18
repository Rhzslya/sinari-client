import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Login memanggil LoginPage */}
        <Route path="/login" element={<LoginPage />} />
        {/* Route Dashboard (Terproteksi) */}
        <Route element={<ProtectedRoute />}>
          {/* <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
          </Route> */}
        </Route>
        {/* Redirect default */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
