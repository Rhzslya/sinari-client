import { api } from "@/lib/axios";
import type { ApiResponse } from "@/model/api-model";
import {
  toServiceLogResponse,
  type GetLogRequest,
  type ServiceLogResponse,
} from "@/model/repair-logs-model";

export class RepairLogService {
  static async get(request: GetLogRequest): Promise<ServiceLogResponse[]> {
    if (isNaN(request.id)) {
      throw new Error("Invalid service ID");
    }

    const response = await api.get<ApiResponse<ServiceLogResponse[]>>(
      `/services/${request.id}/logs`,
    );

    return response.data.data.map(toServiceLogResponse);
  }
}
