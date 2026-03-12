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
import { Textarea } from "@/components/ui/textarea";
import { formatRupiah } from "@/components/utils/formatRupiah";
import { NumberStepper } from "@/components/utils/numberStepper";
import { Brand } from "@/enum/enum";
import { useServiceQueries } from "@/hooks/repair-queries";
import { useTechnicianQueries } from "@/hooks/technician-queries";
import { useCooldown } from "@/hooks/use-cooldown";
import type { CreateServiceRequest } from "@/model/repair-model";
import { RepairValidation } from "@/validation/repair-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { AlertTriangle, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const BRAND_OPTIONS = Object.values(Brand);
const MAX_SERVICE_ITEMS = 10;

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

interface ServiceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateServiceForm({ onSuccess, onCancel }: ServiceFormProps) {
  const { t } = useTranslation();
  const { createMutation } = useServiceQueries();

  const {
    mutateAsync: createService,
    isPending,
    isError,
    error,
    reset,
  } = createMutation;

  const { cooldown, startCooldown } = useCooldown(
    "create_service",
    "ratelimit_",
  );

  const isRateLimited =
    isError && isAxiosError(error) && error.response?.status === 429;
  const { useActiveList } = useTechnicianQueries();

  const { data: technicians, isLoading: isFetchingTechs } = useActiveList();

  const formCreate = useForm<CreateServiceRequest>({
    resolver: zodResolver(
      RepairValidation.CREATE,
    ) as Resolver<CreateServiceRequest>,
    mode: "onChange",
    defaultValues: {
      brand: Brand.OTHER,
      model: "",
      customer_name: "",
      phone_number: "",
      description: "",
      technician_note: "",
      service_list: [{ name: "", price: 0 }],
      discount: 0,
      down_payment: 0,
      technician_id: undefined,
    },
  });

  const { isSubmitting, isDirty } = formCreate.formState;

  const { fields, append, remove } = useFieldArray({
    control: formCreate.control,
    name: "service_list",
  });

  const customerNameValue = useWatch({
    control: formCreate.control,
    name: "customer_name",
  });
  const phoneNumberValue = useWatch({
    control: formCreate.control,
    name: "phone_number",
  });
  const modelValue = useWatch({
    control: formCreate.control,
    name: "model",
  });
  const serviceList = useWatch({
    control: formCreate.control,
    name: "service_list",
  });
  const discountPercent =
    useWatch({
      control: formCreate.control,
      name: "discount",
    }) || 0;
  const downPayment =
    useWatch({
      control: formCreate.control,
      name: "down_payment",
    }) || 0;

  const hasInvalidItems =
    !serviceList ||
    serviceList.length === 0 ||
    serviceList.some(
      (item) => !item.name || !item.price || Number(item.price) <= 0,
    );

  const isButtonDisabled =
    isSubmitting ||
    !customerNameValue ||
    !phoneNumberValue ||
    !modelValue ||
    hasInvalidItems ||
    cooldown > 0;

