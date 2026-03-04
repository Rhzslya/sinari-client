import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ContactServices } from "@/services/contact-service";
import type { ContactUsRequest } from "@/model/contact-model";
import { handleApiError } from "@/lib/utils";

export const useContactQueries = () => {
  return {
    sendEmailMutation: useMutation({
      mutationFn: (request: ContactUsRequest) =>
        ContactServices.sendEmail(request),
      onSuccess: () => {
        toast.success("Message Sent Successfully!", {
          description:
            "We will contact you as soon as possible. Thank you for your message!",
        });
      },
      onError: (error) => handleApiError(error, "Failed to send email"),
    }),
  };
};
