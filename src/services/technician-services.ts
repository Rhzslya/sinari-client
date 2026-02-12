import { objectToFormData } from "@/components/utils/form-helper";
import { api } from "@/lib/axios";
import {
  toTechnicianResponse,
  type ApiResponse,
  type CreateTechnicianRequest,
  type DeleteTechnicianRequest,
  type DeleteTechnicianResponse,
  type ListTechnicianResponse,
  type SearchTechnicianRequest,
  type TechnicianResponse,
  type UpdateTechnicianRequest,
} from "@/model/technician-model";
import { TechnicianValidation } from "@/validation/technician-validation";
import { Validation } from "@/validation/validation";

export class TechnicianServices {
  static async create(
    request: CreateTechnicianRequest,
  ): Promise<TechnicianResponse> {
    const createRequest = Validation.validate(
      TechnicianValidation.CREATE,
      request,
    );

    const formData = objectToFormData(createRequest);

    const response = await api.post<ApiResponse<TechnicianResponse>>(
      "/technicians",
      formData,
    );

    return toTechnicianResponse(response.data.data);
  }

  static async get(id: number): Promise<TechnicianResponse> {
    if (isNaN(id)) {
      throw new Error("Invalid technician ID");
    }

    const response = await api.get<ApiResponse<TechnicianResponse>>(
      `/technicians/${id}`,
    );

    return toTechnicianResponse(response.data.data);
  }

  static async update(
    request: UpdateTechnicianRequest,
  ): Promise<TechnicianResponse> {
    const updateRequest = Validation.validate(
      TechnicianValidation.UPDATE,
      request,
    );

    const formData = objectToFormData({
      ...updateRequest,
      delete_image: updateRequest.delete_image ? "true" : "false",
    });

    const response = await api.patch<ApiResponse<TechnicianResponse>>(
      `/technicians/${request.id}`,
      formData,
    );

    return toTechnicianResponse(response.data.data);
  }

  static async remove(
    request: DeleteTechnicianRequest,
  ): Promise<DeleteTechnicianResponse> {
    if (isNaN(request.id)) {
      throw new Error("Invalid technician ID");
    }

    const response = await api.delete(`/technicians/${request.id}`);

    return {
      message: response.data.message,
    };
  }

  static async search(
    request: SearchTechnicianRequest,
  ): Promise<ApiResponse<TechnicianResponse[]>> {
    const response = await api.get<ApiResponse<TechnicianResponse[]>>(
      "/technicians",
      {
        params: request,
      },
    );

    return response.data;
  }

  static async listActive(): Promise<ListTechnicianResponse[]> {
    const response = await api.get<ApiResponse<ListTechnicianResponse[]>>(
      "/technicians/active",
    );

    return response.data.data;
  }
}
