import { WhatsappService } from "@/services/whatsapp-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // Sesuaikan dengan library toast kamu

export const useWhatsappQueries = (isTabActive: boolean = false) => {
  const queryClient = useQueryClient();

  const useGetStatus = () => {
    return useQuery({
      queryKey: ["whatsapp-status"],
      queryFn: WhatsappService.getStatus,
      refetchInterval: (query) => {
        if (!isTabActive) return false;

        const status = query.state.data?.status;
        return status === "connected" ? false : 5000;
      },
    });
  };

  const disconnectMutation = useMutation({
    mutationFn: WhatsappService.disconnectDevice,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["whatsapp-status"] });
      } else {
        toast.error("Gagal memutuskan koneksi WhatsApp.");
      }
    },
    onError: () => {
      toast.error("Terjadi kesalahan pada server.");
    },
  });

  return {
    useGetStatus,
    disconnectMutation,
  };
};
