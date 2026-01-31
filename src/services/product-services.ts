import { objectToFormData } from "@/components/utils/form-helper";
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

    return response.data.data;
  }
}
