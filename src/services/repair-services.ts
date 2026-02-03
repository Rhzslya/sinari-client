import { api } from "@/lib/axios";
import {
  toServiceResponse,
  toServiceResponseMeta,
  type ApiResponse,
  type CreateServiceRequest,
  type DeleteServiceResponse,
  type SearchServiceRequest,
  type ServiceResponse,
  type ServiceResponseMeta,
  type UpdateServiceRequest,
} from "@/model/repair-model";
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

  static async getById(id: number): Promise<ServiceResponse> {
    const response = await api.get<ApiResponse<ServiceResponse>>(
      `/services/${id}`,
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

  static async remove(id: number): Promise<DeleteServiceResponse> {
    const response = await api.delete(`/services/${id}`);

    return {
      message: response.data.message,
    };
  }

  static async update(request: UpdateServiceRequest): Promise<{
    data: ServiceResponse;
    meta: ServiceResponseMeta;
  }> {
    const updateRequest = Validation.validate(RepairValidation.UPDATE, request);

    const response = await api.patch<ApiResponse<ServiceResponse>>(
      `/services/${request.id}`,
      updateRequest,
    );

    const apiMeta = response.data.meta;
    const safeMeta: ServiceResponseMeta = {
      wa_status: apiMeta?.wa_status || "skipped",
      message: apiMeta?.message || "",
    };

    return {
      data: toServiceResponse(response.data.data),
      meta: toServiceResponseMeta(safeMeta),
    };
  }
}
