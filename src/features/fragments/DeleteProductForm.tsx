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
import { useProductQueries } from "@/hooks/product-queries";
import { useCooldown } from "@/hooks/use-cooldown";
import type { ProductResponse } from "@/model/product-model";
import { isAxiosError } from "axios";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useEffect } from "react";

interface DeleteProductFormProps {
  product: ProductResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteProductForm = ({
  product,
  open,
  onOpenChange,
  onSuccess,
}: DeleteProductFormProps) => {
  const { deleteMutation } = useProductQueries();

  const {
    mutateAsync: deleteProduct,
    isPending,
    isError,
    error,
    reset,
  } = deleteMutation;

  const { cooldown, startCooldown } = useCooldown(
    "delete_product",
    "ratelimit_",
  );

  const isRateLimited =
    isError && isAxiosError(error) && error.response?.status === 429;

  const handleDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct({
        id: product.id,
      });

      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch {
      // Handle by Hook
    }
  };

  useEffect(() => {
    if (isRateLimited) {
      const message = error.response?.data?.errors || "";
      const match = message.match(/(\d+)/);
      const seconds = match ? parseInt(match[1]) : 60;

      if (cooldown === 0) {
        startCooldown(seconds);
        reset();
      }
    }
  }, [isRateLimited, error, cooldown, startCooldown, reset]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

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
              Are you sure you want to delete{" "}
              <span className="inline-flex align-middle max-w-37.5">
                <TruncatedTooltip
                  text={product?.name || ""}
                  className="font-semibold text-foreground max-w-37.5 truncate"
                />
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </div>
        </DialogHeader>

        {(cooldown > 0 || isRateLimited) && (
          <div className="flex justify-center gap-2 mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-300">
            <div className="space-y-1 flex flex-col justify-center items-center">
              <AlertTriangle className="h-7 w-7 shrink-0" />
              <p className="font-semibold text-xs uppercase">Action Paused</p>
              <p className="text-xs opacity-90">
                Too many attempts. Please wait{" "}
                <span className="font-bold tabular-nums">
                  {String(cooldown).padStart(2, "0")}s
                </span>{" "}
                before trying again.
              </p>
            </div>
          </div>
        )}

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
            disabled={isPending || cooldown > 0}
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

export default DeleteProductForm;
