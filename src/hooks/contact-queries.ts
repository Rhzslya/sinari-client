import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ContactServices } from "@/services/contact-service";
import type { ContactUsRequest } from "@/model/contact-model";

export const useContactQueries = () => {
  return {
    sendEmailMutation: useMutation({
      mutationFn: (request: ContactUsRequest) =>
        ContactServices.sendEmail(request),
      onSuccess: () => {
        toast.success("Pesan Berhasil Terkirim!", {
          description:
            "Tim Sinari Cell akan menghubungi Anda melalui WhatsApp/Email.",
        });
      },
      onError: (error) => {
        console.error("EmailJS Error:", error);
        toast.error("Gagal Mengirim Pesan", {
          description: "Pastikan koneksi internet stabil atau coba lagi nanti.",
        });
      },
    }),
  };
};
