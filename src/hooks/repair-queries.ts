import { handleApiError } from "@/lib/utils";
import type {
  ApiResponse,
  CreateServiceRequest,
  DeleteServiceRequest,
  DeleteServiceResponse,
  DetailedServiceRequest,
  PublicServiceResponse,
  RestoreServiceRequest,
  SearchServiceRequest,
  ServiceResponse,
  ServiceResponseMeta,
  TrackPublicServiceRequest,
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
import { REPAIR_LOG_KEYS } from "./repair-log-queries";

export const SERVICE_KEYS = {
  all: ["services"] as const,
  lists: () => [...SERVICE_KEYS.all, "list"] as const,
  list: (params: SearchServiceRequest) =>
    [...SERVICE_KEYS.lists(), params] as const,
  details: () => [...SERVICE_KEYS.all, "detail"] as const,
  detail: (request: DetailedServiceRequest) =>
    [...SERVICE_KEYS.details(), request.id] as const,
  track: (request: TrackPublicServiceRequest) =>
    [...SERVICE_KEYS.all, "track", request.identifier] as const,
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
      request: DetailedServiceRequest,
    ): UseQueryResult<ServiceResponse, Error> => {
      return useQuery({
        queryKey: SERVICE_KEYS.detail(request),
        queryFn: () => RepairServices.getById(request),
        enabled: !!request?.id && !isNaN(request.id),
        staleTime: 1000 * 60,
      });
    },

    //Create Service
    createMutation: useMutation({
      mutationFn: (request: CreateServiceRequest): Promise<ServiceResponse> =>
        RepairServices.create(request),
      onSuccess: (result) => {
        toast.success("Service Created", {
          description: `Service ${result.service_id} created successfully.`,
        });
        queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.lists() });
      },
      onError: (error) => handleApiError(error, "Failed to create service"),
    }),

    //Delete Service
    deleteMutation: useMutation({
      mutationFn: (
        request: DeleteServiceRequest,
      ): Promise<DeleteServiceResponse> => RepairServices.remove(request),
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
          queryKey: SERVICE_KEYS.detail(variables),
        });
        queryClient.invalidateQueries({
          queryKey: REPAIR_LOG_KEYS.detail(variables.id),
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
          queryKey: SERVICE_KEYS.detail(variables),
        });
        queryClient.invalidateQueries({
          queryKey: REPAIR_LOG_KEYS.detail(variables.id),
        });
      },
      onError: (error) => handleApiError(error, "Failed to update status"),
    }),

    //Restore Service
    restoreMutation: useMutation({
      mutationFn: (data: RestoreServiceRequest): Promise<ServiceResponse> =>
        RepairServices.restore(data),
      onSuccess: (result, variables) => {
        toast.success("Service Restored", {
          description: `Service ${result.service_id} restored successfully.`,
        });
        queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: SERVICE_KEYS.detail(variables),
        });
        queryClient.invalidateQueries({
          queryKey: REPAIR_LOG_KEYS.detail(variables.id),
        });
      },
      onError: (error) => handleApiError(error, "Failed to restore service"),
    }),

    useTrackPublic: (
      request: TrackPublicServiceRequest,
    ): UseQueryResult<PublicServiceResponse, Error> => {
      return useQuery({
        queryKey: SERVICE_KEYS.track(request),
        queryFn: () => RepairServices.trackService(request),
        enabled: !!request?.identifier,
        staleTime: 1000 * 30,
        retry: 1,
      });
    },
  };
};
