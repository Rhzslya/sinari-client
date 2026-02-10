import { handleApiError } from "@/lib/utils";
import type {
  ApiResponse,
  DeleteServiceRequest,
  DeleteServiceResponse,
  GetDetailedServiceRequest,
  SearchServiceRequest,
  ServiceResponse,
  ServiceResponseMeta,
  UpdateServiceRequest,
} from "@/model/repair-model";
import { RepairServices } from "@/services/repair-services";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const SERVICE_KEYS = {
  all: ["services"] as const,
  lists: () => [...SERVICE_KEYS.all, "list"] as const,
  list: (params: SearchServiceRequest) =>
    [...SERVICE_KEYS.lists(), params] as const,
  details: () => [...SERVICE_KEYS.all, "detail"] as const,
  detail: (id: number) => [...SERVICE_KEYS.details(), id] as const,
};

export const useServiceQueries = () => {
  const queryClient = useQueryClient();

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

    useDetail: (
      request: GetDetailedServiceRequest,
    ): UseQueryResult<ServiceResponse, Error> => {
      return useQuery({
        queryKey: SERVICE_KEYS.detail(request.id),
        queryFn: () => RepairServices.getById(request.id),
        enabled: !!request.id,
        staleTime: 1000 * 60,
      });
    },

    //Delete Service
    deleteMutation: useMutation({
      mutationFn: (
        request: DeleteServiceRequest,
      ): Promise<DeleteServiceResponse> => RepairServices.remove(request.id),
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.lists() });
      },
      onError: (error) => handleApiError(error, "Failed to delete service"),
    }),

    //Update Service
    updateServiceMutation: useMutation({
      mutationFn: (
        data: UpdateServiceRequest,
      ): Promise<{
        data: ServiceResponse;
        meta: ServiceResponseMeta;
      }> => RepairServices.update(data),
      onSuccess: (result, variables) => {
        toast.success("Service Updated", {
          description: `Service ${result.data.service_id} updated successfully.`,
        });
        queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: SERVICE_KEYS.detail(variables.id),
        });
      },
      onError: (error) => handleApiError(error, "Failed to update service"),
    }),

    updateStatusMutation: useMutation({
      mutationFn: (
        data: UpdateServiceRequest,
      ): Promise<{
        data: ServiceResponse;
        meta: ServiceResponseMeta;
      }> => RepairServices.update(data),
      onSuccess: (_, variables) => {
        toast.success("Status Changed", {
          description: `Service With ID ${variables.id} is now ${variables.status}.`,
        });
        queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: SERVICE_KEYS.detail(variables.id),
        });
      },
      onError: (error) => handleApiError(error, "Failed to update status"),
    }),
  };
};
