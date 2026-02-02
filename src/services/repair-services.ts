import { api } from "@/lib/axios";
import {
  toServiceResponse,
  type CreateServiceRequest,
  type SearchServiceRequest,
  type ServiceResponse,
  type UpdateServiceRequest,
} from "@/model/repair-model";
import type { ApiResponse } from "@/model/user-model";
import { RepairValidation } from "@/validation/repair-validation";
import { Validation } from "@/validation/validation";

export class RepairServices {
  static async create(request: CreateServiceRequest): Promise<ServiceResponse> {
    const createRequest = Validation.validate(RepairValidation.CREATE, request);

    const response = await api.post<ApiResponse<ServiceResponse>>(
      "/services",
      createRequest,
    );

    return toServiceResponse(response.data.data);
  }

  static async search(
    request: SearchServiceRequest,
  ): Promise<ApiResponse<ServiceResponse[]>> {
    const response = await api.get<ApiResponse<ServiceResponse[]>>(
      "/services",
      {
        params: request,
      },
    );

    return response.data;
  }

  static async remove(id: number): Promise<ServiceResponse> {
    const response = await api.delete(`/services/${id}`);

    return toServiceResponse(response.data.data);
  }

  static async update(request: UpdateServiceRequest): Promise<ServiceResponse> {
    const updateRequest = Validation.validate(RepairValidation.UPDATE, request);

    const response = await api.patch<ApiResponse<ServiceResponse>>(
      `/services/${request.id}`,
      updateRequest,
    );

    return toServiceResponse(response.data.data);
  }
}
