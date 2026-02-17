import { objectToFormData } from "@/components/utils/form-helper";
import { api } from "@/lib/axios";
import {
  toProductResponse,
  type ApiResponse,
  type CreateProductRequest,
  type DeleteProductRequest,
  type DeleteProductResponse,
  type DetailedProductRequest,
  type ProductResponse,
  type RestoreProductRequest,
  type SearchProductRequest,
  type UpdateProductRequest,
} from "@/model/product-model";
import { ProductValidation } from "@/validation/product-validation";
import { Validation } from "@/validation/validation";

export class ProductServices {
  static async create(request: CreateProductRequest): Promise<ProductResponse> {
    const createProductRequest = Validation.validate(
      ProductValidation.CREATE,
      request,
    );

    const formData = objectToFormData(createProductRequest);

    const response = await api.post<ApiResponse<ProductResponse>>(
      "/products",
      formData,
    );

    return toProductResponse(response.data.data);
  }

  static async search(
    request: SearchProductRequest,
  ): Promise<ApiResponse<ProductResponse[]>> {
    const response = await api.get<ApiResponse<ApiResponse<ProductResponse[]>>>(
      "/products",
      {
        params: request,
      },
    );

    return response.data.data;
  }

  static async get(request: DetailedProductRequest): Promise<ProductResponse> {
    if (isNaN(request.id)) {
      throw new Error("Invalid product ID");
    }

    const response = await api.get<ApiResponse<ProductResponse>>(
      `/products/${request.id}`,
    );

    return toProductResponse(response.data.data);
  }

  static async update(request: UpdateProductRequest): Promise<ProductResponse> {
    const updateProductRequest = Validation.validate(
      ProductValidation.UPDATE,
      request,
    );

    const formData = objectToFormData({
      ...updateProductRequest,
      delete_image: updateProductRequest.delete_image ? "true" : "false",
    });

    const response = await api.patch<ApiResponse<ProductResponse>>(
      `/products/${request.id}`,
      formData,
    );

    return toProductResponse(response.data.data);
  }

  static async updateStock(
    request: Pick<UpdateProductRequest, "id" | "stock" | "stock_action">,
  ): Promise<ProductResponse> {
    const payload = {
      stock: request.stock as number,
      stock_action: request.stock_action,
    };

    const updateStockRequest = Validation.validate(
      ProductValidation.UPDATE_STOCK,
      payload,
    );
    const response = await api.patch<ApiResponse<ProductResponse>>(
      `/products/${request.id}/stock`,
      updateStockRequest,
    );

    return toProductResponse(response.data.data);
  }

  static async remove(
    request: DeleteProductRequest,
  ): Promise<DeleteProductResponse> {
    if (isNaN(request.id)) {
      throw new Error("Invalid product ID");
    }

    const response = await api.delete<ApiResponse<boolean>>(
      `/products/${request.id}`,
    );

    return {
      message: response.data.message || "Product deleted successfully",
    };
  }

  static async restore(
    request: RestoreProductRequest,
  ): Promise<ProductResponse> {
    if (isNaN(request.id)) {
      throw new Error("Invalid product ID");
    }

    const response = await api.patch<ApiResponse<ProductResponse>>(
      `/products/${request.id}/restore`,
    );

    return toProductResponse(response.data.data);
  }
}
