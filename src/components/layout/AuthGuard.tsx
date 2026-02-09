import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "@/enum/product-enum";
import { useUserQueries } from "@/hooks/user-queries";
import { DashboardLayoutSkeleton } from "@/features/fragments/Skeleton";

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
  const { useProfile } = useUserQueries();

  const { data: user, isLoading, isError } = useProfile();

  if (isLoading) {
    return <DashboardLayoutSkeleton />;
  }

  const isAuthorized =
    user && (user.role === UserRole.ADMIN || user.role === UserRole.OWNER);

  if (isError || !isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
