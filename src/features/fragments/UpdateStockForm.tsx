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
import { ProductLogAction } from "@/enum/enum";
import { useProductQueries } from "@/hooks/product-queries";
import { useCooldown } from "@/hooks/use-cooldown";
import type {
  ProductResponse,
  UpdateProductRequest,
} from "@/model/product-model";
import { ProductValidation } from "@/validation/product-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

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
  const { t } = useTranslation();
  const { updateStockMutation } = useProductQueries();
  const {
    mutateAsync: updateStock,
    isPending,
    isError,
    error,
    reset,
  } = updateStockMutation;

  const { cooldown, startCooldown } = useCooldown("update_stock", "ratelimit_");

  const isRateLimited =
    isError && isAxiosError(error) && error.response?.status === 429;

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

  const labelStyle =
    "text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[95vw] sm:max-w-106.25 p-4 sm:p-6 rounded-xl"
      >
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle className="text-lg sm:text-xl">
            {t("products_management.forms.update_stock.title")}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("products_management.forms.update_stock.desc_1")}{" "}
            <span className="font-bold text-foreground">{product?.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-5 sm:gap-6 pt-2 sm:pt-4"
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => {
                  const currentStockValue = field.value ?? 0;

                  return (
                    <FormItem className="space-y-2">
                      <div className={labelStyle}>
                        {t("products_management.forms.update_stock.new_stock")}
                      </div>
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
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 text-right font-medium">
                        {t(
                          "products_management.forms.update_stock.current_label",
                        )}{" "}
                        <span className="font-mono">{originalStock}</span> |{" "}
                        {t("products_management.forms.update_stock.diff_label")}{" "}
                        <span
                          className={`font-mono font-bold ${
                            currentStockValue > originalStock
                              ? "text-success"
                              : currentStockValue < originalStock
                                ? "text-destructive"
                                : ""
                          }`}
                        >
                          {currentStockValue > originalStock ? "+" : ""}
                          {diff}
                        </span>
                      </div>
                      <FormMessage className="text-[10px] sm:text-xs" />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="stock_action"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className={labelStyle}>
                      {t("products_management.forms.update_stock.reason_label")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting || isPending || diff === 0}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full h-9 sm:h-10 text-xs sm:text-sm bg-input/50">
                          <SelectValue
                            placeholder={t(
                              "products_management.forms.update_stock.reason_placeholder",
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableOptions.map((action) => (
                          <SelectItem
                            key={action}
                            value={action}
                            className="text-xs sm:text-sm"
                          >
                            {formatActionLabel(action)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px] sm:text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <AnimatePresence initial={false}>
              {(cooldown > 0 || isRateLimited) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive border border-destructive/20 text-center">
                      <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 shrink-0 opacity-80" />
                      <div className="space-y-1">
                        <p className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                          {t("products_management.forms.common.action_paused")}
                        </p>
                        <p
                          className="text-[10px] sm:text-xs opacity-90 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: t(
                              "products_management.forms.common.too_many_attempts",
                            ).replace(
                              "{{seconds}}",
                              String(cooldown).padStart(2, "0"),
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <DialogFooter className="gap-2 sm:gap-3 mt-4 sm:mt-6 flex-col sm:flex-row">
              <Button
                size="sm"
                type="button"
                variant="outline"
                className="w-full sm:w-1/4 h-9 sm:h-10 text-xs sm:text-sm cursor-pointer duration-300 order-1 sm:order-0"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || isPending}
              >
                {t("products_management.forms.update_stock.btn_cancel")}
              </Button>
              <Button
                size="sm"
                className="w-full sm:w-1/2 sm:px-8 h-9 sm:h-10 text-xs sm:text-sm text-foreground cursor-pointer bg-success hover:bg-success/80 focus:ring-success duration-300"
                type="submit"
                disabled={isSubmitting || !isDirty || isPending || cooldown > 0}
              >
                {isSubmitting || isPending || isError ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("products_management.forms.update_stock.btn_save")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStockForm;
