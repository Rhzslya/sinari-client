import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductQueries } from "@/hooks/product-queries";
import type { ProductResponse } from "@/model/product-model";
import { ArchiveRestore, Loader2 } from "lucide-react";

interface RestoreProductProps {
  product: ProductResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const RestoreProductForm = ({
  product,
  open,
  onOpenChange,
  onSuccess,
}: RestoreProductProps) => {
  const { restoreMutation } = useProductQueries();

  const { mutateAsync: restoreProduct, isPending } = restoreMutation;

  const handleDelete = async () => {
    if (!product) return;

    try {
      await restoreProduct({ id: product.id });

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
          <div className="flex mx-auto size-16 shrink-0 items-center border-2 border-success justify-center rounded-full bg-foreground/10 mb-4">
            <ArchiveRestore className="size-8 text-success" />
          </div>

          <div className="space-y-4 text-center">
            <DialogTitle>Restore Product?</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore{" "}
              <span className="font-semibold text-foreground">
                {product?.name}
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
            variant="default"
            onClick={handleDelete}
            disabled={isPending}
            className="w-1/3 cursor-pointer duration-300 text-foreground"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Restore
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RestoreProductForm;
