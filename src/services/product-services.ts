import { api } from "@/lib/axios";
import {
  toProductResponse,
  type ApiResponse,
  type CreateProductRequest,
  type ProductResponse,
  type SearchProductRequest,
} from "@/model/product-model";
import { ProductValidation } from "@/validation/product-validation";
import { Validation } from "@/validation/validation";

export class ProductServices {
  static async create(request: CreateProductRequest): Promise<ProductResponse> {
    const CreateProductRequest = Validation.validate(
      ProductValidation.CREATE,
      request,
    );

    const response = await api.post<ApiResponse<ProductResponse>>(
      "/products",
      CreateProductRequest,
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
}
