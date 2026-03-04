import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import type {
  StoreSettingPublicResponse,
  StoreSettingResponse,
  UpdateStoreSettingRequest,
} from "@/model/store-setting-model";
import { StoreSettingService } from "@/services/store-setting-service";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";

export const STORE_SETTING_KEYS = {
  all: ["store-settings"] as const,
  detail: () => [...STORE_SETTING_KEYS.all, "current"] as const,
};

export const useStoreSettingQueries = () => {
  const queryClient = useQueryClient();

  return {
    useGetSettings: (): UseQueryResult<StoreSettingResponse, Error> => {
      return useQuery({
        queryKey: STORE_SETTING_KEYS.detail(),
        queryFn: () => StoreSettingService.get(),
        staleTime: 1000 * 60 * 5,
        retry: false,
      });
    },

    useGetPublicSettings: (): UseQueryResult<
      StoreSettingPublicResponse,
      Error
    > => {
      return useQuery({
        queryKey: STORE_SETTING_KEYS.detail(),
        queryFn: () => StoreSettingService.getPublic(),
        staleTime: 1000 * 60 * 5,
        retry: false,
      });
    },

    updateMutation: useMutation({
      mutationFn: (request: UpdateStoreSettingRequest) =>
        StoreSettingService.update(request),
      onSuccess: () => {
        toast.success("Settings Updated", {
          description: "Store information has been saved successfully.",
        });
        queryClient.invalidateQueries({ queryKey: STORE_SETTING_KEYS.all });
      },
      onError: (error) =>
        handleApiError(error, "Failed to update store settings"),
    }),
  };
};
