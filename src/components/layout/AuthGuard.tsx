import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/types/type";
import { useEffect, useState } from "react";

export const GuestRoute = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  const [isAuthorized] = useState(() => {
    const token = localStorage.getItem("token");

    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const isAdmin = decoded.role === "admin";

      const isTokenValid = decoded.exp * 1000 > Date.now();

      return isAdmin && isTokenValid;
    } catch (error) {
      console.error("Failed to decode token", error);
      return false;
    }
  });

  useEffect(() => {
    if (!isAuthorized) {
      localStorage.clear();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
