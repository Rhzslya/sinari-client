import { api } from "@/lib/axios";
import {
  toPublicServiceResponse,
  toServiceResponse,
  toServiceResponseMeta,
  type AnonymizeCustomerDataRequest,
  type ApiResponse,
  type CreateServiceRequest,
  type CustomerDataAnonymizationResponse,
  type DeleteServiceRequest,
  type DeleteServiceResponse,
  type DetailedServiceRequest,
  type PublicServiceResponse,
  type RestoreServiceRequest,
  type SearchServiceRequest,
  type ServiceResponse,
  type ServiceResponseMeta,
  type TrackPublicServiceRequest,
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

  static async getById(
    request: DetailedServiceRequest,
  ): Promise<ServiceResponse> {
    const response = await api.get<ApiResponse<ServiceResponse>>(
      `/services/${request.id}`,
    );

    return toServiceResponse(response.data.data);
  }

  static async search(
    request: SearchServiceRequest,
  ): Promise<ApiResponse<ServiceResponse[]>> {
    const response = await api.get<ApiResponse<ApiResponse<ServiceResponse[]>>>(
      "/services",
      {
        params: request,
      },
    );

    return response.data.data;
  }

  static async anonymizeCustomerData(
    request: AnonymizeCustomerDataRequest,
  ): Promise<CustomerDataAnonymizationResponse> {
    if (isNaN(request.id)) {
      throw new Error("Invalid service ID");
    }

    const response = await api.patch<ApiResponse<boolean>>(
      `/services/${request.id}/anonymize-customer-data`,
    );

    return {
      message:
        response.data.message ||
        `Customer data of service ${request.id} has been anonymized successfully.`,
    };
  }

  static async remove(
    request: DeleteServiceRequest,
  ): Promise<DeleteServiceResponse> {
    if (isNaN(request.id)) {
      throw new Error("Invalid service ID");
    }

    const response = await api.delete<ApiResponse<boolean>>(
      `/services/${request.id}`,
    );

    return {
      message:
        response.data.message ||
        `Service With ID ${request.id} deleted successfully`,
    };
  }
  static async restore(
    request: RestoreServiceRequest,
  ): Promise<ServiceResponse> {
    const response = await api.patch(`/services/${request.id}/restore`);

    return toServiceResponse(response.data.data);
  }

  static async update(request: UpdateServiceRequest): Promise<{
    data: ServiceResponse;
    meta: ServiceResponseMeta;
  }> {
    const updateRequest = Validation.validate(RepairValidation.UPDATE, request);

    const response = await api.patch<
      ApiResponse<{ data: ServiceResponse; meta: ServiceResponseMeta }>
    >(`/services/${request.id}`, updateRequest);

    const apiData = response.data.data;

    return {
      data: toServiceResponse(apiData.data),
      meta: toServiceResponseMeta(apiData.meta),
    };
  }

  static async trackService(
    request: TrackPublicServiceRequest,
  ): Promise<PublicServiceResponse> {
    const response = await api.get<ApiResponse<PublicServiceResponse>>(
      `/public/services/track/${request.identifier}`,
    );

    return toPublicServiceResponse(response.data.data);
  }
}
