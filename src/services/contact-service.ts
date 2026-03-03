import emailjs from "@emailjs/browser";
import type { ContactUsRequest } from "@/model/user-model";

export class ContactServices {
  static async sendEmail(request: ContactUsRequest) {
    const templateParams = {
      from_name: request.name,
      phone_number: request.phone_number || "-",
      email: request.email,
      subject: request.subject,
      message: request.message,
    };

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    );

    return response;
  }
}