  const subTotal =
    serviceList?.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0) || 0;
  const discountAmount = (subTotal * discountPercent) / 100;
  const grandTotal = subTotal - discountAmount - downPayment;

  const maxDownPayment = subTotal - discountAmount;

  const isBillingDisabled = subTotal <= 0;

  const handleReset = () => {
    formCreate.reset({
      brand: Brand.OTHER,
      model: "",
      customer_name: "",
      phone_number: "",
      description: "",
      technician_note: "",
      service_list: [{ name: "", price: 0 }],
      discount: 0,
      down_payment: 0,
      technician_id: undefined,
    });
  };

  const onSubmit = async (data: CreateServiceRequest) => {
    try {
      await createService(data);

      formCreate.reset({
        brand: Brand.OTHER,
        model: "",
        customer_name: "",
        phone_number: "",
        description: "",
        technician_note: "",
        service_list: [{ name: "", price: 0 }],
        discount: 0,
        down_payment: 0,
      });

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
        onSubmit={formCreate.handleSubmit(onSubmit)}
        className="flex flex-col h-full relative"
      >
        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 
            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar]:h-1
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
                      {t("services_management.forms.common.action_paused")}
                    </p>
                    <p
                      className="text-[10px] sm:text-xs opacity-90 text-center"
                      dangerouslySetInnerHTML={{
                        __html: t(
                          "services_management.forms.common.too_many_attempts",
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

            {/* CUSTOMER & DEVICE SECTION */}
            <motion.div variants={formItemVariants} className="space-y-7">
              <div>
                <h3 className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
                  {t("services_management.forms.create.customer_device_title")}
                </h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  {t("services_management.forms.create.customer_device_desc")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-7">
                <FormField
                  control={formCreate.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem className="relative grid gap-2 space-y-0">
                      <FormLabel className={labelStyle}>
                        {t("services_management.forms.create.customer_name")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="nope"
                          placeholder={t(
                            "services_management.forms.create.customer_placeholder",
                          )}
                          className={inputStyle}
                          {...field}
                          disabled={isSubmitting || isPending}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formCreate.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem className="relative grid gap-2 space-y-0">
                      <FormLabel className={labelStyle}>
                        {t("services_management.forms.create.phone_number")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="nope"
                          placeholder={t(
                            "services_management.forms.create.phone_placeholder",
                          )}
                          className={inputStyle}
                          {...field}
                          inputMode="numeric"
                          onChange={(e) => {
                            const value = e.target.value;
                            const numericValue = value.replace(/\D/g, "");
                            field.onChange(numericValue);
                          }}
                          disabled={isSubmitting || isPending}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formCreate.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="relative grid gap-2 space-y-0">
                      <FormLabel className={labelStyle}>
                        {t("services_management.forms.create.brand_label")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting || isPending}
                      >
                        <FormControl>
                          <SelectTrigger size="sm" className={inputStyle}>
                            <SelectValue
                              placeholder={t(
                                "services_management.forms.create.brand_placeholder",
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
                  name="model"
                  render={({ field }) => (
                    <FormItem className="relative grid gap-2 space-y-0">
                      <FormLabel className={labelStyle}>
                        {t("services_management.forms.create.model_label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="nope"
                          placeholder={t(
                            "services_management.forms.create.model_placeholder",
                          )}
                          className={inputStyle}
                          {...field}
                          disabled={isSubmitting || isPending}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            <Separator className="bg-border/50" />

            {/* SERVICE DETAILS SECTION */}
            <motion.div variants={formItemVariants} className="space-y-7">
              <div>
                <h3 className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
                  {t("services_management.forms.create.service_details_title")}
                </h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  {t("services_management.forms.create.service_details_desc")}
                </p>
              </div>

              <div className="grid gap-x-4 gap-y-7">
                <FormField
                  control={formCreate.control}
                  name="technician_id"
                  render={({ field }) => (
                    <FormItem className="relative grid gap-2 space-y-0">
                      <FormLabel className={labelStyle}>
                        {t(
                          "services_management.forms.create.assign_technician",
                        )}
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          if (value) {
                            field.onChange(Number(value));
                          }
                        }}
                        value={field.value ? field.value.toString() : ""}
                        disabled={isSubmitting || isFetchingTechs || isPending}
                      >
                        <FormControl>
                          <SelectTrigger size="sm" className={inputStyle}>
                            <SelectValue
                              placeholder={
                                isFetchingTechs
                                  ? t(
                                      "services_management.forms.create.tech_loading",
                                    )
                                  : t(
                                      "services_management.forms.create.tech_select",
                                    )
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {technicians?.map((tech) => (
                            <SelectItem
                              key={tech.id}
                              value={tech.id.toString()}
                            >
                              <div className="flex justify-between items-center w-full">
                                <span>{tech.name}</span>
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded ml-2 ${
                                    tech.active_jobs > 5
                                      ? "text-destructive"
                                      : "text-emerald-600"
                                  }`}
                                >
                                  {tech.active_jobs}{" "}
                                  {t(
                                    "services_management.forms.create.tech_queue",
                                  )}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                          {technicians?.length === 0 && !isFetchingTechs && (
                            <div className="p-2 text-xs text-muted-foreground text-center">
                              {t(
                                "services_management.forms.create.tech_not_found",
                              )}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="absolute -bottom-5 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formCreate.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="relative grid gap-2 space-y-0">
                      <FormLabel className={labelStyle}>
                        {t(
                          "services_management.forms.create.description_label",
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "services_management.forms.create.description_placeholder",
                          )}
                          className="resize-none min-h-20 text-xs sm:text-sm bg-input/50"
                          {...field}
                          disabled={isSubmitting || isPending}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formCreate.control}
                  name="technician_note"
                  render={({ field }) => (
                    <FormItem className="relative grid gap-2 space-y-0">
                      <FormLabel className={labelStyle}>
                        {t("services_management.forms.create.tech_note_label")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "services_management.forms.create.tech_note_placeholder",
                          )}
                          className="resize-none min-h-20 text-xs sm:text-sm bg-input/50"
                          {...field}
                          disabled={isSubmitting || isPending}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            <Separator className="bg-border/50" />

            {/* COST & BILLING SECTION */}
            <motion.div variants={formItemVariants} className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
                    {t("services_management.forms.create.cost_billing_title")}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    {t("services_management.forms.create.cost_billing_desc")}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1 cursor-pointer transition-colors"
                  onClick={() => append({ name: "", price: 0 })}
                  disabled={
                    isSubmitting ||
                    isPending ||
                    fields.length >= MAX_SERVICE_ITEMS
                  }
                >
                  <Plus className="w-3 h-3" />{" "}
                  {t("services_management.forms.create.add_item")}
                  <span className="ml-1 text-[10px] text-muted-foreground">
                    ({fields.length}/{MAX_SERVICE_ITEMS})
                  </span>
                </Button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative flex flex-col gap-7 rounded-lg border border-border/50 bg-muted/20 px-3 pt-4 pb-7 sm:px-4 sm:pt-5 sm:pb-8 transition-colors"
                    >
                      <FormField
                        control={formCreate.control}
                        name={`service_list.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="relative flex flex-col gap-2 space-y-0">
                            <div className="flex justify-between items-center">
                              <FormLabel className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">
                                {t(
                                  "services_management.forms.create.service_name",
                                  { index: index + 1 },
                                )}
                              </FormLabel>
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 -mr-1 -mt-1 text-muted-foreground hover:text-destructive opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                                  onClick={() => remove(index)}
                                  disabled={isSubmitting || isPending}
                                  title={t(
                                    "services_management.forms.create.remove_item",
                                  )}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              )}
                            </div>
                            <FormControl>
                              <Input
                                autoComplete="nope"
                                placeholder={t(
                                  "services_management.forms.create.service_name_placeholder",
                                )}
                                className={inputStyle}
                                {...field}
                                disabled={isSubmitting || isPending}
                              />
                            </FormControl>
                            <FormMessage className="absolute -bottom-5 left-0 text-[10px]" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formCreate.control}
                        name={`service_list.${index}.price`}
                        render={({ field }) => (
                          <FormItem className="relative flex flex-col gap-2 space-y-0">
                            <div className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">
                              {t(
                                "services_management.forms.create.cost_estimation",
                              )}
                            </div>
                            <FormControl>
                              <NumberStepper
                                value={field.value}
                                onChange={field.onChange}
                                step={10000}
                                min={0}
                                prefix="Rp"
                                placeholder="0"
                                disabled={isSubmitting || isPending}
                              />
                            </FormControl>
                            <FormMessage className="absolute -bottom-5 left-0 text-[10px]" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* SUMMARY BOX */}
              <div className="bg-muted/30 p-4 sm:p-5 rounded-xl border border-border/50 grid gap-4 mt-2 shadow-sm">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground font-medium">
                    {t("services_management.forms.create.subtotal")}
                  </span>
                  <span className="font-mono font-semibold">
                    {formatRupiah(subTotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm gap-4">
                  <span className="text-muted-foreground font-medium">
                    {t("services_management.forms.create.discount")}
                  </span>
                  <div className="w-40 sm:w-48 relative">
                    <FormField
                      control={formCreate.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <NumberStepper
                              value={field.value}
                              onChange={(value) => {
                                let newDiscount = value || 0;

                                if (newDiscount > 100) newDiscount = 100;
                                if (newDiscount < 0) newDiscount = 0;

                                field.onChange(newDiscount);

                                const newDiscountAmount =
                                  (subTotal * newDiscount) / 100;
                                const newMaxDP = subTotal - newDiscountAmount;

                                const currentDP =
                                  formCreate.getValues("down_payment") || 0;

                                if (currentDP > newMaxDP) {
                                  formCreate.setValue(
                                    "down_payment",
                                    newMaxDP,
                                    {
                                      shouldValidate: true,
                                    },
                                  );
                                }
                              }}
                              max={100}
                              min={0}
                              placeholder="0"
                              disabled={
                                isSubmitting || isPending || isBillingDisabled
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm gap-4 pb-2">
                  <span className="text-muted-foreground font-medium">
                    {t("services_management.forms.create.down_payment")}
                  </span>
                  <div className="w-40 sm:w-48 relative">
                    <FormField
                      control={formCreate.control}
                      name="down_payment"
                      render={({ field }) => (
                        <FormItem className="space-y-0 relative">
                          <FormControl>
                            <NumberStepper
                              value={field.value}
                              onChange={(value) => {
                                const inputDP = value || 0;

                                if (inputDP > maxDownPayment) {
                                  field.onChange(maxDownPayment);
                                } else {
                                  field.onChange(inputDP);
                                }
                              }}
                              step={10000}
                              min={0}
                              max={maxDownPayment}
                              prefix="Rp"
                              placeholder="0"
                              disabled={
                                isSubmitting || isPending || isBillingDisabled
                              }
                              className="text-right"
                            />
                          </FormControl>
                          {/* Alert DP */}
                          {downPayment > maxDownPayment && (
                            <span className="text-[9px] sm:text-[10px] text-destructive absolute right-0 -bottom-4.5 whitespace-nowrap">
                              {t("services_management.forms.create.max_dp", {
                                amount: formatRupiah(maxDownPayment),
                              })}
                            </span>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator className="bg-border/60" />

                <div className="flex items-center justify-between font-bold pt-1">
                  <span className="text-sm sm:text-base">
                    {t("services_management.forms.create.total_bill")}
                  </span>
                  <span className="text-primary text-base sm:text-lg font-mono">
                    {formatRupiah(grandTotal)}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* STICKY FOOTER */}
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
              {t("services_management.forms.create.btn_reset")}
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
              {t("services_management.forms.create.btn_cancel")}
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
              </>
            ) : (
              t("services_management.forms.create.btn_save")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
