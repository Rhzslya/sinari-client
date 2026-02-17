import { api } from "@/lib/axios";
import type { ApiResponse } from "@/model/api-model";
import {
  toProductLogResponse,
  type GetLogRequest,
  type ProductLogResponse,
} from "@/model/product-logs-model";

export class ProductLogService {
  static async get(request: GetLogRequest): Promise<ProductLogResponse[]> {
    if (isNaN(request.id)) {
      throw new Error("Invalid product ID");
    }

    const response = await api.get<ApiResponse<ProductLogResponse[]>>(
      `/products/${request.id}/logs`,
    );

    return response.data.data.map(toProductLogResponse);
  }

  static async voidLog(request: GetLogRequest): Promise<ApiResponse<string>> {
    if (isNaN(request.id)) {
      throw new Error("Invalid product log ID");
    }

    const response = await api.patch<ApiResponse<string>>(
      `/product-logs/${request.id}/void`,
    );

    return response.data;
  }
}
