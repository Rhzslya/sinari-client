import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { NumberStepper } from "@/components/utils/numberStepper";
import { Brand, Category } from "@/enum/product-enum";
import { handleApiError } from "@/lib/utils";
import { type CreateProductRequest } from "@/model/product-model";
import { ProductServices } from "@/services/product-services";
import { ProductValidation } from "@/validation/product-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";

const BRAND_OPTIONS = Object.values(Brand);
const CATEGORY_OPTIONS = Object.values(Category);

interface ProductFormProps {
  onSuccess?: () => void;
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateProductRequest>({
    resolver: zodResolver(
      ProductValidation.CREATE,
    ) as Resolver<CreateProductRequest>,
    mode: "all",
    defaultValues: {
      name: "",
      brand: Brand.OTHER,
      manufacturer: "ORIGINAL",
      price: 0,
      cost_price: 0,
      category: Category.OTHER,
      stock: 0,
    },
  });

  const { isSubmitting } = form.formState;
  const nameValue = form.watch("name");
  const priceValue = form.watch("price");
  const costPriceValue = form.watch("cost_price");

  const isButtonDisabled =
    isSubmitting ||
    !nameValue ||
    Number(priceValue) <= 0 ||
    Number(costPriceValue) <= 0;

  const onSubmit = async (data: CreateProductRequest) => {
    setIsLoading(true);
    try {
      await ProductServices.create(data);

      toast.success("Product created successfully", {
        description: `${data.name} has been added to inventory.`,
      });

      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      const rawMessage = handleApiError(error);

      try {
        if (rawMessage.includes("ZodError")) {
          const jsonString = rawMessage.substring(rawMessage.indexOf("{"));
          const errorObj = JSON.parse(jsonString);
          if (errorObj.name === "ZodError" && errorObj.message) {
            const issues = JSON.parse(errorObj.message);
            if (issues.length > 0) {
              toast.error("Validation Error", {
                description: issues[0].message,
              });
              return;
            }
          }
        }
      } catch (e) {
        console.error("Gagal parsing error validation:", e);
      }

      if (rawMessage.toLowerCase().includes("product already exists")) {
        const errorMsg =
          "Duplicate Product: Item with same Name, Brand, & Category already exists.";
        toast.error("Duplicate Product", { description: errorMsg });
      } else if (rawMessage.toLowerCase().includes("forbidden")) {
        const errorMsg = "Permission Denied: Only Admin can create products.";
        toast.error("Action Failed", { description: errorMsg });
      } else {
        toast.error("Failed to create product", {
          description: rawMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-8";
  const labelStyle =
    "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex flex-col gap-8 py-4 px-2"
      >
        <div className="grid gap-5 px-1">
          <div>
            <h3 className="text-base font-semibold tracking-tight">
              General Information
            </h3>
            <p className="text-xs text-muted-foreground">
              Basic details about your product.
            </p>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="relative grid gap-2 space-y-0">
                <FormLabel className={labelStyle}>Product Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="e.g. iPhone 15 Pro Titanium"
                    className={inputStyle}
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage className="absolute -bottom-4 left-0 text-xs" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0">
                  <FormLabel className={labelStyle}>Brand</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className={inputStyle}>
                        <SelectValue placeholder="Select Brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BRAND_OPTIONS.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0">
                  <FormLabel className={labelStyle}>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className={inputStyle}>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator className="bg-border/60" />

        <div className="grid gap-5 px-1">
          <div>
            <h3 className="text-base font-semibold tracking-tight">
              Pricing & Inventory
            </h3>
            <p className="text-xs text-muted-foreground">
              Manage prices and stock availability.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0">
                  <FormLabel className={labelStyle}>Selling Price</FormLabel>
                  <FormControl>
                    <NumberStepper
                      value={field.value}
                      onChange={field.onChange}
                      step={10000}
                      prefix="Rp"
                      placeholder="0"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost_price"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0">
                  <FormLabel className={labelStyle}>Cost Price</FormLabel>
                  <FormControl>
                    <NumberStepper
                      value={field.value}
                      onChange={field.onChange}
                      step={10000}
                      prefix="Rp"
                      placeholder="0"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0">
                  <FormLabel className={labelStyle}>Initial Stock</FormLabel>
                  <FormControl>
                    <NumberStepper
                      value={field.value}
                      onChange={field.onChange}
                      step={1}
                      placeholder="0"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0">
                  <FormLabel className={labelStyle}>Manufacturer</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="ORIGINAL"
                      className={inputStyle}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border/60">
          <Button
            variant="ghost"
            type="button"
            className={`mt-2 text-sm font-semibold shadow-lg cursor-pointer text-secondary-foreground`}
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button
            className={`w-1/3 mt-2 text-sm font-semibold shadow-lg shadow-primary/20 cursor-pointer text-secondary-foreground`}
            type="submit"
            disabled={isButtonDisabled || isLoading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Save Product"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
