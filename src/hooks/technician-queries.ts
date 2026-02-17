import { handleApiError } from "@/lib/utils";
import type {
  CreateTechnicianRequest,
  DeleteTechnicianRequest,
  DeleteTechnicianResponse,
  GetDetailedTechnicianRequest,
  ListTechnicianResponse,
  RestoreTechnicianRequest,
  SearchTechnicianRequest,
  TechnicianResponse,
  UpdateTechnicianRequest,
} from "@/model/technician-model";
import type { ApiResponse } from "@/model/user-model";
import { TechnicianServices } from "@/services/technician-services";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const TECHNICIAN_KEYS = {
  all: ["technicians"] as const,
  lists: () => [...TECHNICIAN_KEYS.all, "list"] as const,
  list: (request: SearchTechnicianRequest) =>
    [...TECHNICIAN_KEYS.lists(), request] as const,
  details: () => [...TECHNICIAN_KEYS.all, "detail"] as const,
  detail: (request: GetDetailedTechnicianRequest) =>
    [...TECHNICIAN_KEYS.details(), request.id] as const,
  activeLists: () => [...TECHNICIAN_KEYS.all, "active_list"] as const,
};

export const useTechnicianQueries = () => {
  const queryClient = useQueryClient();

  return {
    useList: (
      params: SearchTechnicianRequest,
    ): UseQueryResult<ApiResponse<TechnicianResponse[]>, Error> => {
      return useQuery({
        queryKey: TECHNICIAN_KEYS.list(params),
        queryFn: () => TechnicianServices.search(params),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 30,
      });
    },

    useActiveList: (): UseQueryResult<ListTechnicianResponse[], Error> => {
      return useQuery({
        queryKey: TECHNICIAN_KEYS.activeLists(),
        queryFn: () => TechnicianServices.listActive(),
        staleTime: 1000 * 30,
      });
    },

    useDetail: (
      request: GetDetailedTechnicianRequest,
    ): UseQueryResult<TechnicianResponse, Error> => {
      return useQuery({
        queryKey: TECHNICIAN_KEYS.detail(request),
        queryFn: () => TechnicianServices.get(request),
        enabled: !!request?.id && !isNaN(request.id),
        staleTime: 1000 * 60,
      });
    },

    createMutation: useMutation({
      mutationFn: (
        request: CreateTechnicianRequest,
      ): Promise<TechnicianResponse> => TechnicianServices.create(request),
      onSuccess: (result) => {
        toast.success("Technician Created", {
          description: `Technician ${result.name} created successfully.`,
        });
        queryClient.invalidateQueries({ queryKey: TECHNICIAN_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: TECHNICIAN_KEYS.activeLists(),
        });
      },
      onError: (error) => handleApiError(error, "Failed to create technician"),
    }),

    deleteMutation: useMutation({
      mutationFn: (
        request: DeleteTechnicianRequest,
      ): Promise<DeleteTechnicianResponse> =>
        TechnicianServices.remove(request),
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: TECHNICIAN_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: TECHNICIAN_KEYS.activeLists(),
        });
      },
      onError: (error) => handleApiError(error, "Failed to delete technician"),
    }),

    updateTechnicianMutation: useMutation({
      mutationFn: (
        request: UpdateTechnicianRequest,
      ): Promise<TechnicianResponse> => TechnicianServices.update(request),
      onSuccess: (result, variables) => {
        toast.success("Technician Updated", {
          description: `Technician ${result.name} updated successfully.`,
        });
        queryClient.invalidateQueries({ queryKey: TECHNICIAN_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: TECHNICIAN_KEYS.activeLists(),
        });
        queryClient.invalidateQueries({
          queryKey: TECHNICIAN_KEYS.detail(variables),
        });
      },
      onError: (error) => handleApiError(error, "Failed to update technician"),
    }),

    restoreMutation: useMutation({
      mutationFn: (
        request: RestoreTechnicianRequest,
      ): Promise<TechnicianResponse> => TechnicianServices.restore(request),
      onSuccess: (result, variables) => {
        toast.success("Technician Restored", {
          description: `Technician ${result.name} restored successfully.`,
        });
        queryClient.invalidateQueries({ queryKey: TECHNICIAN_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: TECHNICIAN_KEYS.activeLists(),
        });
        queryClient.invalidateQueries({
          queryKey: TECHNICIAN_KEYS.detail(variables),
        });
      },
      onError: (error) => handleApiError(error, "Failed to restore technician"),
    }),
  };
};
