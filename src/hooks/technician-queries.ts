import { handleApiError } from "@/lib/utils";
import type {
  CreateTechnicianRequest,
  DeleteTechnicianRequest,
  DeleteTechnicianResponse,
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
  list: (params: SearchTechnicianRequest) =>
    [...TECHNICIAN_KEYS.lists(), params] as const,
  details: () => [...TECHNICIAN_KEYS.all, "detail"] as const,
  detail: (id: number) => [...TECHNICIAN_KEYS.details(), id] as const,
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

    createMutation: useMutation({
      mutationFn: (
        request: CreateTechnicianRequest,
      ): Promise<TechnicianResponse> => TechnicianServices.create(request),
      onSuccess: (result) => {
        toast.success("Technician Created", {
          description: `Technician ${result.name} created successfully.`,
        });
        queryClient.invalidateQueries({ queryKey: TECHNICIAN_KEYS.lists() });
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
      },
      onError: (error) => handleApiError(error, "Failed to delete technician"),
    }),

    updateTechnicianMutation: useMutation({
      mutationFn: (
        data: UpdateTechnicianRequest,
      ): Promise<TechnicianResponse> => TechnicianServices.update(data),
      onSuccess: (result) => {
        toast.success("Technician Updated", {
          description: `Technician ${result.name} updated successfully.`,
        });
        queryClient.invalidateQueries({ queryKey: TECHNICIAN_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: ["technicians", "active_list"],
        });
      },
      onError: (error) => handleApiError(error, "Failed to update technician"),
    }),
  };
};
