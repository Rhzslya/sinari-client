import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type {
  GetLogRequest,
  ServiceLogResponse,
} from "@/model/repair-logs-model";
import { RepairLogService } from "@/services/repair-logs-services";

export const REPAIR_LOG_KEYS = {
  all: ["repair-logs"] as const,
  detail: (serviceId: number) => [...REPAIR_LOG_KEYS.all, serviceId] as const,
};

export const useServiceLogQueries = () => {
  return {
    useLogList: (
      request: GetLogRequest,
    ): UseQueryResult<ServiceLogResponse[], Error> => {
      return useQuery({
        queryKey: REPAIR_LOG_KEYS.detail(request.id),
        queryFn: () => RepairLogService.get(request),
        enabled: !!request.id && !isNaN(request.id),
        staleTime: 1000 * 60 * 2,
      });
    },
  };
};
