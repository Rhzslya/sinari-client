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
import { Brand, Category } from "@/enum/enum";
import { useProductQueries } from "@/hooks/product-queries";
import { useCooldown } from "@/hooks/use-cooldown";
import { type CreateProductRequest } from "@/model/product-model";
import { MAX_FILE_SIZE } from "@/types/type";
import { ProductValidation } from "@/validation/product-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  AlertTriangle,
  FileImage,
  Loader2,
  UploadCloud,
  X,
  PenLine,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const BRAND_OPTIONS = Object.values(Brand);
const CATEGORY_OPTIONS = Object.values(Category);

const formContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const formItemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateProductForm({ onSuccess, onCancel }: ProductFormProps) {
  const { t } = useTranslation();
  const { createMutation } = useProductQueries();
  const {
    mutateAsync: createProduct,
    isPending,
    isError,
    error,
    reset,
  } = createMutation;

  const { cooldown, startCooldown } = useCooldown(
    "create_product",
    "ratelimit_",
  );

  const isRateLimited =
    isError && isAxiosError(error) && error.response?.status === 429;

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

  const { isSubmitting, isDirty } = formCreate.formState;

  const nameValue = useWatch({
    control: formCreate.control,
    name: "name",
  });
  const priceValue = useWatch({
    control: formCreate.control,
    name: "price",
  });
  const costPriceValue = useWatch({
    control: formCreate.control,
    name: "cost_price",
  });
  const imageValue = useWatch({
    control: formCreate.control,
    name: "image",
  });

  const isImageOversized =
    imageValue instanceof File && imageValue.size > MAX_FILE_SIZE;

  const isSellingPriceLowerThanCostPrice =
    Number(priceValue) < Number(costPriceValue);

  const isButtonDisabled =
    isPending ||
    !nameValue ||
    Number(priceValue) <= 0 ||
    Number(costPriceValue) <= 0 ||
    isImageOversized ||
    isSellingPriceLowerThanCostPrice ||
    cooldown > 0;

  const handleReset = () => {
    formCreate.reset({
      name: "",
      brand: Brand.OTHER,
      manufacturer: "ORIGINAL",
      price: 0,
      cost_price: 0,
      category: Category.OTHER,
      stock: 0,
      image: undefined,
    });
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  const handleRemoveImage = (
    e: React.MouseEvent,
    onChange: (file: undefined) => void,
  ) => {
    e.stopPropagation();
    onChange(undefined);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: CreateProductRequest) => {
    try {
      await createProduct(data);
      handleReset();
      if (onSuccess) onSuccess();
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

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-xs sm:text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-9 sm:h-10";
  const labelStyle =
    "text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider";

  return (
    <Form {...formCreate}>
      <form
        onSubmit={(e) => void formCreate.handleSubmit(onSubmit)(e)}
        className="flex flex-col h-full relative"
      >
        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 
           [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-primary/20 
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-primary
            transition-colors"
        >
          <motion.div
            className="grid gap-8 sm:gap-10 pb-8 sm:pb-12"
            variants={formContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {(cooldown > 0 || isRateLimited) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-center gap-2 mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20"
                >
                  <div className="space-y-1 flex flex-col justify-center items-center">
                    <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
                    <p className="font-semibold text-[10px] sm:text-xs uppercase">
                      {t("products_management.forms.common.action_paused")}
                    </p>
                    <p
                      className="text-[10px] sm:text-xs opacity-90 text-center"
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
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={formItemVariants} className="space-y-7">
              <div>
                <h3 className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
                  {t("products_management.forms.create.general_title")}
                </h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  {t("products_management.forms.create.general_desc")}
                </p>
              </div>

              <FormField
                control={formCreate.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="relative grid gap-2 space-y-0">
                    <FormLabel className={labelStyle}>
                      {t("products_management.forms.create.name_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="nope"
                        placeholder={t(
                          "products_management.forms.create.name_placeholder",
                        )}
                        className={inputStyle}
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-5 left-0 text-[10px] sm:text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-7">
                <FormField
                  control={formCreate.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="relative grid gap-2 space-y-0 py-0">
                      <FormLabel className={labelStyle}>
                        {t("products_management.forms.create.brand_label")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger size="sm" className={inputStyle}>
                            <SelectValue
                              placeholder={t(
                                "products_management.forms.create.brand_placeholder",
                              )}
                            />
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
                      <FormMessage className="absolute -bottom-5 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formCreate.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="relative grid gap-2 space-y-0">
                      <FormLabel className={labelStyle}>
                        {t("products_management.forms.create.category_label")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger size="sm" className={inputStyle}>
                            <SelectValue
                              placeholder={t(
                                "products_management.forms.create.category_placeholder",
                              )}
                            />
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
                      <FormMessage className="absolute -bottom-5 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            <motion.div variants={formItemVariants} className="space-y-7">
              <FormField
                control={formCreate.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="grid gap-2 relative">
                    <div className={labelStyle}>
                      {t("products_management.forms.create.image_label")}
                    </div>
                    <FormControl>
                      <div className="w-full">
                        <Input
                          name={field.name}
                          onBlur={field.onBlur}
                          disabled={isSubmitting || isPending}
                          ref={fileInputRef}
                          onChange={(e) => handleImageChange(e, field.onChange)}
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          className="hidden"
                        />

                        {!preview ? (
                          <div className="flex items-center justify-center w-full">
                            <div
                              onClick={triggerFileInput}
                              className="flex flex-col items-center justify-center w-full aspect-2/1 border-2 border-dashed rounded-xl cursor-pointer bg-muted/5 hover:bg-muted/20 border-border transition-all group"
                            >
                              <div className="flex flex-col items-center justify-center text-center px-4">
                                <div className="p-3 sm:p-4 rounded-full bg-background shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                  <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <p className="text-xs sm:text-sm font-medium text-foreground">
                                  {t(
                                    "products_management.forms.create.upload_prompt",
                                  )}
                                </p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                                  {t(
                                    "products_management.forms.create.upload_format",
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`w-full overflow-hidden rounded-xl border bg-background shadow-sm group relative cursor-pointer ${
                              isImageOversized
                                ? "border-destructive"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={triggerFileInput}
                          >
                            <div className="relative w-full aspect-2/1 bg-white flex items-center justify-center border-b">
                              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjZWVlIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-50"></div>

                              <img
                                src={preview}
                                alt="Preview"
                                className="relative h-full w-full object-contain z-10 p-2 sm:p-4 mix-blend-multiply"
                              />

                              <div className="absolute inset-0 z-20 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <PenLine className="w-6 h-6 sm:w-8 sm:h-8 text-white mb-2" />
                                <span className="text-white text-[10px] sm:text-xs font-medium">
                                  Klik untuk mengubah gambar
                                </span>
                              </div>

                              <div className="absolute top-2 right-2 flex gap-1 z-30">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  disabled={isSubmitting || isPending}
                                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-md shadow-sm transition-transform hover:scale-110 cursor-pointer"
                                  onClick={(e) =>
                                    handleRemoveImage(e, field.onChange)
                                  }
                                >
                                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                              </div>

                              <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 z-20 flex justify-center px-2">
                                {isImageOversized ? (
                                  <div className="flex items-center gap-1.5 sm:gap-2 bg-destructive/90 backdrop-blur-sm text-destructive-foreground px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg border border-white/10">
                                    <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    <span className="text-[9px] sm:text-[10px] font-medium tracking-wide">
                                      {t(
                                        "products_management.forms.create.file_too_large",
                                      )}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 sm:gap-2 bg-black/70 backdrop-blur-sm text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-400" />
                                    <span className="text-[9px] sm:text-[10px] font-medium tracking-wide">
                                      {t(
                                        "products_management.forms.create.auto_optimized",
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 bg-card border-t z-30 relative">
                              <div
                                className={`h-7 w-7 sm:h-8 sm:w-8 rounded-md flex items-center justify-center shrink-0 ${
                                  isImageOversized
                                    ? "bg-destructive/10"
                                    : "bg-background shadow-sm border"
                                }`}
                              >
                                <FileImage
                                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                                    isImageOversized
                                      ? "text-destructive"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-[10px] sm:text-xs font-medium truncate ${
                                    isImageOversized
                                      ? "text-destructive"
                                      : "text-foreground"
                                  }`}
                                >
                                  {(field.value as File)?.name ||
                                    t(
                                      "products_management.forms.create.uploaded_image",
                                    )}
                                </p>

                                <p
                                  className={`text-[9px] sm:text-[10px] truncate ${
                                    isImageOversized
                                      ? "text-destructive font-semibold"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {(field.value as File)?.size
                                    ? formatBytes((field.value as File).size)
                                    : t(
                                        "products_management.forms.create.ready_to_upload",
                                      )}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="absolute -bottom-5 left-0 text-[10px] sm:text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={formItemVariants} className="space-y-7">
              <div>
                <h3 className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
                  {t("products_management.forms.create.pricing_title")}
                </h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  {t("products_management.forms.create.pricing_desc")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8">
                <FormField
                  control={formCreate.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="relative grid gap-2 space-y-0">
                      <div className={labelStyle}>
                        {t("products_management.forms.create.selling_price")}
                      </div>
                      <FormControl>
                        <NumberStepper
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                            formCreate.trigger("cost_price");
                          }}
                          step={10000}
                          prefix="Rp"
                          placeholder="0"
                          disabled={isSubmitting || isPending}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formCreate.control}
                  name="cost_price"
                  render={({ field }) => (
                    <FormItem className="relative grid gap-2 space-y-0">
                      <div className={labelStyle}>
                        {t("products_management.forms.create.cost_price")}
                      </div>
                      <FormControl>
                        <NumberStepper
                          value={field.value}
                          onChange={field.onChange}
                          step={10000}
                          prefix="Rp"
                          placeholder="0"
                          disabled={isSubmitting || isPending}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formCreate.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem className="relative grid gap-2 space-y-0">
                      <div className={labelStyle}>
                        {t("products_management.forms.create.initial_stock")}
                      </div>
                      <FormControl>
                        <NumberStepper
                          value={field.value}
                          onChange={field.onChange}
                          step={1}
                          placeholder="0"
                          disabled={isSubmitting || isPending}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formCreate.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem className="relative grid gap-2 space-y-0">
                      <FormLabel className={labelStyle}>
                        {t(
                          "products_management.forms.create.manufacturer_label",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="nope"
                          placeholder={t(
                            "products_management.forms.create.manufacturer_placeholder",
                          )}
                          className={inputStyle}
                          disabled={isSubmitting || isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 p-4 sm:p-5 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 mt-auto sticky bottom-0 z-10">
          {isDirty ? (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              className="w-auto text-xs sm:text-sm font-semibold shadow-none cursor-pointer text-foreground duration-300 px-4"
              onClick={handleReset}
              disabled={isSubmitting || isPending}
            >
              {t("products_management.forms.create.btn_reset")}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              className="w-auto text-xs sm:text-sm font-semibold shadow-none cursor-pointer text-foreground duration-300 px-4"
              onClick={onCancel}
              disabled={isSubmitting || isPending}
            >
              {t("products_management.forms.create.btn_cancel")}
            </Button>
          )}

          <Button
            size="sm"
            className="min-w-25 sm:min-w-30 text-xs sm:text-sm font-semibold shadow-md shadow-primary/20 cursor-pointer text-foreground duration-300 px-6"
            type="submit"
            disabled={isButtonDisabled || isPending}
          >
            {isSubmitting || isPending ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              t("products_management.forms.create.btn_save")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
