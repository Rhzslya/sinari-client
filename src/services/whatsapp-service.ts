import { api } from "@/lib/axios";
import type {
  ApiResponse,
  WhatsappDisconnectResponse,
  WhatsappStatusResponse,
} from "@/model/whatsapp-model";

export class WhatsappService {
  static async getStatus(): Promise<WhatsappStatusResponse> {
    const response =
      await api.get<ApiResponse<WhatsappStatusResponse>>("/whatsapp/status");

    return response.data.data;
  }

  static async disconnectDevice(): Promise<WhatsappDisconnectResponse> {
    const response = await api.post<ApiResponse<WhatsappDisconnectResponse>>(
      "/whatsapp/disconnect",
    );

    return response.data.data;
  }
}
