import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { AuthServices } from "@/services/user-services";
import type { SearchUserRequest } from "@/model/user-model";

export const useUsers = (params: SearchUserRequest) => {
  return useQuery({
    queryKey: ["users", params],

    queryFn: async () => {
      const response = await AuthServices.search(params);
      return response;
    },

    placeholderData: keepPreviousData,

    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
};
