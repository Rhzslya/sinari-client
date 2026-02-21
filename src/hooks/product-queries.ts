import { handleApiError } from "@/lib/utils";
import type {
  ApiResponse,
  CreateProductRequest,
  DeleteProductRequest,
  DeleteProductResponse,
  DetailedProductRequest,
  ProductPublicResponse,
  ProductResponse,
  RestoreProductRequest,
  SearchProductRequest,
  UpdateProductRequest,
} from "@/model/product-model";
import { ProductServices } from "@/services/product-services";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { PRODUCT_LOG_KEYS } from "./product-log-queries";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_KEYS.all, "list"] as const,
  list: (request: SearchProductRequest) =>
    [...PRODUCT_KEYS.lists(), request] as const,
  publicLists: () => [...PRODUCT_KEYS.all, "public-list"] as const,
  publicList: (request: SearchProductRequest) =>
    [...PRODUCT_KEYS.publicLists(), request] as const,
  details: () => [...PRODUCT_KEYS.all, "detail"] as const,
  detail: (request: DetailedProductRequest) =>
    [...PRODUCT_KEYS.details(), request.id] as const,
};

export const useProductQueries = () => {
  const queryClient = useQueryClient();

  return {
    useList: (
      params: SearchProductRequest,
    ): UseQueryResult<ApiResponse<ProductResponse[]>, Error> => {
      return useQuery({
        queryKey: PRODUCT_KEYS.list(params),
        queryFn: () => ProductServices.search(params),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 30,
      });
    },

    usePublicList: (
      params: SearchProductRequest,
    ): UseQueryResult<ApiResponse<ProductPublicResponse[]>, Error> => {
      // <--- 2. UBAH JADI ProductPublicResponse
      return useQuery({
        queryKey: PRODUCT_KEYS.publicList(params),
        queryFn: () => ProductServices.searchPublic(params),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 30,
      });
    },

    useDetail: (
      request: DetailedProductRequest,
    ): UseQueryResult<ProductResponse, Error> => {
      return useQuery({
        queryKey: PRODUCT_KEYS.detail(request),
        queryFn: () => ProductServices.get(request),
        enabled: !!request?.id && !isNaN(request.id),
        staleTime: 1000 * 60,
      });
    },

    createMutation: useMutation({
      mutationFn: (request: CreateProductRequest): Promise<ProductResponse> =>
        ProductServices.create(request),
      onSuccess: (result) => {
        toast.success("Product Created", {
          description: `Product ${result.name} created successfully.`,
        });
        queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      },
      onError: (error) => handleApiError(error, "Failed to create product"),
    }),

    deleteMutation: useMutation({
      mutationFn: (
        request: DeleteProductRequest,
      ): Promise<DeleteProductResponse> => ProductServices.remove(request),
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      },
      onError: (error) => handleApiError(error, "Failed to delete product"),
    }),

    updateProductMutation: useMutation({
      mutationFn: (data: UpdateProductRequest): Promise<ProductResponse> =>
        ProductServices.update(data),
      onSuccess: (result, variables) => {
        toast.success("Product Updated", {
          description: `Product ${result.name} updated successfully.`,
        });
        queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: PRODUCT_KEYS.detail(variables),
        });
      },
      onError: (error) => handleApiError(error, "Failed to update product"),
    }),

    updateStockMutation: useMutation({
      mutationFn: (
        data: Pick<UpdateProductRequest, "id" | "stock" | "stock_action">,
      ): Promise<ProductResponse> => ProductServices.updateStock(data),
      onSuccess: (result, variables) => {
        toast.success("Stock Updated", {
          description: `Stock of ${result.name} updated successfully.`,
        });
        queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: PRODUCT_KEYS.detail(variables),
        });
      },
      onError: (error) => handleApiError(error, "Failed to update stock"),
    }),

    restoreMutation: useMutation({
      mutationFn: (data: RestoreProductRequest): Promise<ProductResponse> =>
        ProductServices.restore(data),
      onSuccess: (result, variables) => {
        toast.success("Product Restored", {
          description: `Product ${result.name} restored successfully.`,
        });
        queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: PRODUCT_KEYS.detail(variables),
        });
        queryClient.invalidateQueries({
          queryKey: PRODUCT_LOG_KEYS.detail(variables),
        });
      },
      onError: (error) => handleApiError(error, "Failed to restore product"),
    }),
  };
};
