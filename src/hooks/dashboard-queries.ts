import { DashboardService } from "@/services/dashboard-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  stats: () => [...DASHBOARD_KEYS.all, "stats"] as const,
};

export const useDashboardQueries = () => {
  const queryClient = useQueryClient();

  return {
    useStats: () => {
      return useQuery({
        queryKey: DASHBOARD_KEYS.stats(),
        queryFn: () => DashboardService.getStats(),
        staleTime: 1000 * 60 * 5,
      });
    },

    resetStats: () => {
      return queryClient.resetQueries({ queryKey: DASHBOARD_KEYS.stats() });
    },
  };
};
