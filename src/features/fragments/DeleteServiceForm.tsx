import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useServiceQueries } from "@/hooks/repair-queries";
import type { ServiceResponse } from "@/model/repair-model";
import { Loader2, Trash2 } from "lucide-react";

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
  const { deleteMutation } = useServiceQueries();

  const { mutateAsync: deleteService, isPending } = deleteMutation;

  const handleDelete = async () => {
    if (!service) return;

    try {
      await deleteService({ id: service.id });

      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch {
      // Handle by Hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-106.25"
      >
        <DialogHeader>
          <div className="flex mx-auto size-16 shrink-0 items-center border-2 border-destructive justify-center rounded-full bg-foreground/10 mb-4">
            <Trash2 className="size-8 text-destructive" />
          </div>

          <div className="space-y-4 text-center">
            <DialogTitle>Delete Product?</DialogTitle>
            <DialogDescription>
              Are you sure you want to deleted{" "}
              <span className="font-semibold text-foreground">
                {service?.service_id}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="w-full sm:justify-between mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="w-1/3 cursor-pointer duration-300"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="w-1/3 cursor-pointer duration-300"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServiceForm;
