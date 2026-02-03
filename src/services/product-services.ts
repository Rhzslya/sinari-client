import { objectToFormData } from "@/components/utils/form-helper";
import { api } from "@/lib/axios";
import {
  toProductResponse,
  type ApiResponse,
  type CreateProductRequest,
  type DeleteProductResponse,
  type ProductResponse,
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
    const response = await api.get<ApiResponse<ProductResponse[]>>(
      "/products",
      {
        params: request,
      },
    );

    return response.data;
  }

  static async get(id: number): Promise<ProductResponse> {
    if (isNaN(id)) {
      throw new Error("Invalid product ID");
    }

    const response = await api.get<ApiResponse<ProductResponse>>(
      `/products/${id}`,
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

  static async remove(id: number): Promise<DeleteProductResponse> {
    const response = await api.delete(`/products/${id}`);

    return {
      message: response.data.message,
    };
  }
}
