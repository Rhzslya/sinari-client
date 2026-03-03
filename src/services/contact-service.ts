import type {
  ApiResponse,
  ContactUsRequest,
  ContactUsResponse,
} from "@/model/contact-model";
import { api } from "@/lib/axios";

export class ContactServices {
  static async sendEmail(
    request: ContactUsRequest,
  ): Promise<ContactUsResponse> {
    const response = await api.post<ApiResponse<boolean>>(
      "/public/contact-us",
      request,
      {
        skipGlobalErrorHandler: true,
      },
    );

    return {
      message: response.data.message || "Mail sent successfully",
    };
  }
}
