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
import type { ProductResponse } from "@/model/product-model";
import { ProductServices } from "@/services/product-services";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!product) return;
    setIsLoading(true);

    try {
      const response = await ProductServices.remove(product.id);
      const successMessage = response.message || "Product deleted successfully";

      toast.success("Product deleted successfully", {
        description: successMessage,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      const rawMessage = handleApiError(error);
      toast.error("Failed to delete product", {
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
            disabled={isLoading}
            className="w-1/3 cursor-pointer duration-300"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-1/3 cursor-pointer duration-300"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductForm;
