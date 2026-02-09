import type {
  ApiResponse,
  SearchServiceRequest,
  ServiceResponse,
} from "@/model/repair-model";
import { RepairServices } from "@/services/repair-services";
import {
  keepPreviousData,
  useQuery,
  //   useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";

export const SERVICE_KEYS = {
  all: ["services"] as const,
  lists: () => [...SERVICE_KEYS.all, "list"] as const,
  list: (params: SearchServiceRequest) =>
    [...SERVICE_KEYS.lists(), params] as const,
  details: () => [...SERVICE_KEYS.all, "detail"] as const,
  detail: (id: number) => [...SERVICE_KEYS.details(), id] as const,
};

export const useServiceQueries = () => {
  //   const queryClient = useQueryClient();

  return {
    useList: (
      params: SearchServiceRequest,
    ): UseQueryResult<ApiResponse<ServiceResponse[]>, Error> => {
      return useQuery({
        queryKey: SERVICE_KEYS.list(params),
        queryFn: () => RepairServices.search(params),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 30,
      });
    },
  };
};
