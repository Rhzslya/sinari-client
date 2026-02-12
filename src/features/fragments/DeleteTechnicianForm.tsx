import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import { useTechnicianQueries } from "@/hooks/technician-queries";
import type { TechnicianResponse } from "@/model/technician-model";

import { Loader2, Trash2 } from "lucide-react";

interface DeleteTechnicianFormProps {
  technician: TechnicianResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteTechnicianForm = ({
  technician,
  open,
  onOpenChange,
  onSuccess,
}: DeleteTechnicianFormProps) => {
  const { deleteMutation } = useTechnicianQueries();

  const { mutateAsync: deleteTechnician, isPending } = deleteMutation;

  const handleDelete = async () => {
    if (!technician) return;

    try {
      await deleteTechnician({ id: technician.id });

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
            <DialogTitle>Delete Technician?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="inline-flex align-middle max-w-37.5">
                <TruncatedTooltip
                  text={technician?.name || ""}
                  className="font-semibold text-foreground truncate block"
                />
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

export default DeleteTechnicianForm;
