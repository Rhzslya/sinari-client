import { api } from "@/lib/axios";
import {
  toServiceLogResponse,
  type GetLogRequest,
  type ServiceLogResponse,
} from "@/model/repair-logs-model";
import type { ApiResponse } from "@/model/user-model";

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
