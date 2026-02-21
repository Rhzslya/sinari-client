import type { ApiResponse } from "@/model/api-model";
import type {
  GetLogRequest,
  ProductLogResponse,
} from "@/model/product-logs-model";
import { ProductLogService } from "@/services/product-logs-service";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { PRODUCT_KEYS } from "./product-queries";
import { handleApiError } from "@/lib/utils";

export const PRODUCT_LOG_KEYS = {
  all: ["product-logs"] as const,
  detail: (request: GetLogRequest) =>
    [...PRODUCT_LOG_KEYS.all, request.id] as const,
};

export const useProductLogQueries = () => {
  const queryClient = useQueryClient();

  return {
    useLogList: (
      request: GetLogRequest,
    ): UseQueryResult<ProductLogResponse[], Error> => {
      return useQuery({
        queryKey: PRODUCT_LOG_KEYS.detail(request),
        queryFn: () => ProductLogService.get(request),
        enabled: !!request.id && !isNaN(request.id),
        staleTime: 1000 * 60 * 2,
      });
    },

    voidLogMutation: useMutation({
      mutationFn: (request: GetLogRequest): Promise<ApiResponse<string>> =>
        ProductLogService.voidLog(request),
      onSuccess: (result) => {
        toast.success("Log Voided", {
          description: result.data,
        });
        queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
        queryClient.invalidateQueries({ queryKey: ["product-logs"] });
      },
      onError: (error) => handleApiError(error, "Failed to void log"),
    }),
  };
};
