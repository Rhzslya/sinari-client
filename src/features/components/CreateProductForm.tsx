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
import { formatBytes } from "@/components/utils/formatBytes";
import { NumberStepper } from "@/components/utils/numberStepper";
import { Brand, Category } from "@/enum/product-enum";
import { handleApiError } from "@/lib/utils";
import { type CreateProductRequest } from "@/model/product-model";
import { ProductServices } from "@/services/product-services";
import { MAX_FILE_SIZE } from "@/types/type";
import { ProductValidation } from "@/validation/product-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileImage, Loader2, Sparkles, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";

const BRAND_OPTIONS = Object.values(Brand);
const CATEGORY_OPTIONS = Object.values(Category);

interface ProductFormProps {
  onSuccess?: () => void;
}

export function CreateProductForm({ onSuccess }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formCreate = useForm<CreateProductRequest>({
    resolver: zodResolver(
      ProductValidation.CREATE,
    ) as Resolver<CreateProductRequest>,
    mode: "onChange",
    defaultValues: {
      name: "",
      brand: Brand.OTHER,
      manufacturer: "ORIGINAL",
      price: 0,
      cost_price: 0,
      category: Category.OTHER,
      stock: 0,
      image: undefined,
    },
  });

  const { isSubmitting } = formCreate.formState;
  const nameValue = formCreate.watch("name");
  const priceValue = formCreate.watch("price");
  const costPriceValue = formCreate.watch("cost_price");
  const imageValue = formCreate.watch("image");

  const isImageOversized =
    imageValue instanceof File && imageValue.size > MAX_FILE_SIZE;

  const isButtonDisabled =
    isSubmitting ||
    !nameValue ||
    Number(priceValue) <= 0 ||
    Number(costPriceValue) <= 0 ||
    isImageOversized;

  const onSubmit = async (data: CreateProductRequest) => {
    setIsLoading(true);
    try {
      await ProductServices.create(data);

      toast.success("Product created successfully", {
        description: `${data.name} has been added to inventory.`,
      });

      formCreate.reset();
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | undefined) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleRemoveImage = (onChange: (file: undefined) => void) => {
    onChange(undefined);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-8";
  const labelStyle =
    "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

  return (
    <Form {...formCreate}>
      <form
        onSubmit={formCreate.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div
          className="flex-1 overflow-y-auto px-6 py-6 
            /* Lebar scrollbar */
            [&::-webkit-scrollbar]:w-1
            
            /* Track (Jalur) transparan */
            [&::-webkit-scrollbar-track]:bg-transparent
            
            /* Thumb (Batang) warna primary transparan & bulat */
            [&::-webkit-scrollbar-thumb]:bg-primary/20 
            [&::-webkit-scrollbar-thumb]:rounded-full
            
            hover:[&::-webkit-scrollbar-thumb]:bg-primary
            transition-colors"
        >
          <div className="grid gap-5">
            <div>
              <h3 className="text-base font-semibold tracking-tight">
                General Information
              </h3>
              <p className="text-xs text-muted-foreground">
                Basic details about your product.
              </p>
            </div>

            <FormField
              control={formCreate.control}
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
                control={formCreate.control}
                name="brand"
                render={({ field }) => (
                  <FormItem className="relative grid gap-2 space-y-0 py-0">
                    <FormLabel className={labelStyle}>Brand</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger size="sm" className={inputStyle}>
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
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formCreate.control}
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
                        <SelectTrigger size="sm" className={inputStyle}>
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
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={formCreate.control}
              name="image"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel className={labelStyle}>
                    Product Image (Optional)
                  </FormLabel>
                  <FormControl>
                    {!preview ? (
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-42 border-2 border-dashed rounded-xl cursor-pointer bg-muted/5 hover:bg-muted/20 border-border transition-all group"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                            <div className="p-3 rounded-full bg-background shadow-sm mb-3 group-hover:scale-110 transition-transform">
                              <UploadCloud className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-sm font-medium text-foreground">
                              Click to upload image
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              SVG, PNG, JPG or WEBP (max. 5MB)
                            </p>
                          </div>

                          <Input
                            name={field.name}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            ref={fileInputRef}
                            onChange={(e) =>
                              handleImageChange(e, field.onChange)
                            }
                            id="dropzone-file"
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <div
                        className={`w-full overflow-hidden rounded-xl border bg-background shadow-sm ${
                          isImageOversized
                            ? "border-destructive"
                            : "border-border"
                        }`}
                      >
                        <div className="relative w-full aspect-square bg-white flex items-center justify-center border-b group">
                          <div className="absolute inset-0 bg-white"></div>

                          <img
                            src={preview}
                            alt="Preview"
                            className="relative h-full w-full object-contain z-10 p-2"
                          />

                          <div className="absolute top-2 right-2 flex gap-1 z-20">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6 rounded-md shadow-sm transition-opacity cursor-pointer duration-300"
                              onClick={() => handleRemoveImage(field.onChange)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>

                          <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center px-4">
                            {isImageOversized ? (
                              <div className="flex items-center gap-2 bg-destructive/90 backdrop-blur-sm text-destructive-foreground px-3 py-1.5 rounded-full shadow-lg border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <X className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-medium tracking-wide">
                                  File too large (Max 5MB)
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-lg border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" />
                                <span className="text-[10px] font-medium tracking-wide">
                                  Background will be removed automatically
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-1.5 bg-card border-t z-30 relative">
                          <div
                            className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isImageOversized
                                ? "bg-destructive/10"
                                : "bg-background"
                            }`}
                          >
                            <FileImage
                              className={`h-4 w-4 ${
                                isImageOversized
                                  ? "text-destructive"
                                  : "text-foreground"
                              }`}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-medium truncate ${
                                isImageOversized
                                  ? "text-destructive"
                                  : "text-foreground"
                              }`}
                            >
                              {(field.value as File)?.name || "Uploaded Image"}
                            </p>

                            <p
                              className={`text-xs absolute -bottom-4 left-0 ${
                                isImageOversized
                                  ? "text-destructive font-semibold"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {(field.value as File)?.size
                                ? formatBytes((field.value as File).size)
                                : "Ready to upload"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

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
                control={formCreate.control}
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
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formCreate.control}
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
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formCreate.control}
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
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formCreate.control}
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
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="h-4"></div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t bg-background mt-auto">
          <Button
            variant="ghost"
            type="button"
            className="w-1/4 text-sm font-semibold shadow-sm cursor-pointer text-foreground duration-300"
            onClick={() => {
              formCreate.reset();
              setPreview(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button
            className="w-1/3 text-sm font-semibold shadow-lg shadow-primary/20 cursor-pointer text-foreground duration-300"
            type="submit"
            disabled={isButtonDisabled || isLoading}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save Product"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
