import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NumberStepper } from "@/components/utils/numberStepper";
import { handleApiError } from "@/lib/utils";
import type {
  ProductResponse,
  UpdateProductRequest,
} from "@/model/product-model";
import { ProductServices } from "@/services/product-services";
import { ProductValidation } from "@/validation/product-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";

interface UpdateStockFormProps {
  product: ProductResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const UpdateStockForm = ({
  product,
  open,
  onOpenChange,
  onSuccess,
}: UpdateStockFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Pick<UpdateProductRequest, "stock">>({
    resolver: zodResolver(ProductValidation.UPDATE_STOCK) as Resolver<
      Pick<UpdateProductRequest, "stock">
    >,
    defaultValues: {
      stock: product?.stock || 0,
    },
  });

  const { isSubmitting, isDirty } = form.formState;
  const originalStock = product?.stock || 0;

  useEffect(() => {
    if (open && product) {
      form.reset({
        stock: product.stock,
      });
    }
  }, [product, open, form]);

  const onSubmit = async (data: Pick<UpdateProductRequest, "stock">) => {
    if (!product) return;
    setIsLoading(true);

    try {
      await ProductServices.update({
        id: product.id,
        stock: data.stock,
      });

      toast.success("Stock updated successfully", {
        description: `${product.name} has been updated.`,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      handleApiError(error, "Failed to update stock");
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
          <DialogTitle>Update Stock</DialogTitle>
          <DialogDescription>
            Adjust inventory level for{" "}
            <span className="font-semibold text-foreground">
              {product?.name}
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6 py-4"
          >
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock</FormLabel>
                    <FormControl>
                      <NumberStepper
                        placeholder="0"
                        value={field.value}
                        onChange={(val) => field.onChange(val ?? 0)}
                        min={0}
                        step={1}
                        disabled={isSubmitting}
                        onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                          e.target.select();
                        }}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                          field.onBlur();
                          if (
                            e.target.value === "" ||
                            isNaN(Number(e.target.value))
                          ) {
                            field.onChange(originalStock);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="px-7">
              <Button
                size="sm"
                type="button"
                variant="outline"
                className="cursor-pointer duration-300"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="w-1/3 text-foreground text-sm cursor-pointer bg-success hover:bg-success/80 focus:ring-success duration-300"
                type="submit"
                disabled={isSubmitting || !isDirty}
              >
                Save Changes
                {isSubmitting ||
                  (isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ))}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStockForm;
