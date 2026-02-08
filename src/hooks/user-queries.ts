import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  type UseQueryResult,
} from "@tanstack/react-query";
import { AuthServices } from "@/services/user-services";
import { toast } from "sonner"; // Sesuaikan library toast kamu
import { handleApiError } from "@/lib/utils"; // Pakai utility error handler kita
import type {
  ApiResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  GetDetailedUserRequest,
  NotPublicUserResponse,
  SearchUserRequest,
  UpdateRoleRequest,
} from "@/model/user-model";

// Definisikan Query Keys agar konsisten dan tidak typo
export const USER_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_KEYS.all, "list"] as const,
  list: (params: SearchUserRequest) => [...USER_KEYS.lists(), params] as const,
  details: () => [...USER_KEYS.all, "detail"] as const,
  detail: (id: number) => [...USER_KEYS.details(), id] as const,
  profile: ["current-user"] as const,
};

export const useUserQueries = () => {
  const queryClient = useQueryClient();

  return {
    // 1. GET LIST (Search & Pagination)
    useList: (
      params: SearchUserRequest,
    ): UseQueryResult<ApiResponse<NotPublicUserResponse[]>, Error> => {
      return useQuery({
        queryKey: USER_KEYS.list(params),
        queryFn: () => AuthServices.search(params),
        placeholderData: keepPreviousData, // Agar table tidak kedip saat ganti page
        staleTime: 1000 * 30, // 30 detik data dianggap fresh
      });
    },

    // 2. GET DETAIL (Untuk halaman Detail User)
    useDetail: (
      request: GetDetailedUserRequest,
    ): UseQueryResult<NotPublicUserResponse, Error> => {
      return useQuery({
        queryKey: USER_KEYS.detail(request.id),
        queryFn: () => AuthServices.getById(request), // Asumsi ada method ini
        enabled: !!request, // Hanya jalan jika ID ada
        staleTime: 1000 * 60, // Detail user jarang berubah, cache 1 menit
      });
    },

    // 3. GET CURRENT USER (Untuk Navbar/Profile)
    useProfile: () => {
      return useQuery({
        queryKey: USER_KEYS.profile,
        queryFn: () => AuthServices.get(),
        staleTime: Infinity,
        retry: false,
      });
    },

    // --- MUTATIONS (WRITE DATA) ---
    // Di sinilah kekuatan TanStack Query: Otomatis refresh data!

    // 4. DELETE USER
    deleteMutation: useMutation({
      mutationFn: (request: DeleteUserRequest): Promise<DeleteUserResponse> =>
        AuthServices.remove(request.id),
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      },
      onError: (error) => handleApiError(error, "Failed to delete user"),
    }),

    // 5. UPDATE ROLE
    updateRoleMutation: useMutation({
      mutationFn: (data: UpdateRoleRequest): Promise<NotPublicUserResponse> =>
        AuthServices.updateRole(data),
      onSuccess: (_, variables) => {
        toast.success("Role Updated", {
          description: `User with ID ${variables.id} is now a ${variables.role}.`,
        });
        queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: USER_KEYS.detail(variables.id),
        });
      },
      onError: (error) => handleApiError(error, "Failed to update role"),
    }),
  };
};
