import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleApiError } from "@/lib/utils";
import type { ServiceResponse } from "@/model/repair-model";
import { RepairServices } from "@/services/repair-services";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteServiceFormProps {
  service: ServiceResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteServiceForm = ({
  service,
  open,
  onOpenChange,
  onSuccess,
}: DeleteServiceFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!service) return;
    setIsLoading(true);

    try {
      // Asumsi ada method remove di RepairServices
      await RepairServices.remove(service.id);

      toast.success("Service deleted successfully", {
        description: `Service ${service.service_id} has been removed.`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      const rawMessage = handleApiError(error);
      toast.error("Failed to delete service", {
        description: rawMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-100 gap-6"
      >
        <DialogHeader className="flex flex-col items-center gap-2 sm:text-center">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-2">
            <Trash2 className="size-7 text-red-600 dark:text-red-400" />
          </div>

          <DialogTitle className="text-xl font-semibold text-foreground">
            Delete Service?
          </DialogTitle>

          <DialogDescription className="text-center text-muted-foreground">
            Are you sure you want to delete service{" "}
            <span className="font-medium text-foreground block mt-1 text-base">
              "{service?.service_id}"
            </span>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-3 sm:gap-0 sm:flex sm:justify-between w-full">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full sm:w-auto gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServiceForm;
