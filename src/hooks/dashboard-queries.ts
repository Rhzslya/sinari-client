import { DashboardService } from "@/services/dashboard-service";
import { useQuery } from "@tanstack/react-query";

export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  stats: () => [...DASHBOARD_KEYS.all, "stats"] as const,
};

export const useDashboardQueries = () => {
  return {
    useStats: () => {
      return useQuery({
        queryKey: DASHBOARD_KEYS.stats(),
        queryFn: () => DashboardService.getStats(),
        staleTime: 1000 * 60 * 5,
      });
    },
  };
};
