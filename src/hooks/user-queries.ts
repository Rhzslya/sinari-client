import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  type UseQueryResult,
} from "@tanstack/react-query";
import { AuthServices } from "@/services/user-services";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";
import type {
  ApiResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  DetailedUserResponse,
  GetDetailedUserRequest,
  NotPublicUserResponse,
  RestoreUserRequest,
  SearchUserRequest,
  UpdateRoleRequest,
} from "@/model/user-model";

export const USER_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_KEYS.all, "list"] as const,
  list: (request: SearchUserRequest) =>
    [...USER_KEYS.lists(), request] as const,
  details: () => [...USER_KEYS.all, "detail"] as const,
  detail: (request: GetDetailedUserRequest) =>
    [...USER_KEYS.details(), request.id] as const,
  profile: ["current-user"] as const,
};

export const useUserQueries = () => {
  const queryClient = useQueryClient();

  return {
    useList: (
      request: SearchUserRequest,
    ): UseQueryResult<ApiResponse<NotPublicUserResponse[]>, Error> => {
      return useQuery({
        queryKey: USER_KEYS.list(request),
        queryFn: () => AuthServices.search(request),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 30,
      });
    },

    useDetail: (
      request: GetDetailedUserRequest,
    ): UseQueryResult<DetailedUserResponse, Error> => {
      return useQuery({
        queryKey: USER_KEYS.detail(request),
        queryFn: () => AuthServices.getById(request),
        enabled: !!request?.id && !isNaN(request.id),
        staleTime: 1000 * 60,
      });
    },

    useProfile: () => {
      return useQuery({
        queryKey: USER_KEYS.profile,
        queryFn: () => AuthServices.get(),
        staleTime: Infinity,
        retry: false,
      });
    },

    deleteMutation: useMutation({
      mutationFn: (request: DeleteUserRequest): Promise<DeleteUserResponse> =>
        AuthServices.remove(request),
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      },
      onError: (error) => handleApiError(error, "Failed to delete user"),
    }),

    updateRoleMutation: useMutation({
      mutationFn: (
        request: UpdateRoleRequest,
      ): Promise<NotPublicUserResponse> => AuthServices.updateRole(request),
      onSuccess: (_, variables) => {
        toast.success("Role Updated", {
          description: `User with ID ${variables.id} is now a ${variables.role}.`,
        });
        queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: USER_KEYS.detail(variables),
        });
      },
      onError: (error) => handleApiError(error, "Failed to update role"),
    }),

    restoreMutation: useMutation({
      mutationFn: (
        request: RestoreUserRequest,
      ): Promise<NotPublicUserResponse> => AuthServices.restore(request),
      onSuccess: (result, variables) => {
        toast.success("User Restored", {
          description: `User with ID ${result.id} has been restored.`,
        });
        queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: USER_KEYS.detail(variables),
        });
      },
      onError: (error) => handleApiError(error, "Failed to restore user"),
    }),

    reset: () => {
      return queryClient.resetQueries({ queryKey: USER_KEYS.lists() });
    },
  };
};
