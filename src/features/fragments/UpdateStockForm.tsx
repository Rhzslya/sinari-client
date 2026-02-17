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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NumberStepper } from "@/components/utils/numberStepper";
import { ProductLogAction } from "@/enum/product-enum";
import { useProductQueries } from "@/hooks/product-queries";
import type {
  ProductResponse,
  UpdateProductRequest,
} from "@/model/product-model";
import { ProductValidation } from "@/validation/product-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";

const formatActionLabel = (action: string) => {
  return action.replace(/_/g, " ").replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

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
  const { updateStockMutation } = useProductQueries();
  const { mutateAsync: updateStock, isPending } = updateStockMutation;

  const form = useForm<Pick<UpdateProductRequest, "stock" | "stock_action">>({
    resolver: zodResolver(ProductValidation.UPDATE_STOCK) as Resolver<
      Pick<UpdateProductRequest, "stock" | "stock_action">
    >,
    defaultValues: {
      stock: product?.stock || 0,
      stock_action: ProductLogAction.ADJUST_OPNAME,
    },
  });

  const { isSubmitting, isDirty } = form.formState;
  const originalStock = product?.stock || 0;

  const watchedStock = useWatch({
    control: form.control,
    name: "stock",
  });

  const watchedAction = useWatch({
    control: form.control,
    name: "stock_action",
  });

  const currentStock = watchedStock ?? originalStock;

  const currentAction = (watchedAction ??
    ProductLogAction.ADJUST_OPNAME) as ProductLogAction;

  const diff = currentStock - originalStock;

  const availableOptions = useMemo(() => {
    if (diff > 0) {
      return [ProductLogAction.RESTOCK, ProductLogAction.ADJUST_OPNAME];
    } else if (diff < 0) {
      return [
        ProductLogAction.SALE_OFFLINE,
        ProductLogAction.ADJUST_DAMAGE,
        ProductLogAction.ADJUST_LOST,
        ProductLogAction.ADJUST_OPNAME,
      ];
    }
    return [ProductLogAction.ADJUST_OPNAME];
  }, [diff]);

  useEffect(() => {
    if (!availableOptions.includes(currentAction)) {
      form.setValue("stock_action", availableOptions[0], {
        shouldValidate: true,
      });
    }
  }, [availableOptions, currentAction, form]);

  useEffect(() => {
    if (open && product) {
      form.reset({
        stock: product.stock,
        stock_action: ProductLogAction.ADJUST_OPNAME,
      });
    }
  }, [product, open, form]);

  const onSubmit = async (
    data: Pick<UpdateProductRequest, "stock" | "stock_action">,
  ) => {
    if (!product) return;

    try {
      await updateStock({
        id: product.id,
        stock: data.stock,
        stock_action: data.stock_action,
      });

      onSuccess();
      onOpenChange(false);
    } catch {
      //Handle by Hook
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
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => {
                  const currentStockValue = field.value ?? 0;

                  return (
                    <FormItem>
                      <FormLabel>New Stock Value</FormLabel>
                      <FormControl>
                        <NumberStepper
                          placeholder="0"
                          value={currentStockValue}
                          onChange={(val) => field.onChange(val ?? 0)}
                          min={0}
                          step={1}
                          disabled={isSubmitting || isPending}
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
                      <div className="text-xs text-muted-foreground mt-1 text-right">
                        Current: {originalStock} | Diff:{" "}
                        <span
                          className={
                            currentStockValue > originalStock
                              ? "text-success"
                              : currentStockValue < originalStock
                                ? "text-destructive"
                                : ""
                          }
                        >
                          {currentStockValue > originalStock ? "+" : ""}
                          {diff}
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* FIELD STOCK ACTION (Dropdown) */}
              <FormField
                control={form.control}
                name="stock_action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Adjustment</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting || isPending || diff === 0}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableOptions.map((action) => (
                          <SelectItem key={action} value={action}>
                            {formatActionLabel(action)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                size="sm"
                type="button"
                variant="outline"
                className="cursor-pointer duration-300"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="w-1/3 text-foreground text-sm cursor-pointer bg-success hover:bg-success/80 focus:ring-success duration-300"
                type="submit"
                disabled={isSubmitting || !isDirty || isPending}
              >
                Save Changes
                {isSubmitting ||
                  (isPending && (
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
