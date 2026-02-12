import { api } from "@/lib/axios";
import {
  type ApiResponse,
  type DashboardStatsResponse,
} from "@/model/dashboard-model";

export class DashboardService {
  static async getStats(): Promise<DashboardStatsResponse> {
    const response =
      await api.get<ApiResponse<DashboardStatsResponse>>("/dashboard/stats");

    return response.data.data;
  }
}
